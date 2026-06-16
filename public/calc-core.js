/* ===== Mortgage Broker Miami — shared core (calc helpers + unified site header/footer) ===== */
var PHONE='(305) 988-4806', TEL='+13059884806', NMLS='2560919';

/* formatting */
function money(n){return '$'+Math.round(n).toLocaleString('en-US');}
function money2(n){return '$'+Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
function num(el){return Number(String((el&&el.value!==undefined?el.value:el)).replace(/[^0-9.]/g,''))||0;}
function yrsMonths(m){m=Math.round(m);var y=Math.floor(m/12),mo=m%12;return (y?y+' yr ':'')+(mo?mo+' mo':(y?'':'0 mo'));}
function bindMoney(id,cb){var el=document.getElementById(id);if(!el)return;el.addEventListener('input',function(){var raw=el.value.replace(/[^0-9]/g,'');el.value=raw?Number(raw).toLocaleString('en-US'):'';cb&&cb();});}
function bindNum(id,cb){var el=document.getElementById(id);if(!el)return;el.addEventListener('input',function(){cb&&cb();});}

/* amortization */
function monthlyPI(principal,annualPct,n){var r=annualPct/100/12;return r===0?principal/n:principal*r/(1-Math.pow(1+r,-n));}
function monthsToPayoff(balance,annualPct,payment){var r=annualPct/100/12;if(payment<=balance*r)return Infinity;if(r===0)return balance/payment;return Math.log(payment/(payment-balance*r))/Math.log(1+r);}
function runSchedule(principal,annualPct,basePayment,extra){var r=annualPct/100/12,bal=principal,pay=basePayment+(extra||0),m=0,interest=0,cap=1200;while(bal>0.01&&m<cap){var i=bal*r,pr=pay-i;if(pr<=0)return{months:Infinity,interest:Infinity};if(pr>bal)pr=bal;bal-=pr;interest+=i;m++;}return{months:m,interest:interest};}

/* donut */
function donut(elId,parts,size){size=size||150;var el=document.getElementById(elId);if(!el)return;var total=parts.reduce(function(a,p){return a+p.value;},0)||1,R=size/2,r=R*0.62,cx=R,cy=R,ang=-Math.PI/2,sw=R-r,rMid=(R+r)/2,svg='<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'">';parts.forEach(function(p){var frac=p.value/total,a2=ang+frac*2*Math.PI,large=frac>0.5?1:0,x1=cx+rMid*Math.cos(ang),y1=cy+rMid*Math.sin(ang),x2=cx+rMid*Math.cos(a2),y2=cy+rMid*Math.sin(a2);if(frac>0.999){svg+='<circle cx="'+cx+'" cy="'+cy+'" r="'+rMid+'" fill="none" stroke="'+p.color+'" stroke-width="'+sw+'"/>';}else if(frac>0){svg+='<path d="M '+x1+' '+y1+' A '+rMid+' '+rMid+' 0 '+large+' 1 '+x2+' '+y2+'" fill="none" stroke="'+p.color+'" stroke-width="'+sw+'"/>';}ang=a2;});svg+='</svg>';el.innerHTML=svg;}

/* calculators list (used by hub, footer cross-links, and the Calculators dropdown) */
var CALCS=[
 {s:'mortgage-payment-calculator',n:'Mortgage Payment',d:'Full PITI payment with taxes, insurance, HOA and PMI.'},
 {s:'mortgage-payment-calculator-florida',n:'Florida Payment',d:'Payment tuned for Florida taxes, insurance and HOA/CDD.'},
 {s:'home-affordability-calculator',n:'Home Affordability',d:'How much house your income and debts can support.'},
 {s:'refinance-break-even-calculator',n:'Refinance Break-Even',d:'When a refi pays back its closing costs.'},
 {s:'debt-consolidation-refinance-calculator',n:'Debt Consolidation',d:'Roll high-rate debt into your mortgage.'},
 {s:'extra-payment-calculator',n:'Extra Payment',d:'Interest and time saved by paying extra.'},
 {s:'early-mortgage-payoff-calculator',n:'Early Payoff',d:'Pay your mortgage off by a target date.'},
 {s:'florida-rate-tool',n:'Rate Tool',d:'Compare one loan priced three ways.'},
 {s:'mortgage-rates',n:'Rate Trends',d:'National 30 & 15-yr averages over time.'}
];
var PROGRAMS=['FHA Loans','Conventional','Jumbo','Condo Loans','Bank Statement','DSCR / Investor','VA Loans','Refinance','Foreign National'];
var AREAS=['Brickell','Coral Gables','Miami Beach','Doral','Aventura','Coconut Grove','Kendall','All Miami-Dade'];
function houseSVG(){return '<svg viewBox="0 0 24 24" fill="none"><path d="M3 11.5 12 4l9 7.5M5 10.5V20h14v-9.5M10 20v-5h4v5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';}

var MH_CSS=''+
'.mh-wrap{width:min(1180px,calc(100% - 36px));margin-inline:auto}'+
'.mh-bar{background:var(--navy,#0B2C52);color:#dce8f6;font-size:.8rem}'+
'.mh-bar .mh-wrap{display:flex;justify-content:space-between;align-items:center;min-height:38px;gap:12px}'+
'.mh-stars{color:var(--gold,#EFA31B)}.mh-bar a{color:#fff;font-weight:600;text-decoration:none}'+
'@media(max-width:680px){.mh-bar .mh-tag{display:none}}'+
'.mh-header{position:sticky;top:0;z-index:200;background:rgba(251,252,254,.94);backdrop-filter:blur(10px);border-bottom:1px solid var(--line,#E1E9F3)}'+
'.mh-hd{display:flex;align-items:center;justify-content:space-between;min-height:66px;gap:14px}'+
'.mh-brand{display:flex;align-items:center;gap:10px;text-decoration:none}'+
'.mh-logo{width:40px;height:40px;border-radius:10px;background:linear-gradient(150deg,var(--blue,#1657A8),var(--blue-600,#1D6FD0));display:grid;place-items:center;flex:none}'+
'.mh-logo svg{width:22px;height:22px}'+
'.mh-brand b{font-family:Sora,sans-serif;font-size:1rem;color:var(--navy,#0B2C52);display:block;line-height:1.05}'+
'.mh-brand small{color:var(--muted,#5C6B82);font-size:.7rem}'+
'.mh-nav{display:flex;gap:2px;align-items:center}'+
'.mh-nav>a,.mh-dd>button{font-family:Sora,sans-serif;font-weight:600;font-size:.9rem;color:var(--ink,#0F2440);padding:9px 12px;border-radius:8px;background:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:5px;text-decoration:none}'+
'.mh-nav>a:hover,.mh-dd>button:hover{background:var(--blue-50,#F4F8FD);color:var(--blue,#1657A8)}'+
'.mh-dd{position:relative}'+
'.mh-dd>button svg{width:12px;height:12px;transition:.2s}'+
'.mh-dd:hover>button svg{transform:rotate(180deg)}'+
'.mh-menu{position:absolute;top:calc(100% + 6px);left:0;background:#fff;border:1px solid var(--line,#E1E9F3);border-radius:14px;box-shadow:0 18px 44px rgba(11,44,82,.14);padding:8px;min-width:236px;opacity:0;visibility:hidden;transform:translateY(6px);transition:.16s;max-height:74vh;overflow:auto}'+
'.mh-dd:hover .mh-menu{opacity:1;visibility:visible;transform:none}'+
'.mh-menu a{display:block;padding:9px 12px;border-radius:8px;font-size:.9rem;font-weight:500;color:var(--ink,#0F2440);text-decoration:none;font-family:Inter,sans-serif}'+
'.mh-menu a:hover{background:var(--blue-50,#F4F8FD);color:var(--blue,#1657A8)}'+
'.mh-menu .mh-sep{height:1px;background:var(--line,#E1E9F3);margin:6px 6px}'+
'.mh-cta{display:flex;gap:10px;align-items:center}'+
'.mh-ph{font-family:Sora,sans-serif;font-weight:700;color:var(--blue,#1657A8);text-decoration:none;white-space:nowrap}'+
'.mh-btn{display:inline-flex;align-items:center;justify-content:center;font-family:Sora,sans-serif;font-weight:600;font-size:.9rem;padding:11px 18px;border-radius:10px;background:var(--blue,#1657A8);color:#fff;text-decoration:none;border:1.5px solid var(--blue,#1657A8);cursor:pointer}'+
'.mh-btn:hover{background:var(--navy-700,#103A6B);border-color:var(--navy-700,#103A6B)}'+
'.mh-btn.light{background:#fff;color:var(--navy,#0B2C52);border-color:var(--line,#E1E9F3)}'+
'.mh-menubtn{display:none;width:44px;height:44px;border-radius:10px;border:1px solid var(--line,#E1E9F3);background:#fff;flex-direction:column;gap:5px;align-items:center;justify-content:center;cursor:pointer}'+
'.mh-menubtn span{width:22px;height:2px;background:var(--navy,#0B2C52);border-radius:2px;transition:.25s}'+
'.mh-menubtn.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}'+
'.mh-menubtn.open span:nth-child(2){opacity:0}'+
'.mh-menubtn.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}'+
'@media(max-width:1024px){.mh-nav,.mh-ph,.mh-cta>.mh-btn{display:none}.mh-menubtn{display:flex}}'+
'.mh-drawer{position:fixed;inset:0;z-index:300;visibility:hidden}'+
'.mh-drawer.open{visibility:visible}'+
'.mh-drawer-bg{position:absolute;inset:0;background:rgba(11,44,82,.5);opacity:0;transition:.25s}'+
'.mh-drawer.open .mh-drawer-bg{opacity:1}'+
'.mh-panel{position:absolute;top:0;right:0;height:100%;width:min(330px,86vw);background:#fff;transform:translateX(100%);transition:.28s cubic-bezier(.4,0,.2,1);padding:20px;overflow-y:auto}'+
'.mh-drawer.open .mh-panel{transform:none}'+
'.mh-panel a{display:block;padding:10px 8px;border-bottom:1px solid var(--line,#E1E9F3);font-family:Sora,sans-serif;font-weight:600;color:var(--navy,#0B2C52);text-decoration:none}'+
'.mh-panel .mh-dh{font-family:Sora,sans-serif;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted,#5C6B82);margin:16px 6px 2px}'+
'.mh-panel .mh-btn{margin-top:14px;width:100%}';

function buildChrome(active){
  var chev='<svg viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var prog=PROGRAMS.map(function(p){return '<a href="index.html#programs">'+p+'</a>';}).join('');
  var area=AREAS.map(function(a){return '<a href="index.html#areas">'+a+'</a>';}).join('');
  var calc='<a href="mortgage-calculators.html">All calculators</a><div class="mh-sep"></div>'+
    CALCS.filter(function(c){return c.s!=='florida-rate-tool'&&c.s!=='mortgage-rates';}).map(function(c){return '<a href="'+c.s+'.html">'+c.n+'</a>';}).join('')+
    '<div class="mh-sep"></div><a href="florida-rate-tool.html">Rate Tool</a><a href="mortgage-rates.html">Rate Trends</a>';
  var hdr=document.getElementById('site-hdr');
  if(hdr) hdr.innerHTML='<style id="mh-style">'+MH_CSS+'</style>'+
    '<div class="mh-bar"><div class="mh-wrap"><span><span class="mh-stars">★★★★★</span> <span class="mh-tag">Miami mortgage broker · Serving all of Florida</span></span><a href="tel:'+TEL+'">📞 '+PHONE+'</a></div></div>'+
    '<header class="mh-header"><div class="mh-wrap mh-hd">'+
      '<a class="mh-brand" href="index.html"><span class="mh-logo">'+houseSVG()+'</span><span><b>Mortgage Broker Miami</b><small>Matthew Gromadzki · NMLS #'+NMLS+'</small></span></a>'+
      '<nav class="mh-nav">'+
        '<a href="index.html">Home</a>'+
        '<div class="mh-dd"><button>Loan Programs '+chev+'</button><div class="mh-menu">'+prog+'</div></div>'+
        '<div class="mh-dd"><button>Calculators '+chev+'</button><div class="mh-menu">'+calc+'</div></div>'+
        '<div class="mh-dd"><button>Areas '+chev+'</button><div class="mh-menu">'+area+'</div></div>'+
        '<a href="mortgage-rates.html">Rates</a>'+
      '</nav>'+
      '<div class="mh-cta"><a class="mh-ph" href="tel:'+TEL+'">'+PHONE+'</a><a class="mh-btn" href="index.html#start">Get pre-approved</a>'+
        '<button class="mh-menubtn" id="mhMenu" aria-label="Menu"><span></span><span></span><span></span></button></div>'+
    '</div></header>'+
    '<div class="mh-drawer" id="mhDrawer"><div class="mh-drawer-bg" data-mhclose></div><nav class="mh-panel">'+
      '<a href="index.html" data-mhclose>Home</a>'+
      '<div class="mh-dh">Loan Programs</div>'+prog+
      '<div class="mh-dh">Calculators</div>'+calc+
      '<div class="mh-dh">Areas</div>'+area+
      '<a class="mh-btn" href="index.html#start" data-mhclose>Get pre-approved</a>'+
      '<a class="mh-btn light" href="tel:'+TEL+'">Call '+PHONE+'</a>'+
    '</nav></div>';
  // drawer behavior
  var mb=document.getElementById('mhMenu'),dr=document.getElementById('mhDrawer');
  if(mb&&dr){
    mb.addEventListener('click',function(){var o=dr.classList.toggle('open');mb.classList.toggle('open',o);document.body.style.overflow=o?'hidden':'';});
    [].forEach.call(dr.querySelectorAll('[data-mhclose], .mh-panel a'),function(el){el.addEventListener('click',function(){dr.classList.remove('open');mb.classList.remove('open');document.body.style.overflow='';});});
  }
  // footer (only where a #site-ftr placeholder exists)
  var ftr=document.getElementById('site-ftr');
  if(ftr) ftr.innerHTML=
   '<footer class="site"><div class="wrap"><p class="fl">© 2026 Mortgage Broker Miami Florida · Matthew Gromadzki · NMLS #'+NMLS+'. These tools provide educational estimates only — not a Loan Estimate, an approval, or a commitment to lend. Figures depend on verified credit, income, assets, property, program, lock date, and actual third-party fees. We do business in accordance with the Federal Fair Housing Law and the Equal Credit Opportunity Act.</p>'+
   '<div class="fbar"><span class="eho"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 11.5 12 4l9 7.5M5 10.5V20h14v-9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Equal Housing Opportunity</span><span>Estimates only · Not a commitment to lend</span></div></div></footer>';
  // cross-link grid
  var more=document.getElementById('more-calcs');
  if(more){var html='<div class="wrap"><p class="eyebrow">More tools</p><h2 style="margin:10px 0 22px">Keep planning</h2><div class="more-grid">';
    CALCS.filter(function(c){return c.s!==active;}).forEach(function(c){html+='<a class="mc" href="'+c.s+'.html"><h3>'+c.n+'</h3><p>'+c.d+'</p><span class="go">Open →</span></a>';});
    html+='</div></div>';more.innerHTML=html;}
}
function disclaimer(extra){return '<div class="disc"><strong>Estimate only.</strong> '+(extra||'')+' Not a Loan Estimate, approval, or commitment to lend. Your actual numbers depend on credit, income, property, program, and current rates. Matthew Gromadzki · NMLS #'+NMLS+' · Equal Housing Opportunity.</div>';}
function ctaRow(){return '<div class="cta-row"><a class="btn btn-gold" href="tel:'+TEL+'">Talk to Matthew</a><a class="btn btn-line" href="tel:'+TEL+'">Call '+PHONE+'</a></div>';}
