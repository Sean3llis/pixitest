import { EventEmitter } from "eventemitter3";

export const FILE_UPLOADED = 'FILE_UPLOADED';

export default class PixiClient extends EventEmitter {
  constructor(w, h) {
    super();
    const PIXI = this.PIXI = window.PIXI;
    this.pixi = new PIXI.Application({ width: w, height: h });
    this.w = w;
    this.h = h;
    this.masterLoop = this.pixi.ticker.add(this.masterLoop);
    this.bindEvents();
  }

  masterLoop = (delta) => {
    // tick tick tick
  }

  bindEvents = () => {
    this.on(FILE_UPLOADED, this.handleFileUploaded)
    window.addEventListener('resize', this.resize);
  }

  handleFileUploaded = (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.placeFile(file);
    }
  }

  resize = () => {
    const pixi = this.pixi;
    const parent = pixi.view.parentNode;
    this.w = parent.clientWidth;
    this.h = parent.clientHeight;
    pixi.renderer.resize(parent.clientWidth, parent.clientHeight);
  }
  
  placeFile = (file) => {
    const PIXI = this.PIXI;
    const pixi = this.pixi;
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result;
      const image = new Image();
      image.src = dataURL;
      image.onload = () => {
        const base = new PIXI.BaseTexture(image);
        const texture = new PIXI.Texture(base);
        const sprite = this.pic = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5, 0.5);
        sprite.position.set(this.w / 2, this.h / 2);
        pixi.stage.addChild(sprite);
      }
    };
    reader.readAsDataURL(file);
  }

  static getInstance(w, h) {
    if (this.instance) return this.instance;
    this.instance = new PixiClient(w, h);
    return this.instance;
  }
}