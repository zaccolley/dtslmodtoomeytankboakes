import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';

class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

  render() {

    const { children } = this.props;

    return (
    <div>
      {children}
    </div>
    );

  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
      }
    `
  }
});
