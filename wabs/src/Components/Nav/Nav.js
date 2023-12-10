import { useEffect, useState  } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Nav.css';

function Nav({ user, unloadUser }) {
    const [isShrunken, setIsShrunken] = useState(false);

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

                    <div className="endOfNavBar">
                        {user.isLoggedIn ? (
                            <>
                                <h3 className={isShrunken ? "shrunkenAboveLogout": "aboveLogout"}>{user.userName}</h3>
                                <div className="loginBox" >
                                    <Link className="loginAndOutLink" to="/signout" onClick={unloadUser}>
                                        Sign Out
                                    </Link>
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