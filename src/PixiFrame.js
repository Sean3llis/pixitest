import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PixiClient, { SPACE_CHANGED, LAYER_ADDED } from './PixiClient';
import { addLayer, setSpaceDown } from './reducers/layers';

const CanvasRoot = styled.div`
  width: 100%;
  height: 100%;
  cursor: ${({ mouseDown, spaceDown}) => {
    if (spaceDown) {
      return mouseDown ? 'grabbing' : 'grab'
    } else {
      return 'inherit';
    }
  }};
`;


class PixiFrame extends Component {
  state = {
    mouseDown: false
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
    const { addLayer, setSpaceDown } = this.props;
    pixiClient.on(SPACE_CHANGED, setSpaceDown)
    pixiClient.on(LAYER_ADDED, addLayer);
  }

  handleMouseDown = () => this.setState({ mouseDown: true });
  handleMouseUp = () => this.setState({ mouseDown: false });

  render = () => {
    const { spaceDown } = this.props;
    const { mouseDown } = this.state;
    return (
      <CanvasRoot
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        mouseDown={mouseDown} 
        spaceDown={spaceDown}
        ref={this.setupRoot} id="canvas-root" />
    );
  }
}

const mapStateToProps = ({ layers }) => {
  return {
    spaceDown: layers.spaceDown
  }
}

const mapDispatchToProps = {
  addLayer,
  setSpaceDown
}

export default connect(mapStateToProps, mapDispatchToProps)(PixiFrame);