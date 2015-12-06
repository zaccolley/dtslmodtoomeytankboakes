import React, { Component } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import Building from './Building';
import Map from './Map';

class Snapshot extends Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
    routeParams: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      map: false
    };
  }

  toggleView() {
    const { map } = this.state;
    this.setState({ map: !map });
  }

  render() {

    const { viewer: { snapshots }, routeParams: { buildingReference } } = this.props;
    const { map } = this.state;

    const snapshot = snapshots.edges[0].node;

    return (
    <div className="snapshot">

      <button className="snapshot__map-button" onClick={this.toggleView.bind(this)}>{map ? 'Back...' : 'Map' }</button>

      <div className="snapshot__time">{moment(snapshot.time * 1000).format('MMMM Do YYYY, h:mm:ss a')}</div>

      <div className="buildings">
      {snapshot.buildings.map((building, i) => {
        if (building.reference === buildingReference) {
          return (
          <div key={building.id + i}>

            {!map ? ( // eslint-disable-line no-nested-ternary
              <Building building={building} />
            ) : (
              building.reference === 'ul' ? (
                <Map building={building} />
              ) : (
                <p>No map view for this building...</p>
              )
            )}

          </div>
          );
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
                name,
                reference,
                ${Building.getFragment('building')},
                ${Map.getFragment('building')}
              }
            },
          },
        },
      }
    `,
  },
});
