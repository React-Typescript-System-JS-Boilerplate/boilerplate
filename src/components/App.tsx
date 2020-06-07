import * as React from 'react';
import { filter } from 'lodash';
import { EposDetailsTextInputElement } from './EposDetailsTextInputElement';
console.log(filter);
// import '../scss/main.scss';



export class App extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = { start: 0, counter: 0 }
  }
  
  render() {
    return (
      <div className="hello">
        oye
      </div>
    );  
  }
  
  
  handleClick() {
    const newCounter = this.state.counter + 1
    this.setState({ counter: newCounter })
  }
  

}