const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const api=async t=>{const r=await fetch('/api/content?t='+t);if(r.status===401){location.href='index.html';return[]}return(await r.json()).data||[]};
const SUBJ=['اللغة العربية','الرياضيات','الإيقاظ العلمي','اللغة الفرنسية','التربية الإسلامية'];
const D=d=>new Date(d).toLocaleDateString('ar-DZ'),pick=a=>a[Math.random()*a.length|0],shuf=a=>[...a].sort(()=>Math.random()-.5);
const OK=['أحسنت! 🌟','رائع! أنت بطل ⭐','ممتاز، واصل! 🎉'],NO=['حاول مرة أخرى، أنت قريب! 💪','لا بأس، فكّر قليلًا وجرّب ثانية 🌈'];
const nav=[['home','🏠','الرئيسية'],['homework','📝','العمل المنزلي'],['lessons','📚','دروسنا'],['videos','🎬','فيديوهات تعليمية'],['exercises','✏️','تمارين وتطبيقات'],['games','🎮','نلعب ونتعلم'],['ann','📢','الإعلانات'],['notifs','🔔','الإشعارات'],['parents','👨‍👩‍👧','فضاء الأولياء']];
$('#nav').innerHTML=nav.map(n=>`<a href="#${n[0]}" data-r="${n[0]}">${n[1]} ${n[2]}</a>`).join('');
const safe=u=>/^(https:\/\/|games\/)/.test(u||'');
const embed=u=>{if(!/^https:\/\//.test(u||''))return'';const m=u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);return m?`<iframe src="https://www.youtube-nocookie.com/embed/${m[1]}" style="width:100%;aspect-ratio:16/9;border:0;border-radius:14px" allowfullscreen loading="lazy"></iframe>`:`<a class="btn" href="${esc(u)}" target="_blank" rel="noopener">▶️ مشاهدة الفيديو</a>`};
const empty='<div class="empty">لا يوجد محتوى بعد 🌼</div>';
const hw=h=>`<article class="c"><span class="b">${esc(h.subject)}</span><h3>${esc(h.title)}</h3><small>${D(h.created_at)} • ${esc(h.status)}</small><p>${esc(h.description)}</p>${h.file_url?`<a class="btn" href="${h.file_url}" target="_blank" rel="noopener">📎 فتح / تحميل الملف</a>`:''}${h.lesson_id?`<a class="btn s" href="#lessons?id=${h.lesson_id}">📖 الدرس</a>`:''}<a class="btn w" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent('واجب: '+h.title+' — '+(h.description||''))}">واتساب</a></article>`;
const an=a=>`<article class="c ${a.important?'imp':''}">${a.important?'<span class="b imp">⭐ مهم</span> ':''}${a.category?`<span class="b">${esc(a.category)}</span>`:''}<h3>${esc(a.title)}</h3><small>${D(a.created_at)}</small><p>${esc(a.body)}</p>${a.image_url?`<img src="${a.image_url}" alt="" style="max-width:100%;border-radius:14px">`:''}</article>`;
const ls=l=>`<article class="c"><span class="b">${esc(l.subject)}</span>${l.axis?` <small>${esc(l.axis)}</small>`:''}<h3>${esc(l.title)}</h3><p>${esc(l.body)}</p>${l.image_url?`<img src="${l.image_url}" alt="" style="max-width:100%;border-radius:14px"><br>`:''}${l.pdf_url?`<a class="btn" href="${l.pdf_url}" target="_blank" rel="noopener">📄 PDF</a>`:''}${l.video_url?`<a class="btn s" href="${esc(l.video_url)}" target="_blank" rel="noopener">▶️ فيديو</a>`:''}<a class="btn w" style="background:#ff9fb8" href="#exercises?lesson=${l.id}">✏️ التمارين</a></article>`;
const grid=a=>a.length?`<div class="grid">${a.join('')}</div>`:empty;

const views={
async home(){const[h,a,l]=await Promise.all([api('homework'),api('announcements'),api('lessons')]);
 return `<div class="hero"><div style="font-size:3rem">👧📚👦</div><h1>أهلًا بالتلاميذ والأولياء!</h1><p class="tag">نتعلم، نكتشف، ونبدع معًا</p><p>فضاء السنة الثانية ابتدائي — تأسيس وإشراف المعلمة وئام مسعودي</p></div>
 <div class="grid">${nav.slice(1).map(n=>`<a class="c sec" href="#${n[0]}"><span>${n[1]}</span>${n[2]}</a>`).join('')}</div>
 <h2>📝 آخر الأعمال المنزلية</h2>${grid(h.slice(0,3).map(hw))}<h2>📢 آخر الإعلانات</h2>${grid(a.slice(0,3).map(an))}<h2>📚 أحدث الدروس</h2>${grid(l.slice(0,3).map(ls))}`},
async homework(){const d=await api('homework'),sub=[...new Set([...SUBJ,...d.map(x=>x.subject)])];
 V.innerHTML=`<h2>📝 العمل المنزلي</h2><div class="bar"><input id="q" placeholder="🔍 بحث"><select id="s"><option value="">كل المواد</option>${sub.map(s=>`<option>${esc(s)}</option>`).join('')}</select><input id="d" type="date"></div><div id="l"></div>`;
 const f=()=>{const q=$('#q').value.trim(),s=$('#s').value,dt=$('#d').value;$('#l').innerHTML=grid(d.filter(x=>(!s||x.subject===s)&&(!dt||x.created_at.slice(0,10)===dt)&&(!q||(x.title+' '+(x.description||'')).includes(q))).map(hw))};
 ['q','s','d'].forEach(i=>$('#'+i).oninput=f);f();return null},
async lessons(p){const d=await api('lessons'),sub=[...new Set([...SUBJ,...d.map(x=>x.subject)])];
 V.innerHTML=`<h2>📚 دروسنا</h2><div class="bar"><input id="q" placeholder="🔍 بحث"><select id="s"><option value="">كل المواد</option>${sub.map(s=>`<option>${esc(s)}</option>`).join('')}</select></div><div id="l"></div>`;
 const f=()=>{const q=$('#q').value.trim(),s=$('#s').value;$('#l').innerHTML=grid(d.filter(x=>(!p.id||x.id==p.id)&&(!s||x.subject===s)&&(!q||(x.title+(x.axis||'')).includes(q))).map(ls))};
 $('#q').oninput=$('#s').onchange=f;f();return null},
async exercises(p){const[ex,l]=await Promise.all([api('exercises'),api('lessons')]);
 V.innerHTML=`<h2>✏️ تمارين وتطبيقات</h2><div class="bar"><select id="s"><option value="">كل الدروس</option>${l.map(x=>`<option value="${x.id}">${esc(x.title)}</option>`).join('')}</select></div><div id="l" class="grid"></div>`;
 $('#s').value=p.lesson||'';const f=()=>{const v=$('#s').value,box=$('#l');box.innerHTML='';const r=ex.filter(x=>(!v||x.lesson_id==v)&&(!p.type||x.type===p.type));if(!r.length)box.innerHTML=empty;r.forEach(x=>box.append(makeQ(x)))};
 $('#s').onchange=f;f();return null},
async games(){const g=await api('games');
 const mine=g.map(x=>`<a class="c sec" href="#game?id=${x.id}"><span>🎲</span>${esc(x.title)}<br><small>${esc(x.kind)}</small></a>`);
 const built=Object.entries(G).map(([k,v])=>`<a class="c sec" href="#play?g=${k}"><span>${v.i}</span>${v.t}</a>`);
 built.push(`<a class="c sec" href="#exercises?type=order"><span>🧩</span>ترتيب الجمل</a>`,`<a class="c sec" href="#exercises?type=mcq"><span>🎯</span>صيد الإجابة الصحيحة</a>`);
 return `<h2>🎮 نلعب ونتعلم</h2><h3>🌟 ألعاب المعلمة</h3>${mine.length?grid(mine):'<div class="empty">ستجدون هنا ألعاب المعلمة قريبًا 🎈</div>'}<h3>🎲 ألعاب جاهزة</h3>${grid(built)}`},
async game(p){const g=(await api('games')).find(x=>x.id==p.id);if(!g||!safe(g.url))return'<div class="empty">اللعبة غير متاحة</div>';return `<a href="#games" class="btn s">⬅ الألعاب</a><h2>🎲 ${esc(g.title)}</h2><iframe src="${esc(g.url)}" style="width:100%;height:75vh;border:0;border-radius:18px;background:#fff" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" allowfullscreen></iframe><p><a class="btn" href="${esc(g.url)}" target="_blank" rel="noopener">فتح في صفحة كاملة</a></p>`},
async videos(){const v=await api('videos');return `<h2>🎬 فيديوهات تعليمية</h2>${v.length?grid(v.map(x=>`<article class="c">${x.subject?`<span class="b">${esc(x.subject)}</span>`:''}<h3>${esc(x.title)}</h3>${embed(x.url)}<p>${esc(x.description)}</p></article>`)):'<div class="empty">ستجدون هنا فيديوهات المعلمة قريبًا 🎈</div>'}`},
async notifs(){const n=await api('notifications');localStorage.setItem('bm_seen',Date.now());$('#cnt').textContent='';return `<h2>🔔 الإشعارات الجديدة</h2>${n.length?n.map(x=>`<article class="c" style="margin-bottom:10px"><b>${esc(x.title)}</b><br><small>${D(x.created_at)}</small><br><a class="btn s" href="#${x.ref_type==='homework'?'homework':'ann'}">عرض</a></article>`).join(''):empty}`},
async play(p){const g=G[p.g];if(!g)return'<div class="empty">اللعبة غير موجودة</div>';V.innerHTML=`<a href="#games" class="btn s">⬅ الألعاب</a><h2>${g.i} ${g.t}</h2><div class="c gm" id="gm" style="text-align:center"></div>`;g.run($('#gm'));return null},
async ann(){return `<h2>📢 الإعلانات</h2>${grid((await api('announcements')).sort((a,b)=>b.important-a.important).map(an))}`},
async parents(){return `<div class="c"><h2>👨‍👩‍👧 فضاء الأولياء</h2><p>من هنا يمكنكم متابعة الأعمال المنزلية، الإعلانات، الدروس، وتحميل الملفات، والوصول إلى التمارين والألعاب.</p><a class="btn" href="#homework">الأعمال المنزلية</a><a class="btn" href="#ann">الإعلانات</a><a class="btn" href="#lessons">الدروس</a><a class="btn" href="#exercises">التمارين</a><a class="btn" href="#games">الألعاب</a><hr><h3>📧 استلام التنبيهات بالبريد (اختياري)</h3><input id="se" type="email" placeholder="بريدك الإلكتروني"><label class="o"><input type="checkbox" id="sc"> أوافق على استلام تنبيهات القسم على بريدي</label><button class="btn" id="sb">اشتراك</button><button class="btn s" id="su">إلغاء الاشتراك</button><div class="fb" id="sf"></div><br><button class="btn" id="out" style="background:#ff9fb8;width:auto">تسجيل الخروج</button></div>`}};
const V=$('#view');
async function route(){const[r,q]=(location.hash.slice(1)||'home').split('?'),p=Object.fromEntries(new URLSearchParams(q||''));
 document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.dataset.r===(r==='play'?'games':r)));
 V.innerHTML='<div class="empty">⏳ جارٍ التحميل...</div>';
 try{const h=await (views[r]||views.home)(p);if(h!==null)V.innerHTML=h;const sub=async on=>{const f=$('#sf'),email=$('#se').value.trim();if(!/^\S+@\S+\.\S+$/.test(email)){f.textContent='اكتب بريدًا صحيحًا';return}if(on&&!$('#sc').checked){f.textContent='يلزم تأكيد الموافقة أولًا';return}try{const r=await fetch('/api/subscribe',{method:'POST',body:JSON.stringify({email,on})});f.textContent=(await r.json()).msg||'تعذر الحفظ'}catch{f.textContent='تعذر الاتصال'}};if($('#sb')){$('#sb').onclick=()=>sub(true);$('#su').onclick=()=>sub(false)}const o=$('#out');if(o)o.onclick=()=>fetch('/api/auth?a=logout').then(()=>location.href='index.html')}catch{V.innerHTML='<div class="empty">تعذر التحميل، حاول مرة أخرى</div>'}
 scrollTo(0,0)}
