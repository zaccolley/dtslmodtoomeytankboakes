import React, { Component } from 'react';
import Relay from 'react-relay';
import Building from './Building';
import moment from 'moment';

class Snapshot extends Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  render() {

    const snapshots = this.props.viewer.snapshots;
    const buildingReference = this.props.routeParams.buildingReference;

    return (
    <div>
    {snapshots.edges.map(edge =>
      <div key={edge.node.id}>
        {edge.node.buildings.map((building, i) => {
          if (building.reference === 'ag') {
            return <Building key={building.id + i} building={building} />;
          }
        })}
      </div>
    )}
    </div>
    );

  }
}

export default Relay.createContainer(Snapshot, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        snapshots(first: 1) {
          edges {
            node {
              id,
              time,
              buildings{
                id,
                reference,
                ${Building.getFragment('building')}
              }
            },
          },
        },
      }
    `,
  },
});
