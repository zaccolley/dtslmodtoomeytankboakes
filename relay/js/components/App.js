import React, { Component } from 'react';
import Relay from 'react-relay';
import Building from './Building';
import moment from 'moment';

class App extends Component {
  render() {

    const { snapshots } = this.props.viewer;

    return (
    <div>
      <h1>Snapshots</h1>
      <ul>
        {snapshots.edges.map(edge =>
          <li key={edge.node.id}>
            <h2>
              {moment(edge.node.time).format('MMMM Do YYYY, h:mm:ss a')}{' '}
              <small>({moment(edge.node.time).fromNow()})</small>
            </h2>
            {edge.node.buildings.map((building, i) =>
              <Building key={building.id + i} building={building} />
            )}
          </li>
        )}
      </ul>
    </div>
    );

  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        snapshots(first: 10) {
          edges {
            node {
              id,
              time,
              buildings{
                id,
                ${Building.getFragment('building')}
              }
            },
          },
        },
      }
    `,
  },
});
