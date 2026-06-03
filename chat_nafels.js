(function(){

// ── CHAT IA CASLA VOLEY — Self-contained widget ──────────────────
var CSS = [
  '#vb-chat-btn{position:fixed;bottom:24px;right:24px;width:58px;height:58px;border-radius:50%;border:none;cursor:pointer;z-index:9000;background:transparent;padding:0;filter:drop-shadow(0 4px 18px rgba(37,99,235,.55));transition:transform .2s,filter .2s}',
  '#vb-chat-btn:hover{transform:scale(1.1) rotate(-8deg);filter:drop-shadow(0 6px 28px rgba(37,99,235,.8))}',
  '#vb-chat-dot{position:fixed;bottom:74px;right:22px;width:14px;height:14px;background:#E8192C;border-radius:50%;border:2px solid #07080F;z-index:9001;display:none;animation:vbPulse 1.5s infinite}',
  '@keyframes vbPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.3)}}',
  '#vb-chat-panel{position:fixed;bottom:96px;right:24px;width:min(390px,calc(100vw - 32px));height:min(560px,calc(100vh - 110px));background:#0D0E1A;border:1px solid rgba(255,255,255,.14);border-radius:20px;z-index:9000;display:none;flex-direction:column;box-shadow:0 24px 80px rgba(0,0,0,.75);overflow:hidden;font-family:"Barlow Condensed","Segoe UI",sans-serif}',
  '#vb-chat-panel.vb-open{display:flex;animation:vbSlideUp .22s ease}',
  '@keyframes vbSlideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}',
  '.vb-hdr{display:flex;align-items:center;gap:10px;padding:13px 16px;background:rgba(37,99,235,.08);border-bottom:1px solid rgba(255,255,255,.07);flex-shrink:0}',
  '.vb-hdr-ball{width:30px;height:30px;flex-shrink:0}',
  '.vb-hdr-info{flex:1}',
  '.vb-hdr-title{font-family:"Bebas Neue",sans-serif;font-size:15px;letter-spacing:2px;color:#fff}',
  '.vb-hdr-sub{font-size:10px;color:#64748b;display:flex;align-items:center;gap:5px;margin-top:1px}',
  '.vb-dot-g{width:6px;height:6px;background:#22c55e;border-radius:50%}',
  '.vb-close{background:rgba(255,255,255,.08);border:none;color:#94a3b8;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all .15s}',
  '.vb-close:hover{background:rgba(255,255,255,.16);color:#fff}',
  '#vb-chat-msgs{flex:1;overflow-y:auto;padding:14px 14px 8px;display:flex;flex-direction:column;gap:10px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.08) transparent}',
  '.vb-msg{display:flex;gap:8px;max-width:92%}',
  '.vb-msg.vb-user{flex-direction:row-reverse;align-self:flex-end}',
  '.vb-bubble{padding:10px 13px;border-radius:14px;font-size:13px;line-height:1.55;white-space:pre-wrap;word-break:break-word}',
  '.vb-msg.vb-bot .vb-bubble{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.07);border-bottom-left-radius:4px;color:#e2e8f0}',
  '.vb-msg.vb-user .vb-bubble{background:linear-gradient(135deg,#1d4ed8,#2563eb);border-bottom-right-radius:4px;color:#fff}',
  '.vb-avatar{width:28px;height:28px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:14px;margin-top:2px;background:rgba(37,99,235,.12);border:1px solid rgba(37,99,235,.2)}',
  '.vb-typing{display:flex;gap:4px;align-items:center;padding:10px 13px}',
  '.vb-typing span{width:7px;height:7px;background:#64748b;border-radius:50%;animation:vbBounce .9s infinite;display:block}',
  '.vb-typing span:nth-child(2){animation-delay:.15s}',
  '.vb-typing span:nth-child(3){animation-delay:.3s}',
  '@keyframes vbBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-7px)}}',
  '#vb-suggestions{padding:6px 12px 8px;display:flex;gap:5px;flex-wrap:wrap;border-top:1px solid rgba(255,255,255,.06);flex-shrink:0;background:rgba(0,0,0,.15)}',
  '.vb-sugg{background:rgba(37,99,235,.08);border:1px solid rgba(37,99,235,.2);color:#93c5fd;border-radius:20px;padding:4px 11px;font-size:11px;font-family:"Barlow Condensed","Segoe UI",sans-serif;font-weight:700;cursor:pointer;transition:all .15s}',
  '.vb-sugg:hover{background:rgba(37,99,235,.2);color:#fff}',
  '.vb-input-row{display:flex;gap:8px;padding:10px 12px;border-top:1px solid rgba(255,255,255,.07);flex-shrink:0;background:rgba(0,0,0,.2)}',
  '#vb-input{flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:#e2e8f0;padding:9px 12px;border-radius:12px;font-family:"Barlow Condensed","Segoe UI",sans-serif;font-size:13px;outline:none;transition:border-color .15s;resize:none;height:40px;min-height:40px;max-height:110px}',
  '#vb-input:focus{border-color:rgba(37,99,235,.5)}',
  '#vb-input::placeholder{color:#475569}',
  '#vb-send{width:40px;height:40px;border-radius:12px;border:none;background:linear-gradient(135deg,#1d4ed8,#2563eb);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0}',
  '#vb-send:hover{transform:scale(1.05)}',
  '#vb-send:disabled{opacity:.38;cursor:not-allowed;transform:none}'
].join('\n');

var CONTEXT = {"team": "Biogas Voley Nafels", "season": "NLA Suiza 2025/26", "games_played": 26, "rivals": ["Lausanne UC", "STV St Gallen", "Colombier Volley", "TSV Jona Volleyball", "Volley Amriswil", "Volley Schonenwerd", "Chenois Geneve Volleyball", "VBC Sursee"], "players": {"1": {"name": "Linus Deecke", "pos": "L", "num": 1, "atk": {"total": 4, "eff": 25}, "srv": {"total": 35, "eff": 11}, "rec": {"total": 0, "eff": null}}, "2": {"name": "Mathias Corzo", "pos": "OH", "num": 2, "atk": {"total": 2, "eff": -50}, "srv": {"total": 0, "eff": null}, "rec": {"total": 0, "eff": null}}, "3": {"name": "Tom Schwitter", "pos": "OH", "num": 3, "atk": {"total": 9, "eff": -22}, "srv": {"total": 4, "eff": 6}, "rec": {"total": 0, "eff": null}}, "4": {"name": "Ezequiel Vazquez", "pos": "S", "num": 4, "atk": {"total": 87, "eff": 33}, "srv": {"total": 405, "eff": 4}, "rec": {"total": 5, "eff": -30}}, "5": {"name": "Joachim Hesselholt", "pos": "OH", "num": 5, "atk": {"total": 200, "eff": 41}, "srv": {"total": 226, "eff": -5}, "rec": {"total": 27, "eff": 33}}, "6": {"name": "Pablo Denis Cabanas", "pos": "OPP", "num": 6, "atk": {"total": 982, "eff": 36}, "srv": {"total": 328, "eff": -10}, "rec": {"total": 13, "eff": 0}}, "7": {"name": "Roy Schmid", "pos": "MB", "num": 7, "atk": {"total": 23, "eff": 17}, "srv": {"total": 82, "eff": -15}, "rec": {"total": 2, "eff": 25}}, "8": {"name": "Jonas Peter", "pos": "L", "num": 8, "atk": {"total": 1, "eff": -100}, "srv": {"total": 0, "eff": null}, "rec": {"total": 462, "eff": 25}}, "9": {"name": "Nathan Broch", "pos": "OH", "num": 9, "atk": {"total": 253, "eff": 13}, "srv": {"total": 239, "eff": 1}, "rec": {"total": 375, "eff": 25}}, "10": {"name": "Dejan Bogdanovski", "pos": "MB", "num": 10, "atk": {"total": 35, "eff": 29}, "srv": {"total": 40, "eff": -2}, "rec": {"total": 57, "eff": 13}}, "11": {"name": "Christian Bartholet", "pos": "OH", "num": 11, "atk": {"total": 218, "eff": 22}, "srv": {"total": 145, "eff": 4}, "rec": {"total": 221, "eff": 17}}, "14": {"name": "Manuel Figueiredo", "pos": "OPP", "num": 14, "atk": {"total": 620, "eff": 31}, "srv": {"total": 366, "eff": -5}, "rec": {"total": 481, "eff": 31}}, "15": {"name": "Risto Nikolov", "pos": "MB", "num": 15, "atk": {"total": 211, "eff": 36}, "srv": {"total": 315, "eff": 1}, "rec": {"total": 18, "eff": 22}}}};

var SYSTEM_BASE = "You are the volleyball analysis assistant for Club Atletico San Lorenzo de Almagro (CASLA), Division de Honor Masculina Argentina 2026.\n\nCRITICAL: Always respond in the same language the user writes in.\n- Spanish message respond in Spanish\n- English message respond in English\n- German message respond in German\n\nUse the CONTEXT data for specific player stats. Be concise (2-3 paragraphs max).\n\nKEY CONCEPTS: EFF Attack=(#-/-=)/total x100. Green>=44%, Yellow>=36%, Red<36%. SO=Side Out (attack after receiving). TR=Transition (attack without own reception). K1=Front Quick, K7=Seven, KM=Shifted, K2=Back Quick. Zones 1-9 court. SM=Float serve, SQ=Jump serve, RM=Float reception, RQ=Jump reception.";
var SYSTEM = SYSTEM_BASE + '\n\nSEASON DATA: ' + JSON.stringify(CONTEXT);


var vbOpen=false, vbLoading=false, vbHistory=[];
var LANG=(function(){try{var l=localStorage.getItem('vb_lang');if(l)return l;}catch(e){}var n=(navigator.language||'es').substring(0,2).toLowerCase();return['es','en','de'].indexOf(n)>=0?n:'es';})();

// Inject CSS
var styleEl=document.createElement('style');
styleEl.textContent=CSS;
document.head.appendChild(styleEl);

// Inject HTML
var wrapEl=document.createElement('div');
wrapEl.innerHTML=[
  '<div id="vb-chat-dot"></div>',
  '<button id="vb-chat-btn" onclick="vbToggle()" title="Asistente IA">',
  '<svg viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg">',
  '<circle cx="29" cy="29" r="28" fill="#1e3a8a"/>',
  '<circle cx="29" cy="29" r="27" fill="#dbeafe"/>',
  '<path d="M2,12 Q6,4 14,2 Q17,9 12,16 Q7,13 2,12Z" fill="#1e3a8a" opacity=".9"/>',
  '<path d="M25,2 Q33,5 37,12 Q31,16 25,12 Q25,7 25,2Z" fill="#1e3a8a" opacity=".9"/>',
  '<path d="M8,32 Q13,38 22,38 Q23,32 18,27 Q13,29 8,32Z" fill="#1e3a8a" opacity=".9"/>',
  '<g fill="none" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round">',
  '<path d="M14,2 Q22,10 24,9 Q28,6 25,2"/><path d="M25,2 Q24,12 28,17 Q32,16 37,12"/>',
  '<path d="M8,32 Q12,25 12,18 Q7,15 2,20"/><path d="M2,12 Q7,15 12,16 Q15,10 14,2"/>',
  '</g><ellipse cx="21" cy="17" rx="6" ry="4" fill="white" opacity=".25" transform="rotate(-20,21,17)"/>',
  '</svg></button>',
  '<div id="vb-chat-panel">',
  '<div class="vb-hdr">',
  '<svg class="vb-hdr-ball" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><circle cx="15" cy="15" r="14" fill="#1e3a8a"/><circle cx="15" cy="15" r="13" fill="#dbeafe"/><path d="M2,8 Q5,3 10,2 Q12,6 8,11 Q5,9 2,8Z" fill="#1e3a8a" opacity=".9"/><path d="M16,2 Q21,4 24,8 Q20,11 16,8 Q16,5 16,2Z" fill="#1e3a8a" opacity=".9"/><path d="M5,20 Q8,24 14,24 Q15,20 12,17 Q9,18 5,20Z" fill="#1e3a8a" opacity=".9"/><g fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round"><path d="M10,2 Q14,7 15,6 Q18,4 16,2"/><path d="M16,2 Q15,8 18,11 Q21,10 24,8"/></g></svg>',
  '<div class="vb-hdr-info"><div class="vb-hdr-title">ASISTENTE NAFELS</div><div class="vb-hdr-sub"><div class="vb-dot-g"></div><span>IA aktiv</span></div></div>',
  '<button class="vb-close" onclick="vbToggle()">&#x2715;</button>',
  '</div>',
  '<div id="vb-chat-msgs"></div>',
  '<div id="vb-suggestions">',
  '<button class="vb-sugg" onclick="vbSugg(this)">\u00bfQu\u00e9 es el EFF?</button>',
  '<button class="vb-sugg" onclick="vbSugg(this)">Stats del equipo</button>',
  '<button class="vb-sugg" onclick="vbSugg(this)">\u00bfC\u00f3mo uso los heatmaps?</button>',
  '</div>',
  '<div class="vb-input-row">',
  '<textarea id="vb-input" placeholder="Pregunt\u00e1 sobre stats, t\u00e1ctica..." onkeydown="if(event.key===\'Enter\'&&!event.shiftKey){event.preventDefault();vbSend()}" oninput="vbResize(this)"></textarea>',
  '<button id="vb-send" onclick="vbSend()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"/></svg></button>',
  '</div></div>'
].join('');
document.body.appendChild(wrapEl);

var SUGG={
  es:[['\u00bfQui\u00e9n ataca mejor?','Stats del equipo','\u00bfC\u00f3mo mejoro el EFF?'],
      ['\u00bfQu\u00e9 es Side Out?','Diferencia SO vs TR','\u00bfQu\u00e9 significan las zonas?']],
  en:[['Who attacks best?','Team stats','How to improve EFF?'],['What is Side Out?','SO vs TR','What do zones mean?']],
  de:[['Wer greift am besten an?','Team-Stats','Wie EFF verbessern?'],['Was ist Side Out?','SO vs TR','Was bedeuten Zonen?']]
};

function vbToggle(){
  vbOpen=!vbOpen;
  var p=document.getElementById('vb-chat-panel');
  if(vbOpen){
    p.classList.add('vb-open');
    document.getElementById('vb-chat-dot').style.display='none';
    if(!vbHistory.length) vbWelcome();
    setTimeout(function(){var i=document.getElementById('vb-input');if(i)i.focus();},280);
  } else { p.classList.remove('vb-open'); }
}

function vbWelcome(){
  var w={es:'\u00a1Hola! Soy el asistente de **CASLA Voley**. Tengo los datos de la temporada DHM 2026. \u00bfEn qu\u00e9 te puedo ayudar?',
         en:'Hi! I\'m the **CASLA Voley** assistant. I have access to the NLA 2025/26 season data. How can I help?',
         de:'Hallo! Ich bin der **CASLA Voley** Assistent mit Zugriff auf DHM-2026-Daten. Wie kann ich helfen?'};
  vbAdd('bot', w[LANG]||w.es);
}

function vbSend(){
  var input=document.getElementById('vb-input');
  var text=(input.value||'').trim();
  if(!text||vbLoading)return;
  input.value=''; vbResize(input);
  document.getElementById('vb-suggestions').style.display='none';
  vbAdd('user',text); vbCall(text);
}

function vbSugg(btn){
  var text=btn.textContent;
  document.getElementById('vb-suggestions').style.display='none';
  vbAdd('user',text); vbCall(text);
}

function vbLang(txt){
  if(/\b(wie|was|wer|ich|du|ist|sind|spieler|angriff|aufschlag|mannschaft|spiel)\b/i.test(txt))return 'de';
  if(/\b(what|how|who|is|are|player|attack|serve|team|game|the|and)\b/i.test(txt))return 'en';
  return 'es';
}

async function vbCall(msg){
  vbLoading=true;
  document.getElementById('vb-send').disabled=true;
  vbHistory.push({role:'user',content:msg});
  var tid=vbTyping();
  try{
    var r=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:800,system:SYSTEM,messages:vbHistory.slice(-8)})
    });
    var d=await r.json();
    vbRmTyping(tid);
    var reply=d.content&&d.content[0]?d.content[0].text:'Error al conectar.';
    vbHistory.push({role:'assistant',content:reply});
    vbAdd('bot',reply); vbSuggs(msg);
  }catch(e){vbRmTyping(tid);vbAdd('bot','\u26a0\ufe0f Error de conexi\u00f3n. Intentá de nuevo.');}
  vbLoading=false;
  document.getElementById('vb-send').disabled=false;
}

