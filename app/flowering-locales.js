// Common names/transliterations, not new species or regional flowering predictions.
const order=['en','zh','hi','es','ar','pt','bn','fr','de'];
export const floweringNames={
'Galanthus nivalis':['Common snowdrop','雪花莲','स्नोड्रॉप','Campanilla de invierno','زهرة الثلج','Floco-de-neve','স্নোড্রপ','Perce-neige','Kleines Schneeglöckchen'],
'Helleborus species':['Hellebores · winter-flowering species','铁筷子属 · 冬季开花种','हेलेबोरस · शीतकालीन प्रजातियाँ','Eléboros · especies invernales','خربق · أنواع مزهرة شتاءً','Heléboros · espécies de inverno','হেলেবোরাস · শীতে ফোটা প্রজাতি','Hellébores · espèces hivernales','Christrosen · winterblühende Arten'],
'Acer campestre':['Field maple','田野槭','फील्ड मेपल','Arce campestre','قيقب حقلي','Bordo-campestre','ফিল্ড ম্যাপল','Érable champêtre','Feldahorn'],
'Prunus species':['Cherries and plums · species','樱桃与李 · 多种','चेरी और प्लम · प्रजातियाँ','Cerezos y ciruelos · especies','كرز وبرقوق · أنواع','Cerejeiras e ameixeiras · espécies','চেরি ও প্লাম · প্রজাতি','Cerisiers et pruniers · espèces','Kirsch- und Pflaumenbäume · Arten'],
'Malus species':['Apple trees · species','苹果属 · 多种','सेब · प्रजातियाँ','Manzanos · especies','تفاح · أنواع','Macieiras · espécies','আপেল · প্রজাতি','Pommiers · espèces','Apfelbäume · Arten'],
'Pulmonaria species':['Lungworts · species','肺草属 · 多种','पल्मोनेरिया · प्रजातियाँ','Pulmonarias · especies','رئوية · أنواع','Pulmonárias · espécies','পালমোনারিয়া · প্রজাতি','Pulmonaires · espèces','Lungenkräuter · Arten'],
'Ribes nigrum':['Blackcurrant','黑加仑','ब्लैककरंट','Grosellero negro','كشمش أسود','Groselheira-negra','কালো কারেন্ট','Cassissier','Schwarze Johannisbeere'],
'Vaccinium corymbosum':['Highbush blueberry','高丛蓝莓','हाईबुश ब्लूबेरी','Arándano alto','توت أزرق مرتفع الشجيرة','Mirtilo-americano','হাইবুশ ব্লুবেরি','Myrtillier arbustif','Amerikanische Heidelbeere'],
'Borago officinalis':['Borage','琉璃苣','बोरेज','Borraja','لسان الثور','Borragem','বোরেজ','Bourrache','Borretsch'],
'Echium vulgare':['Viper’s bugloss','蓝蓟','एकियम वल्गारे','Viborera','أفعوان شائع','Soagem','একিয়াম ভালগারে','Vipérine commune','Gewöhnlicher Natternkopf'],
'Allium species':['Alliums · when flowering','葱属 · 开花时','एलियम · फूल आने पर','Allium · durante la floración','ثوميات · عند الإزهار','Allium · durante a floração','অ্যালিয়াম · ফুলের সময়','Alliums · en floraison','Laucharten · während der Blüte'],
'Echinacea purpurea':['Purple coneflower','紫锥菊','इकिनेशिया परप्यूरिया','Equinácea púrpura','إشنسا أرجوانية','Equinácea-púrpura','ইকিনেশিয়া পারপুরিয়া','Échinacée pourpre','Roter Sonnenhut'],
'Lavandula species':['Lavenders · species','薰衣草属 · 多种','लैवेंडर · प्रजातियाँ','Lavandas · especies','خزامى · أنواع','Lavandas · espécies','ল্যাভেন্ডার · প্রজাতি','Lavandes · espèces','Lavendel · Arten'],
'Phacelia tanacetifolia':['Lacy phacelia','Phacelia tanacetifolia（学名）','फैसीलिया टैनेसीटिफोलिया','Facelia','فاسيليا','Facélia','ফ্যাসেলিয়া ট্যানাসেটিফোলিয়া','Phacélie à feuilles de tanaisie','Rainfarn-Phazelie'],
'Hedera species':['Ivies · species','常春藤属 · 多种','आइवी · प्रजातियाँ','Hiedras · especies','لبلاب · أنواع','Heras · espécies','আইভি · প্রজাতি','Lierres · espèces','Efeu · Arten'],
'Symphyotrichum species':['Autumn asters · species','紫菀类 · 秋季开花种','शरदकालीन एस्टर · प्रजातियाँ','Ásteres de otoño · especies','أستر خريفي · أنواع','Ásteres de outono · espécies','শরৎকালীন অ্যাস্টার · প্রজাতি','Asters d’automne · espèces','Herbstastern · Arten']
};
export function floweringName(latin,language='en',russian=latin){const lang=String(language).toLowerCase().split(/[-_]/)[0];return lang==='ru'?russian:floweringNames[latin]?.[Math.max(0,order.indexOf(lang))]||latin;}
