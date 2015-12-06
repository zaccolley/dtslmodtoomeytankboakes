import React, { Component } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import Building from './Building';

class Snapshot extends Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
    routeParams: React.PropTypes.object
  };

  render() {

    const { viewer: { snapshots }, routeParams: { buildingReference } } = this.props;

    const snapshot = snapshots.edges[0].node;

    return (
    <div className="snapshot">

      <div className="snapshot__time">{moment(snapshot.time * 1000).format('MMMM Do YYYY, h:mm:ss a')}</div>

      <div className="buildings">
      {snapshot.buildings.map((building, i) => {
        if (building.reference === buildingReference) {
          return <Building key={building.id + i} building={building} />;
        }
      })}
      </div>

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
