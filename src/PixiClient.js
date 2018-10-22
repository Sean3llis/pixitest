import { EventEmitter } from "eventemitter3";
import { makeDraggable, fitSprite } from "./utils";

export const FILE_UPLOADED = 'FILE_UPLOADED';
export const SPRITE_ADDED = 'SPRITE_ADDED'

export default class PixiClient extends EventEmitter {
  constructor(w, h) {
    super();
    const PIXI = this.PIXI = window.PIXI;
    this.pixi = new PIXI.Application({ width: w, height: h });
    window.p = this.pixi;
    this.w = w;
    this.h = h;
    this.masterLoop = this.pixi.ticker.add(this.masterLoop);
    this.bindEvents();
  }

  masterLoop = (delta) => {
    // tick tick tick
  }

  bindEvents = () => {
    this.on(FILE_UPLOADED, this.handleFileUploaded);
    window.addEventListener('resize', this.resize);
  }

  handleFileUploaded = (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.placeFile(file);
    }
  }

  resize = (w, h) => {
    const pixi = this.pixi;
    const parent = pixi.view.parentNode;
    this.w = parent.clientWidth;
    this.h = parent.clientHeight;
    pixi.renderer.resize(parent.clientWidth, parent.clientHeight);
  }
  
  placeFile = (file) => {
    const PIXI = this.PIXI;
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result;
      const image = new Image();
      image.src = dataURL;
      image.onload = () => {
        const base = new PIXI.BaseTexture(image);
        const texture = new PIXI.Texture(base);
        const sprite = new PIXI.Sprite(texture);
        makeDraggable(sprite);
        this.placeSprite(sprite);
        this.emit(SPRITE_ADDED, sprite);
      }
    };
    reader.readAsDataURL(file);
  }

  placeSprite = (sprite) => {
    const pixi = this.pixi;
    console.log('this.w ~~>', this.w);
    fitSprite(sprite, this.w, this.h);
    pixi.stage.addChild(sprite);
  }

  static getInstance(w, h) {
    if (this.instance) return this.instance;
    this.instance = new PixiClient(w, h);
    return this.instance;
  }
}