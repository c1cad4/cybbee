import test from 'node:test';import assert from 'node:assert/strict';import {apiSource} from './api-source.mjs';import {fixtureDB} from './db-fixture.mjs';
const {api}=await import('data:text/javascript;base64,'+Buffer.from(await apiSource()).toString('base64'));
test('invoice freeze, account isolation, finalized verification, replay prevention and atomic Pro renewal',async()=>{
 const f=await fixtureDB(),original=globalThis.fetch;let tx;
 globalThis.fetch=async(url,options)=>String(url).includes('dexscreener')?Response.json([{chainId:'solana',baseToken:{address:'So11111111111111111111111111111111111111112'},quoteToken:{address:'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'},priceUsd:'100',liquidity:{usd:10000}}]):(assert.equal(JSON.parse(options.body).params[1].commitment,'finalized'),Response.json({result:tx}));
 const call=(path,p,owner='buyer',env={CHECKOUT_ENABLED:'1'})=>api(new Request('https://bee.test/api/payments/'+path,{method:p?'POST':'GET',headers:{Origin:'https://bee.test','oai-authenticated-user-id':owner},...(p?{body:JSON.stringify(p)}:{})}),{DB:f.db,...env});
 try{
  const id='11111111-1111-4111-8111-111111111111';
  const response=await call('invoices',{requestId:id,plan:'monthly',asset:'sol'});assert.equal(response.status,201);const invoice=await response.json();assert.equal(invoice.amount,'0.100000000');assert.equal(invoice.expires-invoice.created,900);assert.match(invoice.url,/^solana:.*amount=0.100000000/);assert.ok(new URL(invoice.url).searchParams.get('reference'));
  assert.deepEqual(await (await call('invoices',{requestId:id,plan:'yearly',asset:'sol'})).json(),invoice);
  assert.equal((await call('invoices',{requestId:id,plan:'monthly',asset:'sol'},'other')).status,404);
  assert.equal((await call('verify',{invoice:id,signature:'A'.repeat(87)},'other')).status,404);
  const recipient='AHBz386tP36ZrABN7STzxV66u1f7CwnaqrFBnevb4ff8';
  tx={blockTime:invoice.created,meta:{err:null,preBalances:[0,0],postBalances:[100000000,0]},transaction:{message:{accountKeys:[recipient,invoice.reference],instructions:[{programId:'11111111111111111111111111111111',parsed:{type:'transfer',info:{destination:recipient,lamports:100000000}}}]}}};
  const verified=await call('verify',{invoice:id,signature:'A'.repeat(87)});assert.equal(verified.status,200);const status=await verified.json();assert.equal(status.active,true);assert.equal(status.paid,true);
  assert.deepEqual(await (await call('verify',{invoice:id,signature:'A'.repeat(87)})).json(),status);
  assert.equal((await call('verify',{invoice:id,signature:'B'.repeat(87)})).status,409);
  const next=await (await call('invoices',{requestId:'22222222-2222-4222-8222-222222222222',plan:'yearly',asset:'sol'})).json();
  assert.equal((await call('verify',{invoice:next.id,signature:'A'.repeat(87)})).status,400);
  tx.transaction.message.accountKeys[1]=next.reference;tx.meta.postBalances[0]=1000000000;tx.transaction.message.instructions[0].parsed.info.lamports=1000000000;
  assert.equal((await call('verify',{invoice:next.id,signature:'A'.repeat(87)})).status,409);
  const renewed=await (await call('verify',{invoice:next.id,signature:'C'.repeat(87)})).json();assert.equal(renewed.expires-status.expires,365*86400);
  assert.equal((await (await call('status')).json()).expires,renewed.expires);assert.equal((await (await call('status',null,'other')).json()).active,false);
  assert.equal((await call('invoices',{requestId:'33333333-3333-4333-8333-333333333333',plan:'monthly',asset:'sol'},'buyer',{})).status,400);
 }finally{globalThis.fetch=original;await f.cleanup()}
});
test('reference discovery ignores invalid candidates, activates once and isolates invoice history',async()=>{
 const f=await fixtureDB(),original=globalThis.fetch;const id='44444444-4444-4444-8444-444444444444',reference='B'.repeat(44),signature='D'.repeat(87),created=Math.floor(Date.now()/1000),recipient='AHBz386tP36ZrABN7STzxV66u1f7CwnaqrFBnevb4ff8';
 const invoice={id,reference,created,expires:created+900,asset:'sol',plan:'monthly',units:'100',amount:'0.000000100',usd:10,assetLabel:'SOL'};
 f.execute([{sql:'INSERT INTO bee_invoices(id,owner,payload) VALUES(?,?,?)',values:[id,'buyer',JSON.stringify(invoice)]}]);
 let found=[];globalThis.fetch=async(url,options)=>{const body=JSON.parse(options.body);assert.equal(body.params[1].commitment,'finalized');return Response.json({result:body.method==='getSignaturesForAddress'?found:{blockTime:created,meta:{err:null,preBalances:[0,0],postBalances:[100,0]},transaction:{message:{accountKeys:[recipient,reference],instructions:[{programId:'11111111111111111111111111111111',parsed:{type:'transfer',info:{destination:recipient,lamports:100}}}]}}}})};
 const call=(path,p,owner='buyer')=>api(new Request('https://bee.test/api/payments/'+path,{method:p?'POST':'GET',headers:{Origin:'https://bee.test','oai-authenticated-user-id':owner},...(p?{body:JSON.stringify(p)}:{})}),{DB:f.db});
 try{assert.equal((await (await call('invoices')).json()).invoices.length,1);assert.equal((await (await call('invoices',null,'other')).json()).invoices.length,0);assert.equal((await call('find',{invoice:id},'other')).status,404);
 assert.equal((await (await call('find',{invoice:id})).json()).paid,false);found=[{signature,err:null,confirmationStatus:'confirmed'}];assert.equal((await (await call('find',{invoice:id})).json()).paid,false);
 found=[{signature,err:null,confirmationStatus:'finalized'}];const paid=await (await call('find',{invoice:id})).json();assert.equal(paid.active,true);assert.deepEqual(await (await call('find',{invoice:id})).json(),paid);
 }finally{globalThis.fetch=original;await f.cleanup()}
});
test('receipts require the invoice owner and confirmed payment, and contain the actual transaction',async()=>{
 const f=await fixtureDB(),id='55555555-5555-4555-8555-555555555555',signature='E'.repeat(87),invoice={id,plan:'monthly',asset:'sol',usd:10,amount:'0.1',units:'100000000',assetLabel:'SOL',created:100,expires:1000};
 await f.db.prepare('INSERT INTO bee_invoices(id,owner,payload) VALUES(?,?,?)').bind(id,'buyer',JSON.stringify(invoice)).run();
 const call=owner=>api(new Request('https://bee.test/api/payments/receipt?id='+id,{headers:owner?{'oai-authenticated-user-id':owner}:{}}),{DB:f.db});
 try{assert.equal((await call()).status,401);assert.equal((await call('other')).status,404);assert.equal((await call('buyer')).status,409);await f.db.prepare('UPDATE bee_invoices SET paid=1,signature=? WHERE id=?').bind(signature,id).run();const result=await call('buyer');assert.equal(result.status,200);assert.equal(result.headers.get('Cache-Control'),'no-store');const receipt=await result.json();assert.equal(receipt.invoice,id);assert.equal(receipt.signature,signature);assert.equal(receipt.amount,'0.1');assert.equal(receipt.network,'solana-mainnet');assert.equal(receipt.subscription.active,false);assert.equal(receipt.owner,undefined);assert.equal(receipt.mint,null);assert.equal((await call('other')).status,404)}finally{await f.cleanup()}
});
test('controlled checkout is scoped, expires, permits monthly SOL only, and cannot leak through the shared quote cache',async()=>{
 const f=await fixtureDB(),original=globalThis.fetch;const owner='controlled-buyer',scope=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(owner)))].map(b=>b.toString(16).padStart(2,'0')).join('');
 const env={DB:f.db,CHECKOUT_TEST_SCOPE:scope,CHECKOUT_TEST_UNTIL:String(Math.floor(Date.now()/1000)+600)};
 globalThis.fetch=async()=>Response.json([{chainId:'solana',baseToken:{address:'So11111111111111111111111111111111111111112'},quoteToken:{address:'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'},priceUsd:'100',liquidity:{usd:10000}}]);
 const call=(path,p,account=owner,settings=env)=>api(new Request('https://controlled.test/api/payments/'+path,{method:p?'POST':'GET',headers:{Origin:'https://controlled.test',...(account?{'oai-authenticated-user-id':account}:{})},...(p?{body:JSON.stringify(p)}:{})}),settings);
 try{assert.equal((await (await call('config')).json()).enabled,true);assert.equal((await (await call('config')).json()).testOnly,true);assert.equal((await (await call('config',null,'other')).json()).enabled,false);assert.equal((await (await call('config',null,null)).json()).enabled,false);assert.equal((await (await call('config',null,owner,{...env,CHECKOUT_TEST_UNTIL:'1'})).json()).enabled,false);
 const [yes,no]=await Promise.all([call('quote',{plan:'monthly',asset:'sol'}),call('quote',{plan:'monthly',asset:'sol'},'other')]);assert.equal((await yes.json()).enabled,true);assert.equal((await no.json()).enabled,false);
 const id='66666666-6666-4666-8666-666666666666';assert.equal((await call('invoices',{requestId:id,plan:'monthly',asset:'sol'},'other')).status,400);assert.equal((await call('invoices',{requestId:id,plan:'yearly',asset:'sol'})).status,400);assert.equal((await call('invoices',{requestId:id,plan:'monthly',asset:'cicada'})).status,400);assert.equal((await call('invoices',{requestId:id,plan:'monthly',asset:'sol'})).status,201);assert.equal((await call('invoices',{requestId:'77777777-7777-4777-8777-777777777777',plan:'monthly',asset:'sol'},owner,{...env,CHECKOUT_TEST_UNTIL:'1'})).status,400);
 }finally{globalThis.fetch=original;await f.cleanup()}
});