addEventListener('hashchange',route);

function makeQ(x){const d=x.data||{},el=document.createElement('article');el.className='c';let get,exp,ex2='';
 const q=`<h3>${esc(x.question)}</h3>`;
 if(x.type==='mcq'){ex2=d.options.map(o=>`<label class="o"><input type="radio" name="q${x.id}" value="${esc(o)}"> ${esc(o)}</label>`).join('');get=()=>(el.querySelector('input:checked')||{}).value;exp=d.answer}
 else if(x.type==='tf'){ex2=`<label class="o"><input type="radio" name="q${x.id}" value="true"> ✅ صح</label><label class="o"><input type="radio" name="q${x.id}" value="false"> ❌ خطأ</label>`;get=()=>(el.querySelector('input:checked')||{}).value;exp=String(d.answer)}
 else if(x.type==='fill'){ex2='<input class="in" placeholder="اكتب الإجابة">';get=()=>el.querySelector('.in').value.trim();exp=d.answer.trim()}
 else if(x.type==='order'){const w=shuf(d.answer.trim().split(/\s+/));let ch=[];ex2='<div id="line"></div><div class="pool"></div>';exp=d.answer.trim().split(/\s+/).join(' ');get=()=>ch.length?ch.map(i=>w[i]).join(' '):'';
  var draw=()=>{el.querySelector('#line').innerHTML=ch.map(i=>`<span class="chip" data-i="${i}">${esc(w[i])}</span>`).join('');el.querySelector('.pool').innerHTML=w.map((t,i)=>ch.includes(i)?'':`<span class="chip" data-i="${i}">${esc(t)}</span>`).join('');el.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{const i=+c.dataset.i;ch=ch.includes(i)?ch.filter(v=>v!==i):[...ch,i];draw()})};setTimeout(draw)}
 else if(x.type==='match'){const R=shuf(d.pairs.map(p=>p[1]));ex2=d.pairs.map((p,i)=>`<div class="o">${esc(p[0])} ⟶ <select class="m"><option value="">اختر</option>${R.map(r=>`<option>${esc(r)}</option>`).join('')}</select></div>`).join('');get=()=>[...el.querySelectorAll('.m')].map(s=>s.value).join('|');exp=d.pairs.map(p=>p[1]).join('|')}
 el.innerHTML=q+ex2+'<button class="btn chk">تحقق ✔</button><div class="fb"></div>';
 el.querySelector('.chk').onclick=()=>{const v=get(),f=el.querySelector('.fb');if(!v||v.split('|').includes('')){f.textContent='اختر أو اكتب إجابتك أولًا 😊';return}
  const ok=v.replace(/\s+/g,' ')===exp;f.style.color=ok?'#2e9e5b':'#e8873a';f.textContent=ok?pick(OK):pick(NO)};
 return el}

