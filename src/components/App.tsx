import * as React from 'react';



export class App extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = { start: 0, counter: 0 }
  }
  
  render() {
    return (
      <div>
        Hello world
      </div>
    );
  }
  
  
  handleClick() {
    const newCounter = this.state.counter + 1
    this.setState({ counter: newCounter })
  }
  

}