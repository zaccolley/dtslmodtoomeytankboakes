import React, { Component } from 'react';

export default class Loading extends Component {
  render() {
    return (
      <div className="loading">
        <p className="loading__message">Loading...</p>
        <div className="loading__spinner" />
      </div>
    );
  }
}