function memory(c){const E=['🍎','🐱','🌸','⭐','🚌','🐟','📘','🌞'],cs=shuf([...E,...E]);let open=[],done=0,mv=0;
 c.innerHTML='<p id="mv">الحركات: 0</p><div class="grid">'+cs.map((e,i)=>`<button class="btn mc" data-i="${i}">❓</button>`).join('')+'</div>';
 c.querySelectorAll('.mc').forEach(b=>b.onclick=()=>{if(open.length>1||b.disabled||open.includes(b))return;b.textContent=cs[b.dataset.i];open.push(b);
  if(open.length==2){mv++;c.querySelector('#mv').textContent='الحركات: '+mv;const[a,z]=open;if(a.textContent==z.textContent){a.disabled=z.disabled=true;open=[];if(++done==8)c.querySelector('#mv').textContent='🎉 أحسنت! أنهيت اللعبة في '+mv+' حركة'}else setTimeout(()=>{a.textContent=z.textContent='❓';open=[]},700)}})}
function math(c){let n=0,s=0;const q=()=>{if(n==10){c.innerHTML=`<h3>🎉 نتيجتك ${s} من 10</h3><button class="btn" id="ag">العب مرة أخرى</button>`;c.querySelector('#ag').onclick=()=>{n=s=0;q()};return}
 let a=1+Math.random()*12|0,b=1+Math.random()*8|0;const op=Math.random()<.5?'+':'−';if(op=='−'&&b>a)[a,b]=[b,a];const r=op=='+'?a+b:a-b;
 c.innerHTML=`<h3>السؤال ${n+1} من 10</h3><div class="big">${a} ${op} ${b} = ؟</div><input id="an" type="number" inputmode="numeric"><button class="btn" id="ok">تحقق</button><div class="fb"></div>`;
 c.querySelector('#ok').onclick=()=>{const i=c.querySelector('#an');if(i.value==='')return;c.querySelector('#ok').disabled=true;if(+i.value==r){s++;c.querySelector('.fb').textContent=pick(OK)}else c.querySelector('.fb').textContent='الجواب هو '+r+' — المرة القادمة ستنجح! 💪';n++;setTimeout(q,1200)}};q()}
