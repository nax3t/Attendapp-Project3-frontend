'use strict';

app.factory('Course', function($resource) {
	// Connect to backend here using $resource
	return $resource('https://attendapp-backend.herokuapp.com/courses/:id', {
	id: '@id'
	}, {
	// Make Attendee.update() available
	'update': { method: 'PUT' },
	// Make Attendee.create() available
	'create': { method: 'POST' },
	});
});

