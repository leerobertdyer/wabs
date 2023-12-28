import './Home.css'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='mainHomeDiv'>
      <div className='homeTopImage'>
        <div className='headerTextDiv'>
          <p className='firstLine'>Not everyone is Mozart</p>
          <p className='headerText'>Some of us need to</p>
          <p className='headerText'><span className='writeabadsong'>Write a <span className='bad'>bad </span>song</span> first.</p>
        </div>
      </div>
      <div className='secondDiv'>
        <p className='headerText center'>Some of us need a little push</p>
        <p className='headerText center'>So we award points each month</p>
        <p className='headerText center'>For those who post early and often</p>
      </div>
      <div className='thirdDiv'>
        <p className='headerText center'>Trouble finishing songs?</p>
        <p className='headerText center'>Try our collab page!</p>
        <Link to='/collaborate' className="center linkBtn">
        <button className='btn center'>Collaborate!</button>
        </Link>
      </div>
      <div className='secondDiv'>
        <p className='headerText center'>Just want to see what's here?</p>
        <p className='headerText center'>Check out the feed!</p>
        <Link to='/feed' className="center linkBtn">
          <button className='btn center'>Scroll Away!</button>
        </Link>
      </div>
      <div className='thirdDiv'>
        <p className='headerText center'>Or are you ready to dive in?</p>
        <Link to='/profile' className="center linkBtn">
        <button className='btn center'>Profile</button>
        </Link>
      </div>
    </div>
  )
}

export default Home