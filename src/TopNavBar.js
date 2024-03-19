import React from "react";
import { NavLink } from "react-router-dom";
import { Nav, Navbar, Container } from "react-bootstrap";

const TopNavBar = () => {
    return (
        <div className="mb-4">
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/">
                        <img alt="" src="/images/icons/ios/32.png" className="d-inline-block align-top" /> Oxford iWriter
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="top-NavBar" />
                    <Navbar.Collapse id="top-NavBar">
                        <Nav className="me-auto" variant="underline">
                            <NavLink to="/" className="nav-link">Home</NavLink>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};

export default TopNavBar;
