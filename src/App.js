import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { colors } from './styled';
import { addLayer } from './reducers/layers';
import PixiFrame from './PixiFrame';
import Toolbar from './Toolbar';
import PixiClient, { FILE_UPLOADED, ZOOM } from './PixiClient';
import './App.css';

const VerticalFrame = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;
const TopFrame = styled.div`
  height: 2rem;
  background-color: ${colors.gray200};
  border-bottom: 1px solid ${colors.gray100};
`;

const MainFrame = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${colors.gray300};
  position: relative;
`;

const BottomFrame = styled.div`
  height: 4rem;
  background-color: ${colors.gray200};
  border-top: 1px solid ${colors.gray100};
`;

const FileInput = styled.input`
  position: absolute;
  left: 0px;
`;

class App extends Component {
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

  onZoom = () => {
    const pixiClient = PixiClient.getInstance();
    pixiClient.emit(ZOOM)
  }

  render() {
    return (
      <VerticalFrame>
        <TopFrame>
          <div onClick={this.onZoom}>ZOOM</div>
        </TopFrame>
        <MainFrame>
          <FileInput type="file" name="upload" id="upload" multiple onChange={this.handleUpload.bind(this)} />
          <PixiFrame />
          <Toolbar />
        </MainFrame>
        <BottomFrame>
          alskdjf
        </BottomFrame>
      </VerticalFrame>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
