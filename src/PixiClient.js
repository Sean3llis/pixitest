import Viewport from 'pixi-viewport';
import { EventEmitter } from "eventemitter3";
import Mousetrap from 'mousetrap';
import ImageLayer from './image-layer';

export const FILE_UPLOADED = 'FILE_UPLOADED';
export const ZOOM = 'ZOOM';
export const SPACE_CHANGED = 'SPACE_CHANGED';
export const LAYER_ADDED = 'LAYER_ADDED';

// viewport plugins
const DRAG = 'drag';

export default class PixiClient extends EventEmitter {
  constructor(w, h) {
    super();
    const PIXI = this.PIXI = window.PIXI;
    this.pixi = new PIXI.Application({ width: w, height: h, backgroundColor: 'black', antialias: true });
    window.pixiClient = this;
    console.log(this);
    window.pixi = this.pixi;
    this.w = w;
    this.h = h;
    this.masterLoop = this.pixi.ticker.add(this.masterLoop);
    this.layers = {};
    this.bindEvents();
    this.bindKeys();
    this.initViewport();
    this.initGrid();
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
      worldWidth: 100,
      worldHeight: 100,
      interaction: pixi.renderer.interaction // the interaction module is important for wheel() to work properly when renderer.view is placed or scaled
    });
    viewport
      .drag()
      .pinch()
      .decelerate();
    viewport.zOrder = 1;
    viewport.pausePlugin(DRAG);
    pixi.stage.addChild(viewport);
    window.viewport = viewport;
    var sprite = viewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE));
    sprite.tint = 0xff0000;
    sprite.width = sprite.height = 100
    sprite.position.set(100, 100);
    sprite.zOrder = 2;
  }

  initGrid = () => {
    const { PIXI } = this;
    const texture = PIXI.Texture.fromImage('grid.png');
    const tilingSprite = new PIXI.extras.TilingSprite(texture, 4000, 4000);
    tilingSprite.position.set(-2000, -2000);
    tilingSprite.zOrder = 1;
    this.viewport.addChild(tilingSprite);
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
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const layer = new ImageLayer(file, this);
      this.emit(LAYER_ADDED, layer);
      this.layers[layer.id] = layer;
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
    viewport.addChild(sprite);
  }

  static getInstance(w, h) {
    if (this.instance) return this.instance;
    this.instance = new PixiClient(w, h);
    return this.instance;
  }
}