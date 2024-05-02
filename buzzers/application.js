$(function() {

	if ('getGamepads' in navigator) {
 console.log("Well it works") // The API is supported!
}
	window.addEventListener("gamepadconnected", (e) => {
  	console.log(
    "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index,
    e.gamepad.id,
    e.gamepad.buttons.length,
    e.gamepad.axes.length,
  );
})
	// Initialize
	var JP = new Game();
	
	var player1 = new Player(),
		player2 = new Player(),
		player3 = new Player();
	
	// TODO: set dynamically after counting boards in HTML	
	var board1 = new Board(),
		board2 = new Board();
	
	JP.players.push(player1, player2, player3);
	JP.boards.push(board1, board2);
	
	
	// Old set-up
	var round = 1,
		questionAvailable = 0,
		playerIsAnswering = 0,
		playerThatIsAnswering,
		questionCount = 0,
		currentCategoryHeader = 0,
		isTestingSounds = 1;
	
	$(".overlay").hide();
		
	
	
	// Keyboard events
	$("body").keyup(function(e){

		if((e.keyCode == 81)){
			JP.answersAccepted = true;
		}
		
		// A player tries to answer
		if((e.keyCode >= 97 && e.keyCode <= 99) || (e.keyCode >= 49 && e.keyCode <= 51)){
			// Stop if players can't answer or if a player is answering
			if(!JP.answersAccepted || playerIsAnswering) return false;
			
			// set playerThatIsAnswering to 1,2 or 3
			// TODO: Change this to 0, 1 or 2 -everywhere-
			if(e.keyCode < 60) { 
				playerThatIsAnswering = e.keyCode - 48;
			} else {
				playerThatIsAnswering = e.keyCode - 96;	
			}
			
			// If player has already answered, return false
			if(JP.playerHasAnswered(JP.players[playerThatIsAnswering-1])) return false;
			// Else, add to answered list as that players answers
			JP.playersThatHaveAnswered.push(JP.players[playerThatIsAnswering-1]);
			
			pauseAllSounds();
			
			// TODO: Replace the two functions below with one function: "presentPlayer(player)"
			// Play player sound
			$("#s" + playerThatIsAnswering)[0].play();
			
			// Show AWESOME pic from answering player
			$("#p" + playerThatIsAnswering + "pic").show();
			
			// Show name from the player that is answering
			var playerName = $("#p" + playerThatIsAnswering + "Name").html();
			$("#playerNameFromAnsweringPlayer").html(playerName);
			$("#playerNameFromAnsweringPlayer").show();
			
			// Allow judgement, prevents more answers
			playerIsAnswering = 1;
		}
		
		// Judgement - "W" or "R" key is pressed
		if(e.keyCode == "82" || e.keyCode == "87"){
			if(!playerIsAnswering && e.keyCode == "87"){
				$("#sBidup")[0].play();
				removeOverlay();
				reset();
			}
			if(!playerIsAnswering) return false;
			// Right?
			if(e.keyCode == 82) {
				removeOverlay();
				reset();
				
				// Play sound
				if(JP.currentQuestionElement.hasClass("sound")){
					JP.currentQuestionElement.find("audio")[0].play();
					// Set OK to answer!
					JP.answersAccepted = true;
				}
								
			} else {

				// Play wrong sound
				$("#sBidup")[0].play();
				
				//$("#wrong").show();
				// Remove overlay after 600 ms
				setTimeout(removeOverlay,600);	
			}
		}	
		
		
		
		// Man trycker på "P". Spela det-kukar-ur-ljudet
		if (e.keyCode == 80) {
			var theSound = $("#sKukarUr")[0];
			if(theSound.paused) {
				theSound.play();
			} else {
				// If is playing, pause instead
				theSound.pause();
				theSound.currentTime = 0
			}
		}
		
	});
	
	// TODO: Rename to newRound()
	function reset(){		
		// Reset all cool stuff
		JP.answersAccepted = false,
		questionAvailable = 0,
		playerIsAnswering = 0;
		
		JP.playersThatHaveAnswered = [];
		
		// Reset UI
		$(".overlay").fadeOut();
		
		// Is round 1 over?
		if(questionCount >= 25 && round == 1){
			startRound2();
		}
		
		if(questionCount >= 50 && round == 2){
			showLastQuestionCategory();
		}
	}
	
	function allPlayersWereWrong(){
		// $("#sWrong")[0].play(); – Sound is too annoying. Change to a new one
		reset();
	}
	
	function removeOverlay(){
		$(".playerpic").hide();
		$("#wrong").hide();
		$("#right").hide();
		$("#playerNameFromAnsweringPlayer").hide();
		
		// Were all players wrong?
		if(JP.playersThatHaveAnswered.length >= JP.players.length) allPlayersWereWrong();
		
		// Let players answer again
		playerIsAnswering = 0;
	}
	
	function startRound2(){
		$("#round1").fadeOut('fast', function(e){
			showRound2();
		});
		round = 2;
	}
	
	function showRound2(){
		currentCategoryHeader = 0;
		$("#categories h1").html(JP.boards[1].categories[0].title);
		$("#categories h1").fadeIn();
		$("#categories").fadeIn();
		$("#round2").fadeIn();
	}
	
	function cheatStartRound2(){
		questionCount = 25;
		reset();
	}
	
	function toggleHighScores(){
		if($("#highscore").is(":visible")){
			$("#highscore").fadeOut();
		} else {
			// If highscore will be shown, update the scores
			for(var i = 0; i < 3; i++){
				var playerHighscore = JP.players[i].score == 0 ? "000" : JP.players[i].score;
				//alert(i+1 + ": " + playerHighscore);
				$("#highscore .p" + parseInt(i+1) + " span").html(playerHighscore);
			}
			
			$("#highscore").fadeIn();
		}
	}
	
	function pauseAllSounds(){
		$("#round1 .c2 audio").each(function(e){
			$(this)[0].pause();
		});
	}
	
	var showingLastQuestionCategory = 0;
	function showLastQuestionCategory(){
		// Is showing last category
		showingLastQuestionCategory = 1;
		$("#finalQuestionCategory").fadeIn();
	}
	
	function showLastQuestion(){
		$("#finalQuestion").fadeIn();	
	}
	
	function toggleVisibleVideoPlayState(){
		$(".videoOverlay video:visible")[0].paused ? $(".videoOverlay video:visible")[0].play() : $(".videoOverlay video:visible")[0].pause();
	}
	
	// When a video finishes, hide all shit and reset
	$(".videoOverlay video").each(function(e){
		var video = $(this)[0];
		video.addEventListener('ended',hideVideoAndReset,false);
	});
	
	function hideVideoAndReset() {
		if($(".videoOverlay video:visible")) {
			$(".videoOverlay video:visible").hide();
			$(".videoOverlay").fadeOut('fast');
			reset();
		}
	}
	
	function setOKToAnswer() {
		if (questionAvailable) {
			JP.answersAccepted = true;
			console.log("Now OK to answer");
		}
	}
	
	function showHighScoreAndAnimate(playerThatAnswered) {
		// Calculate highscore
	    for(var i = 0; i < 3; i++){
	        var playerHighscore = JP.players[i].score == 0 ? "000" : JP.players[i].score;
	        $("#highscore .p" + parseInt(i+1) + " span").html(playerHighscore);
	    }
	    
		// Show the highscore board
		$("#highscore").fadeIn('fast', function(){
		
			// Grow and shrink that players' points
			$("#highscore .p" + playerThatAnswered + " span").animate({fontSize: 130.0}, 250, function(){
				// Animate back
				$(this).animate({fontSize: 120.0}, 250);
			});

		});
			
	}
	
	/* If Click on gifhscore bubble */
	$("#highscore .p1").click(function(e){
		$("#nameOverlay").html("TANTAN").fadeIn('fast');
	});
	
	$("#highscore .p2").click(function(e){
		$("#nameOverlay").html("FLUFF").fadeIn('fast');
	});	
	
	$("#highscore .p3").click(function(e){
		$("#nameOverlay").html("ANTILA").fadeIn('fast');
	});
	
	$("#nameOverlay").click(function(e){
		$(this).fadeOut('fast');
	});

	//#nameOverlay 

});
