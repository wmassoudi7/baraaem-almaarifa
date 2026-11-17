const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const api=async t=>{const r=await fetch('/api/content?t='+t);if(r.status===401){location.href='index.html';return[]}return(await r.json()).data||[]};
const D=d=>new Date(d).toLocaleDateString('ar-DZ'),pick=a=>a[Math.random()*a.length|0],shuf=a=>[...a].sort(()=>Math.random()-.5);
const nav=[['home','🏠','الرئيسية'],['videos','🎬','فيديوهات تعليمية'],['games','🎮','نلعب ونتعلم'],['ann','📢','الإعلانات'],['notifs','🔔','الإشعارات']];
$('#nav').innerHTML=nav.map(n=>`<a href="#${n[0]}" data-r="${n[0]}">${n[1]} ${n[2]}</a>`).join('');
const safe=u=>/^(https:\/\/|games\/)/.test(u||'');
const embed=u=>{if(!/^https:\/\//.test(u||''))return'';const m=u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);return m?`<iframe src="https://www.youtube-nocookie.com/embed/${m[1]}" style="width:100%;aspect-ratio:16/9;border:0;border-radius:14px" allowfullscreen loading="lazy"></iframe>`:`<a class="btn" href="${esc(u)}" target="_blank" rel="noopener">▶️ مشاهدة الفيديو</a>`};
const emp=t=>`<div class="empty"><img src="img/empty.svg" alt="">${t}</div>`;
const empty=emp('لا يوجد شيء بعد 🌼');
const an=a=>`<article class="c ${a.important?'imp':''}">${a.important?'<span class="b imp">⭐ مهم</span> ':''}${a.category?`<span class="b">${esc(a.category)}</span>`:''}<h3>${esc(a.title)}</h3><small>${D(a.created_at)}</small><p>${esc(a.body)}</p>${a.image_url?`<img src="${a.image_url}" alt="" style="max-width:100%;border-radius:14px">`:''}</article>`;
const grid=a=>a.length?`<div class="grid">${a.join('')}</div>`:empty;
const byNew=(a,b)=>(b.important-a.important)||(new Date(b.created_at)-new Date(a.created_at));

const views={
async home(){const a=(await api('announcements')).sort(byNew);
 return `<div class="hero"><img class="art" src="img/hero.svg" alt=""><h1>أهلًا بالتلاميذ والأولياء!</h1><p class="tag">نتعلم، نكتشف، ونبدع معًا</p><p>فضاء السنة الثانية ابتدائي — تأسيس وإشراف المعلمة وئام مسعودي</p></div>
 <h2>📢 آخر الإعلانات</h2>${grid(a.slice(0,3).map(an))}`},
async games(){const g=await api('games');
 return `<h2>🎮 نلعب ونتعلم</h2>${g.length?grid(g.map(x=>`<a class="c sec" href="#game?id=${x.id}"><span>🎲</span>${esc(x.title)}<br><small>${esc(x.kind)}</small></a>`)):emp('ستجدون هنا ألعاب المعلمة قريبًا 🎈')}`},
async game(p){const g=(await api('games')).find(x=>x.id==p.id);if(!g||!safe(g.url))return'<div class="empty">اللعبة غير متاحة</div>';return `<a href="#games" class="btn s">⬅ الألعاب</a><h2>🎲 ${esc(g.title)}</h2><iframe src="${esc(g.url)}" style="width:100%;height:75vh;border:0;border-radius:18px;background:#fff" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" allowfullscreen></iframe><p><a class="btn" href="${esc(g.url)}" target="_blank" rel="noopener">فتح في صفحة كاملة</a></p>`},
async videos(){const v=await api('videos');return `<h2>🎬 فيديوهات تعليمية</h2>${v.length?grid(v.map(x=>`<article class="c">${x.subject?`<span class="b">${esc(x.subject)}</span>`:''}<h3>${esc(x.title)}</h3>${embed(x.url)}<p>${esc(x.description)}</p></article>`)):emp('ستجدون هنا فيديوهات المعلمة قريبًا 🎈')}`},
async notifs(){const n=(await api('notifications')).filter(x=>x.ref_type!=='homework');localStorage.setItem('bm_seen',Date.now());$('#cnt').textContent='';return `<h2>🔔 الإشعارات الجديدة</h2>${n.length?n.map(x=>`<article class="c" style="margin-bottom:10px"><b>${esc(x.title)}</b><br><small>${D(x.created_at)}</small><br><a class="btn s" href="#ann">عرض</a></article>`).join(''):empty}`},
async ann(){return `<h2>📢 الإعلانات</h2>${grid((await api('announcements')).sort(byNew).map(an))}`}};
const V=$('#view');
async function route(){const[r,q]=(location.hash.slice(1)||'home').split('?'),p=Object.fromEntries(new URLSearchParams(q||''));
 document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.dataset.r===r));
 V.innerHTML='<div class="empty">⏳ جارٍ التحميل...</div>';
 try{const h=await (views[r]||views.home)(p);if(h!==null)V.innerHTML=h}catch{V.innerHTML='<div class="empty">تعذر التحميل، حاول مرة أخرى</div>'}
 scrollTo(0,0)}
addEventListener('hashchange',route);
$('#out').onclick=()=>fetch('/api/auth?a=logout').then(()=>location.href='index.html');

async function bell(){const n=(await api('notifications')).filter(x=>x.ref_type!=='homework'),seen=+localStorage.getItem('bm_seen')||0,k=n.filter(x=>new Date(x.created_at)>seen).length;$('#cnt').textContent=k||'';
 $('#bell').onclick=()=>{const p=$('#np');p.hidden=!p.hidden;p.innerHTML=n.length?n.slice(0,10).map(x=>`<p>🔔 ${esc(x.title)}<br><small>${D(x.created_at)}</small></p>`).join(''):'لا إشعارات';localStorage.setItem('bm_seen',Date.now());$('#cnt').textContent=''}}
bell();route();

if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
