// ---- typewriter ----
(function(){
  const el=document.getElementById('typewriter');
  const phrases=['Happy Birthday, Sudeep','Make A Wish ✨','Have The Best Year Yet 🌙'];
  let p=0;
  async function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
  async function cycle(){
    const text=phrases[p%phrases.length];
    for(let i=1;i<=text.length;i++){el.textContent=text.slice(0,i);await sleep(70+Math.random()*40);}
    await sleep(1200);
    for(let i=text.length;i>=0;i--){el.textContent=text.slice(0,i);await sleep(35+Math.random()*20);}
    await sleep(300);
    p++;
  }
  (async function loop(){while(true){await cycle();}})();
})();

// ---- gallery cube ----
(function(){
  let index=0;
  const cube=document.getElementById('cube');
  const prevBtn=document.getElementById('prevImg');
  const nextBtn=document.getElementById('nextImg');
  function update(){cube.style.transform=`rotateY(${index*-90}deg)`;}
  function next(){index++;update();}
  function prev(){index--;update();}
  nextBtn.addEventListener('click',next);
  prevBtn.addEventListener('click',prev);
  let dragging=false,startX=0;
  cube.addEventListener('pointerdown',e=>{dragging=true;startX=e.clientX;cube.setPointerCapture(e.pointerId);});
  cube.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-startX;if(Math.abs(dx)>40){dx<0?next():prev();startX=e.clientX;}});
  cube.addEventListener('pointerup',e=>{dragging=false;try{cube.releasePointerCapture(e.pointerId);}catch(_){}});
  cube.addEventListener('pointercancel',()=>dragging=false);
  let tStartX=0;
  cube.addEventListener('touchstart',e=>{tStartX=e.touches[0].clientX;},{passive:true});
  cube.addEventListener('touchend',e=>{
    const tx=(e.changedTouches&&e.changedTouches[0])?e.changedTouches[0].clientX:0;
    const diff=tx-tStartX; if(Math.abs(diff)>40){diff<0?next():prev();}
  });
  document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')next();if(e.key==='ArrowLeft')prev();});
  update();
})();

// ---- flip card + sparkle burst ----
(function(){
  const card=document.getElementById('card');
  const btn=document.getElementById('toggleButton');
  const container=document.getElementById('cardContainer');
  function burst(){
    if(typeof confetti!=='function')return;
    const rect=container.getBoundingClientRect();
    confetti({
      particleCount:60,spread:70,startVelocity:28,scalar:.7,
      origin:{x:(rect.left+rect.width/2)/window.innerWidth,y:(rect.top+rect.height/2)/window.innerHeight},
      colors:['#ffb3d9','#c9a7ff','#ffd166','#fff6fb']
    });
  }
  function flip(){card.classList.toggle('flipped');if(card.classList.contains('flipped'))burst();}
  btn.addEventListener('click',e=>{e.stopPropagation();flip();});
  container.addEventListener('click',flip);
})();

// ---- sparkles in wish card ----
(function(){
  const box=document.getElementById('sparkles');
  for(let i=0;i<14;i++){
    const s=document.createElement('span');
    s.style.left=Math.random()*100+'%';
    s.style.top=Math.random()*100+'%';
    s.style.animationDelay=(Math.random()*2.6)+'s';
    box.appendChild(s);
  }
})();

// ---- floating CSS petals (guaranteed-visible ambient layer) ----
(function(){
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count=reduced?6:16;
  const colors=['#ffb3d9','#ffd9ec','#ffffff','#ffd166'];
  for(let i=0;i<count;i++){
    const p=document.createElement('div');
    p.className='petal-css';
    const size=6+Math.random()*7;
    p.style.left=Math.random()*100+'vw';
    p.style.width=size+'px';
    p.style.height=size*1.3+'px';
    p.style.background=colors[i%colors.length];
    p.style.animationDuration=(9+Math.random()*10)+'s';
    p.style.animationDelay=(-Math.random()*18)+'s';
    document.body.appendChild(p);
  }
})();

// ---- 3D pointer tilt for .tilt elements ----
(function(){
  const els=document.querySelectorAll('.tilt');
  if(!els.length)return;
  const isTouch=window.matchMedia('(hover: none)').matches;
  els.forEach((el,idx)=>{
    if(!isTouch){
      el.addEventListener('pointermove',e=>{
        const r=el.getBoundingClientRect();
        const px=(e.clientX-r.left)/r.width-0.5;
        const py=(e.clientY-r.top)/r.height-0.5;
        el.style.transform=`perspective(900px) rotateY(${px*14}deg) rotateX(${-py*14}deg) scale(1.02)`;
      });
      el.addEventListener('pointerleave',()=>{ el.style.transform=''; });
    }else{
      let t=idx*1.3;
      setInterval(()=>{
        t+=0.04;
        el.style.transform=`perspective(900px) rotateY(${Math.sin(t)*6}deg) rotateX(${Math.cos(t*0.8)*4}deg)`;
      },60);
    }
  });
})();

// ---- scroll reveal (IntersectionObserver + safety fallback) ----
(function(){
  const items=document.querySelectorAll('.reveal');
  function show(el){el.classList.add('in');}
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{ if(entry.isIntersecting){ show(entry.target); io.unobserve(entry.target); } });
    },{threshold:0.15,rootMargin:'0px 0px -6% 0px'});
    items.forEach(el=>io.observe(el));
  }else{
    items.forEach(show);
  }
  // safety net: never let something stay invisible forever
  setTimeout(()=>{items.forEach(el=>{
    const r=el.getBoundingClientRect();
    if(r.top < window.innerHeight+400) show(el);
  });},1500);
})();

// ---- confetti burst on load ----
window.addEventListener('load',()=>{
  if(typeof confetti==='function'){
    confetti({particleCount:160,spread:110,origin:{y:.15},
      colors:['#ffb3d9','#c9a7ff','#ffd166','#fff6fb']});
  }
});
