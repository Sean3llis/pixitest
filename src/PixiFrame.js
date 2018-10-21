import React, { Component } from 'react';
import PixiClient, { FILE_UPLOADED } from './PixiClient';

export default class PixiFrame extends Component {
  componentDidMount() {
    const PIXI = this.PIXI = window.PIXI;
    this.pixi = new PIXI.Application({ width: 512, height: 512 });
    this.pixiClient = PixiClient.getInstance();
    this.bindEvents();
    this.renderCanvas();
  }

  bindEvents = () => {
    this.pixiClient.on(FILE_UPLOADED, this.handleFileUploaded)
  }

  handleFileUploaded = (files) => {
    // const filename = files[0].name;
    // const imageObject = new Image(files[0]);
    // console.log('imageObject ~~>', imageObject);
    const PIXI = this.PIXI;
    const pixi = this.pixi;
    const reader = new FileReader();
    reader.onload = function () {
      const dataURL = reader.result;
      console.log('dataURL ~~>', dataURL);
      const image = new Image();
      image.src = dataURL;
      image.onload = () => {
        const base = new PIXI.BaseTexture(image);
        const texture = new PIXI.Texture(base);
        const sprite = new PIXI.Sprite(texture);
        pixi.stage.addChild(sprite);

      }
      console.log('image ~~>', image);
      // const output = document.getElementById('output');
      // output.src = dataURL;
    };
    reader.readAsDataURL(files[0]);
    // let base = new PIXI.BaseTexture(anyImageObject),

    // this.PIXI.loader.add('cat.png').load(() => {
    //   let texture = this.PIXI.loader.resources['cat.png'].texture
    //   let sprite = new this.PIXI.Sprite(texture);
    //   console.log('sprite ~~>', sprite);
    //   console.log('this.pixi ~~>', this.pixi);
    //   this.pixi.stage.addChild(sprite)
    //   sprite.x = 0
    //   sprite.y = 0
      // const resource = upload.resources[filename];
      // this.addSprite(resource)
    // })
  }

  addSprite(resource) {
    const sprite = new this.PIXI.Sprite( resource.texture );
    console.log('sprite ~~>', sprite);
    this.pixi.stage.addChild(sprite);
    sprite.x = 0;
    sprite.y = 0;
    console.log('this.pixi.stage ~~>', this.pixi.stage);
  }

  renderCanvas = () => {
    const canvasRoot = document.getElementById('canvas-root');
    canvasRoot.append(this.pixi.view);
  }

  render = () => {
    return <div id="canvas-root"></div>
  }
}