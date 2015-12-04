import React, { Component } from 'react';
import Relay from 'react-relay';

class App extends Component {
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
