'use strict';

app.factory('Attendance', function($resource) {
	// Connect to backend here using $resource
	return $resource('http://localhost:3000/attendances/:id', {
	id: '@id'
	}, {
	// Make Attendee.update() available
	'update': { method: 'PUT' },
	// Make Attendee.create() available
	'create': { method: 'POST' }
	});
});