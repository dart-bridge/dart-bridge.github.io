import React from 'react';
import {Link} from 'react-router';
import pages from './pages';

class Menu extends React.Component {

    constructor(attributes) {
        super(attributes);
    }

    render() {
        return (
            <ul className='menu'>
                <li><img src="/images/logo-blue.svg" alt="Bridge"/></li>
                <li className='desc'>
                    <p className='text-center'>
                        An accessible and scalable <span style={{whiteSpace:'nowrap'}}>end-to-end</span> framework for
                        Dart
                    </p>
                </li>
                {Object.keys(pages).map((key) => (
                    <ul data-label={key}>
                        {Object.keys(pages[key]).map((key2) => (
                            <li><Link to={key2}>{pages[key][key2]}</Link></li>
                        ))}
                    </ul>
                ))}
            </ul>
        );
    }
}

export default Menu;