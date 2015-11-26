import React from 'react';
import Relay from 'react-relay';
import BuildingList from './BuildingList';

class App extends React.Component {
  render() {

    const { snapshots } = this.props.viewer;

    return (
    <div>
      <h1>Snapshots</h1>
      <ul>
        {snapshots.edges.map(edge =>
          <li key={edge.node.id}>
            <h2>{String(new Date(edge.node.time))} (ID: {edge.node.id})</h2>
            <BuildingList />
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
        snapshots(first: 1) {
          edges {
            node {
              id,
              time
            },
          },
        },
      }
    `,
  },
});
