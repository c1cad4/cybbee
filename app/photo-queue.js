// The durable outbox is the existing local photo store. Remote acknowledgements
// are reconstructed on each run, so a lost response cannot lose a local photo.
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const equal=(a,b)=>JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
export function planPhotoQueue(local,notes,remote,journal){
 const noteMap=new Map(notes.map(n=>[n.id,n])),cloudNotes=new Map((journal?.notes||[]).map(n=>[n.id,n]));
 const active=new Map(remote.photos.map(p=>[p.id,p])),blocked=new Set([...(remote.trash||[]),...(remote.pending||[])].map(p=>p.id));
 return local.filter(p=>noteMap.has(p.noteId)).map(photo=>{const match=active.get(photo.id);let status;if(match)status=match.note_id===photo.noteId?'synced':'conflict';else if(blocked.has(photo.id))status='blocked';else if(!cloudNotes.has(photo.noteId)||!equal(noteMap.get(photo.noteId),cloudNotes.get(photo.noteId)))status='journal';else status='pending';return {photo,status}});
}
export async function runPhotoQueue({scope,allowed,getIdentity,getPhotos,getNotes,getRemote,getJournal,send,onState=()=>{},limit=10}){
 if(!allowed())return {stopped:true};const user=await getIdentity();if(!allowed())return {stopped:true};if(!user.signedIn||user.journalScope!==scope)throw Error('photo-account');
 const remote=await getRemote(scope);if(!allowed())return {stopped:true};const journal=await getJournal(scope);if(!allowed())return {stopped:true};if(journal.journalScope!==scope)throw Error('photo-account');
 const local=await getPhotos();if(!allowed())return {stopped:true};const entries=planPhotoQueue(local,getNotes(),remote,journal.journal);onState(entries);let sent=0;
 for(const entry of entries.filter(e=>e.status==='pending').slice(0,limit)){
  if(!allowed())return {stopped:true,sent};
  // A journal edit during a previous upload must not attach a photo to stale notes.
  if(!equal(getNotes().find(n=>n.id===entry.photo.noteId),journal.journal.notes.find(n=>n.id===entry.photo.noteId))){entry.status='journal';onState(entries);continue}
  entry.status='sending';onState(entries);
  try{await send(entry.photo,scope,journal.journal.notes.find(n=>n.id===entry.photo.noteId))}catch(e){entry.status='pending';onState(entries);throw e}
  if(!allowed())return {stopped:true,sent};entry.status='synced';sent++;onState(entries);
 }
 return {sent,remaining:entries.filter(e=>e.status==='pending').length,waiting:entries.filter(e=>['journal','blocked','conflict'].includes(e.status)).length};
}
