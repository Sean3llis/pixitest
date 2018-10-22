export function makeDraggable(sprite) {
  sprite.interactive = true;
  sprite.buttonMode = true;
  sprite.on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);
  return sprite;
}

export function fitSprite(sprite, w, h) {
  if (w > h) {
    if (sprite.height < h) {
      sprite.scale.set(1);
    } else {
      sprite.scale.set(h / sprite.height - 0.01);
    }
  } else {
    if (sprite.width < w) {
      sprite.scale.set(1);
    } else {
      sprite.scale.set(w / sprite.width - 0.01);
    }
  }
  sprite.anchor.set(0.5);
  sprite.position.set(w / 2, h / 2);
}

function onDragStart(event) {
  // store a reference to the data
  // the reason for this is because of multitouch
  // we want to track the movement of this particular touch
  this.data = event.data;
  this.alpha = 0.5;
  this.dragging = true;
}

function onDragEnd() {
  this.alpha = 1;
  this.dragging = false;
  // set the interaction data to null
  this.data = null;
}

function onDragMove() {
  if (this.dragging) {
    var newPosition = this.data.getLocalPosition(this.parent);
    this.x = newPosition.x;
    this.y = newPosition.y;
  }
}