import {journalOnly,mergeJournal,journalChanges,same} from './journal.js';
import {validateJournalBackup} from './restore.js';
// Transport-independent exchange. CAS retries reread the cloud; IDs stay stable even after lost acknowledgments.
export async function exchangeJournal({getState,readRemote,writeRemote,base,choose,assertCurrent=()=>{},persist,saveBase,beforeApply=()=>{}}){
 const captured=journalOnly(getState());validateJournalBackup(captured);
 for(let attempt=0;attempt<3;attempt++){
  const remote=await readRemote(),cloud=journalOnly(remote.journal||{hives:[],tasks:[],notes:[]});validateJournalBackup(cloud);
  let merged=mergeJournal(base,captured,cloud);
  if(merged.conflicts.length){if(!choose)return {needsChoice:true,conflicts:merged.conflicts};const choices=await choose(merged.conflicts);if(!choices)return {cancelled:true};merged=mergeJournal(base,captured,cloud,choices)}
  validateJournalBackup(merged.journal);assertCurrent();if(!same(captured,journalOnly(getState())))throw Error('Локальный журнал изменился во время синхронизации. Повторите.');
  const changes=journalChanges(cloud,merged.journal);
  let revision=remote.revision;
  try{for(let offset=0;offset<changes.length;offset+=100){assertCurrent();revision=(await writeRemote({revision,changes:changes.slice(offset,offset+100),operationId:crypto.randomUUID()})).revision}}catch(e){if(e.status===409&&attempt<2)continue;throw e}
  const pending=!same(captured,journalOnly(getState()));
  let applied=false;if(!pending&&!same(captured,merged.journal)){beforeApply();const previous=journalOnly(getState());Object.assign(getState(),merged.journal);try{if(persist()===false)throw Error('Облако обновлено, но локальное сохранение не удалось. Экспортируйте журнал.')}catch(e){Object.assign(getState(),previous);throw e}applied=true}
  saveBase(merged.journal);return {revision,changes:changes.length,pending,applied};
 }
}