function classify(cfg){return c=>{const it=shuf(cfg.items);let i=0,s=0;const q=()=>{if(i==it.length){c.innerHTML=`<h3>🎉 نتيجتك ${s} من ${it.length}</h3><button class="btn" id="ag">مرة أخرى</button>`;c.querySelector('#ag').onclick=()=>{i=s=0;q()};return}
 c.innerHTML=`<div class="big">${it[i][0]}</div><h3>${it[i][1]}</h3>`+cfg.cats.map((k,j)=>`<button class="btn" data-j="${j}">${k}</button>`).join('')+'<div class="fb"></div>';
 c.querySelectorAll('button').forEach(b=>b.onclick=()=>{c.querySelectorAll('button').forEach(x=>x.disabled=true);const ok=+b.dataset.j==it[i][2];if(ok)s++;c.querySelector('.fb').textContent=ok?pick(OK):'الصحيح: '+cfg.cats[it[i][2]];i++;setTimeout(q,1200)})};q()}}
function team(c){const sc=[0,0];c.innerHTML=[0,1].map(i=>`<div class="c"><input id="n${i}" value="الفريق ${i?'الثاني':'الأول'}"><div class="big" id="s${i}">0</div><button class="btn" data-t="${i}" data-v="1">+1</button><button class="btn s" data-t="${i}" data-v="-1">−1</button></div>`).join('')+'<button class="btn" id="rs">إعادة</button><div class="fb" id="w"></div>';
 const up=()=>{[0,1].forEach(i=>c.querySelector('#s'+i).textContent=sc[i]);c.querySelector('#w').textContent=sc[0]==sc[1]?'':'🏆 يتقدم: '+c.querySelector('#n'+(sc[0]>sc[1]?0:1)).value};
 c.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{sc[b.dataset.t]=Math.max(0,sc[b.dataset.t]+ +b.dataset.v);up()});c.querySelector('#rs').onclick=()=>{sc[0]=sc[1]=0;up()}}
