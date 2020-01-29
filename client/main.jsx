
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Tracker } from 'meteor/tracker'
import './main.scss';
import { onAuthChange, renderRoutes } from '../imports/config/routes';
import { Session } from 'meteor/session';

Tracker.autorun(() => {
	console.log('VISIBILITY:', Session.get('visibility'));
	const isAuthenticated = !!Meteor.userId();
	onAuthChange(isAuthenticated);
});
Meteor.startup(() => {
  render(renderRoutes, document.getElementById('wassup'));
});
