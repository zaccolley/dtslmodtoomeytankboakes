import React, { Component } from 'react';
import Relay from 'react-relay';

class PC extends Component {
  static propTypes = {
    pc: React.PropTypes.object.isRequired
  };

  render() {

    const { pc } = this.props;

    const occupied = !!pc.user.length;

    return (
      <div className={'pc' + (occupied ? ' pc--occupied' : ' pc--free')}>
        {occupied && <span className="pc__user">{pc.user}</span>}
        <span className="pc__status">{pc.user.length ? 'Free' : 'Taken'}</span>
      </div>
    );

  }
}

export default Relay.createContainer(PC, {
  fragments: {
    pc: () => Relay.QL`
      fragment on PC {
        user
      }
    `,
  },
});
