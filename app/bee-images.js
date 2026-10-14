// Taxon-specific photographs, identified and licensed on their Commons file pages.
const rows=[
 ['Apis mellifera','Honey bee (Apis mellifera).jpg','Charles J. Sharp','by-sa/3.0','CC BY-SA 3.0'],
 ['Apis cerana','Apis cerana.jpg','Peterwchen','by-sa/4.0','CC BY-SA 4.0'],
 ['Apis dorsata','Giant honeybee (Apis dorsata).jpg','Rison Thumboor','by-sa/4.0','CC BY-SA 4.0'],
 ['Apis florea','Dwarf honey bee (apis florea).JPG','Charles J. Sharp','by-sa/3.0','CC BY-SA 3.0'],
 ['Meliponini','Tetragonula carbonaria (14523035795).jpg','Graham Wise','by/2.0','CC BY 2.0']
];
const labels={ru:'На фото',en:'Pictured',zh:'图示',hi:'चित्र में',es:'En la foto',ar:'في الصورة',pt:'Na fotografia',bn:'ছবিতে',fr:'Sur la photo',de:'Abgebildet'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function beePhoto(latin,lang='ru',detail=false){
 const row=rows.find(r=>r[0]===latin);if(!row)return '';
 const [,file,author,license,title]=row,shown=latin==='Meliponini'?'Tetragonula carbonaria · Meliponini':latin;
 const source='https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(file.replaceAll(' ','_'));
 const image='https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(file)+'?width=960';
 return `<figure class="bee-photo ${detail?'bee-photo-detail':''}"><img src="${esc(image)}" alt="${esc(shown)}" loading="lazy" decoding="async" referrerpolicy="no-referrer"><figcaption><span>${labels[lang]||labels.en}: ${esc(shown)}</span><a href="${esc(source)}" target="_blank" rel="noopener noreferrer">© ${esc(author)}</a> · <a href="https://creativecommons.org/licenses/${license}/" target="_blank" rel="noopener noreferrer">${title}</a></figcaption></figure>`;
}
