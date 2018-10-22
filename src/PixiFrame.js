import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PixiClient, { SPRITE_ADDED } from './PixiClient';
import { addLayer } from './reducers/layers';

const CanvasRoot = styled.div`
  width: 100%;
  height: 100%;
`;


class PixiFrame extends Component {
  componentDidUpdate = (prevProps, prevState) => {
    if (!prevState.redraw && this.state.redraw) {
      this.h = this.state.h;
      this.w = this.state.w
      this.setState({ redraw: false });
      if (this.pixiClient) {
        this.pixiClient.resize();
      } else {
        this.pixiClient = new PixiClient(this.state.w, this.state.h);
        this.renderCanvas();
      }
    }
  }

  setupRoot = (el) => {
    if (!el) return;
    this.rootRef = el;
    this.initializePixiClient(el.offsetWidth, el.offsetHeight);
  }

  initializePixiClient = (w, h) => {
    this.pixiClient = PixiClient.getInstance(w, h);
    const canvasRoot = document.getElementById('canvas-root');
    canvasRoot.append(this.pixiClient.pixi.view);
    this.bindEvents();
  }

  bindEvents = () => {
    const pixiClient = this.pixiClient;
    const { addLayer } = this.props;
    pixiClient.on(SPRITE_ADDED, sprite => {
      addLayer(sprite);
    });
  }

  render = () => {
    return <CanvasRoot ref={this.setupRoot} id="canvas-root" />
  }
}

const mapStateToProps = (state) => {
  return {
    lol: 'what'
  }
}

const mapDispatchToProps = {
  addLayer
}

export default connect(mapStateToProps, mapDispatchToProps)(PixiFrame);