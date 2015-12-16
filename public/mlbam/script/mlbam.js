var gameData,
	mlburl = 'http://gdx.mlb.com/components/game/mlb/year_2015/month_09/day_12/master_scoreboard.json',
	imagesOK = 0,
	images = [],
	w = window.innerWidth,
	h = window.innerHeight,
	activeGameCanvas,
	newDate;

function createGameList()
{
	displayToday();
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

function setURL()
{
	var month = ('0' + newDate.getMonth()).slice(-2);
	var day = ('0' + newDate.getDate()).slice(-2);
	mlburl = 'http://gdx.mlb.com/components/game/mlb/year_' + newDate.getFullYear()+ '/month_' + month + '/day_' + day + '/master_scoreboard.json';
}

function parseURL(url) {
    var address, query, param, dateValue;
	address = url.split('?'); 
    query = address[1] ? address[1].split('&') : [];
    for(var i = 0; i < query.length; i++ ) {
        param = query[i].split('=');
        if (param[0] == 'date') dateValue = param[1];
    }
    return {
		location: address[0],
        dateValue: dateValue,
    };
}

function displayToday() {
	var whatDayIsIt = parseURL(window.location.href);
	var today = whatDayIsIt.dateValue || '05/20/2015';
	newDate = new Date(today);
	document.getElementById('today').innerHTML = newDate.toDateString();
	
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