const G={memory:{t:'لعبة الذاكرة',i:'🧠',run:memory},math:{t:'تحدي الحساب',i:'➕',run:math},team:{t:'تحدي الفريقين',i:'🤝',run:team},
 animals:{t:'تصنيف الحيوانات',i:'🐾',run:classify({cats:['🌍 يعيش في البر','🌊 يعيش في الماء','☁️ يطير في الجو'],items:[['🐄','بقرة',0],['🐑','خروف',0],['🐘','فيل',0],['🐇','أرنب',0],['🐟','سمكة',1],['🐬','دلفين',1],['🐙','أخطبوط',1],['🦅','نسر',2],['🐦','عصفور',2],['🦋','فراشة',2]]})},
 plants:{t:'تصنيف النباتات',i:'🌿',run:classify({cats:['🌸 زهرة','🥕 خضار','🌳 شجرة'],items:[['🌹','وردة',0],['🌻','دوار الشمس',0],['🌷','زنبق',0],['🥕','جزر',1],['🍅','طماطم',1],['🥔','بطاطا',1],['🌴','نخلة',2],['🌳','شجرة بلوط',2],['🌲','صنوبر',2]]})}};

async function bell(){const n=await api('notifications'),seen=+localStorage.getItem('bm_seen')||0,k=n.filter(x=>new Date(x.created_at)>seen).length;$('#cnt').textContent=k||'';
 $('#bell').onclick=()=>{const p=$('#np');p.hidden=!p.hidden;p.innerHTML=n.length?n.slice(0,10).map(x=>`<p>🔔 ${esc(x.title)}<br><small>${D(x.created_at)}</small></p>`).join(''):'لا إشعارات';localStorage.setItem('bm_seen',Date.now());$('#cnt').textContent=''}}
bell();route();

if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
