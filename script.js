(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = (window.matchMedia && window.matchMedia('(hover: none)').matches) || ('ontouchstart' in window);

  /* chrome sparkles (static field) */
  (function(){
    var f=document.getElementById('sparkles'); if(!f) return;
    var n=window.innerWidth<600?7:12, html='';
    for(var i=0;i<n;i++){
      var s=(6+Math.random()*16).toFixed(0),x=(Math.random()*100).toFixed(1),y=(Math.random()*100).toFixed(1),
          r=(Math.random()*60-30).toFixed(0),d=(Math.random()*4).toFixed(2);
      html+='<svg style="left:'+x+'%;top:'+y+'%;--r:'+r+'deg;animation-delay:'+d+'s" width="'+s+'" height="'+s+'"><use href="#spark"/></svg>';
    }
    f.innerHTML=html;
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
  var seen=new WeakSet();
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting && !seen.has(e.target)){ seen.add(e.target); countUp(e.target);} });},{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });

  /* decode-in headings */
  function textNodes(el){ var out=[], w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null); var n; while(n=w.nextNode()){ if(n.nodeValue.trim()) out.push(n); } return out; }
  function decode(el){
    var glyphs="ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/*#01";
    textNodes(el).forEach(function(node){
      var fin=node.nodeValue, frame=0;
      var iv=setInterval(function(){
        frame++; var out='';
        for(var i=0;i<fin.length;i++){
          if(fin[i]===' '){ out+=' '; }
          else if(i < frame*0.85){ out+=fin[i]; }
          else { out+=glyphs[Math.floor(Math.random()*glyphs.length)]; }
        }
        node.nodeValue=out;
        if(frame > fin.length*1.25){ node.nodeValue=fin; clearInterval(iv); }
      },30);
    });
  }
  var dseen=new WeakSet();
  if(!reduce){
    var dio=new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting && !dseen.has(e.target)){ dseen.add(e.target); decode(e.target); dio.unobserve(e.target);} });},{threshold:.5});
    document.querySelectorAll('[data-decode]').forEach(function(el){ dio.observe(el); });
  }

  /* magnetic buttons */
  if(!touch && !reduce){
    document.querySelectorAll('.btn').forEach(function(b){
      b.addEventListener('mousemove', function(e){
        var r=b.getBoundingClientRect();
        var mx=e.clientX-(r.left+r.width/2), my=e.clientY-(r.top+r.height/2);
        b.style.transform='translate('+(mx*0.25).toFixed(1)+'px,'+(my*0.4).toFixed(1)+'px)';
      });
      b.addEventListener('mouseleave', function(){ b.style.transform=''; });
    });
  }

  /* hero chrome star reacts to mouse */
  var hc=document.querySelector('.hero-chrome');
  if(hc && !touch && !reduce){
    document.addEventListener('mousemove', function(e){
      var cx=e.clientX/window.innerWidth-0.5, cy=e.clientY/window.innerHeight-0.5;
      hc.style.transform='rotate('+(cx*10).toFixed(2)+'deg) translate('+(cx*12).toFixed(1)+'px,'+(cy*12).toFixed(1)+'px)';
    }, {passive:true});
  }

  /* cursor sparkle trail */
  if(!touch && !reduce){
    var last=0;
    document.addEventListener('mousemove', function(e){
      var now=Date.now(); if(now-last<65) return; last=now;
      var s=document.createElement('div'); s.className='cursor-spark';
      s.style.left=(e.clientX-6)+'px'; s.style.top=(e.clientY-6)+'px';
      s.innerHTML='<svg width="12" height="12" viewBox="0 0 100 100"><use href="#spark"/></svg>';
      document.body.appendChild(s);
      var start=performance.now();
      (function anim(){
        var t=(performance.now()-start)/600;
        if(t>=1){ s.remove(); return; }
        s.style.opacity=String(1-t); s.style.transform='translateY('+(t*14).toFixed(1)+'px) scale('+(1-t*0.55).toFixed(3)+')';
        requestAnimationFrame(anim);
      })();
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

  /* vinyl player */
  var vinyl=document.getElementById('vinyl');
  if(vinyl){
    var vbtn=document.getElementById('vinylBtn'), vpop=document.getElementById('vinylPop'),
        vclose=document.getElementById('vinylClose'), vplayer=document.getElementById('vinylPlayer'), loaded=false;
    function open(){ if(!loaded){ vplayer.src=vplayer.getAttribute('data-src'); loaded=true; } vpop.classList.add('open'); vinyl.classList.add('playing'); }
    function close(){ vpop.classList.remove('open'); vinyl.classList.remove('playing'); }
    vbtn.addEventListener('click', function(){ vpop.classList.contains('open')?close():open(); });
    vclose.addEventListener('click', close);
    document.addEventListener('click', function(e){ if(vpop.classList.contains('open') && !vinyl.contains(e.target)) close(); });
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