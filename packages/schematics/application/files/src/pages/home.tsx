import * as React from 'react';
import { Link } from 'react-router-dom';

export function Home(): React.ReactElement {
    return (
       <React.Fragment>
            <h1>Welcome Developer!</h1>
            <Link to='/help'>
                If you need help
            </Link>
       </React.Fragment>
    );
}