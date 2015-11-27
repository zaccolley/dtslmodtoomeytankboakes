import React, { Component } from 'react';
import Relay from 'react-relay';

class PCs extends Component {
  render() {

    const { pcs } = this.props;

    const percentage = Math.ceil((pcs.occupied / pcs.total) * 100);

    return (
      <div>
        <h4>PCs</h4>
        {pcs.occupied} / {pcs.total} ({percentage}%)
      </div>
    );

  }
}

export default Relay.createContainer(PCs, {
  fragments: {
    pcs: () => Relay.QL`
      fragment on PCs {
        occupied,
        total
      }
    `,
  },
});
