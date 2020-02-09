import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Router, Route, Switch } from 'react-router';
import { createBrowserHistory } from 'history';

import App from '../ui/components/App';
import Auth from '../ui/components/authentication/Auth';
import FileUpload from '../ui/components/FIleUpload/FileUpload';
const history = createBrowserHistory();
const unauthenticatedPages = ['/'];
const authenticatedPages = ['/app','./file'];

export const renderRoutes = (
    <Router history={history}>
        <Switch>
            <Route exact path="/" component={Auth}  />
            <Route exact path="/app" component={App}  />
			<Route exact path="/file" component={FileUpload}  />
        </Switch>
    </Router>
)

export const onAuthChange = (isAuthenticated) => {
	console.log('isAuthenticated', isAuthenticated);
	const pathname = history.location.pathname;
	console.log(pathname);
	console.log(authenticatedPages.includes(pathname));
	if (isAuthenticated && unauthenticatedPages.includes(pathname)) {
		console.log('replacing with links');
		return history.replace('/app')
	} else if (!isAuthenticated && authenticatedPages.includes(pathname)) {
		console.log('replacing with /');
		return history.replace('/');
	}
}