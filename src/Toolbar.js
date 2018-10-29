import React, { Component } from 'react';
import styled from 'styled-components';
import { FiZoomIn, FiZoomOut, FiFilePlus, FiLayers, FiType } from 'react-icons/fi';
import { connect } from 'react-redux';
import { colors, unit, border100 } from './styled';
import PixiClient, { FILE_UPLOADED, ZOOM } from './PixiClient';


const Container = styled.div`
  position: absolute;
  left: ${unit * 2}px;
  padding: ${unit / 2}px;
  top: ${unit * 2}px;
  background-color: ${colors.gray200};
`;

const Tool = styled.div`
  background-color: ${colors.gray200};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${unit / 2}px;
  align-items: center;
  width: ${unit * 3}px;
  height: ${unit * 3}px;
  border-bottom: ${border100};
  color: ${colors.white200};
  font-size: ${unit * 2}px;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: ${colors.gray300};
    cursor: pointer;
    &:after {
      opacity: 1;
      transition: opacity 0.2s ease-in-out;
    }
  }
  &:after {
    content: '${props => props.label}';
    padding: ${unit}px;
    pointer-events: none;
    padding-right: ${unit * 2}px;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;
    left: ${unit * 4}px;
    white-space: nowrap;
    background-color: ${colors.gray300};
    color: ${colors.white200};
    font-size: 12px;
    opacity: 0;
    pointer-events: none;
  }
`;

const HiddenInput = styled.input`
  opacity: 0;
  visibility: hidden;
  position: absolute;
  pointer-events: none;
`;

const Label = styled.label`
  &:hover {
    cursor: pointer;
  }
`;

class FileInput extends Component {
  handleUpload = (e) => {
    const output = [];
    const pixiClient = PixiClient.getInstance();
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      output.push(file);
    }
    pixiClient.emit(FILE_UPLOADED, files);
    this.inputRef.value = '';
  }

  setup = el => {
    if (!el) return;
    this.inputRef = el;
  }

  render() {
    return (
      <div>
        <Label htmlFor="add-file">
          <FiFilePlus />
        </Label>
        <HiddenInput ref={this.setup} type="file" id="add-file" multiple onChange={this.handleUpload.bind(this)} />
      </div>
    );
  }
}

class Toolbar extends Component {

  componentDidMount() {
    const pixiClient = PixiClient.getInstance();
    this.pixiClient = pixiClient;
  }

  handleZoom = (value) => {
    this.pixiClient.emit(ZOOM, value);
  }

  render() {
    return (
      <Container>
        <Tool label='Zoom In' onClick={() => this.handleZoom(-200)}><FiZoomIn /></Tool>
        <Tool label='Zoom Out' onClick={() => this.handleZoom(200)}><FiZoomOut /></Tool>
        <Tool label='Add Text' onClick={() => this.handleZoom(200)}><FiType /></Tool>
        <Tool label='Add File'><FileInput /></Tool>
        <Tool label='Layers'><FiLayers /></Tool>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lol: 'what'
  }
}

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
