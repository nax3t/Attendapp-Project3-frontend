'use strict';

app.factory('Attendee', function($resource) {
	// Connect to backend here using $resource
	return $resource('https://attendapp-backend.herokuapp.com/attendees/:id', {
	id: '@id'
	}, {
	// Make Attendee.update() available
	'update': { method: 'PUT' },
	// Make Attendee.create() available
	'create': { method: 'POST' }
	});
});