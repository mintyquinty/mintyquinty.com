var gameData,
	mlburl = 'http://gdx.mlb.com/components/game/mlb/year_2015/month_09/day_12/master_scoreboard.json',
	imagesOK = 0,
	images = [],
	newAddress,
	w = window.innerWidth,
	h = window.innerHeight,
	activeGameCanvas,
	newDate,
	prevDate,
	nextDate;

function createGameList()
{
	parseURL(window.location.href);
	setURL();
	loadJSON(function(data) { 
			gameData = data['data']['games']['game'];
			extractThumbnails(createThumbnail);
		},
		function(xhr) { console.error(xhr); }
	);
}

function loadJSON(success, error)
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
    xhr.open("GET", mlburl, true);
    xhr.send();
}

function extractThumbnails(callback)
{
	if (gameData) {
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
	} else {
		document.getElementById('today').innerHTML = 'No games on ' + newDate.toDateString();
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
	context.fillText(datetimeText, 78, 144);
	context.lineWidth = 2;
	context.strokeStyle = '#fff';
	context.strokeRect(3, 20, 155, 88);
	activeGameCanvas = myCanvas;
}

function fourohfour(){
	//console.log('whoops', this);
	this.src = "images/404-124x70.jpg";
}

function setURL()
{
	var dateArray = getDateInfo(newDate);	
	mlburl = 'http://gdx.mlb.com/components/game/mlb/year_' + dateArray['year'] + '/month_' + dateArray['month'] + '/day_' + dateArray['day'] + '/master_scoreboard.json';
	setLinks();
}

function parseURL(url) {
    var address, query, param, dateValue, today;
	address = url.split('?');
	newAddress = address[0]; // Global
    query = address[1] ? address[1].split('&') : [];
    for(var i = 0; i < query.length; i++ ) {
        param = query[i].split('=');
        if (param[0] == 'date') dateValue = param[1];
    }
	today = dateValue || '05/20/2015';
	newDate = new Date(today); // Global
	document.getElementById('today').innerHTML = newDate.toDateString();
}

function setLinks()
{
	var prev = document.getElementById('prev-day');
	var next = document.getElementById('next-day');
	prevDate = new Date(newDate - 1000 * 60 * 60 * 24 * 1); // Global
	nextDate = new Date(newDate.getTime() + 1000 * 60 * 60 * 24 * 1); // Global
	var prevDateArray = getDateInfo(prevDate);
	var nextDateArray = getDateInfo(nextDate);
	var prevLoc = newAddress + '?date=' + prevDateArray['month'] + '/' + prevDateArray['day'] + '/' + prevDateArray['year'];
	var nextLoc = newAddress + '?date=' + nextDateArray['month'] + '/' + nextDateArray['day'] + '/' + nextDateArray['year']
	prev.addEventListener('click', function() {
		window.location = prevLoc;
	}, false);
	next.addEventListener('click', function() {
		window.location = nextLoc;
	}, false);
}

function getDateInfo(someDate)
{
	console.log('someDate', someDate);
	var year = someDate.getFullYear();
	var month = ('0' + (someDate.getMonth() + 1)).slice(-2);
	var day = ('0' + someDate.getDate()).slice(-2);
	return {
		year: year,
		month: month,
		day: day
	}
}