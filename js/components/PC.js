import React, { Component } from 'react';
import Relay from 'react-relay';

class PC extends Component {
  static propTypes = {
    pc: React.PropTypes.object.isRequired
  };

  render() {

    const { pc } = this.props;

    return (
      <div>
        {pc.user ? pc.user : 'No user'} <br />
        {pc.broken && 'Its fucking broken'}
      </div>
    );

  }
}

export default Relay.createContainer(PC, {
  fragments: {
    pc: () => Relay.QL`
      fragment on PC {
        user,
        broken
      }
    `,
  },
});
