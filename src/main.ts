import './style.css'
import pi_string from './pi_one_million.txt?raw'
import p5, { Color } from "p5";

const isDebug = true;
let isExporting = false;

type Pixel = {
  pos: {
    x: number;
    y: number;
  };
  number: number;
  color: Color;
};

const sketch = (p: p5) => {
  let canvas_x = 1920; // p.windowWidth
  let canvas_y = 1080; // p.windowHeight
  let isFullscreen = false;
  let hiddenCenterDot = false;

  const PIXEL_SIZES = [9, 11, 21, 31, 51];
  const CENTER_DOT_SIZES = [3, 3, 5, 7, 11];
  let current_size = 2;
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
    let max_number;
    if (x_or_y == "x") {
      max_number = Math.floor(canvas_x / PIXEL_SIZES[current_size]);
      if (128 < max_number) {
        return 128;
      }
      else {
        return max_number;
      }
    }
    else {
      max_number = Math.floor(canvas_y / PIXEL_SIZES[current_size]);
      if (96 < max_number) {
        return 96;
      }
      else {
        return max_number;
      }
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

  let max_x_number = 68; //128; //get_max_number(PIXEL_SIZES[current_size], "x");
  let max_y_number = 51; //96; //get_max_number(PIXEL_SIZES[current_size], "y");
  let max_digit = max_x_number * max_y_number
  let currentDigit = 0;

  let offset_x = (canvas_x - (PIXEL_SIZES[current_size] * max_x_number)) / 2;
  let offset_y = (canvas_y - (PIXEL_SIZES[current_size] * max_y_number)) / 2;

  let PI = get_PI(0, max_digit);

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
      p.rect(pixel.pos.x, pixel.pos.y, PIXEL_SIZES[current_size], PIXEL_SIZES[current_size]);
      if (!hiddenCenterDot) {
        p.fill(BG_COLOR);
        p.rect(pixel.pos.x + Math.floor((PIXEL_SIZES[current_size] - CENTER_DOT_SIZES[current_size]) / 2), pixel.pos.y + Math.floor((PIXEL_SIZES[current_size] - CENTER_DOT_SIZES[current_size]) / 2), CENTER_DOT_SIZES[current_size], CENTER_DOT_SIZES[current_size]);
      }
    })
  }

  /** 初期化処理 */
  p.setup = () => {
    p.frameRate(5);
    p.createCanvas(canvas_x, canvas_y);
  };

  /** フレームごとの描画処理 */
  p.draw = () => {
    if (currentDigit < 300) {//max_digit) {
      p.push();
      p.background(p.color(BG_COLOR));
      pixels = [];
      for (const [index, number] of PI.entries()) {
        const x_pos = (index % max_x_number) * PIXEL_SIZES[current_size] + offset_x
        const y_pos = Math.floor(index / max_x_number) * PIXEL_SIZES[current_size] + offset_y;
        addPixel(number, x_pos, y_pos)
      }
      drawPixels()
      p.translate(50, 50);
      p.pop();
      if (isExporting) {
        let filename = "pi-" + ('00000' + currentDigit).slice(-5) + ".png";
        p.save(filename);
        console.log("exported " + filename);
      }
      rotate_PI(PI)
      currentDigit++;
    }
    else {
      console.log("finished rotating all digits");
    }
    if (isDebug) {
      console.log("PI.length:" + PI.length + ", framerate: " + p.frameRate());
    }
  };

  p.keyReleased = () => {
    if (p.key == "f") {
      isFullscreen = !isFullscreen;
      p.fullscreen(isFullscreen);
    }
    if (p.key == "i") {
      PI = get_PI(0, max_digit);
      currentDigit = 0;
    }
    if (p.key == "s") {
      PI = get_PI(0, max_digit);
      isExporting = true;
      currentDigit = 0;
    }
  }

  p.touchEnded = () => {
    if (current_size < PIXEL_SIZES.length - 1) {
      current_size++;
    }
    else {
      current_size = 0;
    }
  }

  // p.windowResized = () => {
  //   p.resizeCanvas(p.windowWidth, p.windowHeight);
  //   max_x_number = get_max_number(PIXEL_SIZES[current_size], "x");
  //   max_y_number = get_max_number(PIXEL_SIZES[current_size], "y");
  //   PI = get_PI(0, max_digit);
  //   p.background(p.color(BG_COLOR));
  // };
};

new p5(sketch);