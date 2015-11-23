import React from 'react';
import Relay from 'react-relay';

class App extends React.Component {
  render() {

    return (
    <div>
      <h1>Snapshots</h1>
      <ul>
        {this.props.viewer.snapshots.edges.map(edge =>
          <li key={edge.node.id}>{String(new Date(edge.node.time))} (ID: {edge.node.id})</li>
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