function vbAdd(role,text){
  var msgs=document.getElementById('vb-chat-msgs');
  var d=document.createElement('div'); d.className='vb-msg vb-'+role;
  var av=document.createElement('div'); av.className='vb-avatar'; av.textContent=role==='bot'?'\ud83c\udfc0':'\ud83d\udc64';
  var b=document.createElement('div'); b.className='vb-bubble';
  b.innerHTML=text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
  d.appendChild(av); d.appendChild(b); msgs.appendChild(d);
  msgs.scrollTop=msgs.scrollHeight;
  if(!vbOpen&&role==='bot'){var dot=document.getElementById('vb-chat-dot');if(dot){dot.style.display='block';setTimeout(function(){dot.style.display='none';},4000);}}
}

function vbTyping(){
  var msgs=document.getElementById('vb-chat-msgs');
  var id='vbt-'+Date.now();
  var d=document.createElement('div'); d.className='vb-msg vb-bot'; d.id=id;
  d.innerHTML='<div class="vb-avatar">\ud83c\udfc0</div><div class="vb-bubble vb-typing"><span></span><span></span><span></span></div>';
  msgs.appendChild(d); msgs.scrollTop=msgs.scrollHeight; return id;
}

function vbRmTyping(id){var el=document.getElementById(id);if(el)el.remove();}

function vbSuggs(q){
  var el=document.getElementById('vb-suggestions'); if(!el)return;
  var l=vbLang(q); LANG=l;
  var sets=SUGG[l]||SUGG.es;
  var set=sets[Math.floor(Math.random()*sets.length)];
  el.innerHTML=set.map(function(s){return '<button class="vb-sugg" onclick="vbSugg(this)">'+s+'</button>';}).join('');
  el.style.display='flex';
}

function vbResize(el){el.style.height='40px';el.style.height=Math.min(el.scrollHeight,110)+'px';}

setTimeout(function(){if(!vbOpen){var d=document.getElementById('vb-chat-dot');if(d){d.style.display='block';setTimeout(function(){d.style.display='none';},3500);}}},2000);

document.addEventListener('click',function(e){
  var p=document.getElementById('vb-chat-panel');
  var b=document.getElementById('vb-chat-btn');
  if(vbOpen&&p&&!p.contains(e.target)&&b&&!b.contains(e.target)){vbOpen=false;p.classList.remove('vb-open');}
});

// Expose to global scope for onclick handlers
window.vbToggle = vbToggle;
window.vbSend   = vbSend;
window.vbSugg   = vbSugg;
window.vbResize = vbResize;

})();
