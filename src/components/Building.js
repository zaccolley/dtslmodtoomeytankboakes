import React, { Component } from 'react';
import Relay from 'react-relay';
import Area from './Area';

class Building extends Component {
  static propTypes = {
    building: React.PropTypes.object.isRequired
  };

  render() {

    const { building } = this.props;

    return (
    <div className="building">

      <div className="building__name">{building.name}</div>

      <div className="areas">
      {building.areas.map((area, i) =>
        <Area key={area.id + i} area={area} />
      )}
      </div>

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
