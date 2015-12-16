var gameData,
	mlburl = 'http://gdx.mlb.com/components/game/mlb/year_2015/month_09/day_12/master_scoreboard.json',
	imagesOK = 0,
	images = [],
	w = window.innerWidth,
	h = window.innerHeight,
	activeGameCanvas,
	activeGameCanvasId = 0,
	newDate;

function loadJSON(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

function extractThumbnails(callback)
{
    for (var i = 0; i < gameData.length; i++){
        img = new Image();
		images.push(img);
        img.onload = function(){ 
            imagesOK++; 
            if (imagesOK >= images.length) {
                callback();
            }
        };
		img.onerror = fourohfour;
		img.src = gameData[i]['video_thumbnail'];
    }
}

function createThumbnail()
{
    var mlbList = document.getElementById('mlb-content');
	mlbList.width = images.length * 162; //w;
	mlbList.height = h;
    for (var i = 0; i < images.length; i++){
		var myCanvas = document.createElement('canvas');
		myCanvas.width = 162;
		myCanvas.height = 200;
		myCanvas.id = i;
		myCanvas.addEventListener('click', function() { 
			selectedNewGame(this);
		}, false);
		drawThumbnail(myCanvas);
		mlbList.appendChild(myCanvas);
		
		if (i == 0 ) {
			//resetGame();
			highlightActiveGame(myCanvas);
		}
    }
}

function drawThumbnail(myCanvas) {
    var context = myCanvas.getContext('2d');
	context.globalAlpha = 0.5;
	context.drawImage(images[myCanvas.id], 19, 32, 124, 70);
}

function selectedNewGame(gameCanvas){
	resetGame(gameCanvas);
	highlightActiveGame(gameCanvas);
}

function resetGame(gameCanvas){
	if (gameCanvas == activeGameCanvas) return;
	var context = activeGameCanvas.getContext('2d');
	context.clearRect(0, 0, activeGameCanvas.width, activeGameCanvas.height);
	drawThumbnail(activeGameCanvas);
}

function highlightActiveGame(myCanvas){
	var context = myCanvas.getContext('2d');
	context.globalAlpha = 1.0;
	/* Game, Thumb, Time for active game */
	var gameText = gameData[myCanvas.id].away_name_abbrev + ' v ' + gameData[myCanvas.id].home_name_abbrev;
	var venueText = gameData[myCanvas.id].venue;
	var datetimeText = gameData[myCanvas.id].time_date + ' ' + gameData[myCanvas.id].time_zone;
	
	context.fillStyle = 'white';
	context.font = 'bold 15px Helvetica, Arial, sans-serif';
  	context.textAlign = 'center';
	context.fillText(gameText, 78, 16);
	
	context.drawImage(images[myCanvas.id], 6, 20, 155, 88);
	
	context.font = '12px Helvetica';
	context.fillText(venueText, 78, 124);
	context.fillText(datetimeText, 78	, 144);
	
	context.lineWidth = 2;
	context.strokeStyle = '#fff';
	context.strokeRect(3, 20, 155, 88);
	
	activeGameCanvas = myCanvas;
}

function fourohfour(){
	//console.log('whoops', this);
	this.src = "images/404-124x70.jpg";
}

/* Wait... what day is it? */
function parseURL(url) {
    var loc, searchObject = {},
        queries, split, i;
    // Convert query string to object
	loc = url.split('?'); 
    queries = url.replace(/^\?/, '').split('&');
    for( i = 0; i < queries.length; i++ ) {
        split = queries[i].split('=');
        //searchObject[split[0]] = split[1];
        searchObject['today'] = split[1];
    }
    return {
		location: loc[0],
        searchObject: searchObject,
    };
}

function displayToday() {
	var whatDayIsIt = parseURL(window.location.href);
	var today = whatDayIsIt.searchObject['today'];
	var fixedDateString = '19';
	var fixedMonthString = '05';

	if (typeof today === 'undefined') {
		// May 20, 2015 by default
		newDate = new Date(2015, 4, 20);
	} else {
		var parts = today.split('/');
		newDate = new Date(parts[2],parts[0]-1,parts[1]);
		
		fixedDateString = (parts[1]).toString();
		if (parts[1] < 10) fixedDateString = '0' + fixedDateString;
		
		fixedMonthString = (parts[0]-1).toString();
		if (parts[0]-1 < 10) fixedMonthString = '0' + fixedMonthString;
		
		mlburl = 'http://gdx.mlb.com/components/game/mlb/year_' + parts[2]+ '/month_' + fixedMonthString + '/day_' + fixedDateString + '/master_scoreboard.json';
	}
	/*
	TODO: Fix this up
	var prev = document.getElementById('prev-day');
	var next = document.getElementById('next-day');
	
	var prevLoc = whatDayIsIt['location'] + '?date=' + fixedMonthString + '/' + fixedDateString+ '/' + newDate.getFullYear();

	
	console.log('prevLoc', prevLoc);
	
	prev.addEventListener('click', function() {
		window.location = prevLoc;
	}, false);
	*/
}