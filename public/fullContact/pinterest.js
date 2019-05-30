// import
var pinterestAPI = require('pinterest-api');

// Create a new object and set the accountname
var pinterest = pinterestAPI(accountName);

// Get pins from a board (second parameter determines whether you want the results paginated and to include some metadata)
pinterest.getPinsFromBoard(boardName, true, function (pins) {
	...
});

// Get all pins
pinterest.getPins(function (pins) {
	...
});

// Get all boards (first parameter determines whether you want the results pagined and to include some metadata)
pinterest.getBoards(true, function (boards) {
	...
});

// Get data for pins (note that this is a static method (a method of the class itself) since it does not rely on any state)
pinterestAPI.getDataForPins(arrayOfPinIds, function (data) {
    ...
});