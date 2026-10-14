const order=['today','hives','calendar','flora','bees','ai','community','plans','settings'];
const copies={
en:`How to use this overview|Today and overdue tasks are separate from future work. A checkbox records completion, not treatment success or absence of disease. Add a hive, record an inspection and choose the next task.
What makes a useful journal|Give every hive a recognizable name. Record observed queen signs, brood, stores and colony condition. Mark uncertainty clearly. Work and follow-up checks may have different dates.
How to plan your work|Choose dates from colony condition, local practice and your protocol. Treatments need a country, authorized product and current HTTPS label. In-app reminders require an open CybBee; export ICS for your external calendar when it is closed.
Private and public map|Your private point stays on this device. Publishing requires sign-in and separate consent and rounds coordinates to 0.1°. Rounding does not guarantee anonymity. You can remove your public point separately.
Species, lineage and group|Cards introduce selected taxa. A lineage within Apis mellifera is not a separate species; Meliponini contains many species. Identification and care require local expertise.
What the assistant can know|Local AI needs a compatible device and may make mistakes. It does not inspect colonies or read your journal automatically. Internet search is separate. Check sources, local labels and real observations.
Chat or diary?|Use chat for a short question and a diary for related observations: region, period, work and outcome. Include sources and avoid home addresses. You can delete your own posts and report others. Automatic checks occur every 15 seconds while this tab is open.
What the dollar price means|One month is $10, one year $100: $20 less than 12 months. Token amounts depend on a verifiable market rate; Solana fees are separate. Invoices last 15 minutes. Payments remain disabled until paid features launch.
Local data, cloud and backup|The local journal stays in this browser. Account sync is manual. Export a backup before the first exchange; select versions when the same entry conflicts. Photos require a separate backup and separately consented cloud transfer.`,
zh:`如何使用概览|今天、逾期和未来任务分开显示。勾选只表示工作完成，不证明治疗有效。添加蜂箱，记录检查，再安排下一步。
实用日志|为蜂箱命名，记录蜂王、子脾、储备和状态。注明不确定性，工作日期与复查日期可以不同。
规划工作|按群情和当地方案选日期。处理需国家、获准产品和现行HTTPS说明。关闭应用时请导出ICS。
私人及公开地图|私人点保存在设备上。公开需登录和单独同意，坐标取整到0.1°，不保证匿名，可撤回公开点。
物种、品系与类群|Apis mellifera的品系不是独立物种。Meliponini含多种蜂，鉴定和饲养需要当地知识。
助手的能力|本地模型需要兼容设备，可能出错，不自动读取日志。网络搜索独立，请核查来源和实际观察。
聊天或日记|聊天用于提问，日记记录地区、时期和结果。不要公开家庭地址。可删除自己的帖子及举报，打开时每15秒检查更新。
美元价格含义|每月10美元，每年100美元，比12个月省20美元。代币随市价变化，SOL手续费另付。付费功能上线前不收款。
本地、云与备份|日志在浏览器，云同步手动启动。先备份，冲突时选版本。照片另行备份及同意云传输。`,
hi:`अवलोकन कैसे उपयोग करें|आज, पुराने और भविष्य के काम अलग हैं। निशान केवल काम पूरा बताता है, इलाज सफल नहीं। छत्ता जोड़कर निरीक्षण और अगला काम लिखें।
उपयोगी जर्नल|छत्तों के पहचानने योग्य नाम रखें। रानी, ब्रूड, भोजन और स्थिति के तथ्य लिखें, संदेह स्पष्ट करें। काम और परिणाम की तारीख अलग हो सकती है।
काम की योजना|कॉलोनी और स्थानीय प्रक्रिया से तारीख चुनें। उपचार के लिए देश, अनुमोदित उत्पाद और HTTPS निर्देश चाहिए। बंद ऐप के लिए ICS निकालें।
निजी और सार्वजनिक नक्शा|निजी बिंदु उपकरण पर है। प्रकाशन में प्रवेश और अलग अनुमति चाहिए; 0.1° गोलाई गुमनामी की गारंटी नहीं। सार्वजनिक बिंदु हटाया जा सकता है।
प्रजाति, वंश और समूह|Apis mellifera का वंश अलग प्रजाति नहीं। Meliponini में कई प्रजातियाँ हैं; पहचान और पालन को स्थानीय ज्ञान चाहिए।
सहायक की क्षमता|स्थानीय मॉडल को संगत उपकरण चाहिए और वह गलती कर सकता है। जर्नल अपने आप नहीं पढ़ता; इंटरनेट खोज अलग है। स्रोत और तथ्य जाँचें।
चैट या डायरी|प्रश्न के लिए चैट, क्षेत्र और परिणाम के लिए डायरी। घर का पता न दें। अपने संदेश हटा सकते हैं, शिकायत कर सकते हैं; खुली टैब में 15 सेकंड पर जाँच होती है।
डॉलर कीमत|महीना $10, साल $100, बारह महीनों से $20 कम। टोकन बाजार दर पर हैं, SOL शुल्क अलग। भुगतान सुविधाएँ तैयार होने तक बंद हैं।
स्थानीय, क्लाउड और बैकअप|जर्नल ब्राउज़र में है, सिंक हाथ से होता है। पहले बैकअप लें, मतभेद में संस्करण चुनें। फोटो का बैकअप और अनुमति अलग हैं।`,
es:`Cómo usar el resumen|Hoy, pendientes vencidas y futuras aparecen por separado. Marcar una tarea no prueba el éxito del tratamiento. Añade colmena, inspección y siguiente tarea.
Un diario útil|Pon nombres reconocibles y anota reina, cría, reservas y estado. Indica dudas. Trabajo y comprobación pueden tener fechas distintas.
Planificar trabajo|Elige fechas según colonia y práctica local. Tratamientos requieren país, producto autorizado y etiqueta HTTPS vigente. Exporta ICS para la app cerrada.
Mapa privado y público|El punto privado queda en el dispositivo. Publicar requiere entrar y consentir; redondear a 0,1° no garantiza anonimato. Puedes retirar el punto público.
Especie, linaje y grupo|Un linaje de Apis mellifera no es otra especie. Meliponini incluye muchas especies. Identificación y cuidado necesitan conocimiento local.
Capacidad del asistente|El modelo local necesita un dispositivo compatible y puede fallar. No lee el diario automáticamente. La búsqueda web es aparte; comprueba fuentes y observaciones.
Chat o diario|Chat para preguntas; diario para región, periodo y resultados. No publiques domicilio. Puedes borrar tus mensajes y denunciar; se revisan novedades cada 15 segundos con la pestaña abierta.
Precio en dólares|Mes $10, año $100: ahorro $20 frente a doce meses. Tokens según mercado, tasas SOL aparte. Pagos desactivados hasta lanzar funciones de pago.
Local, nube y copia|El diario está en el navegador; sincronización manual. Exporta primero y elige versiones en conflicto. Fotos con copia y consentimiento separados.`,
ar:`استخدام الملخص|مهام اليوم والمتأخرة والمستقبلية منفصلة. علامة الإنجاز لا تثبت نجاح العلاج. أضف خلية وفحصاً ومهمة تالية.
سجل مفيد|اختر أسماء واضحة وسجّل الملكة والحضنة والمخزون والحالة وحدد الشك. تاريخ العمل قد يختلف عن التحقق من نتيجته.
تخطيط العمل|اختر المواعيد وفق الطائفة والإرشادات المحلية. العلاج يحتاج البلد والمنتج المرخص وتعليمات HTTPS سارية. صدّر ICS عند إغلاق التطبيق.
الخريطة الخاصة والعامة|النقطة الخاصة تبقى بالجهاز. النشر يحتاج دخولاً وموافقة منفصلة؛ تقريب 0.1° لا يضمن إخفاء الهوية. يمكنك إزالة النقطة العامة.
النوع والسلالة والمجموعة|سلالة Apis mellifera ليست نوعاً آخر. Meliponini تشمل أنواعاً عديدة. التحديد والرعاية يحتاجان معرفة محلية.
قدرات المساعد|النموذج المحلي يحتاج جهازاً متوافقاً وقد يخطئ. لا يقرأ السجل تلقائياً؛ البحث الشبكي منفصل. تحقق من المصادر والملاحظات.
دردشة أم يوميات|الدردشة للأسئلة واليوميات للمنطقة والفترة والنتائج. لا تنشر عنوان المنزل. يمكنك حذف رسائلك والإبلاغ؛ التحديث كل 15 ثانية أثناء فتح الصفحة.
السعر بالدولار|الشهر 10 دولارات والسنة 100، توفير 20 مقارنة باثني عشر شهراً. سعر الرموز سوقي ورسوم SOL منفصلة. الدفع معطل حتى إطلاق الخدمات المدفوعة.
محلي وسحابي ونسخ|السجل في المتصفح والمزامنة يدوية. صدّر نسخة أولاً واختر إصدارات التعارض. الصور تحتاج نسخاً وموافقة نقل منفصلين.`,
pt:`Usar o resumo|Hoje, atrasadas e futuras aparecem separadas. Marcar tarefa não prova êxito do tratamento. Adicione colmeia, inspeção e próxima tarefa.
Diário útil|Dê nomes claros e registe rainha, criação, reservas e estado. Indique dúvidas; trabalho e verificação podem ter datas diferentes.
Planear trabalho|Escolha datas segundo colónia e orientação local. Tratamentos exigem país, produto autorizado e rótulo HTTPS atual. Exporte ICS para a app fechada.
Mapa privado e público|O ponto privado fica no dispositivo. Publicação exige entrada e consentimento; arredondar a 0,1° não garante anonimato. Pode remover o ponto público.
Espécie, linhagem e grupo|Uma linhagem de Apis mellifera não é outra espécie. Meliponini contém muitas espécies. Identificação e cuidado exigem conhecimento local.
Capacidade do assistente|Modelo local exige dispositivo compatível e pode errar. Não lê diário automaticamente. Pesquisa web é separada; verifique fontes e observações.
Chat ou diário|Chat para perguntas, diário para região, período e resultados. Não publique endereço de casa. Pode apagar mensagens e denunciar; verifica atualizações a cada 15 segundos com página aberta.
Preço em dólares|Mês $10, ano $100: poupa $20 contra doze meses. Tokens pela cotação, taxas SOL à parte. Pagamento desligado até lançar funções pagas.
Local, nuvem e cópia|Diário no navegador, sincronização manual. Exporte primeiro e escolha versões em conflito. Fotos exigem cópia e consentimento separados.`,
bn:`সারাংশ ব্যবহার|আজ, পুরোনো ও ভবিষ্যতের কাজ আলাদা। টিক দেওয়া চিকিৎসার সাফল্য প্রমাণ করে না। বাক্স, পরিদর্শন ও পরের কাজ যোগ করুন।
উপকারী জার্নল|পরিচিত নাম দিয়ে রানি, ব্রুড, খাদ্য ও অবস্থা লিখুন; সন্দেহ স্পষ্ট রাখুন। কাজ ও ফল পরীক্ষার তারিখ আলাদা হতে পারে।
কাজের পরিকল্পনা|কলোনি ও স্থানীয় নিয়মে দিন বেছে নিন। চিকিৎসায় দেশ, অনুমোদিত পণ্য ও বর্তমান HTTPS নির্দেশ লাগে। বন্ধ অ্যাপের জন্য ICS নিন।
ব্যক্তিগত ও প্রকাশ্য মানচিত্র|ব্যক্তিগত বিন্দু যন্ত্রে থাকে। প্রকাশে প্রবেশ ও আলাদা সম্মতি লাগে; 0.1° গোল করা গোপনতার নিশ্চয়তা নয়। প্রকাশ্য বিন্দু সরাতে পারেন।
প্রজাতি, বংশ ও দল|Apis mellifera বংশ আলাদা প্রজাতি নয়। Meliponini-তে বহু প্রজাতি। পরিচয় ও যত্নে স্থানীয় জ্ঞান লাগে।
সহায়কের ক্ষমতা|স্থানীয় মডেলে উপযুক্ত যন্ত্র লাগে, ভুল হতে পারে। জার্নল নিজে পড়ে না। ওয়েব খোঁজ আলাদা; উৎস ও বাস্তব তথ্য দেখুন।
চ্যাট না ডায়েরি|প্রশ্নে চ্যাট, অঞ্চল ও ফলে ডায়েরি। বাড়ির ঠিকানা দেবেন না। নিজের বার্তা মুছতে ও অভিযোগ করতে পারেন; খোলা ট্যাবে 15 সেকেন্ডে নতুন তথ্য দেখে।
ডলারের মূল্য|মাস $10, বছর $100, বারো মাস থেকে $20 কম। টোকেন বাজারদরে, SOL ফি আলাদা। সুবিধা চালু হওয়া পর্যন্ত পেমেন্ট বন্ধ।
স্থানীয়, ক্লাউড ও কপি|জার্নল ব্রাউজারে, সমন্বয় হাতে। আগে কপি নিন, মতভেদে সংস্করণ বেছে নিন। ছবির কপি ও সম্মতি আলাদা।`,
fr:`Utiliser le résumé|Aujourd’hui, en retard et futures sont séparées. Cocher une tâche ne prouve pas l’efficacité d’un traitement. Ajoutez ruche, visite et tâche suivante.
Journal utile|Nommez les ruches clairement, notez reine, couvain, réserves et état. Indiquez les doutes. Travail et contrôle peuvent avoir des dates distinctes.
Planifier le travail|Choisissez les dates selon colonie et pratiques locales. Traitement : pays, produit autorisé et notice HTTPS actuelle. Exportez ICS pour l’app fermée.
Carte privée et publique|Le point privé reste sur l’appareil. Publication avec connexion et consentement séparé ; arrondi à 0,1° sans garantie d’anonymat. Le point public peut être retiré.
Espèce, lignée et groupe|Une lignée d’Apis mellifera n’est pas une autre espèce. Meliponini comprend de nombreuses espèces. Identification et soins exigent un savoir local.
Capacités de l’assistant|Le modèle local exige un appareil compatible et peut se tromper. Il ne lit pas automatiquement le journal. Recherche web séparée ; vérifiez sources et observations.
Chat ou journal|Chat pour questions, journal pour région, période et résultats. Ne publiez pas d’adresse personnelle. Supprimez vos messages ou signalez ; vérification toutes les 15 secondes avec l’onglet ouvert.
Prix en dollars|Mois $10, année $100 : $20 de moins que douze mois. Tokens au cours du marché, frais SOL séparés. Paiement désactivé jusqu’au lancement des fonctions payantes.
Local, cloud et sauvegarde|Journal dans le navigateur, synchronisation manuelle. Exportez d’abord et choisissez les versions en conflit. Photos avec sauvegarde et consentement séparés.`,
de:`Übersicht verwenden|Heute, überfällige und zukünftige Aufgaben sind getrennt. Ein Häkchen beweist keinen Behandlungserfolg. Erstellen Sie Beute, Durchsicht und nächste Aufgabe.
Nützliches Tagebuch|Nutzen Sie klare Namen und erfassen Sie Königin, Brut, Vorräte und Zustand. Kennzeichnen Sie Unsicherheit. Arbeit und Erfolgskontrolle können unterschiedliche Termine haben.
Arbeit planen|Termine nach Volk und örtlicher Praxis wählen. Behandlung benötigt Land, zugelassenes Mittel und aktuelle HTTPS-Anleitung. Exportieren Sie ICS für die geschlossene App.
Private und öffentliche Karte|Privater Punkt bleibt auf dem Gerät. Veröffentlichung braucht Anmeldung und eigene Zustimmung; Rundung auf 0,1° garantiert keine Anonymität. Öffentlichen Punkt können Sie entfernen.
Art, Linie und Gruppe|Eine Linie von Apis mellifera ist keine andere Art. Meliponini umfasst viele Arten. Bestimmung und Pflege benötigen örtliches Wissen.
Fähigkeiten des Assistenten|Lokales Modell benötigt kompatibles Gerät und kann irren. Es liest das Tagebuch nicht automatisch. Websuche ist getrennt; prüfen Sie Quellen und Beobachtungen.
Chat oder Tagebuch|Chat für Fragen, Tagebuch für Region, Zeitraum und Ergebnisse. Keine Wohnadresse veröffentlichen. Eigene Beiträge löschen oder melden; Prüfung alle 15 Sekunden bei offenem Tab.
Dollarpreis|Monat $10, Jahr $100: $20 weniger als zwölf Monate. Token zum Marktkurs, SOL-Gebühren getrennt. Zahlung bleibt bis zur Einführung bezahlter Funktionen deaktiviert.
Lokal, Cloud und Sicherung|Tagebuch im Browser, Abgleich manuell. Zuerst exportieren, bei Konflikten Versionen wählen. Fotos benötigen getrennte Sicherung und Zustimmung.`};
export const sectionLocales=Object.fromEntries(Object.entries(copies).map(([lang,lines])=>[lang,Object.fromEntries(lines.split('\n').map((line,i)=>[order[i],line.split('|')]))]));
