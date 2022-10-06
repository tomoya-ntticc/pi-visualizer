import './style.css'
import pi_string from './pi_one_million.txt?raw'
import settings_json from './settings.json'
import p5 from "p5";

const sketch = (p: p5) => {
  let is_debug = false;

  let frame_rate = settings_json.frame_rate;
  let canvas_x = p.windowWidth
  let canvas_y = p.windowHeight
  let isFullscreen = false;

  let line_width = settings_json.line_width;
  let line_height = p.windowHeight;
  let x_position = settings_json.x_position;
  let y_position = settings_json.y_position;;
  const variances = [1, 10, 100];
  let currentVariance = 0;

  let max_digit = 1000000; //432000;
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

  const draw_text = () => {
    let info_text = `
      frame_rate: ${frame_rate}
      current_frame_rate: ${p.round(p.frameRate())}\n
      line_width: ${line_width}
      x_position: ${x_position}
      y_position: ${y_position}\n
      variance: ${variances[currentVariance]}
    `;
    p.textAlign(p.LEFT, p.TOP);
    p.fill("#FFFFFF")
    p.textSize(50);
    p.text(info_text, 10, 10);
    console.info(info_text);
  }

  const load_settings = () => {
    frame_rate = settings_json.frame_rate;
    line_width = settings_json.line_width;
    x_position = settings_json.x_position;
    y_position = settings_json.y_position;

    p.frameRate(frame_rate);
  }

  const save_settings = () => {
    p.createStringDict({
      frame_rate: frame_rate,
      line_width: line_width,
      x_position: x_position,
      y_position: y_position,
    }).saveJSON()
  }

  let currentDigit = 0;
  let pi = arrange(get_PI(0, max_digit));

  p.setup = () => {
    p.createCanvas(canvas_x, canvas_y);
    p.frameRate(120);
    p.noCursor();

    load_settings();
  };

  p.draw = () => {
    p.push();
    p.background(p.color(DIGIT_COLORS[10]));
    p.fill(p.color(DIGIT_COLORS[pi[currentDigit]]));
    p.quad(x_position, y_position, x_position + line_width, 0, x_position + line_width, line_height, x_position, line_height - y_position - 58);
    p.pop();

    if (is_debug) {
      draw_text();
    }

    currentDigit++;
  };

  p.keyReleased = () => {
    is_debug = true;

    switch (p.key) {
      case "h":
        is_debug = !is_debug;
        break;
      case "f":
        isFullscreen = !isFullscreen;
        p.fullscreen(isFullscreen);
        is_debug = false;
        break;
      case "i":
        pi = arrange(get_PI(0, max_digit));
        currentDigit = 0;
        is_debug = false;
        break;
      case "r":
        frame_rate += 5;
        if (120 < frame_rate) {
          frame_rate = 5;
        }
        p.frameRate(frame_rate);
        break;
      case "v":
        currentVariance++;
        if (variances.length <= currentVariance) {
          currentVariance = 0;
        }
        break;
      case "<":
        line_width -= variances[currentVariance];
        if (line_width < 1) {
          line_width = 1;
        }
        break;
      case ">":
        line_width += variances[currentVariance];
        if (p.windowWidth < line_width) {
          line_width = p.windowWidth;
        }
        break;
      case "l":
        load_settings();
        break;
      case "s":
        save_settings();
        break;
    }

    switch (p.keyCode) {
      case p.UP_ARROW:
        y_position -= variances[currentVariance];
        if (y_position < 0) {
          y_position = 0;
        }
        break;
      case p.DOWN_ARROW:
        y_position += variances[currentVariance];
        if (p.windowHeight < y_position) {
          y_position = p.windowHeight;
        }
        break;
      case p.LEFT_ARROW:
        x_position -= variances[currentVariance];
        if (x_position < 0) {
          x_position = 0;
        }
        break;
      case p.RIGHT_ARROW:
        x_position += variances[currentVariance];
        if (p.windowWidth < x_position) {
          x_position = p.windowWidth;
        }
        break;
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    line_height = p.windowHeight;
  };
};

new p5(sketch);