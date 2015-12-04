import React, { Component } from 'react';
import Relay from 'react-relay';
import Grouping from './Grouping';

class Area extends Component {
  static propTypes = {
    area: React.PropTypes.object.isRequired
  };

  render() {

    const { area } = this.props;

    const grouping = area.groupings[0];

    return (
      <Grouping grouping={grouping} />
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
