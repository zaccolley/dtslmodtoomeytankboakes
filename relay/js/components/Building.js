import React, { Component } from 'react';
import Relay from 'react-relay';
import Area from './Area';

class Building extends Component {
  render() {

    const { building } = this.props;

    return (
      <div>
        <h3>{building.name} <small>({building.reference})</small></h3>
        {building.open ? 'Open' : 'Closed'}
        <ul>
        {building.areas.map((area, i) =>
          <li key={area.id + i}><Area area={area} /></li>
        )}
        </ul>
      </div>
    );

  }
}

export default Relay.createContainer(Building, {
  fragments: {
    building: () => Relay.QL`
      fragment on Building {
        reference,
        name,
        open,
        areas{
          id,
          ${Area.getFragment('area')}
        }
      }
    `,
  },
});
