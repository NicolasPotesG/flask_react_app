import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './Profile.css';

const Profile = () => {

    const { user, isAuthenticated } = useAuth0();

    return (
        isAuthenticated && (<div>
            <div className='main-nav'>
                <h4 className='usuario'>Usuario:</h4>
                <img src={user.picture} alt={user.email} />
                <p className='email'>{user.email}</p>

            </div>
            <h4>Mis eventos:</h4>
        </div>
        )
    );
};

export default Profile;
