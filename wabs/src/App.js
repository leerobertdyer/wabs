import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Components/Login/Login';
import Nav from './Components/Nav/Nav';
import Footer from './Components/Footer/Footer';
import Register from './Components/Register/Register';
import Profile from './Components/Profile/Profile';
import Songs from './Components/Songs/Songs';
import Submit from './Components/Submit/Submit';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        uer_id: '',
        userName: '',
        email: '',
        isLoggedIn: false,
        user_profile_pic: '',
        score: 0,
        datecreated: ''
      },

    };
  }

  // componentDidMount() {
  //   // not sure I need a home fetch...
  //   fetch('http://localhost:4000/')
  //     .then((response) => response.json())
  //     .then((data) => {
  //           console.log(data)
  //         },
  //       )
  //   .catch((error) => {
  //       console.error('Error:', error);
  //     });
  // }



  loadUser = (data) => {
    console.log(data)
    this.setState({
      user: {
        user_id: data.user_id,
        userName: data.username,
        email: data.user_email,
        datecreated: data.date_user_joined,
        score: data.score,
        isLoggedIn: true,
        user_profile_pic: data.user_profile_pic,
        status: data.user_status
      }
    },
    () => {
      console.log(this.state.user)
    }
    )
    
  }

  unloadUser = () => {
    this.setState({user: {
      user_id: '',
      userName: '',
      email: '',
      isLoggedIn: false,
      user_profile_pic: '',
      score: 0,
      datecreated: ''
    }})
  }

render() {

  return (
    <Router>
      <div className='App'>
        <div id='mainWrapper'>
        <Nav user={this.state.user} unloadUser={this.unloadUser}/>
        <div className='spacing'></div>
        
        <Routes>
          <Route path='/' element={<Songs />}/>
          <Route path="/login" element={ <Login loadUser={this.loadUser}/> } />
          <Route path="/register" element={ <Register loadUser={this.loadUser}/> } />
          <Route path="/profile" element={ <Profile user={this.state.user}/> } />
          <Route path="/submit" element={ <Submit user={this.state.user} /> } />
        </Routes>
     
        <Footer />
      </div>
      </div>
    </Router>
  );
}
}

export default App;
