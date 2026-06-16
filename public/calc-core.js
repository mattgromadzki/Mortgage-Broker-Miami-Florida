/* ===== Mortgage Broker Miami — calculator suite shared core ===== */
var PHONE='(305) 988-4806', TEL='+13059884806', NMLS='2560919';

/* formatting */
function money(n){return '$'+Math.round(n).toLocaleString('en-US');}
function money2(n){return '$'+Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
function num(el){return Number(String((el.value!==undefined?el.value:el)).replace(/[^0-9.]/g,''))||0;}
function yrsMonths(m){m=Math.round(m);var y=Math.floor(m/12),mo=m%12;return (y?y+' yr ':'')+(mo?mo+' mo':(y?'':'0 mo'));}
/* live thousands-formatting for money inputs */
function bindMoney(id,cb){var el=document.getElementById(id);if(!el)return;el.addEventListener('input',function(){var raw=el.value.replace(/[^0-9]/g,'');el.value=raw?Number(raw).toLocaleString('en-US'):'';cb&&cb();});}
function bindNum(id,cb){var el=document.getElementById(id);if(!el)return;el.addEventListener('input',function(){cb&&cb();});}

/* amortization */
function monthlyPI(principal,annualPct,n){var r=annualPct/100/12;return r===0?principal/n:principal*r/(1-Math.pow(1+r,-n));}
// months to pay off a balance at a given fixed payment
function monthsToPayoff(balance,annualPct,payment){
  var r=annualPct/100/12; if(payment<=balance*r) return Infinity;
  if(r===0) return balance/payment;
  return Math.log(payment/(payment-balance*r))/Math.log(1+r);
}
// run schedule with optional extra monthly; returns totals
function runSchedule(principal,annualPct,basePayment,extra){
  var r=annualPct/100/12, bal=principal, pay=basePayment+(extra||0), m=0, interest=0, cap=1200;
  while(bal>0.01 && m<cap){ var i=bal*r; var pr=pay-i; if(pr<=0) return {months:Infinity,interest:Infinity}; if(pr>bal)pr=bal; bal-=pr; interest+=i; m++; }
  return {months:m,interest:interest};
}

/* simple SVG donut */
function donut(elId,parts,size){
  size=size||150; var el=document.getElementById(elId); if(!el)return;
  var total=parts.reduce(function(a,p){return a+p.value;},0)||1, R=size/2, r=R*0.62, cx=R, cy=R, ang=-Math.PI/2, sw=R-r;
  var rMid=(R+r)/2, svg='<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'">';
  parts.forEach(function(p){
    var frac=p.value/total, a2=ang+frac*2*Math.PI, large=frac>0.5?1:0;
    var x1=cx+rMid*Math.cos(ang), y1=cy+rMid*Math.sin(ang), x2=cx+rMid*Math.cos(a2), y2=cy+rMid*Math.sin(a2);
    if(frac>0.999){svg+='<circle cx="'+cx+'" cy="'+cy+'" r="'+rMid+'" fill="none" stroke="'+p.color+'" stroke-width="'+sw+'"/>';}
    else if(frac>0){svg+='<path d="M '+x1+' '+y1+' A '+rMid+' '+rMid+' 0 '+large+' 1 '+x2+' '+y2+'" fill="none" stroke="'+p.color+'" stroke-width="'+sw+'"/>';}
    ang=a2;
  });
  svg+='</svg>'; el.innerHTML=svg;
}

/* chrome injection */
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
function houseSVG(){return '<svg viewBox="0 0 24 24" fill="none"><path d="M3 11.5 12 4l9 7.5M5 10.5V20h14v-9.5M10 20v-5h4v5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';}
function buildChrome(active){
  var hdr=document.getElementById('site-hdr');
  if(hdr) hdr.innerHTML=
   '<div class="topbar"><div class="wrap"><span><span class="stars">★★★★★</span> Free Florida mortgage calculators</span><a href="tel:'+TEL+'">📞 '+PHONE+'</a></div></div>'+
   '<header class="site"><div class="wrap hd">'+
     '<a class="brand" href="index.html"><span class="logo-mark">'+houseSVG()+'</span><span><b>Mortgage Broker Miami</b><small>Matthew Gromadzki · NMLS #'+NMLS+'</small></span></a>'+
     '<nav class="hd-nav"><a href="index.html">Home</a><a href="mortgage-calculators.html">All calculators</a><a href="florida-rate-tool.html">Rate tool</a></nav>'+
     '<div class="hd-cta"><a class="ph" href="tel:'+TEL+'">'+PHONE+'</a><a class="btn btn-blue" href="index.html#start">Get pre-approved</a></div>'+
   '</div></header>';
  var ftr=document.getElementById('site-ftr');
  if(ftr) ftr.innerHTML=
   '<footer class="site"><div class="wrap"><p class="fl">© 2026 Mortgage Broker Miami Florida · Matthew Gromadzki · NMLS #'+NMLS+'. These calculators provide educational estimates only — not a Loan Estimate, an approval, or a commitment to lend. Figures depend on verified credit, income, assets, property, program, lock date, and actual third-party fees. We do business in accordance with the Federal Fair Housing Law and the Equal Credit Opportunity Act.</p>'+
   '<div class="fbar"><span class="eho"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 11.5 12 4l9 7.5M5 10.5V20h14v-9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Equal Housing Opportunity</span><span>Estimates only · Not a commitment to lend</span></div></div></footer>';
  var more=document.getElementById('more-calcs');
  if(more){var html='<div class="wrap"><p class="eyebrow">More tools</p><h2 style="margin:10px 0 22px">Keep planning</h2><div class="more-grid">';
    CALCS.filter(function(c){return c.s!==active;}).forEach(function(c){
      html+='<a class="mc" href="'+c.s+'.html"><h3>'+c.n+'</h3><p>'+c.d+'</p><span class="go">Open →</span></a>';});
    html+='</div></div>'; more.innerHTML=html;}
}
function disclaimer(extra){
  return '<div class="disc"><strong>Estimate only.</strong> '+(extra||'')+' Not a Loan Estimate, approval, or commitment to lend. Your actual numbers depend on credit, income, property, program, and current rates. Matthew Gromadzki · NMLS #'+NMLS+' · Equal Housing Opportunity.</div>';
}
function ctaRow(){return '<div class="cta-row"><a class="btn btn-gold" href="tel:'+TEL+'">Talk to Matthew</a><a class="btn btn-line" href="tel:'+TEL+'">Call '+PHONE+'</a></div>';}
