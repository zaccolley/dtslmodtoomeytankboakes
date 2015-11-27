import React, { Component } from 'react';
import Relay from 'react-relay';
import PCs from './PCs';

class Building extends Component {
  render() {

    const { building } = this.props;

    return (
      <div>
        <h3>{building.name}</h3>
        <PCs pcs={building.pcs} />
      </div>
    );

  }
}

export default Relay.createContainer(Building, {
  fragments: {
    building: () => Relay.QL`
      fragment on Building {
        name,
        pcs{
          ${PCs.getFragment('pcs')}
        }
      }
    `,
  },
});
