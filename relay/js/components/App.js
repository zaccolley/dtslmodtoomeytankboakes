import React from 'react';
import Relay from 'react-relay';

class App extends React.Component {
  render() {

    const { snapshots } = this.props.viewer;

    return (
    <div>
      <h1>Snapshots</h1>
      <ul>
        {snapshots.edges.map(edge =>
          <li key={edge.node.id}>
            <h2>{String(new Date(edge.node.time*1000))} (ID: {edge.node.id})</h2>
            {edge.node.buildings.map((building, i) =>
            <span key={i}>
              <h3>{building.name}</h3>
              <h4>PCs</h4>
              {building.pcs.occupied} / {building.pcs.total} ({Math.ceil((building.pcs.occupied / building.pcs.total) * 100)}%)
            </span>
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
        snapshots(first: 1) {
          edges {
            node {
              id,
              time,
              buildings{
                id,
                name,
                pcs{
                  occupied,
                  total
                }
              }
            },
          },
        },
      }
    `,
  },
});
