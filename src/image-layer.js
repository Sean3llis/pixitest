import uniqid from 'uniqid';
import { SPACE_CHANGED } from "./PixiClient";

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
        this.sprite = sprite;
        window.sprite = sprite;
        sprite.interactive = true;
        sprite.buttonMode = true;
        sprite.on('pointerdown', this.onDragStart)
          .on('pointerdown', this.onClick)
          .on('pointerup', this.onDragEnd)
          .on('pointerupoutside', this.onDragEnd)
          .on('pointermove', this.onDragMove);
        this.fitSprite(sprite, pixiClient.w, pixiClient.h);
        this.placeSprite(sprite);
      }
    };
    reader.readAsDataURL(file);
  }

  onClick = () => {
    console.log('click', this);

  }

  placeSprite = (sprite) => {
    const { viewport } = this.pixiClient;
    viewport.addChild(sprite);
  }

  fitSprite(sprite, w, h) {
    if (w > h) {
      if (sprite.height < h) {
        sprite.scale.set(1);
      } else {
        sprite.scale.set(h / sprite.height - 0.05);
      }
    } else {
      if (sprite.width < w) {
        sprite.scale.set(1);
      } else {
        sprite.scale.set(w / sprite.width - 0.05);
      }
    }
    sprite.anchor.set(0.5);
    sprite.position.set(w / 2, h / 2);
  }

  onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.7;
    this.dragging = true;
  }

  onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
  }
  
  onDragMove(e) {
    if (this.dragging) {
      // var newPosition = this.data.getLocalPosition(this.parent);
      this.x += e.data.originalEvent.movementX;//here
      this.y += e.data.originalEvent.movementY;//and here
    }
  }
  
}