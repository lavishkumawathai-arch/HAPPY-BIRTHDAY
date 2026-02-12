let highestZ = 1;
const music = document.getElementById("bgMusic");
const tapLayer = document.getElementById("tapToStart");

/* 🎶 start music safely */
tapLayer.addEventListener("click", () => {
  music.volume = 0.5;
  music.play().catch(() => {});
  tapLayer.remove();
});

/* ================= DRAG SYSTEM ================= */

class Paper {
  holding = false;
  x = 0;
  y = 0;
  px = 0;
  py = 0;
  moved = false;

  init(paper) {
    const rx = Math.random()*300-150;
    const ry = Math.random()*200-100;
    const rr = Math.random()*20-10;

    this.x = rx;
    this.y = ry;
    paper.style.transform = `translate(${rx}px,${ry}px) rotate(${rr}deg)`;

    const start = (x,y)=>{
      this.holding=true;
      this.moved=false;
      paper.style.zIndex=highestZ++;
      this.px=x;
      this.py=y;
    };

    const move = (x,y)=>{
      if(!this.holding) return;

      const dx = x - this.px;
      const dy = y - this.py;

      if(Math.abs(dx) > 5 || Math.abs(dy) > 5){
        this.moved = true;   // drag detected
      }

      this.x += dx;
      this.y += dy;
      this.px = x;
      this.py = y;

      paper.style.transform = `translate(${this.x}px,${this.y}px)`;
    };

    const end = ()=>{
      if(!this.holding) return;
      this.holding=false;
      paper.style.rotate = `${Math.random()*20-10}deg`;

      // 📸 TAP (not drag) → fullscreen
      if(!this.moved){
        openFullscreen(paper);
      }
    };

    /* Desktop */
    paper.addEventListener("mousedown",e=>start(e.clientX,e.clientY));
    document.addEventListener("mousemove",e=>move(e.clientX,e.clientY));
    window.addEventListener("mouseup",end);

    /* Mobile */
    paper.addEventListener("touchstart",e=>{
      const t=e.touches[0];
      start(t.clientX,t.clientY);
    }, { passive:false });

    paper.addEventListener("touchmove",e=>{
      const t=e.touches[0];
      move(t.clientX,t.clientY);
    }, { passive:false });

    paper.addEventListener("touchend",end);
  }
}

document.querySelectorAll(".paper").forEach(p=>{
  new Paper().init(p);
});

/* ================= FULLSCREEN ================= */

function openFullscreen(paper){
  const overlay = document.createElement("div");
  overlay.className="fullscreen";

  const clone = paper.cloneNode(true);
  overlay.appendChild(clone);
  document.body.appendChild(overlay);

  overlay.addEventListener("click",()=>overlay.remove());
}

/* ================= HEARTS ================= */

document.addEventListener("click",e=>{
  const h=document.createElement("div");
  h.className="heart";
  h.innerText="💗";
  h.style.left=e.clientX+"px";
  h.style.top=e.clientY+"px";
  document.body.appendChild(h);
  setTimeout(()=>h.remove(),1000);
});

/* ================= VIDEO ================= */

document.querySelectorAll(".video").forEach(v=>{
  v.addEventListener("click",e=>{
    e.stopPropagation();
    v.paused ? v.play() : v.pause();
  });
});