import uniqid from 'uniqid';
import { SPACE_CHANGED } from "./PixiClient";

export const HANDLE_WIDTH = 5;
export const UI_COLOR = 0xF5F5F5;


function rotateToPoint(mx, my, px, py){  
  var self = this;
  var dist_Y = my - py;
  var dist_X = mx - px;
  var angle = Math.atan2(dist_Y,dist_X);
  //var degrees = angle * 180/ Math.PI;
  return angle;
}


export default class ImageLayer {
  constructor(file, pixiClient) {
    this.pixiClient = pixiClient;
    this.bindEvents();
    this.makeSprite(file);
  }

  bindEvents = () => {
    const { pixiClient } = this;
    pixiClient.on(SPACE_CHANGED, spaceDown => this.sprite.interactive = !spaceDown);
  }

  makeSprite = (file) => {
    const { pixiClient } = this;
    this.filename = file.name;
    this.id = uniqid('image-');
    const PIXI = window.PIXI;
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result;
      const image = new Image();
      image.src = dataURL;
      image.onload = () => {
        const base = new PIXI.BaseTexture(image);
        const texture = new PIXI.Texture(base);
        const sprite = new PIXI.Sprite(texture);
        this.fitSprite(sprite);
        this.sprite = sprite;
        window.sprite = sprite;
        // this.sizeLayer(sprite, pixiClient.w, pixiClient.h);
        // this.placeSprite(sprite);
        this.setupLayer(sprite);
      }
    };
    reader.readAsDataURL(file);
  }

  onClick = () => {
    console.log('click', this);
  }

  setupLayer = (sprite) => {
    const { pixiClient, pixiClient: { viewport } } = this;
    const PIXI = window.PIXI;
    const container = this.container = new PIXI.Container();
    container.interactive = true;
    container.buttonMode = true;
    container
      .on('mouseover', this.onMouseOver)
      .on('pointerdown', this.onDragStart)
      .on('pointerdown', this.onClick)
      .on('pointerup', this.onDragEnd)
      .on('pointerupoutside', this.onDragEnd)
      .on('pointermove', this.onDragMove);
    container.addChild(sprite);
    this.drawBorder()
    viewport.addChild(container);
    container.position.set((pixiClient.w / 2) - (container.width / 2), (pixiClient.h / 2) - (container.height / 2));
    // container.pivot.x = container.x
    // container.pivot.y = container.y
  }

  fitSprite = (sprite) => {
    const { pixiClient } = this;
    if (sprite.width > pixiClient.w) {
      sprite.scale.set((pixiClient.w / sprite.width) * 0.85)
    } else if (sprite.height > pixiClient.h) {
      sprite.scale.set((pixiClient.height / sprite.height) * 0.85)
    }
  }

  drawBorder = () => {
    const PIXI = window.PIXI;
    const { pixiClient } = this;
    const renderer = pixiClient.pixi.renderer;
    const { container } = this;
    const border = new PIXI.Graphics();
    border.lineStyle(2, UI_COLOR);
    border.drawRect(container.position.x, container.position.y, container.width, container.height);
    container.addChild(border);
    const handle = new PIXI.Graphics();
    const handlesContainer = new PIXI.Container();
    handlesContainer.interactive = true;
    handlesContainer.on('pointerdown', (e) => {
      
    });
    handle.beginFill(UI_COLOR);
    handle.drawEllipse(0, 0, HANDLE_WIDTH, HANDLE_WIDTH);
    handle.drawEllipse(container.width - (HANDLE_WIDTH / 2), 0, HANDLE_WIDTH, HANDLE_WIDTH);
    handle.drawEllipse(container.width  - (HANDLE_WIDTH / 2), container.height  - (HANDLE_WIDTH / 2), HANDLE_WIDTH, HANDLE_WIDTH);
    handle.drawEllipse(0, container.height  - (HANDLE_WIDTH / 2), HANDLE_WIDTH, HANDLE_WIDTH);
    handlesContainer.addChild(handle);
    container.addChild(handlesContainer);
    animate();
    function animate() {  
      requestAnimationFrame(animate);
      container.rotation = rotateToPoint(renderer.plugins.interaction.mouse.global.x, renderer.plugins.interaction.mouse.global.y, container.position.x, container.position.y);
    }
  }

  onMouseOver(event) {
    console.log('event ~~>', event);
  }

  onDragStart(event) {
    this.data = event.data;
    this.alpha = 0.7;
    this.dragging = true;
  }

  onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
  }
  
  onDragMove(e) {
    if (this.dragging) {
      this.x += e.data.originalEvent.movementX;
      this.y += e.data.originalEvent.movementY;
    }
  }
  
}