import React, { Component } from 'react';
import './App.css';
import Login from './Components/Login/Login';
import Nav from './Components/Nav/Nav'
import Footer from './Components/Footer/Footer';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      route: "home"
    }
  }

  render() {
    const route = this.state.route
   if (route === "home") {
    return (
      <div className='App'>
        <Nav />
        <div className='spacing'></div>
        <Login />
        <div className='spacing'></div>
        <Footer />
      </div>
    )
  }
  else if (route === "register") {
    return (
      <div className="App">
        <Nav />
        <div className='spacing'></div>
        {/* <Register /> */}
        <div className='spacing'></div>
        <Footer />
      </div>
    )
  }
  else {
    return (
      <div className="other">
        <p>Other Routes Go Here</p>
      </div>
    )
  }

}

}

export default App;
