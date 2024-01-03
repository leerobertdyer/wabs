import { useState, useRef } from "react";
import { Link } from "react-router-dom";

const ProfileLink = ({ post }) => {
    const [isHovered, setIsHovered] = useState(false);
    const profilePicRef = useRef(null)

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <>
            <Link to={{ pathname: '/profile', search: `?otherusername=${post.username}` }}
                ref={profilePicRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="thumbnailDiv"
                style={{ backgroundImage: `url(${isHovered ? '' : post.user_profile_pic})`, backgroundSize: 'cover' }}>
                {isHovered && <h1>{post.username}</h1>}
            </Link>
        </>
    )
}

export default ProfileLink