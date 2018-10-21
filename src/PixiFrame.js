import React, { Component } from 'react';
import styled from 'styled-components';
import PixiClient from './PixiClient';

const CanvasRoot = styled.div`
  width: 100%;
  height: 100%;
`;


export default class PixiFrame extends Component {
  state = {
    w: null,
    h: null,
    redraw: false
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (!prevState.redraw && this.state.redraw) {
      this.h = this.state.h;
      this.w = this.state.w
      this.setState({ redraw: false });
      if (this.pixiClient) {
        this.pixiClient.resize();
      } else {
        console.log('this.state ~~>', this.state);
        this.pixiClient = PixiClient.getInstance(this.state.w, this.state.h);
        this.renderCanvas();
      }
    }
  }

  setupRoot = (el) => {
    if (!el) return;
    this.rootRef = el;
    console.log('el.offsetWidth ~~>', el.offsetWidth);
    this.setState({
      w: el.offsetWidth,
      h: el.offsetHeight,
      redraw: true
    });
  }

  renderCanvas = () => {
    const canvasRoot = document.getElementById('canvas-root');
    canvasRoot.append(this.pixiClient.pixi.view);
  }

  render = () => {

    return <CanvasRoot ref={this.setupRoot} id="canvas-root" />
  }
}