import React, { Component } from 'react';
import Relay from 'react-relay';

class Grouping extends Component {
  static propTypes = {
    grouping: React.PropTypes.object.isRequired
  };

  render() {

    const { grouping } = this.props;

    var frees = [
      [], [], [], []
    ];

    var pcs = grouping.pcs;

    for (var i = 0; i < pcs.length; i++) {
      var amount = 0;
      var pcsFree = [];

      calcFreePcs(pcs, frees, pcsFree, i, amount);
    }

    function calcFreePcs(pcs, frees, pcsFree, i, amount) {

      if (i < pcs.length - amount) {
        var pc = pcs[i + amount];
        var pcFree = (!pc.user && !pc.broken);

        // if the pc isnt available or we've reached the end of the availabiliies
        if (!pcFree || amount > frees.length - 1) {
          return false;
        }

        pcsFree = [pc, ...pcsFree].sort();
        frees[amount].push(pcsFree);
        return calcFreePcs(pcs, frees, pcsFree, i, amount + 1);
      }

    }

    const arrows = {
      'top': '↑',
      'top right': '↗',
      'right': '→',
      'bottom right': '↘',
      'bottom': '↓',
      'bottom left': '↙',
      'left': '←',
      'top left': '↖'
    };

    return (
      <div className="groupings">
        <div className="grouping">
          <div className="grouping__arrow grouping__arrow--left">{arrows['left']}</div>
          <div className="grouping__amount">{frees[0].length}</div>
        </div>
        <div className="grouping">
          <div className="grouping__arrow grouping__arrow--left">{arrows['top left']}</div>
          <div className="grouping__amount">{frees[1].length}</div>
        </div>
        <div className="grouping">
          <div className="grouping__arrow grouping__arrow--left">{arrows['right']}</div>
          <div className="grouping__amount">{frees[2].length}</div>
        </div>
        <div className="grouping">
          <div className="grouping__arrow grouping__arrow--left">{arrows['top']}</div>
          <div className="grouping__amount">{frees[3].length}</div>
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
