import LZString from './vendor/lz-string.mjs';
const PREFIX='cybbee.lz1:';
// Compression only: these values are not encrypted.
export function packLocalText(text){
 if(typeof text!=='string')throw TypeError('Expected text');
 if(text.length<10000)return text;
 const packed=PREFIX+LZString.compressToUTF16(text);
 return packed.length<text.length?packed:text;
}
export function unpackLocalText(text){
 if(typeof text!=='string')throw TypeError('Expected stored text');
 if(!text.startsWith(PREFIX))return text;
 const value=LZString.decompressFromUTF16(text.slice(PREFIX.length));
 if(value===null||value==='')throw Error('Invalid compressed local copy');
 return value;
}
export function readLocalJSON(key,fallback=null){const text=localStorage.getItem(key);return text===null?fallback:JSON.parse(unpackLocalText(text))}
export function writeLocalJSON(key,value){localStorage.setItem(key,packLocalText(JSON.stringify(value)))}
