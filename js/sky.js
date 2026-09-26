(function(){
  const canvas=document.getElementById('skyCanvas');
  const ctx=canvas.getContext('2d');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w,h,stars=[],petals=[],shooters=[];
  function size(){w=canvas.width=window.innerWidth;h=canvas.height=window.innerHeight;}
  size(); window.addEventListener('resize',size);

  const starCount=Math.min(110,Math.floor(w/12));
  for(let i=0;i<starCount;i++){
    stars.push({x:Math.random()*w,y:Math.random()*h*0.7,r:Math.random()*1.5+.4,
      s:Math.random()*0.02+0.005,a:Math.random()*Math.PI*2});
  }

  const petalCount=reduced?10:Math.min(30,Math.floor(w/28));
  const petalColors=['#ffb3d9','#ffd9ec','#ffffff'];
  for(let i=0;i<petalCount;i++){
    petals.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*5+4,
      vy:Math.random()*0.6+0.35,vx:Math.random()*0.6-0.3,
      sway:Math.random()*Math.PI*2,swaySpeed:Math.random()*0.02+0.01,
      rot:Math.random()*Math.PI*2,rotSpeed:Math.random()*0.02-0.01,
      color:petalColors[i%petalColors.length]});
  }

  function spawnShooter(){
    shooters.push({x:Math.random()*w*0.6+w*0.2,y:Math.random()*h*0.25,
      vx:-(6+Math.random()*5),vy:3+Math.random()*3,life:0,max:40+Math.random()*20});
  }
  if(!reduced) setInterval(spawnShooter, 5000+Math.random()*4000);

  function drawPetal(p){
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);
    ctx.fillStyle=p.color;ctx.globalAlpha=0.85;
    ctx.beginPath();ctx.ellipse(0,0,p.r,p.r*0.6,0,0,Math.PI*2);ctx.fill();ctx.restore();
  }
  function drawShooter(s){
    const t=s.life/s.max;
    ctx.save();
    ctx.globalAlpha=Math.sin(Math.PI*t);
    const grad=ctx.createLinearGradient(s.x,s.y,s.x-s.vx*6,s.y-s.vy*6);
    grad.addColorStop(0,'#fff'); grad.addColorStop(1,'rgba(255,255,255,0)');
    ctx.strokeStyle=grad; ctx.lineWidth=2; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(s.x-s.vx*6,s.y-s.vy*6); ctx.stroke();
    ctx.restore();
  }

  function frame(){
    ctx.clearRect(0,0,w,h);
    for(const st of stars){
      st.a+=st.s;
      ctx.globalAlpha=0.4+Math.abs(Math.sin(st.a))*0.6;
      ctx.fillStyle='#fff';
      ctx.beginPath();ctx.arc(st.x,st.y,st.r,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
    for(const p of petals){
      p.sway+=p.swaySpeed; p.rot+=p.rotSpeed;
      p.x+=p.vx+Math.sin(p.sway)*0.4; p.y+=p.vy;
      if(p.y>h+10){p.y=-10;p.x=Math.random()*w;}
      if(p.x>w+10)p.x=-10; if(p.x<-10)p.x=w+10;
      drawPetal(p);
    }
    for(let i=shooters.length-1;i>=0;i--){
      const s=shooters[i]; s.x+=s.vx; s.y+=s.vy; s.life++;
      drawShooter(s);
      if(s.life>=s.max) shooters.splice(i,1);
    }
    requestAnimationFrame(frame);
  }
  frame();
})();
