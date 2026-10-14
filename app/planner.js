import {seasonFor,translation,resolveLanguage} from './presentation.js';
import {notesForHive} from './journal.js';
export const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function localDate(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
export function dailyPlan(state,today){return {overdue:state.tasks.filter(t=>!t.done&&!t.suspended&&t.date<today).sort((a,b)=>a.date.localeCompare(b.date)),today:state.tasks.filter(t=>!t.done&&!t.suspended&&t.date===today),next:state.tasks.filter(t=>!t.done&&!t.suspended&&t.date>today).sort((a,b)=>a.date.localeCompare(b.date))}}
export function apiaryStats(state,year){return state.hives.map(h=>{const notes=notesForHive(state,h);return {id:h.id,name:h.name,inspections:notes.filter(n=>(n.kind||'inspection')==='inspection'&&n.date.startsWith(year+'-')).length,honey:notes.filter(n=>n.kind==='harvest'&&n.date.startsWith(year+'-')).reduce((s,n)=>s+(Number(n.honey)||0),0),last:notes[0]?.date||null}})}
export function seasonalIdeas(state,month){const s=seasonFor(month,state.hemisphere,'auto');const ideas={winter:[['Наблюдение за зимовкой','Проверить записи о запасах, сырости и состоянии летка без ненужного вскрытия.','winter']],spring:[['План первого осмотра','Выбрать подходящие условия по местной практике; записать матку, расплод и корм.','spring']],summer:[['Роевое состояние и пространство','Оценить состояние по осмотру и записать признаки роения.','swarm']],autumn:[['Подготовка к зимовке','Сверить силу семьи, запасы и результаты мониторинга Varroa.','autumn']],tropical:[['План по местным сезонам','Учитывать дожди, засуху, местное цветение и собственные наблюдения.','journal']]};return {season:s,ideas:ideas[s]}}
export function monthDays(month){const [year,m]=month.split('-').map(Number);const first=new Date(year,m-1,1,12),count=new Date(year,m,0,12).getDate(),offset=(first.getDay()+6)%7;return Array.from({length:offset+count},(_,i)=>i<offset?null:`${month}-${String(i-offset+1).padStart(2,'0')}`)}
const textICS=s=>String(s||'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
function fold(line){const parts=[];let current='',bytes=0;for(const c of line){const size=new TextEncoder().encode(c).length;if(bytes+size>73){parts.push(current);current=' ';bytes=1}current+=c;bytes+=size}parts.push(current);return parts.join('\r\n')}
export function calendarICS(tasks,stamp=new Date()){const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//CybBee//Apiary planner//RU','CALSCALE:GREGORIAN'];for(const task of tasks.filter(t=>!t.done&&!t.suspended)){const end=new Date(task.date+'T12:00:00Z');end.setUTCDate(end.getUTCDate()+1);lines.push('BEGIN:VEVENT','UID:'+textICS(task.id)+'@cy…6679 tokens truncated…ую без GPS.|No point selected. You can place one manually without GPS.
Разрешаю показать людям приблизительное место пасеки (округление координат до 0,1°).|Allow publication of my approximate apiary location, rounded to 0.1°.
Опубликовать приблизительную точку|Publish approximate point
Убрать мою публичную точку|Remove my public point
Ваш регион|Your region
не выбран|not selected
Карта открывается по вашему запросу. Точное местоположение пасеки автоматически не передаётся.|The map loads on request. Your precise apiary location is not shared automatically.
Открыть регион на OpenStreetMap ↗|Open region on OpenStreetMap ↗
Ниже есть справочный список с указанным регионом и ваш журнал фактического цветения. Даты для других регионов автоматически не выдумываются.|Below are references with their source region and your actual flowering journal. Dates for other regions are not invented automatically.
Ива|Willow
Одуванчик|Dandelion
Липа|Linden
Клевер|Clover
Гречиха|Buckwheat
Эвкалипт|Eucalyptus
Ранний корм для семьи|Early forage
Наблюдайте массовое цветение|Observe peak flowering
Нектаровыделение зависит от погоды|Nectar production depends on weather
Уточняйте вид и доступность нектара|Check species and nectar availability
Срок зависит от посева|Timing depends on sowing
Разные виды имеют разные сроки|Different species have different seasons
Подробнее о наблюдениях|More about observations
Карта наблюдений GBIF ↗|GBIF occurrence map ↗
Мир пчёл|World of bees
Западная медоносная пчела|Western honey bee
Восточная медоносная пчела|Eastern honey bee
Гигантская медоносная пчела|Giant honey bee
Карликовая медоносная пчела|Dwarf honey bee
Безжальные пчёлы|Stingless bees
Подробнее о пчёлах|More about these bees
Посмотреть распространение ↗|View occurrences ↗
Широко разводится в мире; происхождение линии и местная адаптация важны.|Kept worldwide; lineage origin and local adaptation matter.
Южная и Восточная Азия; содержание требует местных знаний.|South and East Asia; husbandry needs local expertise.
Южная и Юго-Восточная Азия; открытые гнёзда, не обычный рамочный улей.|South and Southeast Asia; open nests, not a conventional frame hive.
Южная Азия и соседние районы; небольшие открытые гнёзда.|South Asia and nearby regions; small open nests.
Группа тропических пчёл, а не один вид. Практики содержания отличаются.|A group of tropical bees, not one species. Husbandry differs.
Формат|Format
Показывать|Show
Дневники пасек|Apiary diaries
Обновить ленту|Refresh feed
Показать ещё записи|Show more entries
Понимаю, что запись будет публичной|I understand this entry will be public
Что наблюдали? Где и когда? Укажите источник, если даёте совет.|What did you observe, where and when? Include a source when giving advice.
Для публикации войдите через ChatGPT. Псевдонимы выбирают сами пользователи. Не размещайте адрес дома, точные координаты и чужие данные. Свои записи можно удалить; на неподходящие — пожаловаться.|Sign in through ChatGPT to post. Nicknames are self-selected. Do not share home addresses, exact coordinates or other people's data. Delete your own posts or report inappropriate content.
Пока записей нет. Поделитесь первым наблюдением.|No entries yet. Share your first observation.
Удалить мою запись|Delete my entry
Пожаловаться|Report
Причина жалобы|Reason for report
Удалить эту запись из общей ленты?|Delete this entry from the public feed?
Запись удалена|Entry deleted
Жалоба сохранена|Report saved
Запись опубликована|Entry published
Подтвердите публичную публикацию|Confirm public publication
Показано записей|Entries shown
на вашем устройстве|on your device
Первый запуск скачивает несколько сотен мегабайт из WebLLM / Hugging Face и движок с unpkg.com. Требуются HTTPS, WebGPU и достаточно памяти. После загрузки запросы к модели обрабатываются локально; это не поиск свежих данных в интернете.|First launch downloads several hundred MB from WebLLM / Hugging Face and an engine from unpkg.com. HTTPS, WebGPU and sufficient memory are required. Model requests then run locally; this does not search for current internet information.
Разрешаю загрузку модели; использовать сохранённую модель при следующих открытиях|Allow model download and use the saved model on later visits
Загрузить и включить ИИ|Download and enable AI
Улей для контекста|Hive context
Без журнала|Without journal
Разрешаю локальному ИИ прочитать до 5 последних записей выбранного улья для этого ответа|Allow local AI to read up to 5 recent entries of the selected hive for this answer
Журнал не подключён. Фотографии и точное местоположение в модель не передаются.|Journal not connected. Photos and precise location are not sent to the model.
Вопрос|Question
Спросить ИИ|Ask AI
Небольшая модель может ошибаться. Проверяйте рекомендации и местную инструкцию препарата. Доступ к журналу включается отдельно. Ответ модели не является диагнозом; фотографии она не анализирует.|The small model can make mistakes. Check advice and your local product label. Journal access needs separate consent. Answers are not diagnoses; the model does not analyze photos.
Поиск свежей информации|Search current information
Например: подготовка семьи к зимовке|For example: preparing a colony for winter
Найти информацию ↗|Search information ↗
Открыть знания|Open guide
Подтвердите загрузку модели на устройство|Confirm model download to this device
WebGPU недоступен. Локальная модель требует совместимого браузера/GPU. Интернет-поиск ниже остаётся доступен.|WebGPU unavailable. Local AI needs a compatible browser/GPU. Internet search below remains available.
Загружаем движок и модель. Лучше использовать Wi-Fi.|Downloading engine and model. Wi-Fi is recommended.
Модель готова. Ответы формируются на устройстве.|Model ready. Answers are generated on this device.
Модель не загрузилась|Model could not load
Готовим ответ…|Preparing an answer…
В ответ включены последние записи выбранного улья. Обработка локальная.|Recent entries of the selected hive are included. Processing is local.
Ответ без личного журнала.|Answer without personal journal.
Модель уже загружена|Model already loaded
CybBee Pro · больше возможностей для пасеки|CybBee Pro · more tools for your apiary
Бесплатно|Free
Основной журнал|Core journal
Ульи, осмотры, календарь, памятки и экспорт.|Hives, inspections, calendar, guides and export.
Месяц|Month
Месяц — $10|Month — $10
Год — $100|Year — $100
$10 / месяц|$10 / month
$100 / год|$100 / year
Экономия $20 за год|Save $20 a year
Расширенные возможности Pro. Платёж за один месяц, без автоматического списания.|Extended Pro tools. One-month payment, without automatic renewal.
Годовой доступ Pro. На 16,7% дешевле 12 отдельных месяцев.|Annual Pro access. 16.7% less than 12 separate months.
Оплата подписки|Subscription payment
Pro ещё в разработке. Приём платежей отключён до запуска платных функций. Сейчас можно посмотреть расчёт, но приложение не предлагает платить за недоступные возможности.|Pro is under development. Payments remain disabled until paid features launch. You can view a quote, but are not asked to pay for unavailable features.
Срок|Period
Токен|Token
Рассчитать сумму в токенах|Calculate token amount
Курс загружается с платёжного сервера по вашему запросу.|The payment server retrieves a rate only when requested.
Создать счёт на 15 минут|Create a 15-minute invoice
Получатель|Recipient
Адрес токена CicadaFarm|CicadaFarm mint address
Перевод подписывается только в вашем кошельке. Для комиссии нужен SOL. Сумма в токенах фиксируется в счёте; комиссия сети оплачивается отдельно.|Transfers are signed only in your wallet. SOL is required for fees. The token amount is fixed in the invoice; network fees are separate.
Страна, край / область, населённый пункт|Country, region and locality
Россия, Приморский край|For example: your country and region
Проверьте копию и объедините её с журналом этого устройства. Существующие записи сохраняются; различия требуют вашего выбора.|Review the backup and merge it with this device's journal. Existing entries are preserved; conflicts need your choice.
Выбрать JSON-журнал|Choose JSON journal
Объединяет ульи, осмотры, задачи и настройки региона между устройствами. При различиях одной записи вы выбираете версию. Точная точка карты остаётся на устройстве.|Merge hives, inspections, tasks and regional settings across devices. Choose a version for conflicting entries. The precise map point stays on this device.
Разрешаю передать личный журнал в мой аккаунт CybBee|Allow transfer of my personal journal to my CybBee account
Восстановить копию до последнего обмена|Restore the backup before the last sync
Синхронизация запускается вручную. Перед обменом сохраняются последние 5 локальных копий; сервер хранит последние 10 предыдущих версий.|Sync is manual. The last 5 local pre-sync backups and 10 previous server versions are retained.
Напоминания на этом устройстве|Reminders on this device
Проверяем задачи при открытии и пока CybBee открыт. При полностью закрытом приложении используйте экспорт ICS в календарь устройства; его уведомления зависят от настроек календаря.|Tasks are checked on launch and while CybBee is open. For a closed app, export ICS to your device calendar; reminders depend on its settings.
Напоминания отключены. План внутри приложения доступен всегда.|Reminders are disabled. The in-app plan is always available.
Напоминания включены для этого браузера. Проверяются при открытом приложении.|Reminders enabled for this browser. Tasks are checked while the app is open.
До 3 снимков на запись и 100 на устройство. Фото уменьшаются до 1600 пикселей и сохраняются отдельно от журнала. Облачный обмен запускается отдельно, с вашего согласия. Экспортируйте оба файла для резервной копии.|Up to 3 photos per entry and 100 per device. Photos are resized to 1600 pixels and stored separately. Cloud exchange is separate and requires consent. Export both backup files.
Скачать копию фотографий|Download photo backup
Восстановить фотографии из копии|Restore photo backup
Фото в вашем аккаунте|Photos in your account
Сначала синхронизируйте журнал, затем загрузите фото отдельно. Доступ к ним есть только у вашего аккаунта. До 100 фото, до 3 на запись; обмен порциями по 10.|Sync the journal first, then upload photos separately. Only your account can access them. Up to 100 photos, 3 per entry, transferred in batches of 10.
Разрешаю передавать фотографии журнала в мой аккаунт CybBee и сохранять их на этом устройстве|Allow journal photo transfer to my CybBee account and saving on this device
Загрузить фото в аккаунт|Upload photos to account
Восстановить фото из аккаунта|Restore photos from account
Управление хранилищем|Storage management
Фото в корзине можно восстановить. Корзина занимает место до окончательного удаления. Проверка загрузок обрабатывает операции старше 24 часов, включая уже подтверждённое окончательное удаление.|Trashed photos can be restored and still use storage until permanently deleted. The upload check processes operations older than 24 hours, including already confirmed permanent deletions.
Показать фотографии и объём|Show photos and storage
Проверить незавершённые операции|Check unfinished operations
Установка: Chrome / Edge — меню браузера → установить приложение. iPhone — Safari → Поделиться → На экран «Домой». Работает через HTTPS или localhost.|Install: Chrome / Edge menu → install app. iPhone: Safari → Share → Add to Home Screen. Requires HTTPS or localhost.
Очистка данных браузера удаляет локальный журнал. Экспортируйте его регулярно. Публичная публикация не содержит данных вашей пасеки.|Clearing browser data removes the local journal. Export backups regularly. The public app release contains no personal apiary records.
Язык и времена года / Language & seasons|Language and seasons
Auto · язык устройства|Auto · device language
Hemisphere / Климат|Hemisphere / climate
Северное / Northern|Northern
Южное / Southern|Southern
Тропики / Tropical|Tropical
Season / Тема|Season / theme
🌸 Spring / Весна|🌸 Spring
☀️ Summer / Лето|☀️ Summer
🍂 Autumn / Осень|🍂 Autumn
❄️ Winter / Зима|❄️ Winter
🌴 Tropical / Тропики|🌴 Tropical
10 languages: navigation, calendars and concise guides. Full editorial guides are also available in Russian. Сезонная тема определяется по месяцу и выбранному полушарию; это оформление, а не прогноз погоды или срок обработки.|10 languages cover navigation, calendars and concise guides. Extended guides are available in Russian. The seasonal theme follows the month and hemisphere; it is not a weather forecast or treatment schedule.
Войти через ChatGPT|Sign in through ChatGPT
Выйти из аккаунта|Sign out
Локальная версия|Local version
Не удалось сохранить данные. Экспортируйте резервную копию.|Could not save data. Export a backup.
Укажите название и существующую календарную дату|Enter a title and a valid calendar date
Укажите существующую дату|Enter a valid date
Проверьте числовые показатели|Check measurements
Для обработки нужны страна, препарат и корректная HTTPS-ссылка на инструкцию|Treatment needs country, product and a valid HTTPS product-label link
Для обработки нужны препарат, страна и HTTPS-инструкция|Treatment needs product, country and an HTTPS product label
Укажите массу собранного мёда|Enter the harvested honey mass
Не удалось сохранить запись. Экспортируйте журнал.|Could not save the entry. Export your journal.
Укажите существующий год|Enter a valid year`;
export const uiEnglish=Object.fromEntries(lines.split('\n').map(line=>line.split('|')));
Object.assign(uiEnglish,{'Осень':'Autumn','Весна':'Spring','Лето':'Summer','Зима':'Winter','Тропики':'Tropics','Разделы':'Sections'});
const floraCopy={
Salix:['Willow is a genus, not one species with a universal flowering date. Identify the species and site, then record flowering start and end from observations.',['First and peak flowering dates','Weather and bee flight','Species identification and plant photos'],'Early forage does not mean equal resources in every region.'],
Taraxacum:['Dandelions are useful for repeated observation at one site. Record the site and peak flowering rather than copying a month from a general reference.',['First and peak flowering','Whether bees visit flowers','Mowing and subsequent changes'],'A map occurrence does not confirm that this site is flowering now.'],
Tilia:['Lindens differ by species and local conditions. Observing flowering and weather together is more useful than assuming a fixed month always produces linden honey.',['Identified species or an uncertainty note','Flowering start and end','Weather and observed colony changes'],'Flowering alone does not guarantee a honey crop.'],
Trifolium:['Clover includes multiple species. Identify the species or retain uncertainty: a general name does not explain resource availability in a particular field.',['Species, place and date','Bee visits to flowers','Mowing and site changes'],'This card helps observation; an icon is not a species identifier.'],
'Fagopyrum esculentum':['For buckwheat, identify the specific field and sowing date. Observe flowering locally; a different field’s sowing date does not describe yours.',['Field location without disclosing a home address','First and peak flowering','Observed bee flight and weather'],'Ask those responsible for the field about treatments; the map does not know them automatically.'],
Eucalyptus:['Eucalyptus is a large genus. A genus name is insufficient for a global reference: identify species, region and observation year first.',['Species or an explicit uncertainty note','Region and elevation, if known','Observed flowering start and end'],'Do not assume all eucalyptus species have the same season or forage value.']};
for(const [latin,[intro,observe,limit]]of Object.entries(floraCopy)){const source=floraDetails[latin];uiEnglish[source.intro]=intro;uiEnglish[source.limit]=limit;source.observe.forEach((text,i)=>uiEnglish[text]=observe[i])}
const beeCopy={
'Apis mellifera':'The species includes populations, lineages and breeding groups. A lineage name does not replace origin, local adaptation and observed behaviour. Keep the queen’s source and year in the journal; occurrence maps supplement local information.',
'Apis cerana':'Do not transfer western honey bee practices without checking. Consult local husbandry and permissions. A generic bee picture cannot identify the species; maps show registered observations, not every colony.',
'Apis dorsata':'This species has open nests. This section introduces bee diversity; it does not instruct removal of wild nests. Observation should follow local rules and protect habitats.',
'Apis florea':'Small size and open nesting do not make husbandry equivalent to a conventional frame apiary. Use local expert information; do not identify a species solely from size in a photo.',
Meliponini:'This taxonomic group includes many species. Stingless does not mean identical behaviour, nests or husbandry. Specify species and origin rather than only the group name.'};
for(const [latin,text]of Object.entries(beeCopy))uiEnglish[beeDetails[latin]]=text;
Object.assign(uiEnglish,{
'Что наблюдать на своём участке':'What to observe at your site',
'Как собрать местный календарь':'Build your local calendar',
'Выберите один участок. В журнале отмечайте год, дату, начало, массовое цветение и окончание. Сравнивайте записи нескольких сезонов. Не подменяйте наблюдение предполагаемым месяцем из другого региона.':'Choose one site. Record year, date, first, peak and final flowering. Compare several seasons. Do not replace an observation with an assumed month from another region.',
'Зарегистрированные находки на GBIF ↗':'Registered occurrences on GBIF ↗',
'GBIF показывает записи находок; это не календарь цветения. Иллюстрация условная и не служит определителем растения.':'GBIF shows occurrence records, not a flowering calendar. The illustration is symbolic and cannot identify the plant.',
'Как читать карту распространения':'Read an occurrence map',
'Точка находки означает, что наблюдение было зарегистрировано. Отсутствие точек не доказывает отсутствие вида. Проверяйте дату, источник и качество определения. Фотография показывает отдельную особь, а не все варианты окраски вида. По одному снимку нельзя надёжно определить происхождение семьи.':'A point means an observation was registered. Missing points do not prove a species is absent. Check date, source and identification quality. The photograph shows one individual, not every colour variation of the species. A single image cannot reliably establish the origin of a colony.',
'Что полезно записать':'Useful records',
'Уточнённый вид или отметку «не определён».':'Identified species or a note that it is unknown.',
'Общий регион и дату наблюдения.':'General region and observation date.',
'Происхождение семьи, если она содержится на пасеке.':'Colony origin, if kept in an apiary.',
'Источник определения и вопросы местному специалисту.':'Identification source and questions for a local expert.',
'Открыть карту находок ↗':'Open occurrence map ↗'
});
Object.assign(uiEnglish,{
'Один файл содержит журнал, проекты вывода и фотографии этого устройства. Книги, черновики и точная точка карты в него не входят.':'One file contains the journal, rearing projects and photos on this device. Books, drafts and the precise map point are excluded.',
'Проверка единой копии':'Review combined backup',
'Ульи':'Hives','Записи':'Entries','Фото':'Photos',
'Копия объединяется с журналом. Существующие записи и фото сохраняются. Файл обрабатывается на устройстве.':'The backup is merged with your journal. Existing entries and photos remain. The file is processed on this device.',
'Также восстановить регион, язык и настройки сезонов':'Also restore region, language and season settings',
'Объединить копию':'Merge backup',
'Готовим единую копию…':'Preparing combined backup…',
'Копия скачана. Фото':'Backup downloaded. Photos',
'Фото без записей исключены':'Unlinked photos excluded',
'Восстановление отменено':'Restore cancelled',
'Проверяем фотографии…':'Checking photos…',
'Единая копия восстановлена':'Combined backup restored',
'Неверная единая копия CybBee':'Invalid CybBee combined backup',
'В копии есть фото без записи журнала':'Backup contains photos without journal entries',
'Более трёх фото у одной записи':'More than three photos for one entry',
'Фото с одинаковым ID различаются. Копия не применена.':'Photos with the same ID differ. Backup was not applied.',
'Единая копия превышает 70 МБ':'Combined backup exceeds 70 MB',
'Выберите единую копию до 70 МБ':'Choose a combined backup up to 70 MB',
'Журнал изменился. Повторите восстановление.':'The journal changed. Repeat the restore.',
'Не удалось сохранить объединённый журнал':'Could not save the merged journal',
'Фото сохранены, но журнал не применён. Повторите импорт из файла.':'Photos were saved, but the journal was not applied. Repeat import from the file.',
'Превышен лимит фото: 100 всего и 3 на запись':'Photo limit exceeded: 100 total and 3 per entry',
'Фото изменились или хранилище недоступно. Повторите восстановление.':'Photos changed or storage is unavailable. Repeat the restore.'
});

Object.assign(uiEnglish,{'Статус относится к журналу. Фотографии обмениваются отдельно.':'Status applies to the journal. Photos are transferred separately.'});

Object.assign(uiEnglish,{'Фото превышает 500 КБ':'Photo exceeds 500 KB'});
