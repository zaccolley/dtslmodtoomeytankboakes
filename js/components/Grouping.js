import React, { Component } from 'react';
import Relay from 'react-relay';
import PC from './PC';

class Grouping extends Component {
  render() {

    const { grouping } = this.props;

    return (
      <div>
        {grouping.location}
        <ul>
        {grouping.pcs.map((pc, i) =>
          <li key={pc.id + i}><PC pc={pc} /></li>
        )}
        </ul>
      </div>
    );

  }
}

export default Relay.createContainer(Grouping, {
  fragments: {
    grouping: () => Relay.QL`
      fragment on Grouping {
        location,
        pcs{
          id,
          ${PC.getFragment('pc')}
        }
      }
    `,
  },
});
