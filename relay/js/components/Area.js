import React, { Component } from 'react';
import Relay from 'react-relay';
import Grouping from './Grouping';

class Area extends Component {
  render() {

    const { area } = this.props;

    return (
      <div>
        {area.name}
        {area.location}
        <ul>
        {area.groupings.map((grouping, i) =>
          <li key={grouping.id + i}><Grouping grouping={grouping} /></li>
        )}
        </ul>
      </div>
    );

  }
}

export default Relay.createContainer(Area, {
  fragments: {
    area: () => Relay.QL`
      fragment on Area {
        name,
        location,
        groupings{
          id,
          ${Grouping.getFragment('grouping')}
        }
      }
    `,
  },
});
