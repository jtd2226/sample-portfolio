import React from 'react';
import Navbar from './navigation/navbar';
import './App.css';

function App() {
  return (
    <div id="app" className="App">
      <Navbar></Navbar>
      <div id="navBody"></div>
    </div>
  );
}

class Iframe extends React.Component {
  render() {
    return (
      <iframe title="frame"
              src={this.props.src}
              frameBorder="0" 
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
     </iframe>
    )
  }
}

export default App;
export {Iframe};