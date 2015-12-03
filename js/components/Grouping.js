import React, { Component } from 'react';
import Relay from 'react-relay';

class Grouping extends Component {
  render() {

    const { grouping } = this.props;

    console.log(grouping.pcs);

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

    console.log(frees);

    return (
      <div>
        {grouping.location}
        <p>Amount of single pcs free: {frees[0].length}</p>
        <p>Amount of double pcs free: {frees[1].length}</p>
        <p>Amount of triple pcs free: {frees[2].length}</p>
        <p>Amount of quadruple pcs free: {frees[3].length}</p>
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
