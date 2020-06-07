import * as React from 'react';

export class ButtonCounter extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = { start: 0, counter: 0 }
  }
  
  render() {
    return (
      <div style={{ border: 'solid green 2px', margin: '2px' }}>
        <h2>Here is in React</h2>
        <div>
          <span>Counter: { this.state.start + this.state.counter }</span>
          <button onClick={ e => this.handleClick(e) }>Click Me!</button>
        </div>
      </div>
    );
  }
  
  
  handleClick() {
    const newCounter = this.state.counter + 1
    this.setState({ counter: newCounter })
  }
  

}