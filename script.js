(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* scatter stars in the sky */
  (function(){
    var f = document.getElementById('starfield'); if(!f) return;
    var cols = ['#ECC04B','#4574B8','#E08A39','#E9E1CD','#E24E37'];
    var n = window.innerWidth < 600 ? 16 : 30;
    var html = '';
    for(var i=0;i<n;i++){
      var s = 8 + Math.random()*22;
      var x = Math.random()*100, y = Math.random()*100;
      var c = cols[i % cols.length];
      var r = (Math.random()*40-20).toFixed(0);
      var d = (Math.random()*4).toFixed(2);
      html += '<svg style="left:'+x.toFixed(1)+'%;top:'+y.toFixed(1)+'%;color:'+c+';--r:'+r+'deg;animation-delay:'+d+'s" width="'+s.toFixed(0)+'" height="'+s.toFixed(0)+'"><use href="#star"/></svg>';
    }
    f.innerHTML = html;
  })();

  /* reveal */
  var rev = document.querySelectorAll('.reveal');
  if(reduce){ rev.forEach(function(el){el.classList.add('in');}); }
  else {
    var io = new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });},{threshold:.16, rootMargin:'0px 0px -40px 0px'});
    rev.forEach(function(el){ io.observe(el); });
  }

  /* count-up */
  function countUp(el){
    var end=parseFloat(el.getAttribute('data-count')), suf=el.getAttribute('data-suffix')||'';
    if(reduce){ el.textContent=end+suf; return; }
    var t0=null;
    function step(ts){ if(!t0)t0=ts; var p=Math.min((ts-t0)/1000,1); el.textContent=Math.round(end*p)+suf; if(p<1)requestAnimationFrame(step); else el.textContent=end+suf; }
    requestAnimationFrame(step);
  }
  var seen=new WeakSet();
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting && !seen.has(e.target)){ seen.add(e.target); countUp(e.target);} });},{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });

  /* turntable */
  var tt=document.getElementById('turntable'), sound=document.getElementById('sound');
  window.addEventListener('scroll', function(){ if(window.scrollY>520) tt.classList.add('show'); else tt.classList.remove('show'); }, {passive:true});
  function go(){ sound.scrollIntoView({behavior:reduce?'auto':'smooth'}); }
  tt.addEventListener('click', go);
  tt.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); } });

  /* rec forms -> mailto */
  function wire(fid, okid, subject, build){
    var f=document.getElementById(fid); if(!f) return;
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var d={}; new FormData(f).forEach(function(v,k){ d[k]=v; });
      window.location.href='mailto:pasaboo@uwaterloo.ca?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(build(d));
      document.getElementById(okid).textContent='opening your mail — thank you ✦'; f.reset();
    });
  }
  wire('songForm','s-ok','a track for paridhi', function(d){ return (d.song||'')+'\n\n'+(d.why?'why: '+d.why+'\n\n':'')+'— '+(d.name||'a friend'); });
  wire('bookForm','b-ok','a book for paridhi', function(d){ return (d.title||'')+'\n\n'+(d.why?'why: '+d.why+'\n\n':'')+'— '+(d.name||'a friend'); });

  /* ===== BOOKS ===== */
  // full shelf (40) for the index
  var SHELF = [
    ["Who Have Never Known Men","Jacqueline Harpman"],["Giovanni's Room","James Baldwin"],["Demian","Hermann Hesse"],
    ["Memoirs of a Geisha","Arthur Golden"],["Out","Natsuo Kirino"],["Moonlight",""],["Snow Country","Yasunari Kawabata"],
    ["Territory of Light","Yūko Tsushima"],["1984","George Orwell"],["Animal Farm","George Orwell"],
    ["All the Lovers in the Night","Mieko Kawakami"],["Breasts and Eggs","Mieko Kawakami"],["Tomb of Sand","Geetanjali Shree"],
    ["Lolita","Vladimir Nabokov"],["Save Me the Waltz","Zelda Fitzgerald"],["In Praise of Shadows","Jun'ichirō Tanizaki"],
    ["Never Let Me Go","Kazuo Ishiguro"],["My Dark Vanessa","Kate Elizabeth Russell"],["Conversations with Friends","Sally Rooney"],
    ["Bunny","Mona Awad"],["Men Without Women","Haruki Murakami"],["Sputnik Sweetheart","Haruki Murakami"],
    ["A Wild Sheep Chase","Haruki Murakami"],["The Wind-Up Bird Chronicle","Haruki Murakami"],["Kafka on the Shore","Haruki Murakami"],
    ["South of the Border, West of the Sun","Haruki Murakami"],["Norwegian Wood","Haruki Murakami"],["After Dark","Haruki Murakami"],
    ["Diary of a Mad Old Man","Jun'ichirō Tanizaki"],["Naomi","Jun'ichirō Tanizaki"],["1Q84","Haruki Murakami"],
    ["Colorless Tsukuru Tazaki","Haruki Murakami"],["A Little Life","Hanya Yanagihara"],["The Perks of Being a Wallflower","Stephen Chbosky"],
    ["Letters to a Young Poet","Rainer Maria Rilke"],["Revenge","Yōko Ogawa"],["The Picture of Dorian Gray","Oscar Wilde"],
    ["Nausea","Jean-Paul Sartre"],["Before the Coffee Gets Cold","Toshikazu Kawaguchi"],["Before the Coffee Gets Cold: Tales from the Café","Toshikazu Kawaguchi"]
  ];
  // the 10 designed books for the staircase
  var STAIR = [
    {t:"Kafka on the Shore", a:"Murakami", c:"#2E4A86", ink:"#F1E8D2"},
    {t:"Norwegian Wood", a:"Murakami", c:"#7B5230", ink:"#F4ECD8"},
    {t:"Breasts and Eggs", a:"Kawakami", c:"#C4423A", ink:"#FBEDE8"},
    {t:"Snow Country", a:"Kawabata", c:"#3E6FA0", ink:"#EAF2FB"},
    {t:"Lolita", a:"Nabokov", c:"#E0AE3A", ink:"#2A2410"},
    {t:"Never Let Me Go", a:"Ishiguro", c:"#566B45", ink:"#EEF5E6"},
    {t:"A Little Life", a:"Yanagihara", c:"#2B2E55", ink:"#EDEBF6"},
    {t:"The Picture of Dorian Gray", a:"Wilde", c:"#1F5C52", ink:"#E6F5EF"},
    {t:"Giovanni's Room", a:"Baldwin", c:"#B0612F", ink:"#FBEFE0"},
    {t:"In Praise of Shadows", a:"Tanizaki", c:"#3A3A44", ink:"#ECE6D6"}
  ];

  // build full index
  var idx=document.getElementById('indexList');
  if(idx){ SHELF.forEach(function(b){ var li=document.createElement('li');
    var t=document.createElement('span'); t.className='ti'; t.textContent=b[0]; li.appendChild(t);
    if(b[1]){ li.appendChild(document.createElement('br')); var a=document.createElement('span'); a.className='au'; a.textContent=b[1]; li.appendChild(a); }
    idx.appendChild(li);
  }); }

  // build staircase books
  var core=document.getElementById('stairCore');
  var slabs=[];
  STAIR.forEach(function(b){
    var d=document.createElement('div'); d.className='bookslab';
    d.style.background='linear-gradient(170deg,'+b.c+','+shade(b.c)+')';
    d.style.color=b.ink;
    var band=document.createElement('span'); band.className='band'; d.appendChild(band);
    var t=document.createElement('span'); t.className='bt'; t.textContent=b.t; d.appendChild(t);
    var a=document.createElement('span'); a.className='ba'; a.textContent=b.a; d.appendChild(a);
    core.appendChild(d); slabs.push(d);
  });
  function shade(hex){var c=hex.replace('#','');var r=Math.round(parseInt(c.substr(0,2),16)*0.62),g=Math.round(parseInt(c.substr(2,2),16)*0.62),b=Math.round(parseInt(c.substr(4,2),16)*0.62);return 'rgb('+r+','+g+','+b+')';}

  if(!reduce){
    var section=document.getElementById('stair');
    var N=slabs.length, ticking=false;
    var STEP_ANGLE=52*Math.PI/180, STEP_Y=70;
    function render(){
      ticking=false;
      var rect=section.getBoundingClientRect();
      var vh=window.innerHeight;
      var total=section.offsetHeight - vh;
      var p=Math.min(Math.max((-rect.top)/total,0),1);
      var spiral=Math.min(p/0.16,1);            // 0 = pile, 1 = full staircase
      spiral=spiral*spiral*(3-2*spiral);
      var rscale=Math.min(1, window.innerWidth/820);
      var R=120*rscale;
      var descend=p*(N+2.4)-1.2;                // camera index moving down
      for(var i=0;i<N;i++){
        var rel=i-descend;
        // staircase (helix) target
        var ang=rel*STEP_ANGLE;
        var sx=Math.sin(ang)*R;
        var depth=Math.cos(ang);                // 1 front, -1 back
        var sy=rel*STEP_Y*rscale;
        var sScale=(0.6+0.4*((depth+1)/2))*rscale;
        var sRot=-Math.sin(ang)*7;
        var sOp=Math.max(0,1-Math.abs(rel)/5.5)*(0.55+0.45*((depth+1)/2));
        // pile target (neat stack, slight wonk)
        var px=( (i%2)?1:-1 )*4;
        var py=(i-(N-1)/2)*15*rscale;
        var pScale=1*rscale;
        var pRot=(i%2?-2.2:2.2);
        var pOp=1;
        // blend
        var x=px+(sx-px)*spiral;
        var y=py+(sy-py)*spiral;
        var sc=pScale+(sScale-pScale)*spiral;
        var rot=pRot+(sRot-pRot)*spiral;
        var op=pOp+(sOp-pOp)*spiral;
        var d=slabs[i];
        d.style.transform='translate(-50%,-50%) translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) rotate('+rot.toFixed(2)+'deg) scale('+sc.toFixed(3)+')';
        d.style.opacity=op.toFixed(2);
        d.style.zIndex=String(200+Math.round(depth*100 - (spiral<0.5? -i:0)));
      }
    }
    window.addEventListener('scroll', function(){ if(!ticking){ticking=true; requestAnimationFrame(render);} }, {passive:true});
    window.addEventListener('resize', render);
    render();
  }
})();
