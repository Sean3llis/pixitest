import React, { Component } from 'react';
import styled from 'styled-components';
import { colors } from './styled';
import PixiFrame from './PixiFrame';
import PixiClient, { FILE_UPLOADED } from './PixiClient';
import './App.css';

const VerticalFrame = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;
const TopFrame = styled.div`
  height: 5vh;
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
`;
const BottomFrame = styled.div`
  height: 20vh;
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
    const pixiclient = PixiClient.getInstance();
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      output.push(file);
    }
    pixiclient.emit(FILE_UPLOADED, files)
  }
  render() {
    return (
      <VerticalFrame>
        <TopFrame>
          asdf
        </TopFrame>
        <MainFrame>
          <FileInput type="file" name="upload" id="upload" multiple onChange={this.handleUpload.bind(this)} />
          <PixiFrame />
        </MainFrame>
        <BottomFrame>
          alskdjf
        </BottomFrame>
      </VerticalFrame>
    );
  }
}

export default App;
