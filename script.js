(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = (window.matchMedia && window.matchMedia('(hover: none)').matches) || ('ontouchstart' in window);

  /* ambient sparkles are now hand-placed constellations in the HTML — nothing to generate here */

  /* staggered cascade — group reveal siblings get incremental delay */
  (function(){
    function stagger(selector, step){
      document.querySelectorAll(selector).forEach(function(group){
        Array.prototype.forEach.call(group.children, function(child, i){
          if(child.classList && child.classList.contains('reveal')) child.style.transitionDelay=(i*step)+'ms';
        });
      });
    }
    stagger('.projects', 70);
    stagger('.skills', 60);
  })();

  /* reveal */
  var rev=document.querySelectorAll('.reveal');
  if(reduce){ rev.forEach(function(el){el.classList.add('in');}); }
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });},{threshold:.14, rootMargin:'0px 0px -40px 0px'});
    rev.forEach(function(el){ io.observe(el); });
  }

  /* count-up (chrome stats) */
  function countUp(el){
    var end=parseFloat(el.getAttribute('data-count')), suf=el.getAttribute('data-suffix')||'';
    if(reduce){ el.textContent=end+suf; return; }
    var t0=null;
    function step(ts){ if(!t0)t0=ts; var p=Math.min((ts-t0)/1000,1); el.textContent=Math.round(end*p)+suf; if(p<1)requestAnimationFrame(step); else el.textContent=end+suf; }
    requestAnimationFrame(step);
  }
  /* dotted quantification meter — fills to data-fill%, restartable */
  function fillMeter(project){
    var fill=project.querySelector('.stat-meter-fill'); if(!fill) return;
    fill.style.setProperty('--fill', fill.getAttribute('data-fill')||0);
    project.classList.remove('meter-in');
    void project.offsetWidth; /* force reflow so the transition restarts cleanly */
    project.classList.add('meter-in');
  }
  var seen=new WeakSet();
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting && !seen.has(e.target)){ seen.add(e.target); e.target.classList.add('in'); countUp(e.target); var proj=e.target.closest('.project'); if(proj) fillMeter(proj);} });},{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });

  /* typewriter — text types in left-to-right with a blinking cursor, no scramble */
  function textNodes(el){ var out=[], w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null); var n; while(n=w.nextNode()){ if(n.nodeValue.trim()) out.push(n); } return out; }
  function typewriter(el){
    var nodes=textNodes(el), originals=nodes.map(function(n){ return n.nodeValue; });
    nodes.forEach(function(n){ n.nodeValue=''; });
    el.classList.add('typing');
    var nodeIndex=0, charIndex=0;
    var iv=setInterval(function(){
      if(nodeIndex>=nodes.length){ clearInterval(iv); el.classList.remove('typing'); return; }
      charIndex++;
      nodes[nodeIndex].nodeValue=originals[nodeIndex].slice(0,charIndex);
      if(charIndex>=originals[nodeIndex].length){ nodeIndex++; charIndex=0; }
    },70);
  }
  var twSeen=new WeakSet();
  if(reduce){
    document.querySelectorAll('.typewrite').forEach(function(el){ /* leave full text as-is */ });
  } else {
    var twIO=new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting && !twSeen.has(e.target)){ twSeen.add(e.target); typewriter(e.target); twIO.unobserve(e.target);} });},{threshold:.5});
    document.querySelectorAll('.typewrite').forEach(function(el){ twIO.observe(el); });
  }

  /* MacroLens — rotate through 3 scanned items every 5s, bars swap with the values */
  function initMacroDemo(root){
    var sets=[
      {label:'Trail mix · 40g', kcal:'234', protein:'18g', fat:'9g', carb:'31g', bars:[38,80,55,95,42,70,30,88,60,48]},
      {label:'Greek yogurt · 170g', kcal:'150', protein:'15g', fat:'4g', carb:'11g', bars:[60,35,90,50,75,40,85,55,30,65]},
      {label:'Chicken breast · 100g', kcal:'165', protein:'31g', fat:'4g', carb:'0g', bars:[45,70,25,95,60,40,80,50,65,35]}
    ];
    var labelEl=root.querySelector('.ml-item-label');
    var statEls=root.querySelectorAll('.ml-stat b');
    var bars=root.querySelectorAll('.ml-barcode span:not(.ml-scanline)');
    if(!labelEl||!statEls.length||!bars.length) return;
    function apply(s){
      labelEl.textContent=s.label;
      statEls[0].textContent=s.kcal; statEls[1].textContent=s.protein; statEls[2].textContent=s.fat; statEls[3].textContent=s.carb;
      bars.forEach(function(b,j){ b.style.height=(s.bars[j]||50)+'%'; });
    }
    if(reduce){ apply(sets[0]); return; }
    var idx=0;
    setInterval(function(){
      idx=(idx+1)%sets.length;
      labelEl.style.opacity=0; statEls.forEach(function(el){ el.style.opacity=0; });
      setTimeout(function(){
        apply(sets[idx]);
        labelEl.style.opacity=1; statEls.forEach(function(el){ el.style.opacity=1; });
      },320);
    },5000);
  }

  /* COAT — cycle through example emails, animating each category's confidence bar (showcases the classifier itself) */
  function initCoatDemo(root){
    var examples=[
      {subj:'Re: SWE Intern — Offer!', offer:88, interview:9, reject:3},
      {subj:'Interview availability next week?', offer:6, interview:83, reject:11},
      {subj:'Thank you for your application', offer:2, interview:5, reject:93}
    ];
    var subjEl=root.querySelector('.coat-email-subj');
    var rows={offer:root.querySelector('.coat-bar-row-offer'), interview:root.querySelector('.coat-bar-row-interview'), reject:root.querySelector('.coat-bar-row-reject')};
    var fills={offer:root.querySelector('.coat-bar-offer'), interview:root.querySelector('.coat-bar-interview'), reject:root.querySelector('.coat-bar-reject')};
    if(!subjEl||!rows.offer) return;
    function apply(ex){
      subjEl.textContent=ex.subj;
      ['offer','interview','reject'].forEach(function(k){
        fills[k].style.width=ex[k]+'%';
        var pct=rows[k].querySelector('.coat-bar-pct'); if(pct) pct.textContent=ex[k]+'%';
      });
      var top=Object.keys(rows).reduce(function(a,b){ return ex[a]>=ex[b]?a:b; });
      Object.keys(rows).forEach(function(k){ rows[k].classList.toggle('winner', k===top); });
    }
    apply(examples[0]);
    if(reduce) return;
    var idx=0;
    setInterval(function(){
      idx=(idx+1)%examples.length;
      subjEl.style.opacity=0;
      setTimeout(function(){ apply(examples[idx]); subjEl.style.opacity=1; },260);
    },5000);
  }

  /* SignSpeak caption — loops through a few fingerspelled phrases */
  function initSignCaption(el, phrases){
    if(reduce){ el.textContent=phrases[0]; return; }
    var pi=0;
    function cycle(){
      var text=phrases[pi], ci=0;
      el.textContent='';
      var typeIv=setInterval(function(){
        ci++; el.textContent=text.slice(0,ci);
        if(ci>=text.length){
          clearInterval(typeIv);
          setTimeout(function(){
            var eraseIv=setInterval(function(){
              el.textContent=el.textContent.slice(0,-1);
              if(el.textContent.length===0){ clearInterval(eraseIv); pi=(pi+1)%phrases.length; setTimeout(cycle,300); }
            },35);
          },1300);
        }
      },80);
    }
    cycle();
  }

  /* project sneak-peek demos — start animating once scrolled into view, respect reduced motion */
  var demos=document.querySelectorAll('.p-demo');
  function initDemo(el){
    if(el.classList.contains('demo-mlens')) initMacroDemo(el);
    if(el.classList.contains('demo-coat')) initCoatDemo(el);
    if(el.classList.contains('demo-signspeak')){ var cap=el.querySelector('.ss-caption'); if(cap) initSignCaption(cap, ['HELLO', "I'M PARIDHI", 'PLEASE HIRE ME']); }
  }
  if(reduce){ demos.forEach(function(el){ el.classList.add('play'); initDemo(el); }); }
  else{
    var dio=new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('play'); initDemo(e.target); dio.unobserve(e.target);} });},{threshold:.35});
    demos.forEach(function(el){ dio.observe(el); });
  }

  /* chrome cursor star — a smooth, glitch-free shimmer trail (no rotation jitter) */
  if(!touch && !reduce){
    var lead=document.createElement('div');
    lead.className='cursor-lead';
    lead.innerHTML='<svg width="26" height="26" viewBox="0 0 100 100"><use href="#spark"/></svg>';
    document.body.appendChild(lead);

    var tx=window.innerWidth/2, ty=window.innerHeight/2, lx=tx, ly=ty, shown=false;
    document.addEventListener('mousemove', function(e){
      tx=e.clientX; ty=e.clientY;
      if(!shown){ shown=true; lead.classList.add('on'); }
    }, {passive:true});

    (function raf(){
      lx += (tx-lx)*0.16; ly += (ty-ly)*0.16;
      lead.style.transform='translate('+lx.toFixed(1)+'px,'+ly.toFixed(1)+'px)';
      requestAnimationFrame(raf);
    })();

    var last=0;
    document.addEventListener('mousemove', function(e){
      var now=Date.now(); if(now-last<75) return; last=now;
      var s=document.createElement('div'); s.className='cursor-spark';
      s.style.left=(e.clientX-6)+'px'; s.style.top=(e.clientY-6)+'px';
      s.innerHTML='<svg width="12" height="12" viewBox="0 0 100 100"><use href="#spark"/></svg>';
      document.body.appendChild(s);
      var start=performance.now();
      (function anim(){
        var t=(performance.now()-start)/900;
        if(t>=1){ s.remove(); return; }
        s.style.opacity=String((1-t)*.75); s.style.transform='translateY('+(t*14).toFixed(1)+'px) scale('+(1-t*0.5).toFixed(3)+')';
        requestAnimationFrame(anim);
      })();
    }, {passive:true});

    /* dust — a dense scatter of tiny white dots for a shimmery, sparkly trail */
    var lastDust=0;
    document.addEventListener('mousemove', function(e){
      var now=Date.now(); if(now-lastDust<26) return; lastDust=now;
      var n=1+Math.floor(Math.random()*2);
      for(var k=0;k<n;k++){
        var d=document.createElement('div'); d.className='cursor-dust';
        var ox=(Math.random()*22-11), oy=(Math.random()*22-11), sz=(1.5+Math.random()*2.2).toFixed(1);
        d.style.left=(e.clientX+ox)+'px'; d.style.top=(e.clientY+oy)+'px';
        d.style.width=sz+'px'; d.style.height=sz+'px';
        document.body.appendChild(d);
        (function(el,driftX,driftY){
          var st=performance.now();
          (function anim(){
            var t=(performance.now()-st)/620;
            if(t>=1){ el.remove(); return; }
            el.style.opacity=String((1-t)*.9);
            el.style.transform='translate('+(driftX*t).toFixed(1)+'px,'+(driftY*t-t*10).toFixed(1)+'px) scale('+(1-t*0.4).toFixed(3)+')';
            requestAnimationFrame(anim);
          })();
        })(d, (Math.random()*16-8), (Math.random()*10));
      }
    }, {passive:true});
  }

  /* parallax */
  if(!reduce){
    var sf=document.getElementById('sparkles'), stars=document.querySelector('.sky .stars'), ticking=false;
    window.addEventListener('scroll', function(){
      if(ticking) return; ticking=true;
      requestAnimationFrame(function(){
        var y=window.scrollY;
        if(sf) sf.style.transform='translateY('+(y*0.14).toFixed(1)+'px)';
        if(stars) stars.style.transform='translateY('+(y*0.06).toFixed(1)+'px)';
        ticking=false;
      });
    }, {passive:true});
  }

  /* hero star — a gentle, smooth tilt toward the pointer */
  var heroStar=document.getElementById('heroStar');
  if(heroStar && !touch && !reduce){
    var hsx=0, hsy=0, hlx2=0, hly2=0;
    heroStar.addEventListener('mousemove', function(e){
      var r=heroStar.getBoundingClientRect();
      hsx=(e.clientX-(r.left+r.width/2))/r.width;
      hsy=(e.clientY-(r.top+r.height/2))/r.height;
    });
    heroStar.addEventListener('mouseleave', function(){ hsx=0; hsy=0; });
    var dotstar=heroStar.querySelector('.hero-figure');
    (function raf2(){
      hlx2 += (hsx-hlx2)*0.07; hly2 += (hsy-hly2)*0.07;
      if(dotstar) dotstar.style.transform='rotate('+(hlx2*8).toFixed(2)+'deg) scale('+(1+Math.abs(hly2)*0.025).toFixed(3)+')';
      requestAnimationFrame(raf2);
    })();
  }

  /* playlist player — pill opens into the whole embedded playlist */
  var player=document.getElementById('player');
  if(player){
    var pill=document.getElementById('playerPill'), panel=document.getElementById('playerPanel'),
        pclose=document.getElementById('playerClose'), pframe=document.getElementById('playerFrame'), loaded=false;
    function open(){ if(!loaded){ pframe.src=pframe.getAttribute('data-src'); loaded=true; } panel.classList.add('open'); player.classList.add('playing'); }
    function close(){ panel.classList.remove('open'); player.classList.remove('playing'); }
    pill.addEventListener('click', function(){ panel.classList.contains('open')?close():open(); });
    pclose.addEventListener('click', close);
    document.addEventListener('click', function(e){ if(panel.classList.contains('open') && !player.contains(e.target)) close(); });
  }

  /* rec forms -> mailto */
  function wire(fid, okid, subject, build){
    var f=document.getElementById(fid); if(!f) return;
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var d={}; new FormData(f).forEach(function(v,k){ d[k]=v; });
      window.location.href='mailto:pasaboo@uwaterloo.ca?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(build(d));
      var ok=document.getElementById(okid); if(ok) ok.textContent='Opening your mail — thank you.'; f.reset();
    });
  }
  wire('songForm','s-ok','A track for Paridhi', function(d){ return (d.song||'')+'\n\n— '+(d.name||'a friend'); });
  wire('bookForm','b-ok','A book for Paridhi', function(d){ return (d.title||'')+'\n\n— a friend'; });
})();