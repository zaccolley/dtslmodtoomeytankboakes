import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

  render() {

    const { children } = this.props;

    return (
    <div className="app">
      <nav className="app__nav">
        <div className="app__nav__title">Nav</div>
        <Link className="app__nav__item" to="ag">Anglesea</Link>
        <Link className="app__nav__item" to="ul">Library</Link>
        <Link className="app__nav__item" to="po">Portland</Link>
        <Link className="app__nav__item" to="pk">Park</Link>
      </nav>

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
