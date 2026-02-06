let highestZ = 1;
const music = document.getElementById("bgMusic");
let musicStarted = false;

/* 🎶 start music safely */
function startMusicOnce() {
  if (musicStarted) return;
  musicStarted = true;

  music.volume = 0.5;
  music.play().catch(() => {});
}

/* start music on first user interaction */
document.addEventListener("click", startMusicOnce, { once: true });
document.addEventListener("touchstart", startMusicOnce, { once: true });

class Paper {
  holding = false;
  x = 0;
  y = 0;
  px = 0;
  py = 0;

  init(paper) {

    /* random table placement */
    const rx = Math.random() * 300 - 150;
    const ry = Math.random() * 200 - 100;
    const rr = Math.random() * 20 - 10;

    this.x = rx;
    this.y = ry;

    paper.style.transform =
      `translate(${rx}px, ${ry}px) rotate(${rr}deg)`;

    const start = (x, y) => {
      this.holding = true;
      paper.style.zIndex = highestZ++;
      this.px = x;
      this.py = y;
      paper.style.rotate = "0deg";
    };

    const move = (x, y) => {
      if (!this.holding) return;

      this.x += x - this.px;
      this.y += y - this.py;
      this.px = x;
      this.py = y;

      paper.style.transform =
        `translate(${this.x}px, ${this.y}px)`;
    };

    const end = () => {
      if (!this.holding) return;
      this.holding = false;
      paper.style.rotate = `${Math.random() * 20 - 10}deg`;
    };

    /* 🖱 Desktop */
    paper.addEventListener("mousedown", e => start(e.clientX, e.clientY));
    document.addEventListener("mousemove", e => move(e.clientX, e.clientY));
    window.addEventListener("mouseup", end);

    /* 📱 Mobile touch */
    paper.addEventListener("touchstart", e => {
      const t = e.touches[0];
      start(t.clientX, t.clientY);
    });
    paper.addEventListener("touchmove", e => {
      const t = e.touches[0];
      move(t.clientX, t.clientY);
    });
    paper.addEventListener("touchend", end);
  }
}

/* 💗 heart on click */
document.addEventListener("click", e => {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.innerText = "💗";
  heart.style.left = e.clientX + "px";
  heart.style.top = e.clientY + "px";
  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 1000);
});

/* init papers */
document.querySelectorAll(".paper").forEach(p => {
  new Paper().init(p);
});

/* 📸 Click (not drag) → fullscreen */
document.querySelectorAll(".paper").forEach(paper => {
  let moved = false;

  const markMove = () => moved = true;

  paper.addEventListener("mousedown", () => moved = false);
  paper.addEventListener("mousemove", markMove);

  paper.addEventListener("touchstart", () => moved = false);
  paper.addEventListener("touchmove", markMove);

  paper.addEventListener("click", e => {
    if (moved) return;   // ❌ drag tha, click nahi
    e.stopPropagation();

    const overlay = document.createElement("div");
    overlay.className = "fullscreen";

    /* clone whole polaroid (image + white bg + caption) */
    const clone = paper.cloneNode(true);

    overlay.appendChild(clone);
    document.body.appendChild(overlay);

    /* tap anywhere to close */
    overlay.addEventListener("click", () => overlay.remove());
  });
});


