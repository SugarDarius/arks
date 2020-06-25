import * as React from 'react';
import { useLocation } from 'react-router-dom';

export function NotFound(): React.ReactElement {
    const { pathname } = useLocation();
    return (
        <h1>{`Page on URL ${pathname} not found!`}</h1>
    );
}