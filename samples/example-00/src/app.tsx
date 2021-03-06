import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import { 
    Home,
    Help,
    NotFound,
} from './pages';

export default function App(): React.ReactElement {
    return (
        <Switch>
            <Route exact path='/'>
                <Home />
            </Route>
            <Route path='/help'>
                <Help />
            </Route>
            <Route path='*'>
                <NotFound />
            </Route>
        </Switch>
    );
}