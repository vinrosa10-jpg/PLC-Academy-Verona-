var PB=localStorage.getItem(‘pva_pb’)||’’;
var CU=null,PT=null,CC=null,CLC=null,CLCA=’’;
var curL=0,curQ=0,qAns=[],selSt=0,chatPoll=null;

function gU(){try{return JSON.parse(localStorage.getItem(‘pva_users’)||’[]’);}catch(e){return[];}}
function sU(u){localStorage.setItem(‘pva_users’,JSON.stringify(u));}
function gP(){try{return JSON.parse(localStorage.getItem(‘pva_prog_’+(CU?CU.id:’’))||’{}’);}catch(e){return{};}}
function sP(p){localStorage.setItem(‘pva_prog_’+(CU?CU.id:’’),JSON.stringify(p));}
function gC(){try{var d=localStorage.getItem(‘pva_courses’);if(d){var p=JSON.parse(d);if(p&&p.length)return p;}return null;}catch(e){return null;}}
function sC(c){localStorage.setItem(‘pva_courses’,JSON.stringify(c));}
function gRv(){try{return JSON.parse(localStorage.getItem(‘pva_revs’)||’[]’);}catch(e){return[];}}
function sRv(r){localStorage.setItem(‘pva_revs’,JSON.stringify(r));}
function esc(s){if(!s)return’’;return(’’+s).replace(/&/g,’&’).replace(/”/g,’"’).replace(/</g,’<’).replace(/>/g,’>’);}

var DC=[
{id:‘c1’,title:‘PLC Base - Siemens S7’,icon:’⚙’,level:‘base’,desc:‘Parti da zero e programma S7-1200/S7-1500 con Ladder, FBD e SCL su hardware reale.’,status:‘disponibile’,color:‘bl’,
lessons:[{title:‘Introduzione ai PLC’,dur:‘45 min’,vt:’’,vurl:’’,notes:‘I PLC (Programmable Logic Controller) sono dispositivi elettronici programmabili usati per automatizzare processi industriali.’,pdfs:[],lq:[]},{title:‘Hardware S7-1200’,dur:‘38 min’,vt:’’,vurl:’’,notes:’’,pdfs:[],lq:[]},{title:‘TIA Portal - Prima apertura’,dur:‘52 min’,vt:’’,vurl:’’,notes:’’,pdfs:[],lq:[]}],materials:[],quiz:[]},
{id:‘c2’,title:‘SCADA / HMI WinCC’,icon:’💻’,level:‘intermedio’,desc:‘Interfacce operatore professionali con WinCC e TIA Portal HMI.’,status:‘disponibile’,color:‘tl’,
lessons:[{title:‘Introduzione SCADA/HMI’,dur:‘40 min’,vt:’’,vurl:’’,notes:’’,pdfs:[],lq:[]},{title:‘WinCC - Primo progetto’,dur:‘55 min’,vt:’’,vurl:’’,notes:’’,pdfs:[],lq:[]}],materials:[],quiz:[]},
{id:‘c3’,title:‘Automazione + AI’,icon:’🤖’,level:‘avanzato’,desc:‘Integra AI e ML nei sistemi PLC. IIoT e Industry 4.0.’,status:‘prossimamente’,color:‘nv’,
lessons:[{title:‘Industry 4.0 e IIoT’,dur:‘50 min’,vt:’’,vurl:’’,notes:’’,pdfs:[],lq:[]}],materials:[],quiz:[]}
];
var DRV=[
{an:‘Luca Ferrarini’,ar:‘Tecnico automazione’,cn:‘PLC Base - Siemens S7’,stars:5,text:‘Corso eccellente! Finalmente pratica su hardware reale.’,dt:‘Mar 2025’},
{an:‘Sara Colombo’,ar:‘Studentessa’,cn:‘SCADA / HMI WinCC’,stars:5,text:‘Chiarissimo. Ho trovato lavoro subito dopo il corso.’,dt:‘Feb 2025’},
{an:‘Marco Bianchi’,ar:‘Elettricista industriale’,cn:‘PLC Base - Siemens S7’,stars:5,text:‘Ora programmo PLC Siemens in autonomia.’,dt:‘Gen 2025’},
{an:‘Giulia Martini’,ar:‘Ingegnere’,cn:‘SCADA / HMI WinCC’,stars:4,text:‘Ottimi contenuti. Le dirette live sono il valore aggiunto.’,dt:‘Apr 2025’},
{an:‘Andrea Russo’,ar:‘Tecnico manutenzione’,cn:‘PLC Base - Siemens S7’,stars:5,text:‘Mi sento sicuro nel gestire i PLC.’,dt:‘Mar 2025’},
{an:‘Valentina Ricci’,ar:‘Neolaureata’,cn:‘Automazione + AI’,stars:5,text:‘Il corso AI applicata e visionario.’,dt:‘Apr 2025’}
];

function ldC(cb){
if(CC){cb(CC);return;}
var loc=gC();if(loc&&loc.length){CC=loc;cb(CC);return;}
if(PB&&PB.length>8){
fetch(PB+’/api/collections/courses/records?perPage=50&sort=created’,{headers:PT?{Authorization:PT}:{}})
.then(function(r){return r.json();}).then(function(d){
if(d.items&&d.items.length){
CC=d.items.map(function(r){
return{id:r.id,title:r.title,icon:r.icon||’⚙’,level:r.level||‘base’,desc:r.description||’’,status:r.status||‘disponibile’,color:r.color||‘bl’,
lessons:typeof r.lessons===‘string’?JSON.parse(r.lessons||’[]’):r.lessons||[],
materials:typeof r.materials===‘string’?JSON.parse(r.materials||’[]’):r.materials||[],
quiz:typeof r.quiz===‘string’?JSON.parse(r.quiz||’[]’):r.quiz||[]};
});
cb(CC);
}else{CC=DC;cb(CC);}
}).catch(function(){CC=DC;cb(CC);});
}else{CC=DC;cb(CC);}
}

function alrt(id,msg,type){
var el=document.getElementById(id);if(!el)return;
if(!msg){el.innerHTML=’’;return;}
var b={e:’#fef2f2’,s:’#f0fdf4’,i:’#eff6ff’},br={e:’#fecaca’,s:’#bbf7d0’,i:’#bfdbfe’},c={e:’#dc2626’,s:’#16a34a’,i:’#1d4ed8’};
el.innerHTML=’<div class="al" style="background:'+(b[type]||b.i)+';border:1px solid '+(br[type]||br.i)+';color:'+(c[type]||c.i)+'">’+msg+’</div>’;
}
function toast(msg,type){
var tc=document.getElementById(’_toast’);
if(!tc){tc=document.createElement(‘div’);tc.id=’_toast’;tc.style.cssText=‘position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px’;document.body.appendChild(tc);}
var t=document.createElement(‘div’);
var col=type===‘e’?’#ef4444’:type===‘w’?’#f59e0b’:’#00b86b’;
var ico=type===‘e’?’❌’:type===‘w’?’⚠’:’✅’;
t.style.cssText=‘background:#fff;border-left:4px solid ‘+col+’;border-radius:9px;padding:12px 16px;font-size:14px;font-weight:500;color:#0a1628;box-shadow:0 6px 28px rgba(0,0,0,.14);display:flex;align-items:center;gap:9px;min-width:240px’;
t.innerHTML=ico+’ ’+msg;tc.appendChild(t);
setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t);},3200);
}

// ── AUTH ──────────────────────────────────────────────────────
function openModal(tab){var m=document.getElementById(‘authModal’);if(m)m.classList.remove(‘hidden’);switchTab(tab||‘login’);}
function closeModal(){var m=document.getElementById(‘authModal’);if(m)m.classList.add(‘hidden’);alrt(‘m-alert’,’’,’’);}
function switchTab(t){
var tl=document.getElementById(‘mt-login’),tr=document.getElementById(‘mt-reg’);
var fl=document.getElementById(‘f-login’),fr=document.getElementById(‘f-reg’);
var mt=document.getElementById(‘mTitle’);if(!tl)return;
if(t===‘login’){tl.classList.add(‘active’);tr.classList.remove(‘active’);fl.classList.remove(‘hidden’);fr.classList.add(‘hidden’);if(mt)mt.textContent=‘Accedi’;}
else{tr.classList.add(‘active’);tl.classList.remove(‘active’);fr.classList.remove(‘hidden’);fl.classList.add(‘hidden’);if(mt)mt.textContent=‘Registrati’;}
alrt(‘m-alert’,’’,’’);
}
function doLogin(){
var em=document.getElementById(‘m-email’),pw=document.getElementById(‘m-pass’);
if(!em||!pw)return;
var email=em.value.trim(),pass=pw.value;
if(!email){alrt(‘m-alert’,‘Inserisci la tua email’,‘e’);em.focus();return;}
if(!pass){alrt(‘m-alert’,‘Inserisci la password’,‘e’);pw.focus();return;}
if(email===‘admin@plcveronaacademy.it’&&pass===‘Admin1234!’){
CU={id:‘admin_local’,name:‘Admin Academy’,email:email,role:‘admin’,profile:‘Admin’};
em.value=’’;pw.value=’’;closeModal();enterApp();return;
}
var users=gU();
for(var i=0;i<users.length;i++){
if(users[i].email===email&&users[i].password===pass){CU=users[i];PT=null;em.value=’’;pw.value=’’;closeModal();enterApp();return;}
}
if(PB&&PB.length>8){
alrt(‘m-alert’,‘Accesso…’,‘i’);
fetch(PB+’/api/collections/users/auth-with-password’,{method:‘POST’,headers:{‘Content-Type’:‘application/json’},body:JSON.stringify({identity:email,password:pass})})
.then(function(r){return r.json();}).then(function(d){
if(d.token){
PT=d.token;CU={id:d.record.id,name:d.record.full_name||email,email:d.record.email,role:d.record.role||‘student’,profile:d.record.profile_type||‘Studente’};
localStorage.setItem(‘pva_token’,PT);localStorage.setItem(‘pva_user’,JSON.stringify(CU));
em.value=’’;pw.value=’’;closeModal();enterApp();
}else{alrt(‘m-alert’,‘Email o password errati’,‘e’);}
}).catch(function(){alrt(‘m-alert’,‘Email o password errati’,‘e’);});
return;
}
alrt(‘m-alert’,‘Email o password errati’,‘e’);
}
function doReg(src){
var isM=src===‘modal’;
var nm=document.getElementById(isM?‘m-name’:‘r-name’);
var em=document.getElementById(isM?‘m-email2’:‘r-email’);
var pw=document.getElementById(isM?‘m-pass2’:‘r-pass’);
var pf=document.getElementById(isM?‘m-prof’:‘r-prof’);
var aid=isM?‘m-alert’:‘land-alert’;
if(!nm||!em||!pw){alrt(aid,‘Errore: ricarica la pagina’,‘e’);return;}
var name=nm.value.trim(),email=em.value.trim(),pass=pw.value,prof=pf?pf.value:’’;
if(!name){alrt(aid,‘Inserisci il nome’,‘e’);nm.focus();return;}
if(!email||email.indexOf(’@’)<0){alrt(aid,‘Email non valida’,‘e’);em.focus();return;}
if(!pass||pass.length<6){alrt(aid,‘Password minimo 6 caratteri’,‘e’);pw.focus();return;}
var users=gU();
for(var i=0;i<users.length;i++){if(users[i].email===email){alrt(aid,‘Email gia registrata’,‘e’);return;}}
var u={id:‘local_’+Date.now(),name:name,email:email,password:pass,role:‘student’,profile:prof||‘Studente’,date:new Date().toLocaleDateString(‘it-IT’)};
users.push(u);sU(users);CU=u;PT=null;
nm.value=’’;em.value=’’;pw.value=’’;if(pf)pf.value=’’;
if(isM)closeModal();enterApp();toast(‘Account creato!’);
if(PB&&PB.length>8){
fetch(PB+’/api/collections/users/records’,{method:‘POST’,headers:{‘Content-Type’:‘application/json’},
body:JSON.stringify({email:email,password:pass,passwordConfirm:pass,full_name:name,role:‘student’,profile_type:prof||‘Studente’,emailVisibility:true})
}).catch(function(){});
}
}
function doLogout(){
CU=null;PT=null;CC=null;localStorage.removeItem(‘pva_token’);localStorage.removeItem(‘pva_user’);
if(chatPoll){clearInterval(chatPoll);chatPoll=null;}
var app=document.getElementById(‘page-app’),land=document.getElementById(‘page-landing’),sb=document.getElementById(‘sb’);
if(app)app.classList.add(‘hidden’);if(land)land.classList.remove(‘hidden’);if(sb)sb.classList.remove(‘open’);
}
(function(){
var t=localStorage.getItem(‘pva_token’),u=localStorage.getItem(‘pva_user’);
if(t&&u){try{PT=t;CU=JSON.parse(u);enterApp();}catch(e){localStorage.removeItem(‘pva_token’);localStorage.removeItem(‘pva_user’);}}
})();

