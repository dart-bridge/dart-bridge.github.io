import React from 'react';
import Menu from './Menu';

class Header extends React.Component {

    constructor(attributes) {
        super(attributes);
    }

    render() {

        return (
            <header>
                <Menu />
            </header>
        );
    }
}

export default Header;