import React, { Component } from 'react';
import styled from 'styled-components';
import { FiZoomIn, FiZoomOut, FiFilePlus } from 'react-icons/fi';
import { connect } from 'react-redux';
import { colors, unit, border100 } from './styled';
import PixiClient, { FILE_UPLOADED, ZOOM } from './PixiClient';


const Container = styled.div`
  position: absolute;
  right: ${unit * 2}px;
  padding: ${unit / 2}px;
  top: ${unit * 2}px;
  background-color: ${colors.gray200};
`;

const Tool = styled.div`
  background-color: ${colors.gray200};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: ${unit * 3}px;
  height: ${unit * 3}px;
  border-bottom: ${border100};
  color: black;
  font-size: ${unit * 2}px;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: ${colors.gray300};
    cursor: pointer;
    &:after {
      opacity: 1;
    }
  }
  &:after {
    display: flex;
    flex-direction: row;
    align-items: center;
    content: '${props => props.label}';
    position: absolute;
    right: ${unit * 4}px;
    white-space: nowrap;
    padding: ${unit / 2}px;
    background-color: ${colors.gray300};
    font-color: ${colors.gray200};
    font-size: 12px;
    opacity: 0;
    pointer-events: none;
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
    pixiClient.emit(FILE_UPLOADED, files)
  }
  render() {
    return (
      <FileInput type="file" name="upload" id="upload" multiple onChange={this.handleUpload.bind(this)} />
    )
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
        <Tool label='Zoom In'><FiZoomIn onClick={() => this.handleZoom(-200)} /></Tool>
        <Tool label='Zoom Out'><FiZoomOut onClick={() => this.handleZoom(200)} /></Tool>
        <Tool label='Add File'><FiFilePlus /></Tool>
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