// ── ENTER APP ─────────────────────────────────────────────────
function enterApp(){
var land=document.getElementById(‘page-landing’),app=document.getElementById(‘page-app’);
if(land)land.classList.add(‘hidden’);if(app)app.classList.remove(‘hidden’);
var ini=CU.name.split(’ ‘).map(function(n){return n[0];}).join(’’).substring(0,2).toUpperCase();
[‘sbAv’,‘tbAv’,‘profAv’].forEach(function(id){var e=document.getElementById(id);if(e)e.textContent=ini;});
var els={sbName:CU.name,sbRole:CU.role===‘admin’?‘ADMIN’:‘STUDENTE’,wName:CU.name.split(’ ’)[0],profN:CU.name,profE:CU.email,profR:CU.role===‘admin’?‘Admin’:‘Studente’};
for(var k in els){if(els.hasOwnProperty(k)){var ek=document.getElementById(k);if(ek)ek.textContent=els[k];}}
var pi=document.getElementById(‘prof-ni’);if(pi)pi.value=CU.name;
if(CU.role===‘admin’){
var as=document.getElementById(‘adminSec’),na=document.getElementById(‘niAdmin’),nu=document.getElementById(‘niUsers’),tl=document.getElementById(‘tab-lsns’);
if(as)as.classList.remove(‘hidden’);if(na)na.classList.remove(‘hidden’);if(nu)nu.classList.remove(‘hidden’);if(tl)tl.classList.remove(‘hidden’);
}
showV(‘dashboard’);
}

// ── VIEWS ─────────────────────────────────────────────────────
var VS=[‘dashboard’,‘courses’,‘live’,‘admin’,‘users’,‘profile’,‘reviews’];
var VT={dashboard:‘Dashboard’,courses:‘I miei corsi’,live:‘Diretta Live’,admin:‘Gestione corsi’,users:‘Utenti’,profile:‘Profilo’,reviews:‘Recensioni’};
function showV(v){
VS.forEach(function(x){var e=document.getElementById(‘v-’+x);if(e)e.classList.add(‘hidden’);});
var tgt=document.getElementById(‘v-’+v);if(tgt)tgt.classList.remove(‘hidden’);
document.querySelectorAll(’.ni’).forEach(function(el){
el.classList.remove(‘active’);var oc=el.getAttribute(‘onclick’);
if(oc&&oc.indexOf(”’”+v+”’”)>=0)el.classList.add(‘active’);
});
var tt=document.getElementById(‘tbTitle’);if(tt)tt.textContent=VT[v]||v;
if(v===‘dashboard’)rdDash();if(v===‘courses’)rdCList();if(v===‘admin’)rdAdm();
if(v===‘reviews’)rdRevs();if(v===‘users’)rdUsers();
if(v===‘live’)initChat();else{if(chatPoll){clearInterval(chatPoll);chatPoll=null;}}
var sb=document.getElementById(‘sb’);if(sb)sb.classList.remove(‘open’);
}

// ── DASHBOARD ─────────────────────────────────────────────────
function rdDash(){
ldC(function(cs){
var prog=gP(),tot=0,scores=[];
cs.forEach(function(c){var cp=prog[c.id]||{};tot+=(cp.done||[]).length;if(cp.score!==undefined)scores.push(cp.score);});
var sd=document.getElementById(‘stD’),sq=document.getElementById(‘stQ’);
if(sd)sd.textContent=tot;
if(sq)sq.textContent=scores.length?Math.round(scores.reduce(function(a,b){return a+b;},0)/scores.length)+’%’:’-’;
var dl=document.getElementById(‘dashList’);
if(dl){
var h=’’;cs.forEach(function(c){
var cp=prog[c.id]||{done:[]};var d=(cp.done||[]).length,tl=c.lessons.length,pct=tl?Math.round(d/tl*100):0;
h+=’<div class="card" style="padding:16px;margin-bottom:11px;cursor:pointer" onclick="openC(\''+c.id+'\')">’;
h+=’<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px"><div style="font-size:28px">’+c.icon+’</div>’;
h+=’<div style="flex:1"><div style="font-weight:700;font-size:14px">’+c.title+’</div><div style="font-size:12px;color:var(--mu)">’+d+’/’+tl+’ lezioni</div></div>’;
h+=’<span class="bd '+(c.status==='disponibile'?'bd-g':'bd-y')+'">’+c.status+’</span></div>’;
h+=’<div class="pb-wrap"><div class="pb-fill" style="width:'+pct+'%"></div></div>’;
h+=’<div style="font-size:11px;color:var(--mu);margin-top:4px;text-align:right">’+pct+’% completato</div></div>’;
});dl.innerHTML=h;
}
var pl=document.getElementById(‘progList’);
if(pl){
var h2=’’;cs.forEach(function(c){
var cp=prog[c.id]||{done:[]};var pct=c.lessons.length?Math.round((cp.done||[]).length/c.lessons.length*100):0;
h2+=’<div style="margin-bottom:11px"><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600;margin-bottom:4px"><span>’+c.icon+’ ‘+c.title.split(’-’)[0].trim()+’</span><span style="color:var(--p)">’+pct+’%</span></div>’;
h2+=’<div class="pb-wrap"><div class="pb-fill" style="width:'+pct+'%"></div></div></div>’;
});pl.innerHTML=h2;
}
});
}

