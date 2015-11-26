import React from 'react';
import Relay from 'react-relay';

class BuildingList extends React.Component {
  render() {

    return (
      <div>
        {this.props.viewer.buildings.map(building =>
          <span key={building.id}>
            <h3>{building.name}</h3>
            <h4>PCs</h4>
            {building.pcs.occupied} / {building.pcs.total} ({Math.ceil((building.pcs.occupied / building.pcs.total) * 100)}%)
          </span>
        )}
      </div>
    );

  }
}

export default Relay.createContainer(BuildingList, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Snapshot {
        buildings {
          id,
          name,
          pcs {
            occupied,
            total
          }
        }
      }
    `,
  },
});
