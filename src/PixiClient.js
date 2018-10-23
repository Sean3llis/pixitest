import Viewport from 'pixi-viewport';
import { EventEmitter } from "eventemitter3";
import { makeDraggable, fitSprite } from "./utils";

export const FILE_UPLOADED = 'FILE_UPLOADED';
export const SPRITE_ADDED = 'SPRITE_ADDED'
export const ZOOM = 'ZOOM'

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
    this.initViewport();
  }

  masterLoop = (delta) => {
    // tick tick tick
  }

  initViewport = () => {
    const { PIXI, pixi } = this;
    const viewport = this.viewport = new Viewport({
      screenWidth: this.w,
      screenHeight: this.h,
      worldWidth: 1000,
      worldHeight: 1000,
      drag: false,

      interaction: pixi.renderer.interaction // the interaction module is important for wheel() to work properly when renderer.view is placed or scaled
    });
    viewport
      .drag()
      .pinch()
      .wheel()
      .decelerate();
    pixi.stage.addChild(viewport);
    var sprite = viewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE));
    sprite.tint = 0xff0000;
    sprite.width = sprite.height = 100
    sprite.position.set(100, 100);
  }

  bindEvents = () => {
    this.on(FILE_UPLOADED, this.handleFileUploaded);
    this.on(ZOOM, this.handleZoom);
    window.addEventListener('resize', this.resize);
  }

  handleZoom = () => {
    const { viewport } = this;
    console.log('viewport ~~>', viewport);
    viewport.zoomTo(0.5, 0.5)
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
    const { viewport } = this;
    console.log('this.w ~~>', this.w);
    fitSprite(sprite, this.w, this.h);
    viewport.addChild(sprite);
  }

  static getInstance(w, h) {
    if (this.instance) return this.instance;
    this.instance = new PixiClient(w, h);
    return this.instance;
  }
}