/* Keep startup independent from the module graph so import errors stay visible. */
(function(){
 var message=document.getElementById('startup-message'),retry=document.getElementById('startup-retry');
 function report(text){if(!document.getElementById('startup'))return;message.textContent=text;retry.hidden=false;}
 retry.onclick=function(){location.reload();};
 var timer=setTimeout(function(){report('Загрузка занимает больше времени. Проверьте соединение и повторите запуск. Во встроенном браузере мессенджера попробуйте открыть эту же ссылку в Safari или Chrome. Данные журнала удалять не нужно.');},15000);
 function ready(){clearTimeout(timer);}
 window.addEventListener('cybbee-ready',ready,{once:true});
 // Register independently: a broken cached module must not prevent an update.
 if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(function(){});}
 import('./app.js').then(ready).catch(function(){clearTimeout(timer);report('Не удалось запустить CybBee. Повторите загрузку страницы. Если ошибка остаётся, откройте ссылку в обновлённом Safari или Chrome. Не очищайте данные сайта: в них может храниться ваш журнал.');});
})();
