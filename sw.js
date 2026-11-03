// أساس إشعارات المتصفح (يحتاج خادم Push ومفاتيح VAPID لاحقًا)
self.addEventListener('push',e=>{const d=e.data?e.data.json():{};e.waitUntil(self.registration.showNotification(d.title||'براعم المعرفة',{body:d.body||'',dir:'rtl'}))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.openWindow('/home.html#notifs'))});
