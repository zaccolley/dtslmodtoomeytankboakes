import React, { Component } from 'react';
import Relay from 'react-relay';
import Grouping from './Grouping';

class Area extends Component {
  static propTypes = {
    area: React.PropTypes.object.isRequired
  };

  render() {

    const { area } = this.props;

    return (
    <div className={'area' + (area.name === 'Main Library' ? ' area--main-library' : '')}>

      <div className="area__name">{area.name}</div>
      <div className="area__location">{area.location}</div>

      <div className="groupings">
      {area.groupings.map((grouping, i) =>
        <Grouping key={grouping.id + i} grouping={grouping} />
      )}
      </div>

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
