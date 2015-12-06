import React, { Component } from 'react';
import Relay from 'react-relay';
import PC from './PC';

class Grouping extends Component {
  static propTypes = {
    grouping: React.PropTypes.object.isRequired
  };

  render() {

    const { grouping } = this.props;

    function calcFreePcs(pcs, frees, pcsFree, i, amount) {
      if (i < pcs.length - amount) {

        const pc = pcs[i + amount];
        const pcOccupied = pc.user.length;

        // if the pc isnt available or we've reached the end of the availabiliies
        if (pcOccupied || amount > frees.length - 1) {
          return false;
        }

        const newPcsFree = [pc, ...pcsFree].sort();
        frees[amount].push(newPcsFree);
        return calcFreePcs(pcs, frees, newPcsFree, i, amount + 1);
      }

    }

    const frees = [
      [], [], [], []
    ];

    for (let i = 0; i < grouping.pcs.length; i++) {
      const amount = 0;
      const pcsFree = [];

      calcFreePcs(grouping.pcs, frees, pcsFree, i, amount);
    }

    grouping.frees = frees;

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
