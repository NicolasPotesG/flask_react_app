import { Navbar, Container } from 'react-bootstrap';
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton';

const NavbarComp = () => {
    const { isAuthenticated } = useAuth0();

    return <Navbar variant="dark" bg="dark" expand="lg">
        <Container>
            <Navbar.Brand>Eventos</Navbar.Brand>
            {
                isAuthenticated
                    ?
                    <LogoutButton />
                    :
                    <LoginButton />
            }
        </Container>
    </Navbar >;
};

export default NavbarComp;