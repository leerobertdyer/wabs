import { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import './Nav.css';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useMediaQuery } from 'react-responsive';
import { GiHamburgerMenu } from "react-icons/gi";
import Notifications from '../Notifications/Notifications';


function Nav({ user, unloadUser, token, socket }) {
    const [isShrunken, setIsShrunken] = useState(false);
    const [showLinks, setShowLinks] = useState(false);
    const [showLogoutMenu, setShowLogoutMenu] = useState(true);
    const isMobile = useMediaQuery({ query: '(max-width: 500px)' })
    const navigate = useNavigate();
    useEffect(() => {
        !isMobile && setShowLinks(false)
    }, [isMobile])

    useEffect(() => {
        const handleScroll = () => {
            const scrollThreshold = 200;
            const shouldShrink = window.scrollY > scrollThreshold;
            setIsShrunken(shouldShrink);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLinkClick = (link) => {
        setShowLinks(false); // Close the links before navigating
        navigate(link);
      };

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
            <div className={isShrunken ? "shrunken nav" : "notShrunken nav"}>
                <div className='logoContainer'>
                    <img src='../../Assets/logo.png' alt="logo" className={isShrunken ? "shrunkenLogo" : "logo"} />
                </div>
                {showLinks &&
                        <div className='loading showLinks' onClick={() => setShowLinks(false)}>
                            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : 'links')}>Home</NavLink>
                            <NavLink to="/feed" className={({ isActive }) => (isActive ? 'active' : 'links')}>Feed</NavLink>
                            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : 'links')}>Profile</NavLink>
                            <NavLink to="/submit" className={({ isActive }) => (isActive ? 'active' : 'links')}>Submit</NavLink>
                            <NavLink to="/collaborate" className={({ isActive }) => (isActive ? 'active' : 'links')}>Collaborate</NavLink>
                            <NavLink to="/score" className={({ isActive }) => (isActive ? 'active' : 'links')}>Scoreboard</NavLink>
                        </div>}
                    {isMobile
                    ? <div className='hamburger'
                        onClick={() => setShowLinks(true)}
                    ><GiHamburgerMenu size={60} />
                    </div>
                 
                        : 
                        <div className='linkList'>
                            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : 'links')}>Home</NavLink>
                            <NavLink to="/feed" className={({ isActive }) => (isActive ? 'active' : 'links')}>Feed</NavLink>
                            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : 'links')}>Profile</NavLink>
                            <NavLink to="/submit" className={({ isActive }) => (isActive ? 'active' : 'links')}>Submit</NavLink>
                            <NavLink to="/collaborate" className={({ isActive }) => (isActive ? 'active' : 'links')}>Collaborate</NavLink>
                            <NavLink to="/score" className={({ isActive }) => (isActive ? 'active' : 'links')}>Scoreboard</NavLink>
                        </div>
                }


                <div className="endOfNavBar">
                    {auth.currentUser ? (
                        <>
                        <div className='userNameAndNotifications'>
                                <div className="notificationsDiv" onClick={() => setShowLogoutMenu(!showLogoutMenu)}>
                                    <Notifications type="all" useClick={true} token={token} socket={socket}/>
                                    </div>
                            <h3 className={isShrunken ? "shrunkenAboveLogout" : "aboveLogout"}>
                                {user.username.length > 10 ? `${user.username.slice(0, 10)}...` : user.username}</h3>
                        </div>
                        {showLogoutMenu &&
                            <div className="loginBox" >
                                <div className="loginAndOutLink" to="/signout" onClick={handleSignout}>
                                    Sign Out
                                </div>
                            </div>
                        }
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