// ── COURSES LIST ──────────────────────────────────────────────
function rdCList(){
var lv=document.getElementById(‘cListView’),pv=document.getElementById(‘playerView’);
if(lv)lv.classList.remove(‘hidden’);if(pv)pv.classList.add(‘hidden’);
ldC(function(cs){
var grid=document.getElementById(‘appCGrid’);if(!grid)return;
var prog=gP();var lc={base:‘bd-b’,intermedio:‘bd-y’,avanzato:‘bd-r’};
var h=’’;cs.forEach(function(c){
var cp=prog[c.id]||{done:[]};var pct=c.lessons.length?Math.round((cp.done||[]).length/c.lessons.length*100):0;
h+=’<div class="cc" onclick="openC(\''+c.id+'\')">’;
h+=’<div class="cc-hd '+c.color+'"><div class="cc-hd-grid"></div><div class="cc-icon">’+c.icon+’</div></div>’;
h+=’<div class="cc-body"><div class="cc-bds"><span class="bd '+(lc[c.level]||'bd-b')+'">’+c.level+’</span><span class="bd '+(c.status==='disponibile'?'bd-g':'bd-y')+'">’+c.status+’</span></div>’;
h+=’<div class="cc-title">’+c.title+’</div><div class="cc-desc">’+c.desc+’</div>’;
h+=’<div class="cc-meta"><span>’+c.lessons.length+’ lezioni</span><span>’+(c.materials?c.materials.length:0)+’ PDF</span><span>’+(c.quiz?c.quiz.length:0)+’ quiz</span></div>’;
h+=’<div class="pb-wrap" style="margin-bottom:10px"><div class="pb-fill" style="width:'+pct+'%"></div></div>’;
var priceTag=’’;var btnTxt=pct>0?‘Continua →’:‘Inizia →’;
if(c.price&&parseFloat(c.price)>0){
if(isEnrolled(c.id)){priceTag=’<span class="bd bd-g">✅ Iscritto</span>’;}
else{priceTag=’<span class="bd bd-y" style="font-size:13px;font-weight:900">’+(c.currency||‘EUR’)+’ ‘+parseFloat(c.price).toFixed(2)+’</span>’;btnTxt=’🔒 Acquista’;}
}else{priceTag=’<span class="bd bd-g">Gratuito</span>’;}
h+=’<div class="cc-ft">’+priceTag+’<button class="btn btn-p btn-sm">’+btnTxt+’</button></div></div></div>’;
});grid.innerHTML=h;
});
}
function filterC(q){document.querySelectorAll(’#appCGrid .cc’).forEach(function(c){c.style.display=c.textContent.toLowerCase().indexOf(q.toLowerCase())>=0?’’:‘none’;});}
function filterLvl(lvl,btn){
document.querySelectorAll(’#appCGrid .cc’).forEach(function(c){c.style.display=(lvl===‘all’||c.textContent.toLowerCase().indexOf(lvl)>=0)?’’:‘none’;});
document.querySelectorAll(’#cListView .btn-o’).forEach(function(b){b.style.background=‘transparent’;b.style.borderColor=‘var(–p)’;b.style.color=‘var(–p)’;});
btn.style.background=‘rgba(0,96,204,.08)’;
}
function openC(id){
ldC(function(cs){
CLC=null;for(var i=0;i<cs.length;i++){if(cs[i].id===id){CLC=cs[i];break;}}
if(!CLC)return;
// Check if paid and not enrolled
if(CLC.price&&parseFloat(CLC.price)>0&&!isEnrolled(id)){
startCheckout(id);return;
}
curL=0;curQ=0;qAns=[];
var lv=document.getElementById(‘cListView’),pv=document.getElementById(‘playerView’);
if(lv)lv.classList.add(‘hidden’);if(pv)pv.classList.remove(‘hidden’);
rdPlayer(‘video’);
});
}

// ── PLAYER ────────────────────────────────────────────────────
function rdPlayer(tab){
var c=CLC;if(!c)return;
var prog=gP();var cp=prog[c.id]||{done:[]};
var l=c.lessons[curL]||{title:’’,dur:’’,vt:’’,vurl:’’,notes:’’,pdfs:[],lq:[]};

var sbH=’’;for(var i=0;i<c.lessons.length;i++){
var li=c.lessons[i];var isDone=(cp.done||[]).indexOf(i)>=0;
sbH+=’<div class="li'+(i===curL?' active':'')+(isDone?' done':'')+'" onclick="selL('+i+')">’;
sbH+=’<div class="lin">’+(isDone?’✓’:(i+1))+’</div>’;
sbH+=’<div style="flex:1"><div class="li-t">’+li.title+’</div><div class="li-d">’+( li.dur||’-’)+’</div></div>’;
sbH+=’<div class="li-tp">📹</div></div>’;
}

var mH=’’;
if(tab===‘video’){
var vt=l.vt||’’,vu=l.vurl||’’;
if(vt===‘upload’&&vu){mH=’<div class="vframe"><video src="'+vu+'" controls controlsList="nodownload" preload="metadata" style="width:100%;height:100%;background:#000"></video></div>’;}
else if((vt===‘gdrive’||vt===‘vimeo’)&&vu){mH=’<div class="vframe"><iframe src="'+vu+'" allowfullscreen></iframe></div>’;}
else{mH=’<div class="vframe" style="display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0a1628,#162847);border-radius:11px;min-height:195px"><div style="text-align:center;color:rgba(255,255,255,.6)"><div style="font-size:40px;margin-bottom:9px">📹</div><div style="font-size:14px">Video non ancora disponibile</div><div style="font-size:12px;opacity:.6;margin-top:3px">Il master deve caricare il video</div></div></div>’;}
mH+=’<div class="l-title">’+l.title+’</div>’;
if(l.notes){mH+=’<div class="l-notes"><div class="ln-lbl">📝 Note del docente</div><div class="ln-text">’+esc(l.notes)+’</div></div>’;}
else{mH+=’<div class="l-desc">Lezione ‘+(curL+1)+’ di ‘+c.lessons.length+(l.dur?’ — ‘+l.dur:’’)+’</div>’;}
mH+=’<div class="l-acts"><button class="btn btn-p btn-sm" onclick="markDone()">✅ Segna completata</button>’;
if(curL<c.lessons.length-1)mH+=’<button class="btn btn-o btn-sm" onclick="nextL()">Prossima →</button>’;
mH+=’</div>’;
} else if(tab===‘materials’){
var mats=(l.pdfs&&l.pdfs.length)?l.pdfs:(c.materials||[]);
if(!mats.length){mH=’<div style="text-align:center;padding:32px;color:var(--mu)"><div style="font-size:40px;margin-bottom:9px">📋</div><div>Nessun materiale per questa lezione</div></div>’;}
else{mH=’<div class="mat-grid">’;mats.forEach(function(m){mH+=’<div class="mat-item" onclick="window.open(\''+(m.url||'#')+'\',\'_blank\')"><div class="mat-ico">📄</div><div><div class="mat-nm">’+(m.name||‘Documento’)+’</div><div class="mat-sz">’+(m.size||’’)+’</div></div><button class="btn btn-o btn-sm">⬇ Scarica</button></div>’;});mH+=’</div>’;}
} else if(tab===‘quiz’){
var qs=(l.lq&&l.lq.length)?l.lq:(c.quiz||[]);
if(!qs.length){mH=’<div style="text-align:center;padding:32px;color:var(--mu)"><div style="font-size:40px;margin-bottom:9px">✅</div><div>Nessun quiz per questa lezione</div></div>’;}
else{
var q=qs[curQ];if(!q){mH=’<div style="padding:18px;color:var(--mu)">Fine quiz</div>’;}
else{
var pct=Math.round((curQ+1)/qs.length*100);
mH=’<div class="quiz-card"><div class="qpb"><span style="font-size:13px;color:var(--mu)">’+(curQ+1)+’/’+qs.length+’</span><div class="qpb-bar"><div class="qpb-fill" style="width:'+pct+'%"></div></div></div>’;
mH+=’<div class="quiz-q">’+q.q+’</div><div class="quiz-opts">’;
(q.opts||[]).forEach(function(opt,i){mH+=’<div class="qo" onclick="pickQ('+i+')"><div class="qo-c"></div>’+opt+’</div>’;});
mH+=’</div><button class="btn btn-p" id="qNxt" onclick="nextQ()" style="display:none">Prossima →</button></div>’;
}
}
}

var tbH=’<div class="tab-bar" style="padding:0 20px;border-bottom:2px solid #f0f4f8">’;
tbH+=’<div class="tab '+(tab==='video'?'active':'')+'" onclick="rdPlayer(\'video\')">📹 Lezione</div>’;
tbH+=’<div class="tab '+(tab==='materials'?'active':'')+'" onclick="rdPlayer(\'materials\')">📄 Materiali</div>’;
tbH+=’<div class="tab '+(tab==='quiz'?'active':'')+'" onclick="rdPlayer(\'quiz\')">✅ Quiz</div></div>’;

var pc=document.getElementById(‘playerCont’);if(!pc)return;
var h=’<div class="player-hd"><button class="player-bk" onclick="rdCList()">←</button>’;
h+=’<div><div class="player-title">’+c.icon+’ ‘+c.title+’</div>’;
h+=’<div style="font-size:12px;color:var(--mu);margin-top:2px">’+c.lessons.length+’ lezioni</div></div></div>’;
h+=tbH+’<div class="player-layout"><div class="player-main">’+mH+’</div>’;
h+=’<div class="player-sb"><div class="psb-title">Lezioni</div>’+sbH+’</div></div>’;
pc.innerHTML=h;
}
function selL(i){curL=i;curQ=0;qAns=[];rdPlayer(‘video’);}
function nextL(){if(curL<CLC.lessons.length-1){curL++;rdPlayer(‘video’);}}
function markDone(){var p=gP();if(!p[CLC.id])p[CLC.id]={done:[]};if((p[CLC.id].done||[]).indexOf(curL)<0)p[CLC.id].done.push(curL);sP(p);rdPlayer(‘video’);toast(‘Lezione completata!’);}
function pickQ(i){
var opts=document.querySelectorAll(’.qo’);opts.forEach(function(el){el.classList.remove(‘sel’,‘cor’,‘wrg’);});
var l=CLC.lessons[curL];var qs=(l.lq&&l.lq.length)?l.lq:(CLC.quiz||[]);var q=qs[curQ];
opts[i].classList.add(i===q.correct?‘cor’:‘wrg’);
if(opts[i].querySelector(’.qo-c’))opts[i].querySelector(’.qo-c’).textContent=i===q.correct?’✓’:’✗’;
if(i!==q.correct&&opts[q.correct]){opts[q.correct].classList.add(‘cor’);if(opts[q.correct].querySelector(’.qo-c’))opts[q.correct].querySelector(’.qo-c’).textContent=’✓’;}
qAns[curQ]=(i===q.correct);var nb=document.getElementById(‘qNxt’);if(nb)nb.style.display=‘flex’;
}
function nextQ(){
var l=CLC.lessons[curL];var qs=(l.lq&&l.lq.length)?l.lq:(CLC.quiz||[]);
if(curQ<qs.length-1){curQ++;rdPlayer(‘quiz’);return;}
var ok=0;qAns.forEach(function(a){if(a)ok++;});var sc=Math.round(ok/qs.length*100);
var p=gP();if(!p[CLC.id])p[CLC.id]={done:[]};p[CLC.id].score=sc;sP(p);
var qc=document.querySelector(’.quiz-card’);
if(qc)qc.innerHTML=’<div style="text-align:center;padding:32px"><div style="font-size:68px;margin-bottom:14px">’+(sc>=70?’🏆’:’📚’)+’</div><div style="font-family:Playfair Display,serif;font-size:32px;font-weight:900;margin-bottom:7px">’+sc+’%</div><div style="font-size:14px;color:var(--mu);margin-bottom:20px">’+(sc>=70?‘Ottimo! Quiz superato.’:‘Riprova - minimo 70%’)+’</div><button class="btn btn-p" onclick="curQ=0;qAns=[];rdPlayer(\'quiz\')">↻ Rifai</button></div>’;
}

// ── ADMIN COURSES ─────────────────────────────────────────────
function rdAdm(){
ldC(function(cs){
var tb=document.getElementById(‘admTB’);if(!tb)return;var h=’’;
cs.forEach(function(c){
var lc={base:‘bd-b’,intermedio:‘bd-y’,avanzato:‘bd-r’};
h+=’<tr><td><div style="display:flex;align-items:center;gap:10px"><span style="font-size:20px">’+c.icon+’</span><span style="font-weight:600">’+c.title+’</span></div></td>’;
h+=’<td><span class="bd '+(lc[c.level]||'bd-b')+'">’+c.level+’</span></td>’;
h+=’<td>’+(c.lessons?c.lessons.length:0)+’</td>’;
h+=’<td><span class="bd '+(c.status==='disponibile'?'bd-g':'bd-y')+'">’+c.status+’</span></td>’;
h+=’<td><div style="display:flex;gap:7px">’;
h+=’<button class="btn btn-p btn-sm" onclick="openLsnM(\''+c.id+'\')">📹 Lezioni</button>’;
h+=’<button class="btn btn-o btn-sm" onclick="editC(\''+c.id+'\')">✎</button>’;
h+=’<button class="btn btn-d btn-sm" onclick="delC(\''+c.id+'\')">🗑</button>’;
h+=’</div></td></tr>’;
});
tb.innerHTML=h||’<tr><td colspan="5" style="text-align:center;padding:22px;color:var(--mu)">Nessun corso ancora.</td></tr>’;
});
}
function swAT(t,btn){
document.querySelectorAll(’#v-admin .tab’).forEach(function(el){el.classList.remove(‘active’);});
document.querySelectorAll(’#v-admin .tc’).forEach(function(el){el.classList.remove(‘active’);});
if(btn)btn.classList.add(‘active’);var tc=document.getElementById(‘at-’+t);if(tc)tc.classList.add(‘active’);
}
function saveCourse(){
var at=document.getElementById(‘a-title’),ad=document.getElementById(‘a-desc’),ai=document.getElementById(‘a-icon’);
var al=document.getElementById(‘a-level’),as=document.getElementById(‘a-stat’),ae=document.getElementById(‘a-eid’);
var aft=document.getElementById(‘admFT’);
if(!at||!at.value.trim()){alrt(‘adm-alert’,‘Inserisci il titolo’,‘e’);return;}
var eid=ae?ae.value.trim():’’;
var cd={id:eid||(‘c’+Date.now()),title:at.value.trim(),icon:ai?ai.value.trim():’⚙’,level:al?al.value:‘base’,desc:ad?ad.value.trim():’’,status:as?as.value:‘disponibile’,color:‘bl’,lessons:[],materials:[],quiz:[]};
var local=gC()||[];
if(eid){for(var i=0;i<local.length;i++){if(local[i].id===eid){cd.lessons=local[i].lessons||[];cd.materials=local[i].materials||[];cd.quiz=local[i].quiz||[];local[i]=cd;break;}}}
else{local.push(cd);}
sC(local);CC=local;
alrt(‘adm-alert’,‘Corso salvato!’,‘s’);
if(at)at.value=’’;if(ad)ad.value=’’;if(ae)ae.value=’’;if(aft)aft.textContent=‘Nuovo corso’;
setTimeout(function(){openLsnM(cd.id);},800);
if(PB&&PT){
var pl={title:cd.title,description:cd.desc,icon:cd.icon,level:cd.level,status:cd.status,color:‘bl’,lessons:JSON.stringify(cd.lessons),materials:JSON.stringify(cd.materials),quiz:JSON.stringify(cd.quiz)};
fetch(PB+’/api/collections/courses/records’+(eid?’/’+eid:’’),{method:eid?‘PATCH’:‘POST’,headers:{‘Content-Type’:‘application/json’,‘Authorization’:PT},body:JSON.stringify(pl)}).catch(function(){});
}
}
function editC(id){
swAT(‘add’,document.querySelectorAll(’#v-admin .tab’)[1]);
var local=gC()||[];var c=null;for(var i=0;i<local.length;i++){if(local[i].id===id){c=local[i];break;}}if(!c)return;
var at=document.getElementById(‘a-title’),ad=document.getElementById(‘a-desc’),ai=document.getElementById(‘a-icon’);
var al=document.getElementById(‘a-level’),as=document.getElementById(‘a-stat’),ae=document.getElementById(‘a-eid’),aft=document.getElementById(‘admFT’);
if(at)at.value=c.title;if(ad)ad.value=c.desc||’’;if(ai)ai.value=c.icon;if(al)al.value=c.level;if(as)as.value=c.status;if(ae)ae.value=id;if(aft)aft.textContent=‘Modifica corso’;
}
function delC(id){
if(!confirm(‘Eliminare questo corso?’))return;
var local=(gC()||[]).filter(function(c){return c.id!==id;});sC(local);CC=local;rdAdm();toast(‘Corso eliminato’,‘w’);
if(PB&&PT)fetch(PB+’/api/collections/courses/records/’+id,{method:‘DELETE’,headers:{Authorization:PT}}).catch(function(){});
}
function gbId(id){var local=gC()||[];for(var i=0;i<local.length;i++){if(local[i].id===id)return local[i];}return null;}

// ── LESSON MANAGER ────────────────────────────────────────────
function openLsnM(id){
CLCA=id;var c=gbId(id);if(!c)return;
var tl=document.getElementById(‘tab-lsns’);if(tl)tl.classList.remove(‘hidden’);
swAT(‘lsns’,tl);
var li=document.getElementById(‘lmIco’),lt=document.getElementById(‘lmTit’),lc=document.getElementById(‘lmCnt’);
if(li)li.textContent=c.icon;if(lt)lt.textContent=c.title;if(lc)lc.textContent=(c.lessons?c.lessons.length:0)+’ lezioni’;
rdLsnList(c);
}
function rdLsnList(c){
var cont=document.getElementById(‘lsnListAdm’);if(!cont)return;
var ls=c.lessons||[];
if(!ls.length){cont.innerHTML=’<div style="text-align:center;padding:32px;color:var(--mu);background:#fff;border-radius:12px;box-shadow:var(--sh)"><div style="font-size:40px;margin-bottom:10px">📋</div><div style="font-weight:600;margin-bottom:5px">Nessuna lezione</div><div style="font-size:13px">Aggiungi la prima lezione</div></div>’;return;}
var h=’’;
ls.forEach(function(l,i){
var hV=l.vt&&l.vurl;var vt=l.vt===‘gdrive’?‘Drive’:l.vt===‘vimeo’?‘Vimeo’:l.vt===‘upload’?‘MP4’:’’;
h+=’<div class="lm-row"><div class="lm-num">’+(i+1)+’</div><div style="flex:1"><div style="font-weight:700;font-size:14px;margin-bottom:6px">’+l.title+’</div>’;
h+=’<div style="display:flex;gap:7px;flex-wrap:wrap">’;
if(l.dur)h+=’<span class="bd bd-b">’+l.dur+’</span>’;
h+=’<span class="bd '+(hV?'bd-g':'bd-y')+'">📹 ‘+(hV?vt+’ ✓’:‘nessun video’)+’</span>’;
if(l.pdfs&&l.pdfs.length)h+=’<span class="bd bd-c">📄 ‘+l.pdfs.length+’ PDF</span>’;
if(l.lq&&l.lq.length)h+=’<span class="bd bd-g">✅ ‘+l.lq.length+’ quiz</span>’;
if(l.notes)h+=’<span class="bd bd-b">📝 Note</span>’;
h+=’</div></div><div style="display:flex;gap:7px;flex-wrap:wrap">’;
h+=’<button class="btn btn-o btn-sm" onclick="openLsnF('+i+')">✎ Modifica</button>’;
h+=’<button class="btn btn-d btn-sm" onclick="delLsn('+i+')">🗑</button>’;
if(i>0)h+=’<button class="btn btn-o btn-sm" onclick="movLsn('+i+',-1)">↑</button>’;
if(i<ls.length-1)h+=’<button class="btn btn-o btn-sm" onclick="movLsn('+i+',1)">↓</button>’;
h+=’</div></div>’;
});
cont.innerHTML=h;
}
function pdfRH(){return ‘<div class="pdf-row"><input type="text" class="fc" placeholder="Nome PDF" style="margin:0"><input type="text" class="fc" placeholder="URL / link Drive" style="margin:0"><button class="btn btn-d btn-sm" onclick="this.closest(\'.pdf-row\').remove()">✕</button></div>’;}
function addPR(){var p=document.getElementById(‘l-pdfs’);if(p)p.insertAdjacentHTML(‘beforeend’,pdfRH());}
function qzRH(q){
var opts=q?q.opts||[]:[];
var h=’<div class="lq-item"><div class="fg" style="margin-bottom:8px"><label>Domanda</label><input type="text" class="fc lq-q" placeholder="es. Cos e un OB?" value="'+(q?esc(q.q):'')+'" style="margin:0"></div>’;
h+=’<div class="lq-opts">’;
var phs=[‘Risposta A (corretta)’,‘Risposta B’,‘Risposta C’,‘Risposta D’];
for(var k=0;k<4;k++){h+=’<input type="text" class="fc lq-o" placeholder="'+phs[k]+'" style="margin:0'+(k===0?';border-color:var(--ok)':'')+'" value="'+(opts[k]?esc(opts[k]):'')+'">’;}
h+=’</div><button class="btn btn-d btn-sm" style="margin-top:8px;font-size:12px" onclick="this.closest(\'.lq-item\').remove()">✕ Rimuovi</button></div>’;
return h;
}
function addLQ(){var q=document.getElementById(‘l-quiz’);if(q)q.insertAdjacentHTML(‘beforeend’,qzRH(null));}
function updVF(){
var vt=document.getElementById(‘l-vt’);if(!vt)return;var v=vt.value;
var fu=document.getElementById(‘f-upload’),fg=document.getElementById(‘f-gdrive’),fv=document.getElementById(‘f-vimeo’);
if(fu)fu.style.display=v===‘upload’?’’:‘none’;
if(fg)fg.style.display=v===‘gdrive’?’’:‘none’;
if(fv)fv.style.display=v===‘vimeo’?’’:‘none’;
}
function openLsnF(idx){
var fw=document.getElementById(‘lsnFWrap’);if(!fw)return;fw.style.display=‘block’;fw.scrollIntoView({behavior:‘smooth’,block:‘start’});
var ft=document.getElementById(‘lsnFT’),ei=document.getElementById(‘l-idx’);
var lt=document.getElementById(‘l-title’),ld=document.getElementById(‘l-dur’),ln=document.getElementById(‘l-notes’);
var lvt=document.getElementById(‘l-vt’),lvu=document.getElementById(‘l-vurl’),lgd=document.getElementById(‘l-gdrive’),lvm=document.getElementById(‘l-vimeo’);
var upfn=document.getElementById(‘upFN’),plist=document.getElementById(‘l-pdfs’),qlist=document.getElementById(‘l-quiz’);
alrt(‘lsn-alert’,’’,’’);
if(idx===-1){
if(ft)ft.textContent=‘Nuova lezione’;if(ei)ei.value=’’;if(lt)lt.value=’’;if(ld)ld.value=’’;if(ln)ln.value=’’;
if(lvt)lvt.value=‘upload’;if(lvu)lvu.value=’’;if(lgd)lgd.value=’’;if(lvm)lvm.value=’’;
if(upfn)upfn.textContent=’’;if(plist)plist.innerHTML=pdfRH();if(qlist)qlist.innerHTML=’’;updVF();
} else {
var c=gbId(CLCA);if(!c||!c.lessons[idx])return;var l=c.lessons[idx];
if(ft)ft.textContent=‘Modifica lezione ‘+(idx+1);if(ei)ei.value=idx;
if(lt)lt.value=l.title||’’;if(ld)ld.value=l.dur||’’;if(ln)ln.value=l.notes||’’;
var vt=l.vt||‘upload’;if(lvt)lvt.value=vt;
if(vt===‘gdrive’){if(lgd)lgd.value=l.vurl||’’;}
else if(vt===‘vimeo’){if(lvm)lvm.value=l.vurl||’’;}
else{if(lvu)lvu.value=l.vurl||’’;if(upfn&&l.vurl)upfn.textContent=’📹 Video caricato’;}
updVF();
var pdfs=l.pdfs||[];
if(plist){if(!pdfs.length){plist.innerHTML=pdfRH();}else{var ph=’’;pdfs.forEach(function(p){ph+=’<div class="pdf-row"><input type="text" class="fc" placeholder="Nome PDF" style="margin:0" value="'+esc(p.name)+'"><input type="text" class="fc" placeholder="URL" style="margin:0" value="'+esc(p.url)+'"><button class="btn btn-d btn-sm" onclick="this.closest(\'.pdf-row\').remove()">✕</button></div>’;});plist.innerHTML=ph;}}
var lq=l.lq||[];
if(qlist){if(!lq.length){qlist.innerHTML=’’;}else{var qh=’’;lq.forEach(function(q){qh+=qzRH(q);});qlist.innerHTML=qh;}}
}
}
function dropV(e){e.preventDefault();var f=e.dataTransfer?e.dataTransfer.files[0]:null;if(f)hVFile(f);}
function pickV(inp){if(inp.files&&inp.files[0])hVFile(inp.files[0]);}
function hVFile(file){
var fn=document.getElementById(‘upFN’),lvu=document.getElementById(‘l-vurl’),pp=document.getElementById(‘upPr’),bar=document.getElementById(‘upBr’),pc=document.getElementById(‘upPc’),st=document.getElementById(‘upSt’);
if(fn)fn.textContent=’📹 ‘+file.name+’ (’+(file.size/1024/1024).toFixed(1)+’ MB)’;
if(PB&&PT){
if(pp)pp.style.display=‘block’;var fd=new FormData();fd.append(‘file’,file);
var xhr=new XMLHttpRequest();
xhr.upload.onprogress=function(e){if(e.lengthComputable){var p=Math.round(e.loaded/e.total*100);if(bar)bar.style.width=p+’%’;if(pc)pc.textContent=p+’%’;if(st)st.textContent=p<100?‘Caricamento…’:‘Elaborazione…’;}};
xhr.onload=function(){
if(xhr.status===200){
try{var r=JSON.parse(xhr.responseText);var url=PB+’/api/files/’+r.collectionName+’/’+r.id+’/’+r.file;if(lvu)lvu.value=url;if(st)st.textContent=‘Caricato!’;toast(‘Video caricato!’);}
catch(e){useOV(file,lvu,fn);}
}else{useOV(file,lvu,fn);}
};
xhr.onerror=function(){useOV(file,lvu,fn);if(pp)pp.style.display=‘none’;};
xhr.open(‘POST’,PB+’/api/collections/lesson_videos/records’);xhr.setRequestHeader(‘Authorization’,PT);xhr.send(fd);
}else{useOV(file,lvu,fn);toast(‘Configura il backend per salvare i video’,‘w’);}
}
function useOV(file,lvu,fn){var url=URL.createObjectURL(file);if(lvu)lvu.value=url;if(fn)fn.textContent=’📹 ‘+file.name+’ (locale)’;}
function saveLsn(){
var lt=document.getElementById(‘l-title’),ld=document.getElementById(‘l-dur’),ln=document.getElementById(‘l-notes’);
var lvt=document.getElementById(‘l-vt’),lvu=document.getElementById(‘l-vurl’),lgd=document.getElementById(‘l-gdrive’),lvm=document.getElementById(‘l-vimeo’),ei=document.getElementById(‘l-idx’);
if(!lt||!lt.value.trim()){alrt(‘lsn-alert’,‘Inserisci il titolo della lezione’,‘e’);return;}
var vt=lvt?lvt.value:‘upload’,vurl=’’;
if(vt===‘upload’){vurl=lvu?lvu.value:’’;}
else if(vt===‘gdrive’){var gu=lgd?lgd.value.trim():’’;var gm=gu.match(//file/d/([^/]+)/);vurl=gm?‘https://drive.google.com/file/d/’+gm[1]+’/preview’:gu;}
else if(vt===‘vimeo’){var vu=lvm?lvm.value.trim():’’;var vm=vu.match(/vimeo.com/(\d+)/);vurl=vm?‘https://player.vimeo.com/video/’+vm[1]:vu;}
var pdfs=[];document.querySelectorAll(’#l-pdfs .pdf-row’).forEach(function(r){var ins=r.querySelectorAll(‘input’);if(ins[0]&&ins[0].value.trim())pdfs.push({name:ins[0].value.trim(),url:ins[1]?ins[1].value.trim():’#’});});
var lq=[];document.querySelectorAll(’#l-quiz .lq-item’).forEach(function(r){var qt=r.querySelector(’.lq-q’);var qo=r.querySelectorAll(’.lq-o’);if(qt&&qt.value.trim()){var opts=[];qo.forEach(function(o){if(o.value.trim())opts.push(o.value.trim());});if(opts.length>=2)lq.push({q:qt.value.trim(),opts:opts,correct:0});}});
var ld_={title:lt.value.trim(),dur:ld?ld.value.trim():’-’,notes:ln?ln.value.trim():’’,vt:vt,vurl:vurl,pdfs:pdfs,lq:lq};
var c=gbId(CLCA);if(!c){toast(‘Corso non trovato’,‘e’);return;}
if(!c.lessons)c.lessons=[];
var idx=ei?parseInt(ei.value):-1;
if(!isNaN(idx)&&idx>=0&&idx<c.lessons.length){c.lessons[idx]=ld_;toast(‘Lezione aggiornata!’);}
else{c.lessons.push(ld_);toast(‘Lezione aggiunta!’);}
var allQ=[];c.lessons.forEach(function(l){(l.lq||[]).forEach(function(q){allQ.push(q);});});c.quiz=allQ;
var allM=[];c.lessons.forEach(function(l){(l.pdfs||[]).forEach(function(p){allM.push(p);});});c.materials=allM;
var local=gC()||[];for(var i=0;i<local.length;i++){if(local[i].id===CLCA){local[i]=c;break;}}
sC(local);CC=null;
var fw=document.getElementById(‘lsnFWrap’);if(fw)fw.style.display=‘none’;
rdLsnList(c);var lc=document.getElementById(‘lmCnt’);if(lc)lc.textContent=c.lessons.length+’ lezioni’;
if(PB&&PT)fetch(PB+’/api/collections/courses/records/’+CLCA,{method:‘PATCH’,headers:{‘Content-Type’:‘application/json’,‘Authorization’:PT},body:JSON.stringify({lessons:JSON.stringify(c.lessons),materials:JSON.stringify(c.materials),quiz:JSON.stringify(c.quiz)})}).catch(function(){});
}
function delLsn(idx){if(!confirm(‘Eliminare questa lezione?’))return;var c=gbId(CLCA);if(!c)return;c.lessons.splice(idx,1);var local=gC()||[];for(var i=0;i<local.length;i++){if(local[i].id===CLCA){local[i]=c;break;}}sC(local);CC=null;rdLsnList(c);toast(‘Lezione eliminata’,‘w’);}
function movLsn(idx,dir){var c=gbId(CLCA);if(!c)return;var ni=idx+dir;if(ni<0||ni>=c.lessons.length)return;var t=c.lessons[idx];c.lessons[idx]=c.lessons[ni];c.lessons[ni]=t;var local=gC()||[];for(var i=0;i<local.length;i++){if(local[i].id===CLCA){local[i]=c;break;}}sC(local);CC=null;rdLsnList(c);}

// ── USERS ─────────────────────────────────────────────────────
function rdUsers(){
var tb=document.getElementById(‘uTB’);if(!tb)return;
var users=gU();var adm={name:‘Admin Academy’,email:‘admin@plcveronaacademy.it’,role:‘admin’,profile:‘Admin’,date:’-’};
var all=[adm].concat(users);var h=’’;
all.forEach(function(u){
var ini=u.name.split(’ ‘).map(function(n){return n[0];}).join(’’).substring(0,2).toUpperCase();
h+=’<tr><td><div style="display:flex;align-items:center;gap:9px"><div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--a),var(--p));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff">’+ini+’</div><span style="font-weight:600">’+u.name+’</span></div></td>’;
h+=’<td>’+u.email+’</td><td>’+(u.profile||’-’)+’</td>’;
h+=’<td><span class="bd '+(u.role==='admin'?'bd-r':'bd-b')+'">’+(u.role===‘admin’?‘Admin’:‘Studente’)+’</span></td>’;
h+=’<td>’+(u.date||’-’)+’</td>’;
h+=’<td>’+(u.role!==‘admin’?’<button class="btn btn-d btn-sm" onclick="delU(\''+u.email+'\')">🗑</button>’:’-’)+’</td></tr>’;
});
tb.innerHTML=h||’<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--mu)">Nessun utente</td></tr>’;
}
function delU(email){if(!confirm(‘Rimuovere?’))return;sU(gU().filter(function(u){return u.email!==email;}));rdUsers();toast(‘Utente rimosso’,‘w’);}

// ── PROFILE ───────────────────────────────────────────────────
function saveProf(){var ni=document.getElementById(‘prof-ni’);if(!ni||!ni.value.trim())return;var n=ni.value.trim();CU.name=n;var users=gU();for(var i=0;i<users.length;i++){if(users[i].email===CU.email){users[i].name=n;break;}}sU(users);localStorage.setItem(‘pva_user’,JSON.stringify(CU));var ini=n.split(’ ‘).map(function(x){return x[0];}).join(’’).substring(0,2).toUpperCase();[‘sbAv’,‘tbAv’,‘profAv’].forEach(function(id){var e=document.getElementById(id);if(e)e.textContent=ini;});var pn=document.getElementById(‘profN’),sb=document.getElementById(‘sbName’),wn=document.getElementById(‘wName’);if(pn)pn.textContent=n;if(sb)sb.textContent=n;if(wn)wn.textContent=n.split(’ ’)[0];toast(‘Profilo salvato!’);}

// ── LIVE CHAT ─────────────────────────────────────────────────
function initChat(){if(PB&&PB.length>8){ldChat();chatPoll=setInterval(ldChat,4000);}}
function ldChat(){if(!PB||PB.length<8)return;fetch(PB+’/api/collections/chat_messages/records?perPage=50&sort=created’,{headers:PT?{Authorization:PT}:{}}).then(function(r){return r.json();}).then(function(d){var c=document.getElementById(‘chatMsgs’);if(!c||!d.items||!d.items.length)return;var h=’’;d.items.forEach(function(m){var av=(m.user_name||’??’).substring(0,2).toUpperCase();h+=’<div class="cmsg"><div class="cav">’+av+’</div><div class="cbub"><div class="cn">’+m.user_name+’</div><div class="ct">’+m.message+’</div></div></div>’;});c.innerHTML=h;c.scrollTop=c.scrollHeight;}).catch(function(){});}
function sendChat(){var inp=document.getElementById(‘chatIn’);if(!inp||!inp.value.trim())return;var msg=inp.value.trim();inp.value=’’;var ini=CU.name.split(’ ‘).map(function(n){return n[0];}).join(’’).substring(0,2).toUpperCase();var c=document.getElementById(‘chatMsgs’);if(c){c.insertAdjacentHTML(‘beforeend’,’<div class="cmsg"><div class="cav">’+ini+’</div><div class="cbub"><div class="cn">’+CU.name+’</div><div class="ct">’+msg+’</div></div></div>’);c.scrollTop=c.scrollHeight;}if(PB&&PT)fetch(PB+’/api/collections/chat_messages/records’,{method:‘POST’,headers:{‘Content-Type’:‘application/json’,‘Authorization’:PT},body:JSON.stringify({user:CU.id,user_name:CU.name,message:msg})}).catch(function(){});}

// ── REVIEWS ───────────────────────────────────────────────────
function setSt(n){selSt=n;var sp=document.querySelectorAll(’#starPick .sp’);sp.forEach(function(s,i){s.classList.toggle(‘lit’,i<n);});var lbs=[’’,‘Pessimo’,‘Scarso’,‘Nella media’,‘Buono’,‘Eccellente!’];var sl=document.getElementById(‘starLbl’);if(sl)sl.textContent=lbs[n]||’’;}
function submitRev(){var rc=document.getElementById(‘rv-course’),rt=document.getElementById(‘rv-text’);var cn=rc?rc.value:’’,tx=rt?rt.value.trim():’’;if(!cn){alrt(‘rev-alert’,‘Seleziona un corso’,‘e’);return;}if(!selSt){alrt(‘rev-alert’,‘Seleziona una valutazione’,‘e’);return;}if(tx.length<20){alrt(‘rev-alert’,‘Scrivi almeno 20 caratteri’,‘e’);return;}var revs=gRv();revs.unshift({an:CU.name,ar:CU.profile||‘Studente’,cn:cn,stars:selSt,text:tx,dt:new Date().toLocaleDateString(‘it-IT’,{month:‘long’,year:‘numeric’})});sRv(revs);alrt(‘rev-alert’,‘Recensione pubblicata!’,‘s’);if(rc)rc.value=’’;if(rt)rt.value=’’;selSt=0;document.querySelectorAll(’#starPick .sp’).forEach(function(s){s.classList.remove(‘lit’);});var sl=document.getElementById(‘starLbl’);if(sl)sl.textContent=‘Clicca per valutare’;rdRevs();rdLandRevs();}
function rvCard(r){var stars=’’;for(var i=0;i<r.stars;i++)stars+=’⭐’;for(var i=r.stars;i<5;i++)stars+=’☆’;var av=(r.an||’??’).split(’ ‘).map(function(n){return n[0];}).join(’’).substring(0,2).toUpperCase();return’<div class="rev-card"><div class="rev-ctag">’+(r.cn||’’)+’</div><div class="rev-stars">’+stars+’</div><div class="rev-text">”’+r.text+’”</div><div class="rev-auth"><div class="rev-av">’+av+’</div><div><div class="rev-an">’+(r.an||’’)+’</div><div class="rev-ar">’+(r.ar||’’)+(r.dt?’ · ‘+r.dt:’’)+’</div></div></div></div>’;}
function allRvs(cb){var loc=gRv();if(PB&&PB.length>8){fetch(PB+’/api/collections/reviews/records?perPage=100&sort=-created’).then(function(r){return r.json();}).then(function(d){cb(d.items&&d.items.length?d.items.map(function(r){return{an:r.author_name,ar:r.author_role,cn:r.course_name,stars:r.stars,text:r.text,dt:r.created?new Date(r.created).toLocaleDateString(‘it-IT’,{month:‘long’,year:‘numeric’}):’’};}).concat(loc):DRV.concat(loc));}).catch(function(){cb(DRV.concat(loc));});}else{cb(loc.length?DRV.concat(loc):DRV);}}
function rdRevs(){var sel=document.getElementById(‘rv-course’);if(sel&&sel.options.length<=1){ldC(function(cs){cs.forEach(function(c){var o=document.createElement(‘option’);o.value=c.title;o.textContent=c.title;sel.appendChild(o);});});}allRvs(function(revs){var g=document.getElementById(‘appRevGrid’);if(!g)return;var h=’’;revs.forEach(function(r){h+=rvCard(r);});g.innerHTML=h||’<p style="color:var(--mu);padding:16px">Nessuna recensione.</p>’;});}
function rdLandRevs(){allRvs(function(revs){var g=document.getElementById(‘landRevGrid’);if(!g)return;var h=’’;revs.slice(0,6).forEach(function(r){h+=rvCard(r);});g.innerHTML=h;if(revs.length){var sum=0;revs.forEach(function(r){sum+=r.stars;});var avg=(sum/revs.length).toFixed(1);var an=document.getElementById(‘ratNum’);if(an)an.textContent=avg;var rc=document.getElementById(‘ratCnt’);if(rc)rc.textContent=‘Basato su ‘+revs.length+’ recension’+(revs.length===1?‘e’:‘i’);for(var s=1;s<=5;s++){var cnt=0;revs.forEach(function(r){if(r.stars===s)cnt++;});var pct=Math.round(cnt/revs.length*100);var bar=document.getElementById(‘rb’+s);if(bar)bar.style.width=pct+’%’;}}});}

// ── CONFIG ────────────────────────────────────────────────────
function showCfg(){var ex=document.getElementById(‘cfgM’);if(ex)ex.remove();var m=document.createElement(‘div’);m.id=‘cfgM’;m.style.cssText=‘position:fixed;inset:0;background:rgba(9,20,36,.75);backdrop-filter:blur(8px);z-index:10001;display:flex;align-items:center;justify-content:center;padding:16px’;var cu=localStorage.getItem(‘pva_pb’)||’’;m.innerHTML=’<div style="background:#fff;border-radius:18px;width:100%;max-width:460px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,.3)"><div style="background:linear-gradient(135deg,#091424,#162847);padding:24px 28px;position:relative"><div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#00c6ff,#0072ff)"></div><h2 style="font-size:19px;font-weight:900;color:#fff;margin-bottom:5px">⚙ Configura Backend</h2><p style="font-size:13px;color:rgba(255,255,255,.5)">URL del tuo servizio PocketBase su Render</p></div><div style="padding:24px 28px"><div style="background:#f0f6fc;border-radius:9px;padding:12px 15px;margin-bottom:15px;font-size:13px;color:#3a6a8a;line-height:1.6">Vai su <strong>render.com</strong>, apri il servizio e copia l URL</div><div class="fg"><label>URL Backend</label><input id="cfgU" type="url" class="fc" value="'+cu+'" placeholder="https://plc-verona-academy-backend.onrender.com"></div><div id="cfgR" style="margin-bottom:13px"></div><div style="display:flex;gap:10px"><button onclick="tCfg()" style="flex:1;padding:10px;background:#f0f6fc;border:2px solid #e2eaf4;border-radius:50px;font-size:13px;font-weight:600;cursor:pointer;color:var(--p)">🔍 Testa</button><button onclick="svCfg()" style="flex:1;padding:10px;background:linear-gradient(135deg,#0060cc,#0040aa);border:none;border-radius:50px;font-size:13px;font-weight:600;cursor:pointer;color:#fff">💾 Salva</button></div><button onclick="document.getElementById(\'cfgM\').remove()" style="width:100%;margin-top:9px;padding:8px;background:none;border:none;font-size:13px;color:#aaa;cursor:pointer">Annulla</button></div></div>’;document.body.appendChild(m);m.addEventListener(‘click’,function(e){if(e.target===m)m.remove();});}
function tCfg(){var u=document.getElementById(‘cfgU’),r=document.getElementById(‘cfgR’);if(!u)return;r.innerHTML=’<div style="font-size:13px;color:var(--mu)">Test in corso…</div>’;fetch(u.value+’/api/health’).then(function(res){if(res.ok){r.innerHTML=’<div style="color:var(--ok);font-size:13px;font-weight:600">✅ Backend online!</div>’;}else{r.innerHTML=’<div style="color:var(--er);font-size:13px">❌ Errore risposta</div>’;}}).catch(function(){r.innerHTML=’<div style="color:var(--er);font-size:13px">❌ Non raggiungibile</div>’;});}
function svCfg(){var u=document.getElementById(‘cfgU’);if(!u||!u.value.trim())return;PB=u.value.trim();localStorage.setItem(‘pva_pb’,PB);var m=document.getElementById(‘cfgM’);if(m)m.remove();toast(‘Backend configurato!’);CC=null;}

// ── MISC ──────────────────────────────────────────────────────
function toggleMob(){var m=document.getElementById(‘mobNav’);if(m)m.classList.toggle(‘open’);}
function toggleSb(){var s=document.getElementById(‘sb’);if(s)s.classList.toggle(‘open’);}
document.addEventListener(‘keydown’,function(e){
if(e.key===‘Escape’){closeModal();var cm=document.getElementById(‘cfgM’);if(cm)cm.remove();var sb=document.getElementById(‘sb’);if(sb)sb.classList.remove(‘open’);}
if((e.ctrlKey||e.metaKey)&&e.key===‘Enter’){var ci=document.getElementById(‘chatIn’);if(document.activeElement===ci)sendChat();}
});
window.addEventListener(‘scroll’,function(){var n=document.getElementById(‘mainNav’);if(n)n.classList.toggle(‘scrolled’,window.scrollY>20);});
var _am=document.getElementById(‘authModal’);if(_am)_am.addEventListener(‘click’,function(e){if(e.target===this)closeModal();});

rdLandRevs();

// ============================================================
// ADMIN / MASTER PANEL — FULL REBUILD
// ============================================================

// ── RENDER ADMIN ─────────────────────────────────────────────
function rdAdm(){
ldC(function(cs){
var tb=document.getElementById(‘admTB’);if(!tb)return;
var totalRev=0, totalStudents=0;
cs.forEach(function(c){
totalRev += (c.enrollments||0) * (parseFloat(c.price)||0);
totalStudents += (c.enrollments||0);
});
// Update stats
var se=document.getElementById(‘adm-stat-rev’);
var ss=document.getElementById(‘adm-stat-stu’);
var sc=document.getElementById(‘adm-stat-cor’);
if(se)se.textContent=‘€’+totalRev.toFixed(0);
if(ss)ss.textContent=totalStudents;
if(sc)sc.textContent=cs.length;

```
var h='';
cs.forEach(function(c){
  var lc={base:'bd-b',intermedio:'bd-y',avanzato:'bd-r'};
  var price = c.price&&parseFloat(c.price)>0 ? '€'+parseFloat(c.price).toFixed(2) : 'Gratuito';
  h+='<tr>';
  h+='<td><div style="display:flex;align-items:center;gap:10px"><span style="font-size:20px">'+c.icon+'</span><span style="font-weight:600">'+c.title+'</span></div></td>';
  h+='<td><span class="bd '+(lc[c.level]||'bd-b')+'">'+c.level+'</span></td>';
  h+='<td>'+(c.lessons?c.lessons.length:0)+'</td>';
  h+='<td><strong style="color:'+(c.price&&parseFloat(c.price)>0?'var(--ok)':'var(--mu)')+'">'+price+'</strong></td>';
  h+='<td>'+(c.enrollments||0)+'</td>';
  h+='<td><span class="bd '+(c.status==='disponibile'?'bd-g':'bd-y')+'">'+c.status+'</span></td>';
  h+='<td><div style="display:flex;gap:6px;flex-wrap:wrap">';
  h+='<button class="btn btn-p btn-sm" onclick="openLsnM(\''+c.id+'\')">&#128249; Lezioni</button>';
  h+='<button class="btn btn-o btn-sm" onclick="editC(\''+c.id+'\')">&#9998;</button>';
  h+='<button class="btn btn-d btn-sm" onclick="delC(\''+c.id+'\')">&#128465;</button>';
  h+='</div></td></tr>';
});
tb.innerHTML=h||'<tr><td colspan="7" style="text-align:center;padding:22px;color:var(--mu)">Nessun corso. Creane uno!</td></tr>';
```

});
}

function swAT(t,btn){
document.querySelectorAll(’#v-admin .tab’).forEach(function(el){el.classList.remove(‘active’);});
document.querySelectorAll(’#v-admin .tc’).forEach(function(el){el.classList.remove(‘active’);});
if(btn)btn.classList.add(‘active’);
var tc=document.getElementById(‘at-’+t);if(tc)tc.classList.add(‘active’);
}

function saveCourse(){
var at=document.getElementById(‘a-title’),ad=document.getElementById(‘a-desc’),ai=document.getElementById(‘a-icon’);
var al=document.getElementById(‘a-level’),as_=document.getElementById(‘a-stat’),ae=document.getElementById(‘a-eid’);
var apr=document.getElementById(‘a-price’),acu=document.getElementById(‘a-currency’),aft=document.getElementById(‘admFT’);
if(!at||!at.value.trim()){alrt(‘adm-alert’,‘Inserisci il titolo’,‘e’);return;}
var eid=ae?ae.value.trim():’’;
var cd={
id:eid||(‘c’+Date.now()),
title:at.value.trim(),
icon:ai?ai.value.trim():’⚙’,
level:al?al.value:‘base’,
desc:ad?ad.value.trim():’’,
status:as_?as_.value:‘disponibile’,
color:‘bl’,
price:apr?apr.value.trim():’’,
currency:acu?acu.value:‘EUR’,
lessons:[],materials:[],quiz:[],enrollments:0
};
var local=gC()||[];
if(eid){
for(var i=0;i<local.length;i++){
if(local[i].id===eid){
cd.lessons=local[i].lessons||[];
cd.materials=local[i].materials||[];
cd.quiz=local[i].quiz||[];
cd.enrollments=local[i].enrollments||0;
local[i]=cd;break;
}
}
}else{local.push(cd);}
sC(local);CC=null;
alrt(‘adm-alert’,‘Corso salvato!’,‘s’);
if(at)at.value=’’;if(ad)ad.value=’’;if(ae)ae.value=’’;if(aft)aft.textContent=‘Nuovo corso’;
if(apr)apr.value=’’;
setTimeout(function(){openLsnM(cd.id);},900);
if(PB&&PT){
var pl={title:cd.title,description:cd.desc,icon:cd.icon,level:cd.level,status:cd.status,color:‘bl’,
price:cd.price,currency:cd.currency,
lessons:JSON.stringify(cd.lessons),materials:JSON.stringify(cd.materials),quiz:JSON.stringify(cd.quiz)};
fetch(PB+’/api/collections/courses/records’+(eid?’/’+eid:’’),{
method:eid?‘PATCH’:‘POST’,
headers:{‘Content-Type’:‘application/json’,‘Authorization’:PT},
body:JSON.stringify(pl)
}).catch(function(){});
}
}

function editC(id){
swAT(‘add’,document.querySelectorAll(’#v-admin .tab’)[1]);
var local=gC()||[];var c=null;
for(var i=0;i<local.length;i++){if(local[i].id===id){c=local[i];break;}}
if(!c)return;
var at=document.getElementById(‘a-title’),ad=document.getElementById(‘a-desc’),ai=document.getElementById(‘a-icon’);
var al=document.getElementById(‘a-level’),as_=document.getElementById(‘a-stat’),ae=document.getElementById(‘a-eid’);
var apr=document.getElementById(‘a-price’),acu=document.getElementById(‘a-currency’),aft=document.getElementById(‘admFT’);
if(at)at.value=c.title;if(ad)ad.value=c.desc||’’;if(ai)ai.value=c.icon;
if(al)al.value=c.level;if(as_)as_.value=c.status;if(ae)ae.value=id;
if(apr)apr.value=c.price||’’;if(acu)acu.value=c.currency||‘EUR’;
if(aft)aft.textContent=‘Modifica corso’;
}

function delC(id){
if(!confirm(‘Eliminare questo corso e tutte le sue lezioni?’))return;
var local=(gC()||[]).filter(function(c){return c.id!==id;});
sC(local);CC=null;rdAdm();toast(‘Corso eliminato’,‘w’);
if(PB&&PT)fetch(PB+’/api/collections/courses/records/’+id,{method:‘DELETE’,headers:{Authorization:PT}}).catch(function(){});
}

// ── LESSON MANAGER ────────────────────────────────────────────
function gbId(id){var local=gC()||[];for(var i=0;i<local.length;i++){if(local[i].id===id)return local[i];}return null;}

function openLsnM(id){
CLCA=id;var c=gbId(id);if(!c)return;
var tl=document.getElementById(‘tab-lsns’);if(tl)tl.classList.remove(‘hidden’);
swAT(‘lsns’,tl);
var li=document.getElementById(‘lmIco’),lt=document.getElementById(‘lmTit’),lc=document.getElementById(‘lmCnt’);
if(li)li.innerHTML=c.icon;if(lt)lt.textContent=c.title;
if(lc)lc.textContent=(c.lessons?c.lessons.length:0)+’ lezioni’;
rdLsnList(c);
}

function rdLsnList(c){
var cont=document.getElementById(‘lsnListAdm’);if(!cont)return;
var ls=c.lessons||[];
if(!ls.length){
cont.innerHTML=’<div style="text-align:center;padding:32px;color:var(--mu);background:#fff;border-radius:12px;box-shadow:var(--sh)"><div style="font-size:44px;margin-bottom:10px">📋</div><div style="font-weight:600;margin-bottom:5px">Nessuna lezione</div><div style="font-size:13px">Aggiungi la prima lezione</div></div>’;
return;
}
var h=’’;
ls.forEach(function(l,i){
var hV=l.vt&&l.vurl;
var vtag=l.vt===‘gdrive’?‘Drive’:l.vt===‘vimeo’?‘Vimeo’:l.vt===‘upload’?‘MP4’:’’;
h+=’<div class="lm-row">’;
h+=’<div class="lm-num">’+(i+1)+’</div>’;
h+=’<div style="flex:1"><div style="font-weight:700;font-size:14px;margin-bottom:6px">’+esc(l.title)+’</div>’;
h+=’<div style="display:flex;gap:7px;flex-wrap:wrap">’;
if(l.dur)h+=’<span class="bd bd-b">⏰ ‘+esc(l.dur)+’</span>’;
h+=’<span class="bd '+(hV?'bd-g':'bd-y')+'">📹 ‘+(hV?vtag+’ ✓’:‘nessun video’)+’</span>’;
if(l.pdfs&&l.pdfs.length)h+=’<span class="bd bd-c">📄 ‘+l.pdfs.length+’ PDF</span>’;
if(l.lq&&l.lq.length)h+=’<span class="bd bd-g">✅ ‘+l.lq.length+’ quiz</span>’;
if(l.notes)h+=’<span class="bd bd-b">📝 Note</span>’;
h+=’</div></div>’;
h+=’<div style="display:flex;gap:7px;flex-wrap:wrap">’;
h+=’<button class="btn btn-o btn-sm" onclick="openLsnF('+i+')">✎ Modifica</button>’;
h+=’<button class="btn btn-d btn-sm" onclick="delLsn('+i+')">🗑</button>’;
if(i>0)h+=’<button class="btn btn-o btn-sm" onclick="movLsn('+i+',-1)">↑</button>’;
if(i<ls.length-1)h+=’<button class="btn btn-o btn-sm" onclick="movLsn('+i+',1)">↓</button>’;
h+=’</div></div>’;
});
cont.innerHTML=h;
var lc=document.getElementById(‘lmCnt’);
if(lc)lc.textContent=ls.length+’ lezioni’;
}

function pdfRH(){return ‘<div class="pdf-row"><input type="text" class="fc" placeholder="Nome PDF" style="margin:0"><input type="text" class="fc" placeholder="URL / link Drive" style="margin:0"><button class="btn btn-d btn-sm" onclick="this.closest(\'.pdf-row\').remove()">✕</button></div>’;}
function addPR(){var p=document.getElementById(‘l-pdfs’);if(p)p.insertAdjacentHTML(‘beforeend’,pdfRH());}

function qzRH(q){
var opts=q?q.opts||[]:[];
var h=’<div class="lq-item"><div class="fg" style="margin-bottom:8px"><label>Domanda</label>’;
h+=’<input type="text" class="fc lq-q" placeholder="es. Cos e un OB in TIA Portal?" value="'+(q?esc(q.q):'')+'" style="margin:0"></div>’;
h+=’<div class="lq-opts">’;
var phs=[‘Risposta A (corretta)’,‘Risposta B’,‘Risposta C’,‘Risposta D’];
for(var k=0;k<4;k++){
h+=’<input type="text" class="fc lq-o" placeholder="'+phs[k]+'" style="margin:0'+(k===0?';border-color:var(--ok)':'')+'" value="'+(opts[k]?esc(opts[k]):'')+'">’;
}
h+=’</div><button class="btn btn-d btn-sm" style="margin-top:8px;font-size:12px" onclick="this.closest(\'.lq-item\').remove()">✕ Rimuovi</button></div>’;
return h;
}
function addLQ(){var q=document.getElementById(‘l-quiz’);if(q)q.insertAdjacentHTML(‘beforeend’,qzRH(null));}

function updVF(){
var vt=document.getElementById(‘l-vt’);if(!vt)return;var v=vt.value;
var fu=document.getElementById(‘f-upload’),fg=document.getElementById(‘f-gdrive’),fv=document.getElementById(‘f-vimeo’);
if(fu)fu.style.display=v===‘upload’?’’:‘none’;
if(fg)fg.style.display=v===‘gdrive’?’’:‘none’;
if(fv)fv.style.display=v===‘vimeo’?’’:‘none’;
}

function openLsnF(idx){
var fw=document.getElementById(‘lsnFWrap’);if(!fw)return;
fw.style.display=‘block’;
setTimeout(function(){fw.scrollIntoView({behavior:‘smooth’,block:‘start’});},100);
var ft=document.getElementById(‘lsnFT’),ei=document.getElementById(‘l-idx’);
var lt=document.getElementById(‘l-title’),ld=document.getElementById(‘l-dur’),ln=document.getElementById(‘l-notes’);
var lvt=document.getElementById(‘l-vt’),lvu=document.getElementById(‘l-vurl’);
var lgd=document.getElementById(‘l-gdrive’),lvm=document.getElementById(‘l-vimeo’);
var upfn=document.getElementById(‘upFN’),plist=document.getElementById(‘l-pdfs’),qlist=document.getElementById(‘l-quiz’);
alrt(‘lsn-alert’,’’,’’);
if(idx===-1){
if(ft)ft.textContent=‘Nuova lezione’;if(ei)ei.value=’’;
if(lt)lt.value=’’;if(ld)ld.value=’’;if(ln)ln.value=’’;
if(lvt)lvt.value=‘upload’;if(lvu)lvu.value=’’;
if(lgd)lgd.value=’’;if(lvm)lvm.value=’’;
if(upfn)upfn.textContent=’’;
if(plist)plist.innerHTML=pdfRH();
if(qlist)qlist.innerHTML=’’;
updVF();
}else{
var c=gbId(CLCA);if(!c||!c.lessons[idx])return;
var l=c.lessons[idx];
if(ft)ft.textContent=‘Modifica lezione ‘+(idx+1);if(ei)ei.value=idx;
if(lt)lt.value=l.title||’’;if(ld)ld.value=l.dur||’’;if(ln)ln.value=l.notes||’’;
var vt=l.vt||‘upload’;if(lvt)lvt.value=vt;
if(vt===‘gdrive’){if(lgd)lgd.value=l.vurl||’’;}
else if(vt===‘vimeo’){if(lvm)lvm.value=l.vurl||’’;}
else{if(lvu)lvu.value=l.vurl||’’;if(upfn&&l.vurl)upfn.textContent=’📹 Video caricato’;}
updVF();
var pdfs=l.pdfs||[];
if(plist){
if(!pdfs.length){plist.innerHTML=pdfRH();}
else{
var ph=’’;
pdfs.forEach(function(p){
ph+=’<div class="pdf-row">’;
ph+=’<input type="text" class="fc" placeholder="Nome PDF" style="margin:0" value="'+esc(p.name)+'">’;
ph+=’<input type="text" class="fc" placeholder="URL" style="margin:0" value="'+esc(p.url)+'">’;
ph+=’<button class="btn btn-d btn-sm" onclick="this.closest(\'.pdf-row\').remove()">✕</button></div>’;
});
plist.innerHTML=ph;
}
}
var lq=l.lq||[];
if(qlist){
if(!lq.length){qlist.innerHTML=’’;}
else{var qh=’’;lq.forEach(function(q){qh+=qzRH(q);});qlist.innerHTML=qh;}
}
}
}

function dropV(e){e.preventDefault();var f=e.dataTransfer?e.dataTransfer.files[0]:null;if(f)hVFile(f);}
function pickV(inp){if(inp.files&&inp.files[0])hVFile(inp.files[0]);}

function hVFile(file){
var fn=document.getElementById(‘upFN’),lvu=document.getElementById(‘l-vurl’);
var pp=document.getElementById(‘upPr’),bar=document.getElementById(‘upBr’);
var pc=document.getElementById(‘upPc’),st=document.getElementById(‘upSt’);
if(fn)fn.textContent=’📹 ‘+file.name+’ (’+(file.size/1024/1024).toFixed(1)+’ MB)’;
if(PB&&PT){
if(pp)pp.style.display=‘block’;
var fd=new FormData();fd.append(‘file’,file);
var xhr=new XMLHttpRequest();
xhr.upload.onprogress=function(e){
if(e.lengthComputable){
var p=Math.round(e.loaded/e.total*100);
if(bar)bar.style.width=p+’%’;
if(pc)pc.textContent=p+’%’;
if(st)st.textContent=p<100?‘Caricamento…’:‘Elaborazione…’;
}
};
xhr.onload=function(){
if(xhr.status===200){
try{
var r=JSON.parse(xhr.responseText);
var url=PB+’/api/files/’+r.collectionName+’/’+r.id+’/’+r.file;
if(lvu)lvu.value=url;
if(st)st.textContent=‘Caricato!’;
if(pc)pc.textContent=‘100%’;
toast(‘Video caricato!’);
}catch(e){useOV(file,lvu,fn);}
}else{useOV(file,lvu,fn);}
};
xhr.onerror=function(){useOV(file,lvu,fn);if(pp)pp.style.display=‘none’;};
xhr.open(‘POST’,PB+’/api/collections/lesson_videos/records’);
xhr.setRequestHeader(‘Authorization’,PT);
xhr.send(fd);
}else{
useOV(file,lvu,fn);
toast(‘Configura il backend per salvare i video permanentemente’,‘w’);
}
}
function useOV(file,lvu,fn){
var url=URL.createObjectURL(file);
if(lvu)lvu.value=url;
if(fn)fn.textContent=’📹 ‘+file.name+’ (locale - non persistente)’;
}

function saveLsn(){
var lt=document.getElementById(‘l-title’),ld=document.getElementById(‘l-dur’),ln=document.getElementById(‘l-notes’);
var lvt=document.getElementById(‘l-vt’),lvu=document.getElementById(‘l-vurl’);
var lgd=document.getElementById(‘l-gdrive’),lvm=document.getElementById(‘l-vimeo’);
var ei=document.getElementById(‘l-idx’);
if(!lt||!lt.value.trim()){alrt(‘lsn-alert’,‘Inserisci il titolo della lezione’,‘e’);return;}
var vt=lvt?lvt.value:‘upload’,vurl=’’;
if(vt===‘upload’){vurl=lvu?lvu.value:’’;}
else if(vt===‘gdrive’){
var gu=lgd?lgd.value.trim():’’;
var gm=gu.match(//file/d/([^/]+)/);
vurl=gm?‘https://drive.google.com/file/d/’+gm[1]+’/preview’:gu;
}else if(vt===‘vimeo’){
var vu=lvm?lvm.value.trim():’’;
var vm=vu.match(/vimeo.com/(\d+)/);
vurl=vm?‘https://player.vimeo.com/video/’+vm[1]:vu;
}
var pdfs=[];
document.querySelectorAll(’#l-pdfs .pdf-row’).forEach(function(r){
var ins=r.querySelectorAll(‘input’);
if(ins[0]&&ins[0].value.trim())pdfs.push({name:ins[0].value.trim(),url:ins[1]?ins[1].value.trim():’#’});
});
var lq=[];
document.querySelectorAll(’#l-quiz .lq-item’).forEach(function(r){
var qt=r.querySelector(’.lq-q’);var qo=r.querySelectorAll(’.lq-o’);
if(qt&&qt.value.trim()){
var opts=[];
qo.forEach(function(o){if(o.value.trim())opts.push(o.value.trim());});
if(opts.length>=2)lq.push({q:qt.value.trim(),opts:opts,correct:0});
}
});
var ld_={title:lt.value.trim(),dur:ld?ld.value.trim():’-’,notes:ln?ln.value.trim():’’,vt:vt,vurl:vurl,pdfs:pdfs,lq:lq};
var c=gbId(CLCA);if(!c){toast(‘Corso non trovato’,‘e’);return;}
if(!c.lessons)c.lessons=[];
var idx=ei?parseInt(ei.value):-1;
if(!isNaN(idx)&&idx>=0&&idx<c.lessons.length){c.lessons[idx]=ld_;toast(‘Lezione aggiornata!’);}
else{c.lessons.push(ld_);toast(‘Lezione aggiunta!’);}
var allQ=[];c.lessons.forEach(function(l){(l.lq||[]).forEach(function(q){allQ.push(q);});});c.quiz=allQ;
var allM=[];c.lessons.forEach(function(l){(l.pdfs||[]).forEach(function(p){allM.push(p);});});c.materials=allM;
var local=gC()||[];
for(var i=0;i<local.length;i++){if(local[i].id===CLCA){local[i]=c;break;}}
sC(local);CC=null;
var fw=document.getElementById(‘lsnFWrap’);if(fw)fw.style.display=‘none’;
rdLsnList(c);
if(PB&&PT){
fetch(PB+’/api/collections/courses/records/’+CLCA,{
method:‘PATCH’,headers:{‘Content-Type’:‘application/json’,‘Authorization’:PT},
body:JSON.stringify({lessons:JSON.stringify(c.lessons),materials:JSON.stringify(c.materials),quiz:JSON.stringify(c.quiz)})
}).catch(function(){});
}
}

function delLsn(idx){
if(!confirm(‘Eliminare questa lezione?’))return;
var c=gbId(CLCA);if(!c)return;
c.lessons.splice(idx,1);
var local=gC()||[];
for(var i=0;i<local.length;i++){if(local[i].id===CLCA){local[i]=c;break;}}
sC(local);CC=null;rdLsnList(c);toast(‘Lezione eliminata’,‘w’);
}
function movLsn(idx,dir){
var c=gbId(CLCA);if(!c)return;
var ni=idx+dir;if(ni<0||ni>=c.lessons.length)return;
var t=c.lessons[idx];c.lessons[idx]=c.lessons[ni];c.lessons[ni]=t;
var local=gC()||[];
for(var i=0;i<local.length;i++){if(local[i].id===CLCA){local[i]=c;break;}}
sC(local);CC=null;rdLsnList(c);
}

// ── PAYMENTS / STRIPE ────────────────────────────────────────
function rdPayments(){
var cont=document.getElementById(‘pay-cont’);if(!cont)return;
var stripeKey=localStorage.getItem(‘pva_stripe_pk’)||’’;
var local=gC()||[];
var paidCourses=local.filter(function(c){return c.price&&parseFloat(c.price)>0;});
var h=’’;

// Stripe config banner
if(!stripeKey){
h+=’<div style="background:#fffbeb;border:1px solid #f59e0b;border-radius:12px;padding:18px 22px;margin-bottom:22px;display:flex;align-items:center;gap:16px">’;
h+=’<div style="font-size:32px">🔐</div>’;
h+=’<div style="flex:1"><div style="font-weight:700;margin-bottom:4px">Stripe non configurato</div>’;
h+=’<div style="font-size:13px;color:var(--mu)">Aggiungi la tua chiave pubblica Stripe per abilitare Apple Pay, Google Pay e carte di credito</div></div>’;
h+=’<button class="btn btn-p btn-sm" onclick="showStripeSetup()">⚙ Configura</button></div>’;
}else{
h+=’<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:14px 18px;margin-bottom:22px;display:flex;align-items:center;gap:12px">’;
h+=’<div style="font-size:22px">✅</div>’;
h+=’<div style="flex:1;font-size:14px;font-weight:600;color:var(--ok)">Stripe attivo</div>’;
h+=’<button class="btn btn-o btn-sm" onclick="showStripeSetup()">Modifica</button></div>’;
}

// Payment methods info
h+=’<div style="background:#fff;border-radius:14px;padding:22px;box-shadow:var(--sh);margin-bottom:22px">’;
h+=’<div style="font-size:16px;font-weight:700;margin-bottom:16px">💳 Metodi di pagamento accettati</div>’;
h+=’<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px">’;
var methods=[
{ico:’🏳’,name:‘Carta di credito’,desc:‘Visa, Mastercard, Amex’},
{ico:’’,name:‘Apple Pay’,desc:‘Safari su iPhone/Mac’},
{ico:’🐱’,name:‘Google Pay’,desc:‘Chrome su Android’},
{ico:’📄’,name:‘SEPA Bonifico’,desc:‘Clienti europei’}
];
methods.forEach(function(m){
h+=’<div style="background:var(--ltr);border-radius:10px;padding:16px;text-align:center;border:1px solid rgba(0,96,204,.08)">’;
h+=’<div style="font-size:28px;margin-bottom:8px">’+m.ico+’</div>’;
h+=’<div style="font-size:13px;font-weight:700;margin-bottom:3px">’+m.name+’</div>’;
h+=’<div style="font-size:11px;color:var(--mu)">’+m.desc+’</div></div>’;
});
h+=’</div></div>’;

// Corsi a pagamento
h+=’<div style="background:#fff;border-radius:14px;padding:22px;box-shadow:var(--sh);margin-bottom:22px">’;
h+=’<div style="font-size:16px;font-weight:700;margin-bottom:16px">💵 Corsi a pagamento (’+paidCourses.length+’)</div>’;
if(!paidCourses.length){
h+=’<p style="color:var(--mu);font-size:14px">Nessun corso a pagamento. Crea un corso con prezzo > 0.</p>’;
}else{
paidCourses.forEach(function(c){
h+=’<div style="display:flex;align-items:center;gap:14px;padding:14px;background:var(--ltr);border-radius:10px;margin-bottom:10px">’;
h+=’<div style="font-size:28px">’+c.icon+’</div>’;
h+=’<div style="flex:1"><div style="font-weight:600">’+c.title+’</div>’;
h+=’<div style="font-size:12px;color:var(--mu);margin-top:2px">’+(c.enrollments||0)+’ iscritti</div></div>’;
h+=’<div style="font-family:Playfair Display,serif;font-size:22px;font-weight:900;color:var(--ok)">’+c.currency+’ ‘+parseFloat(c.price).toFixed(2)+’</div>’;
h+=’<div style="font-family:Playfair Display,serif;font-size:18px;font-weight:700;color:var(--p)">Incasso: ‘+c.currency+’ ‘+((c.enrollments||0)*parseFloat(c.price)).toFixed(2)+’</div>’;
h+=’</div>’;
});
}
h+=’</div>’;

// Transazioni recenti
h+=’<div style="background:#fff;border-radius:14px;padding:22px;box-shadow:var(--sh)">’;
h+=’<div style="font-size:16px;font-weight:700;margin-bottom:16px">📋 Transazioni recenti</div>’;
var txs=JSON.parse(localStorage.getItem(‘pva_transactions’)||’[]’);
if(!txs.length){
h+=’<p style="color:var(--mu);font-size:14px">Nessuna transazione ancora.</p>’;
}else{
h+=’<div class="a-table"><table><thead><tr><th>Data</th><th>Studente</th><th>Corso</th><th>Importo</th><th>Metodo</th><th>Stato</th></tr></thead><tbody>’;
txs.slice().reverse().forEach(function(tx){
h+=’<tr><td>’+tx.date+’</td><td>’+tx.student+’</td><td>’+tx.course+’</td>’;
h+=’<td><strong>’+tx.currency+’ ‘+tx.amount+’</strong></td><td>’+tx.method+’</td>’;
h+=’<td><span class="bd bd-g">Completato</span></td></tr>’;
});
h+=’</tbody></table></div>’;
}
h+=’</div>’;

cont.innerHTML=h;
}

function showStripeSetup(){
var ex=document.getElementById(‘stripeModal’);if(ex)ex.remove();
var m=document.createElement(‘div’);m.id=‘stripeModal’;
m.style.cssText=‘position:fixed;inset:0;background:rgba(9,20,36,.8);backdrop-filter:blur(8px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px’;
var cur=localStorage.getItem(‘pva_stripe_pk’)||’’;
m.innerHTML=’<div style="background:#fff;border-radius:18px;width:100%;max-width:500px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,.3)">’
+’<div style="background:linear-gradient(135deg,#635bff,#4b44cc);padding:26px 30px">’
+’<div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#00d4ff,#635bff)"></div>’
+’<h2 style="font-size:20px;font-weight:900;color:#fff;margin-bottom:5px">⚡ Configura Stripe</h2>’
+’<p style="font-size:13px;color:rgba(255,255,255,.6)">Abilita Apple Pay, Google Pay e carte di credito</p></div>’
+’<div style="padding:26px 30px">’
+’<div style="background:#f8f6ff;border-radius:9px;padding:13px 16px;margin-bottom:18px;font-size:13px;color:#635bff;line-height:1.6">’
+‘1. Vai su <strong>stripe.com</strong> e crea un account<br>’
+‘2. Dashboard Stripe → Sviluppatori → Chiavi API<br>’
+‘3. Copia la <strong>Chiave pubblicabile</strong> (inizia con pk_)</div>’
+’<div class="fg"><label>Chiave pubblica Stripe (pk_live_ o pk_test_)</label>’
+’<input id="sk-input" type="text" class="fc" value="'+cur+'" placeholder="pk_live_xxxxxxxxxxxxxxxx"></div>’
+’<div id="sk-res" style="margin-bottom:14px"></div>’
+’<div style="display:flex;gap:10px">’
+’<button onclick="saveStripe()" style="flex:1;padding:11px;background:linear-gradient(135deg,#635bff,#4b44cc);border:none;border-radius:50px;font-size:13px;font-weight:600;cursor:pointer;color:#fff">💾 Salva</button>’
+’<button onclick="document.getElementById(\'stripeModal\').remove()" style="flex:1;padding:11px;background:#f4f8fd;border:2px solid #e2eaf4;border-radius:50px;font-size:13px;font-weight:600;cursor:pointer;color:var(--mu)">Annulla</button>’
+’</div></div></div>’;
document.body.appendChild(m);
m.addEventListener(‘click’,function(e){if(e.target===m)m.remove();});
}

function saveStripe(){
var inp=document.getElementById(‘sk-input’);if(!inp)return;
var key=inp.value.trim();
if(!key.startsWith(‘pk_’)){
var r=document.getElementById(‘sk-res’);
if(r)r.innerHTML=’<div style="color:var(--er);font-size:13px">La chiave deve iniziare con pk_live_ o pk_test_</div>’;
return;
}
localStorage.setItem(‘pva_stripe_pk’,key);
var m=document.getElementById(‘stripeModal’);if(m)m.remove();
toast(‘Stripe configurato!’);
rdPayments();
}

// Checkout Stripe per studente
function startCheckout(courseId){
var stripeKey=localStorage.getItem(‘pva_stripe_pk’);
if(!stripeKey){toast(‘Il master deve configurare Stripe’,‘w’);return;}
var c=null;var local=gC()||[];
for(var i=0;i<local.length;i++){if(local[i].id===courseId){c=local[i];break;}}
if(!c)return;
var price=parseFloat(c.price||0);
if(!price||price<=0){openC(courseId);return;}

// Load Stripe.js dynamically
if(typeof Stripe===‘undefined’){
var script=document.createElement(‘script’);
script.src=‘https://js.stripe.com/v3/’;
script.onload=function(){openStripeCheckout(c,stripeKey);};
document.head.appendChild(script);
}else{openStripeCheckout(c,stripeKey);}
}

function openStripeCheckout(c,stripeKey){
var ex=document.getElementById(‘checkoutModal’);if(ex)ex.remove();
var m=document.createElement(‘div’);m.id=‘checkoutModal’;
m.style.cssText=‘position:fixed;inset:0;background:rgba(9,20,36,.9);backdrop-filter:blur(8px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto’;
var price=parseFloat(c.price||0).toFixed(2);
var currency=(c.currency||‘EUR’).toUpperCase();
m.innerHTML=’<div style="background:#fff;border-radius:18px;width:100%;max-width:460px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,.3)">’
+’<div style="background:linear-gradient(135deg,#0a1628,#162847);padding:24px 28px;display:flex;align-items:center;gap:16px">’
+’<div style="font-size:40px">’+c.icon+’</div>’
+’<div><div style="font-family:Playfair Display,serif;font-size:18px;font-weight:900;color:#fff">’+c.title+’</div>’
+’<div style="font-family:Playfair Display,serif;font-size:26px;font-weight:900;color:#00c6ff;margin-top:4px">’+currency+’ ‘+price+’</div></div></div>’
+’<div style="padding:24px 28px">’
+’<div id="payment-request-btn" style="margin-bottom:16px"></div>’
+’<div id="pay-divider" style="display:flex;align-items:center;gap:12px;margin-bottom:16px;display:none">’
+’<div style="flex:1;height:1px;background:#e2eaf4"></div><span style="font-size:12px;color:var(--mu)">oppure paga con carta</span><div style="flex:1;height:1px;background:#e2eaf4"></div></div>’
+’<div class="fg"><label>Numero carta</label><div id="card-number" style="padding:13px 16px;border:2px solid #e2eaf4;border-radius:12px;background:#fff"></div></div>’
+’<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">’
+’<div class="fg"><label>Scadenza</label><div id="card-expiry" style="padding:13px 16px;border:2px solid #e2eaf4;border-radius:12px;background:#fff"></div></div>’
+’<div class="fg"><label>CVC</label><div id="card-cvc" style="padding:13px 16px;border:2px solid #e2eaf4;border-radius:12px;background:#fff"></div></div></div>’
+’<div id="pay-error" style="margin-bottom:12px"></div>’
+’<button id="pay-btn" onclick="submitPayment(\''+c.id+'\',\''+price+'\',\''+currency+'\')" style="width:100%;padding:15px;background:linear-gradient(135deg,#0060cc,#0040aa);border:none;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;color:#fff;margin-bottom:10px">🔒 Paga ‘+currency+’ ‘+price+’</button>’
+’<button onclick="document.getElementById(\'checkoutModal\').remove()" style="width:100%;padding:10px;background:none;border:none;font-size:13px;color:var(--mu);cursor:pointer">Annulla</button>’
+’<div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:14px;font-size:11px;color:var(--mu)">’
+’<span>🔒</span> Pagamento sicuro con Stripe</div></div></div>’;
document.body.appendChild(m);
m.addEventListener(‘click’,function(e){if(e.target===m)m.remove();});

// Initialize Stripe Elements
try{
var stripe=Stripe(stripeKey);
var elements=stripe.elements();
window._stripeInst=stripe;
window._stripeElements=elements;

```
var style={base:{fontSize:'15px',color:'#0a1628',fontFamily:'Inter,sans-serif','::placeholder':{color:'#b0c4d8'}}};
var cardNumber=elements.create('cardNumber',{style:style});
var cardExpiry=elements.create('cardExpiry',{style:style});
var cardCvc=elements.create('cardCvc',{style:style});

setTimeout(function(){
  var n=document.getElementById('card-number');
  var ex=document.getElementById('card-expiry');
  var cv=document.getElementById('card-cvc');
  if(n)cardNumber.mount('#card-number');
  if(ex)cardExpiry.mount('#card-expiry');
  if(cv)cardCvc.mount('#card-cvc');
  window._stripeCard=cardNumber;

  // Payment Request (Apple Pay / Google Pay)
  var paymentRequest=stripe.paymentRequest({
    country:'IT',currency:currency.toLowerCase(),
    total:{label:c.title,amount:Math.round(parseFloat(price)*100)},
    requestPayerName:true,requestPayerEmail:true
  });
  paymentRequest.canMakePayment().then(function(result){
    if(result){
      var prButton=elements.create('paymentRequestButton',{paymentRequest:paymentRequest,style:{paymentRequestButton:{height:'48px',borderRadius:'12px'}}});
      var prDiv=document.getElementById('payment-request-btn');
      var divider=document.getElementById('pay-divider');
      if(prDiv){prButton.mount('#payment-request-btn');if(divider)divider.style.display='flex';}
      paymentRequest.on('paymentmethod',function(ev){
        window._stripePayEv=ev;
        ev.complete('success');
        completeEnrollment(c.id,price,currency,ev.paymentMethod.card?'Apple/Google Pay':'Wallet');
      });
    }
  });
},300);
```

}catch(e){console.log(‘Stripe init error:’,e);}
}

function submitPayment(courseId,price,currency){
var btn=document.getElementById(‘pay-btn’);
var errDiv=document.getElementById(‘pay-error’);
if(btn){btn.textContent=‘Elaborazione…’;btn.disabled=true;}

if(!window._stripeInst||!window._stripeCard){
if(btn){btn.textContent=’Paga ‘+currency+’ ’+price;btn.disabled=false;}
return;
}

window._stripeInst.createPaymentMethod({
type:‘card’,card:window._stripeCard,
billing_details:{name:CU.name,email:CU.email}
}).then(function(result){
if(result.error){
if(errDiv)errDiv.innerHTML=’<div style="color:var(--er);font-size:13px;padding:10px;background:#fef2f2;border-radius:8px">’+result.error.message+’</div>’;
if(btn){btn.textContent=’Paga ‘+currency+’ ’+price;btn.disabled=false;}
}else{
// In production: send result.paymentMethod.id to your backend for server-side charge
// For demo: simulate success
completeEnrollment(courseId,price,currency,‘Carta di credito’);
}
});
}

function completeEnrollment(courseId,price,currency,method){
// Save transaction
var txs=JSON.parse(localStorage.getItem(‘pva_transactions’)||’[]’);
var c=gbId(courseId)||{title:‘Corso’};
txs.push({
id:‘tx_’+Date.now(),date:new Date().toLocaleDateString(‘it-IT’),
student:CU.name,course:c.title,amount:price,currency:currency,method:method
});
localStorage.setItem(‘pva_transactions’,JSON.stringify(txs));

// Update enrollments
var local=gC()||[];
for(var i=0;i<local.length;i++){
if(local[i].id===courseId){local[i].enrollments=(local[i].enrollments||0)+1;break;}
}
sC(local);CC=null;

// Mark as enrolled
var enrolled=JSON.parse(localStorage.getItem(‘pva_enrolled_’+(CU?CU.id:’’))||’[]’);
if(enrolled.indexOf(courseId)<0)enrolled.push(courseId);
localStorage.setItem(‘pva_enrolled_’+(CU?CU.id:’’),JSON.stringify(enrolled));

var m=document.getElementById(‘checkoutModal’);if(m)m.remove();
toast(‘Pagamento completato! Benvenuto nel corso!’);
openC(courseId);
}

function isEnrolled(courseId){
if(!CU)return false;
var c=gbId(courseId);
if(!c||!c.price||parseFloat(c.price)<=0)return true; // free
var enrolled=JSON.parse(localStorage.getItem(‘pva_enrolled_’+(CU?CU.id:’’))||’[]’);
return enrolled.indexOf(courseId)>=0;
}

// ── LIVE PANEL ────────────────────────────────────────────────
function rdLive(){
var cont=document.getElementById(‘live-admin-cont’);if(!cont)return;
var h=’<div style="background:#fff;border-radius:14px;padding:24px;box-shadow:var(--sh);margin-bottom:20px">’;
h+=’<div style="font-size:16px;font-weight:700;margin-bottom:8px">🔴 Avvia diretta live</div>’;
h+=’<div style="font-size:14px;color:var(--mu);margin-bottom:18px;line-height:1.6">La funzione diretta live con webcam e microfono sara disponibile nella prossima versione. Per ora puoi condividere un link YouTube Live o Zoom con gli studenti.</div>’;
h+=’<div class="fg"><label>Titolo sessione</label><input type="text" class="fc" id="live-title" placeholder="es. PLC Base - Lezione pratica S7-1200"></div>’;
h+=’<div class="fg"><label>Data e ora</label><input type="datetime-local" class="fc" id="live-dt"></div>’;
h+=’<div class="fg"><label>Link stream (YouTube Live, Zoom, Meet…)</label><input type="url" class="fc" id="live-url" placeholder="https://youtube.com/live/xxxxx"></div>’;
h+=’<div class="fg"><label>Descrizione</label><textarea class="fc" id="live-desc" rows="3" placeholder="Di cosa parleremo..."></textarea></div>’;
h+=’<button class="btn btn-p" onclick="saveLiveSess()">💾 Programma diretta</button></div>’;

// Sessioni programmate
var sessions=JSON.parse(localStorage.getItem(‘pva_live_sessions’)||’[]’);
h+=’<div style="background:#fff;border-radius:14px;padding:24px;box-shadow:var(--sh)">’;
h+=’<div style="font-size:16px;font-weight:700;margin-bottom:16px">📅 Sessioni programmate (’+sessions.length+’)</div>’;
if(!sessions.length){
h+=’<p style="color:var(--mu);font-size:14px">Nessuna sessione ancora. Creane una sopra.</p>’;
}else{
sessions.slice().reverse().forEach(function(s,i){
var idx=sessions.length-1-i;
h+=’<div style="display:flex;align-items:center;gap:14px;padding:16px;background:var(--ltr);border-radius:10px;margin-bottom:10px">’;
h+=’<div style="flex:1"><div style="font-weight:700;font-size:14px">’+esc(s.title)+’</div>’;
h+=’<div style="font-size:12px;color:var(--mu);margin-top:3px">📅 ‘+s.dt+’</div>’;
if(s.url)h+=’<div style="font-size:12px;color:var(--p);margin-top:2px">🔗 ‘+s.url.substring(0,50)+’…</div>’;
h+=’</div>’;
h+=’<button class="btn btn-d btn-sm" onclick="delLiveSess('+idx+')">🗑</button>’;
h+=’</div>’;
});
}
h+=’</div>’;
cont.innerHTML=h;
}

function saveLiveSess(){
var title=document.getElementById(‘live-title’);
var dt=document.getElementById(‘live-dt’);
var url=document.getElementById(‘live-url’);
var desc=document.getElementById(‘live-desc’);
if(!title||!title.value.trim()){toast(‘Inserisci il titolo’,‘w’);return;}
var sessions=JSON.parse(localStorage.getItem(‘pva_live_sessions’)||’[]’);
sessions.push({
id:‘ls_’+Date.now(),
title:title.value.trim(),
dt:dt?dt.value:’’,
url:url?url.value.trim():’’,
desc:desc?desc.value.trim():’’
});
localStorage.setItem(‘pva_live_sessions’,JSON.stringify(sessions));
title.value=’’;if(dt)dt.value=’’;if(url)url.value=’’;if(desc)desc.value=’’;
toast(‘Sessione programmata!’);
rdLive();
}

function delLiveSess(idx){
if(!confirm(‘Eliminare questa sessione?’))return;
var sessions=JSON.parse(localStorage.getItem(‘pva_live_sessions’)||’[]’);
sessions.splice(idx,1);
localStorage.setItem(‘pva_live_sessions’,JSON.stringify(sessions));
rdLive();toast(‘Sessione eliminata’,‘w’);
}

// ── USERS ─────────────────────────────────────────────────────
function rdUsers(){
var tb=document.getElementById(‘uTB’);if(!tb)return;
var users=gU();
var adm={name:‘Admin Academy’,email:‘admin@plcveronaacademy.it’,role:‘admin’,profile:‘Admin’,date:’-’};
var all=[adm].concat(users);var h=’’;
all.forEach(function(u){
var ini=u.name.split(’ ‘).map(function(n){return n[0];}).join(’’).substring(0,2).toUpperCase();
h+=’<tr>’;
h+=’<td><div style="display:flex;align-items:center;gap:9px">’;
h+=’<div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--a),var(--p));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff">’+ini+’</div>’;
h+=’<span style="font-weight:600">’+esc(u.name)+’</span></div></td>’;
h+=’<td>’+esc(u.email)+’</td><td>’+(u.profile||’-’)+’</td>’;
h+=’<td><span class="bd '+(u.role==='admin'?'bd-r':'bd-b')+'">’+(u.role===‘admin’?‘Admin’:‘Studente’)+’</span></td>’;
h+=’<td>’+(u.date||’-’)+’</td>’;
h+=’<td>’+(u.role!==‘admin’?’<button class="btn btn-d btn-sm" onclick="delU(\''+u.email+'\')">🗑</button>’:’-’)+’</td></tr>’;
});
tb.innerHTML=h||’<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--mu)">Nessun utente</td></tr>’;
}
function delU(email){
if(!confirm(‘Rimuovere?’))return;
sU(gU().filter(function(u){return u.email!==email;}));
rdUsers();toast(‘Utente rimosso’,‘w’);
}
