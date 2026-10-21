const canvas = document.getElementById('clock');
const ctx = canvas.getContext('2d');

const SIZE = canvas.width;
const CENTER = SIZE / 2;
const RADIUS = CENTER - 4;

const BLACK = '#000000';
const GREEN = '#2ecc71';
const WHITE = '#ffffff';

// 四等分のうち 2 番目(15〜30分)と 4 番目(45〜60分)が休息時間
const REST_RANGES = [[15, 30], [45, 60]];

const isRest = (minute) => REST_RANGES.some(([from, to]) => minute >= from && minute < to);

// 分(0〜60)を canvas の角度に変換する。12時方向が 0 分、時計回り
const minuteToAngle = (minute) => (minute / 60) * Math.PI * 2 - Math.PI / 2;

function drawSector(from, to, color) {
  ctx.beginPath();
  ctx.moveTo(CENTER, CENTER);
  ctx.arc(CENTER, CENTER, RADIUS, minuteToAngle(from), minuteToAngle(to));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function draw() {
  const now = new Date();
  const minute = now.getMinutes() + now.getSeconds() / 60;
  const resting = isRest(now.getMinutes());

  ctx.clearRect(0, 0, SIZE, SIZE);

  // 鐘面: 全体を黒で塗り、休息中だけ休息時間の扇形を緑にする
  drawSector(0, 60, BLACK);
  if (resting) {
    REST_RANGES.forEach(([from, to]) => drawSector(from, to, GREEN));
  }

  // 四等分の境界線
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1;
  [0, 15, 30, 45].forEach((m) => {
    ctx.beginPath();
    ctx.moveTo(CENTER, CENTER);
    ctx.lineTo(
      CENTER + Math.cos(minuteToAngle(m)) * RADIUS,
      CENTER + Math.sin(minuteToAngle(m)) * RADIUS,
    );
    ctx.stroke();
  });

  // 中央の文字(休息中のみ)
  if (resting) {
    ctx.fillStyle = WHITE;
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('休息中', CENTER, CENTER);
  }

  // 分針
  const angle = minuteToAngle(minute);
  ctx.strokeStyle = WHITE;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(CENTER, CENTER);
  ctx.lineTo(CENTER + Math.cos(angle) * (RADIUS - 8), CENTER + Math.sin(angle) * (RADIUS - 8));
  ctx.stroke();
}

canvas.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  window.clock.showMenu();
});

draw();
setInterval(draw, 1000);
