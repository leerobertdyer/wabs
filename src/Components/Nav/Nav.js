import { useEffect, useState  } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import './Nav.css';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

function Nav({ user, unloadUser }) {
    const [isShrunken, setIsShrunken] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      const handleScroll = () => {
        const scrollThreshold = 200; 
        const shouldShrink = window.scrollY > scrollThreshold;
        setIsShrunken(shouldShrink);
      };
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };}, []); 

      const handleSignout = () => {
        signOut(auth).then(() => {
                unloadUser();
                navigate('/login')
          }).catch((error) => {
            alert(error)
          });
      }

        return (
            <div>
                <div  className={isShrunken ? "shrunken nav" : "notShrunken nav"}>
                    <div className='logoContainer'>
                    <img src='../../Assets/logo.png' alt="logo" className={isShrunken ? "shrunkenLogo" : "logo"} />
                    </div>
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : 'links')}>Home</NavLink>

                    <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : 'links')}>Profile</NavLink>

                    <NavLink to="/submit" className={({ isActive }) => (isActive ? 'active' : 'links')}>Submit</NavLink>

                    <NavLink to="/collaborate" className={({ isActive }) => (isActive ? 'active' : 'links')}>Collaborate</NavLink>

                    <NavLink to="/score" className={({ isActive }) => (isActive ? 'active' : 'links')}>Scoreboard</NavLink>

                    <div className="endOfNavBar">
                        {auth.currentUser ? (
                            <>
                                <h3 className={isShrunken ? "shrunkenAboveLogout": "aboveLogout"}>
                                    {user.userName.length > 10 ? `${user.userName.slice(0, 10)}...` : user.userName}</h3>
                                <div className="loginBox" >
                                    <div className="loginAndOutLink" to="/signout" onClick={handleSignout}>
                                        Sign Out
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="loginBox" >
                            <Link className="loginAndOutLink" to="/login">Login</Link>
                            </div>
                        )}
                    </div>

                </div>

            </div>
        )
    }


export default Nav;