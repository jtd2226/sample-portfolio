import React from 'react';
import logo from './logo.svg';
import ReactDom from 'react-dom'
import './App.css';

function App() {
  return (
    <div id="app" className="App">
      <header className="App-header">
        <h1>Step 1</h1>
      </header>
    </div>
  );
}

function Header(value) {
  return (
    <h1>{value}</h1>
  )
}

class Button extends React.Component {
  render() {
    return (
      <button className="Button" onClick={this.handleClick}>
        {this.props.value}
      </button>
    );
  }

  handleClick() {
    const element = Header("YO")
    ReactDom.render(element, document.getElementById("instructions"))
  }
}

export default App;
