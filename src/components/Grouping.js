import React, { Component } from 'react';
import Relay from 'react-relay';

class Grouping extends Component {
  static propTypes = {
    grouping: React.PropTypes.object.isRequired
  };

  render() {

    const { grouping } = this.props;

    function calcFreePcs(pcs, frees, pcsFree, i, amount) {

      if (i < pcs.length - amount) {

        const pc = pcs[i + amount];
        const pcFree = (!pc.user && !pc.broken);

        // if the pc isnt available or we've reached the end of the availabiliies
        if (!pcFree || amount > frees.length - 1) {
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

    const pcs = grouping.pcs;

    for (let i = 0; i < pcs.length; i++) {
      const amount = 0;
      const pcsFree = [];

      calcFreePcs(pcs, frees, pcsFree, i, amount);
    }

    const arrows = {
      top: '↑',
      topRight: '↗',
      right: '→',
      bottomRight: '↘',
      bottom: '↓',
      bottomLeft: '↙',
      left: '←',
      topLeft: '↖'
    };

    return (
      <div className="groupings">
        <div className="grouping">
          <div className="grouping__arrow grouping__arrow--left">{arrows.left}</div>
          <div className="grouping__amount">1 <small>({frees[0].length})</small></div>
        </div>
        <div className="grouping">
          <div className="grouping__arrow grouping__arrow--left">{arrows.topLeft}</div>
          <div className="grouping__amount">2 <small>({frees[1].length})</small></div>
        </div>
        <div className="grouping">
          <div className="grouping__arrow grouping__arrow--left">{arrows.right}</div>
          <div className="grouping__amount">3 <small>({frees[2].length})</small></div>
        </div>
        <div className="grouping">
          <div className="grouping__arrow grouping__arrow--left">{arrows.top}</div>
          <div className="grouping__amount">4 <small>({frees[3].length})</small></div>
        </div>
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
          user,
          broken
        }
      }
    `,
  },
});
