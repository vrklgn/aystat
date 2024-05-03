$(function() {
	var JP = new Game();
	var player1 = new Player();
	var player2 = new Player();
	var player3 = new Player();
	
	// TODO: set dynamically after counting boards in HTML	
	var board1 = new Board();
	
	JP.players.push(player1, player2, player3);
	JP.boards.push(board1);
	
	// Old set-up
	console.log("BUZZERS ❌");
	var round = 1,
		questionAvailable = 0,
		playerIsAnswering = 0,
		playerThatIsAnswering,
		questionCount = 0,
		currentCategoryHeader = 0,
		isTestingSounds = 1,
		answersAccepted = false;
	
	$(".overlay").hide();
		
	
	
	// Keyboard events
	$("body").keyup(function(e){

		if((e.keyCode == 81)){
			setOKToAnswer() 
			//JP.answersAccepted = true;
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
				$("#sCorrect")[0].play();
				removeOverlay();
				reset();
								
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
		console.log("BUZZERS ❌");
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
		$(".playerpic").hide().fadeOut();
		$("#wrong").hide();
		$("#right").hide();
		$("#playerNameFromAnsweringPlayer").hide();
		
		// Were all players wrong?
		if(JP.playersThatHaveAnswered.length >= JP.players.length) allPlayersWereWrong();
		
		// Let players answer again
		playerIsAnswering = 0;
	}
	
	
	function pauseAllSounds(){
		$("#round1 .c2 audio").each(function(e){
			$(this)[0].pause();
		});
	}
	
	
	function setOKToAnswer() {
			JP.answersAccepted = true;
			console.log("BUZZERS ✅");
	}
	

	if ('getGamepads' in navigator) {
 console.log("Gamepad API Available") // The API is supported!
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

const pollGamepads = () => {
  // Always call `navigator.getGamepads()` inside of
  // the game loop, not outside.
  const gamepads = navigator.getGamepads();
  for (const gamepad of gamepads) {
    // Disregard empty slots.
    if (!gamepad) {
      continue;
    }
	  	if(gamepad.buttons[0].pressed == true){
		playerThatIsAnswering = 1; 
		console.log ("PLAYER 1");
	// If player has already answered, return false
		if(JP.playerHasAnswered(JP.players[playerThatIsAnswering-1])) return false;
			// Else, add to answered list as that players answers
		JP.playersThatHaveAnswered.push(JP.players[playerThatIsAnswering-1]);
		pauseAllSounds();
		$("#s" + playerThatIsAnswering)[0].play();
		$("#p" + playerThatIsAnswering + "pic").show();
		var playerName = $("#p" + playerThatIsAnswering + "Name").html();
		$("#playerNameFromAnsweringPlayer").html(playerName);
		$("#playerNameFromAnsweringPlayer").show();
		playerIsAnswering = 1;}
    // Process the gamepad state.
    console.log(gamepad);
  }
  // Call yourself upon the next animation frame.
  // (Typically this happens every 60 times per second.)
  window.requestAnimationFrame(pollGamepads);
};
// Kick off the initial game loop iteration.
pollGamepads();
	//#nameOverlay 

});
