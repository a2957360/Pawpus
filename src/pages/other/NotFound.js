import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = ({ match }) => {
    return (
        <div>
            Oops! Page not found! 404.
            <Link to="/">Go home</Link>
        </div>
    )
};

export default NotFound;
