import './style.css'
import pi_string from './pi_one_million.txt?raw'
import p5, { Color } from "p5";

const isDebug = false;

type Pixel = {
  pos: {
    x: number;
    y: number;
  };
  number: number;
  color: Color;
};

const sketch = (p: p5) => {
  const frameRates = [1, 2, 5, 10, 20, 30, 60]
  let currentFrameRate = 5;

  let isFullscreen = false;
  let hiddenCenterDot = false;

  const PIXEL_SIZE = 11;
  const CENTER_DOT_SIZE = 3;
  const BG_COLOR = "#171d21";
  const DIGIT_COLORS = [
    [255, 255, 255],
    [255, 195, 0],
    [255, 255, 0],
    [0, 255, 0],
    [0, 120, 10],
    [0, 0, 255],
    [160, 50, 255],
    [255, 0, 100],
    [255, 175, 175],
    [0, 0, 0]
  ];

  const get_max_number = (PIXEL_SIZE: number, x_or_y: string) => {
    if (x_or_y == "x") {
      return Math.floor(p.windowWidth / PIXEL_SIZE)
    }
    else {
      return Math.floor(p.windowHeight / PIXEL_SIZE)
    }
  }

  const get_PI = (start: number = 0, end: number = 512) => {
    return pi_string.split("").slice(start, end).map(s => parseInt(s, 10));
  }

  const rotate_PI = (PI: number[]) => {
    const first = PI.shift();
    if (first != undefined) {
      PI.push(first);
    }
    return PI
  }

  let PI = get_PI(0, get_max_number(PIXEL_SIZE, "x") * get_max_number(PIXEL_SIZE, "y"));
  let pixels: Pixel[] = [];

  const addPixel = (number: number, x: number, y: number) => {
    pixels.push({
      pos: {x, y},
      number: number,
      color: p.color(DIGIT_COLORS[number])
    })
  }

  const drawPixels = () => {
    p.noStroke();
    pixels.forEach((pixel) => {
      p.fill(pixel.color);
      p.rect(pixel.pos.x, pixel.pos.y, PIXEL_SIZE, PIXEL_SIZE);
      if (!hiddenCenterDot) {
        p.fill(BG_COLOR);
        p.rect(pixel.pos.x + Math.floor((PIXEL_SIZE - CENTER_DOT_SIZE) / 2), pixel.pos.y + Math.floor((PIXEL_SIZE - CENTER_DOT_SIZE) / 2), CENTER_DOT_SIZE, CENTER_DOT_SIZE);
      }
    })
  }

  /** 初期化処理 */
  p.setup = () => {
    p.frameRate(frameRates[currentFrameRate]);
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  /** フレームごとの描画処理 */
  p.draw = () => {
    p.push();
    p.background(p.color(BG_COLOR));
    rotate_PI(PI)
    // console.log("PI.length:" + PI.length);
    pixels = [];
    for (const [index, number] of PI.entries()) {
      const x_pos = (index % get_max_number(PIXEL_SIZE, "x")) * PIXEL_SIZE
      const y_pos = Math.floor(index / get_max_number(PIXEL_SIZE, "x")) * PIXEL_SIZE;
      addPixel(number, x_pos, y_pos)
    }
    drawPixels()
    p.pop();
    if (isDebug) {
      console.log("framerate: " + p.frameRate());
    }
  };

  p.keyReleased = () => {
    if (p.key == "f") {
      isFullscreen = !isFullscreen
      p.fullscreen(isFullscreen)
    }
    if (p.key == "i") {
      PI = get_PI(0, get_max_number(PIXEL_SIZE, "x") * get_max_number(PIXEL_SIZE, "y"))
    }
  }

  p.touchEnded = () => {
    if (currentFrameRate < frameRates.length) {
      currentFrameRate++;
    }
    else {
      currentFrameRate = 0;
    }
    p.frameRate(frameRates[currentFrameRate]);
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    PI = get_PI(0, get_max_number(PIXEL_SIZE, "x") * get_max_number(PIXEL_SIZE, "y"));
    p.background(p.color(BG_COLOR));
  };
};

new p5(sketch);