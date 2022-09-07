import './style.css'
import p5, { Color } from "p5";

/** バブルの情報を定義する型 */
type Pixcel = {
  /** 位置（画面サイズに対する0〜1の相対位置） */
  pos: {
    x: number;
    y: number;
  };
  number: number;
  color: Color;
};

const sketch = (p: p5) => {
  const PI = "31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624".split("").map(s => parseInt(s, 10));

  // const MAX_DIGITS = 512;
  const PIXEL_SIZE = 11;
  const BG_COLOR = "#171d21";
  const DIGIT_COLORS = ["#ffffff", "#ffa500", "#ffff00", "#008000", "#006400", "#191970", "#dda0dd", "#b22222", "#f0e68c", "#000000"];
  const pixels: Pixcel[] = [];

  let isFullscreen = false;

  const addPixel = (number: number, x: number, y: number) => {
    pixels.push({
      pos: {x, y},
      number: number,
      color: p.color(DIGIT_COLORS[number])
    })

  }

  const drawPixels = () => {
    pixels.forEach((pixel) => {
      p.stroke(pixel.color);
      p.fill(pixel.color);
      p.rect(pixel.pos.x, pixel.pos.y, PIXEL_SIZE, PIXEL_SIZE);
      p.stroke(BG_COLOR);
      p.rect(pixel.pos.x + Math.floor(PIXEL_SIZE/2), pixel.pos.y + Math.floor(PIXEL_SIZE/2), 1, 1)
    })
  }

  /** 初期化処理 */
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  /** フレームごとの描画処理 */
  p.draw = () => {
    let x_number = Math.floor(p.windowWidth / PIXEL_SIZE)
    p.push();
    p.background(p.color(BG_COLOR));
    // p.blendMode(p.SCREEN);
    for (const [index, number] of PI.entries()) {
      const x_pos = (index % x_number) * (PIXEL_SIZE + 1)
      const y_pos = Math.floor(index / x_number) * (PIXEL_SIZE + 1)
      addPixel(number, x_pos, y_pos)
    }
    drawPixels()
    p.pop();
  };

  p.keyReleased = () => {
    if (p.key == "f") {
      isFullscreen = !isFullscreen
      p.fullscreen(isFullscreen)
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(sketch);