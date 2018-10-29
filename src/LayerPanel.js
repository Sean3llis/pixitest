import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FiImage } from 'react-icons/fi'
import styled from 'styled-components';
import { unit } from './styled';

const Panel = styled.div`
  position: absolute;
  left: 0px;
  bottom: 0px;
  padding: ${unit}px;
`;

const LayerRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: ${unit}px;
  background-color: black;
  color: white;
`;

class LayerPanel extends Component {
  renderLayerRow = (layer) => {
    console.log('layer ~~>', layer);
    return (
      <LayerRow key={layer.id}>
        <FiImage />
        {layer.name}
      </LayerRow>
    )
  }

  render() { 
    const { stack } = this.props;
    return (
      <Panel>
        {stack.map(this.renderLayerRow)}
      </Panel>
    );
  }
}
 
const mapStateToProps = ({ layers }) => {
  const { stack } = layers;
  
  return { stack }
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LayerPanel);