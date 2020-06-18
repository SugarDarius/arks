
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export function hydrate(Component: React.FC, nodeId: string): void {
    ReactDOM.hydrate((
        <Component />
    ), document.getElementById(nodeId));
}