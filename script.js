(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* chrome sparkles, sparse + deliberate */
  (function(){
    var f = document.getElementById('sparkles'); if(!f) return;
    var n = window.innerWidth < 600 ? 7 : 11;
    var html = '';
    for(var i=0;i<n;i++){
      var s=(6+Math.random()*16).toFixed(0), x=(Math.random()*100).toFixed(1), y=(Math.random()*100).toFixed(1),
          r=(Math.random()*60-30).toFixed(0), d=(Math.random()*4).toFixed(2);
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