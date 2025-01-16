import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <div className='header'>
            <nav>


                <ul>
                    <NavLink to='/' className={(nav) => (nav.isActive ? "nav-active" : "")}>
                        <li>Home</li>
                    </NavLink >

                    <NavLink to='/favorites' className={(nav) => (nav.isActive ? "nav-active" : "")} >
                        <li>Favoris</li>
                    </NavLink>
                </ul>
            </nav>
            <div className='title'>
                <h1>KinoRama</h1>
            </div>

        </div>
    );
};

export default Header;