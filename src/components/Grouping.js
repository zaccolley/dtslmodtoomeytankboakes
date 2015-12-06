import React, { Component } from 'react';
import Relay from 'react-relay';
import PC from './PC';

class Grouping extends Component {
  static propTypes = {
    grouping: React.PropTypes.object.isRequired
  };

  render() {

    const { grouping } = this.props;

    return (
    <div className="grouping">

      <div className="grouping__location">{grouping.location}</div>
      <div className="grouping__tally">{grouping.occupied} / {grouping.total}</div>

      <div className="pcs">
      {grouping.pcs.map((pc, i) =>
        <PC key={`${pc.id}_${i}`} pc={pc} />
      )}
      </div>

    </div>
    );

  }
}

export default Relay.createContainer(Grouping, {
  fragments: {
    grouping: () => Relay.QL`
      fragment on Grouping {
        id,
        location,
        occupied,
        total,
        pcs{
          id,
          user,
          ${PC.getFragment('pc')}
        }
      }
    `,
  },
});
