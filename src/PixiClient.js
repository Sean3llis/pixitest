import Viewport from 'pixi-viewport';
import { EventEmitter } from "eventemitter3";
import { makeDraggable, fitSprite } from "./utils";
import Mousetrap from 'mousetrap';
import ImageLayer from './image-layer';

export const FILE_UPLOADED = 'FILE_UPLOADED';
export const SPRITE_ADDED = 'SPRITE_ADDED'
export const ZOOM = 'ZOOM'
export const SPACE_CHANGED = 'SPACE_CHANGED'

// viewport plugins
const DRAG = 'drag';

export default class PixiClient extends EventEmitter {
  constructor(w, h) {
    super();
    const PIXI = this.PIXI = window.PIXI;
    this.pixi = new PIXI.Application({ width: w, height: h, backgroundColor: 0x1099bb });
    window.p = this.pixi;
    this.w = w;
    this.h = h;
    this.masterLoop = this.pixi.ticker.add(this.masterLoop);
    this.bindEvents();
    this.bindKeys();
    this.initViewport();
    this.spaceDown = false;
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
      interaction: pixi.renderer.interaction // the interaction module is important for wheel() to work properly when renderer.view is placed or scaled
    });
    viewport
      .drag()
      .pinch()
      .decelerate();
    viewport.pausePlugin(DRAG);
    pixi.stage.addChild(viewport);
    window.viewport = viewport;
    var sprite = viewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE));
    sprite.tint = 0xff0000;
    sprite.width = sprite.height = 100
    sprite.position.set(100, 100);
  }

  bindEvents = () => {
    this.on(FILE_UPLOADED, this.handleFileUploaded);
    this.on(ZOOM, this.handleZoom);
    this.on(SPACE_CHANGED, spaceDown => {
      if (spaceDown !== this.spaceDown) {
        this.handleSpaceChanged(spaceDown);
        this.spaceDown = spaceDown;
      }
    })
    window.addEventListener('resize', this.resize);
  }

  bindKeys = () => {
    const M = Mousetrap;
    M.bind('space', () => {
      if (!this.spaceDown) {
        this.emit(SPACE_CHANGED, true);
        this.spaceDown = true;
      }
    });
    M.bind('space', () => {
      if (this.spaceDown) {
        this.emit(SPACE_CHANGED, false)
        this.spaceDown = false;
      }
    }, 'keyup');
  }

  handleSpaceChanged = (spaceDown) => {
    const { viewport } = this;
    spaceDown ? viewport.resumePlugin(DRAG) : viewport.pausePlugin(DRAG);
  }

  handleZoom = (value) => {
    const { viewport } = this;
    viewport.zoom(value, true);
  }

  handleFileUploaded = (files) => {
    const { pixi } = this;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const layer = new ImageLayer(file, this);
    }
  }

  resize = (w, h) => {
    const pixi = this.pixi;
    const parent = pixi.view.parentNode;
    this.w = parent.clientWidth;
    this.h = parent.clientHeight;
    pixi.renderer.resize(parent.clientWidth, parent.clientHeight);
  }

  placeSprite = (sprite) => {
    const { viewport } = this;
    fitSprite(sprite, this.w, this.h);
    viewport.addChild(sprite);
  }

  static getInstance(w, h) {
    if (this.instance) return this.instance;
    this.instance = new PixiClient(w, h);
    return this.instance;
  }
}