import './style.css'
import pi_string from './pi_one_million.txt?raw'
import p5 from "p5";

const sketch = (p: p5) => {
  let frame_rate = 30;
  let canvas_x = p.windowWidth
  let canvas_y = p.windowHeight
  let isFullscreen = false;

  let line_width = 100;
  let line_height = p.windowHeight;
  let x_position = 1050;
  let y_position = 0;

  let max_digit = 432000;
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
    [0, 0, 0],
    [0, 0, 0] // for inserting black
  ];

  const get_PI = (start: number = 0, end: number = 512) => {
    return pi_string.split("").slice(start, end).map(s => parseInt(s, 10));
  }

  const arrange = (PI: number[]) => {
    let arranged_pi: number[] = [];
    for (const number of PI) {
      arranged_pi.push(10);
      arranged_pi.push(number);
    }
    return arranged_pi
  }

  let currentDigit = 0;
  let pi = arrange(get_PI(0, max_digit));

  p.setup = () => {
    p.frameRate(frame_rate);
    p.createCanvas(canvas_x, canvas_y);
  };

  p.draw = () => {
    p.push();
    p.background(p.color(BG_COLOR));
    p.fill(p.color(DIGIT_COLORS[pi[currentDigit]]));
    p.rect(x_position, y_position, line_width, line_height);
    p.pop();

    currentDigit++;
  };

  p.keyReleased = () => {
    if (p.key == "f") {
      isFullscreen = !isFullscreen;
      p.fullscreen(isFullscreen);
    }
    if (p.key == "i") {
      pi = arrange(get_PI(0, max_digit));
      currentDigit = 0;
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    line_height = p.windowHeight;
  };
};

new p5(sketch);