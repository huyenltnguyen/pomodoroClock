$("document").ready(function() {
	var sessionDuration = $("#session").val() * 60 * 1000;
	var breakDuration = $("#break").val() * 60 * 1000;
	var run = true;
	var onSession = true;
	var seconds;
	var minutes;
	var interval;

	var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'https://www.freesound.org/data/previews/153/153213_2499466-lq.mp3');

	// initial timer title and value
	$("#timerTitle").text("Session");
	$("#timer").text(formatTime($("#session").val() + ":" + "00"));


	///  EVENT HANDLERS  ///

	// reset button
	$("#resetBtn").on("click", function() {
		// reset time
		minutes = undefined;
		seconds = undefined;
		// switch timer back to session
		$("#timerTitle").text("Session");
		$("#timer").text(formatTime($("#session").val() + ":" + "00"));
		// stop timer
		clearInterval(interval);
		// switch timerBtn's state
		run = true;
		$("#timerBtn").html("<i class='fa fa-play'></i> Start Timer");
	});

	// get input value
	$(".duration").change(function() {
		if ( validateInput($("#session").val()) ) {
			//input range is from 15 to 60			
			if ($("#session").val() < 15) {
				$("#session").val(15);
			} else if ($("#session").val() > 60) {
				$("#session").val(60);
			};

			// updates timer displayed on screen
			$("#timer").text(formatTime($("#session").val() + ":" + "00"));

			// updates session duration after change
			sessionDuration = $("#session").val() * 60 * 1000;
		}
		
		if ( validateInput($("#break").val()) ) {
			//input range is from 5 to 30			
			if ($("#break").val() < 5) {
				$("#break").val(5);
			} else if ($(this).val() > 30) {
				$("#break").val(30);
			};

			// updates break duration on screen
			breakDuration = $("#break").val() * 60 * 1000;
		}		
	});		

	// button for starting and stopping the timer
	$("#timerBtn").on("click", function() {
		if (run) {
			$(this).html("<i class='fa fa-pause'></i> Stop Timer");
		 	runTimer();		 		
		} else {
			$(this).html("<i class='fa fa-play'></i> Start Timer");	
		 	pauseTimer();		 	
		}
		run = !run;
	});


	///  FUNCTIONS FOR TIMER  ///

	// check if input is a string that is no longer than 3 characters and contains numbers only
	function validateInput(str) {
		return (str.length < 3 && parseInt(str) === parseInt(str));
	}

	// add an extra 0 when minute and second have 1 digit
	function formatTime(time) {
		var str = time;
		if (time < 10) {str = "0" + time;}
		return str;
	}

	// convert input (in milliseconds) to minutes and seconds for screen display
	function setTimer(duration) {
		if ( (minutes === undefined && seconds === undefined) || (minutes === 0 && seconds === 0) ) {
			minutes = Math.floor( (duration / 1000) / 60 );
			seconds = Math.floor( (duration / 1000) % 60 ) * 60;
		}
		return minutes, seconds;			
	}

	// run timer
	function runTimer() {
		if (onSession) {			
			setTimer(sessionDuration);
			$("#timerTitle").text("Session");
			interval = setInterval(updateTimer, 1000);		
			
		} else {			
			setTimer(breakDuration);
			$("#timerTitle").text("Break");
			interval = setInterval(updateTimer, 1000);
		}
	}


	// update timer every second
	function updateTimer() {
		if (seconds === 0 && minutes === 0) {
			onSession = !onSession;
			clearInterval(interval);
			// alarm goes off
			audioElement.play();
			// runTimer after the sound ended
			audioElement.addEventListener("ended", function() {
				runTimer();
			});
			
		} else if (seconds === 0) {
			minutes--;
			seconds = 59;
		} else {
			seconds--;
		}		

		$("#timer").text(formatTime(minutes) + ":" + formatTime(seconds));
	}

	// pause timer
	function pauseTimer() {
		clearInterval(interval);				
	}	

});