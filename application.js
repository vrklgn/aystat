$(function() {
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
	$("#finalscore").hide()
		
	// Collect headers and questions and create objects
	$(".round").each(function(index){
		$(this).find(".category").each(function(e){
			var categoryTitle = $(this).find("h1").html(),
				newCategory = new Category();
			newCategory.title = categoryTitle;
			
			// Find questions in category and add to category
			$(this).find(".q").each(function(questionIndex){
				var questionHTML = $(this).html(),
					questionPoints = parseInt($(this).parent().find("span").html()),
					newQuestion = new Question();
				newQuestion.title = questionHTML;
				newQuestion.points = questionPoints;
				newCategory.questions.push(newQuestion);	
			});
			
			// Add category to board			
			JP.boards[index].categories.push(newCategory);
		});
	});
	
	// A question is clicked: Show it
	$("#finalscore button#orange").click(function(e){
		if ($("#finalscore input#orange")[0].value == ""){console.log("Robert stop breaking the game")}
			else {JP.players[1].score += parseInt($("#finalscore input#orange")[0].value);
	console.log("ORANGE: " + parseInt($("#finalscore input#orange")[0].value))}
	})

	$("#finalscore button#lilac").click(function(e){
		if ($("#finalscore input#lilac")[0].value == ""){console.log("Robert stop breaking the game")}
			else {JP.players[0].score += parseInt($("#finalscore input#lilac")[0].value);
		console.log("LILAC: " + parseInt($("#finalscore input#lilac")[0].value))}
	})

	$("#finalscore button#coffee").click(function(e){
		if ($("#finalscore input#coffee")[0].value == ""){console.log("Robert stop breaking the game")}
			else {JP.players[2].score += parseInt($("#finalscore input#coffee")[0].value);
		console.log("COFFEE: " + parseInt($("#finalscore input#lilac")[0].value))}
	})





	$(".category div").click(function(e){
		if($(this).data("hasBeenDisplayed") == 1) return false;
		$(this).data("hasBeenDisplayed", 1);
		questionCount++;
		questionAvailable = 1; // Replace with: if(JP.currentQuestion.shown == false) or something similar

		var questionIndex = $(this).index()-1,
			categoryIndex = $(this).parent().index(),
			boardIndex = $(this).parent().parent().index();
		JP.currentQuestion = JP.boards[boardIndex].categories[categoryIndex].questions[questionIndex];
		JP.currentQuestionElement = $(this);
				
		// Set data to be displayed
		$overlay = $(".overlay");
		$overlay.find("p").html(JP.currentQuestion.title)
			.end().find(".points span").html(JP.currentQuestion.points);
			
		// TO-DO: Animate bubble - flip and expand
		// Remove the blob that was clicked
		$(this).animate({opacity: 0.0}, 100);
		
		// Play sound if sound bubble

		if ($(this).hasClass("sound")) {
			console.log("SOUND DETECTED LINE 74")
					JP.currentQuestionElement.find("audio")[0].play();
					// Set OK to answer!
					JP.answersAccepted = true;
		}
		if ($(this).hasClass("video")) { // If not, play if it is a video
			// Fade in background, and once that is finished, show and play the movie
			$(".videoOverlay").fadeIn('fast', function(){
				$(".videoOverlay video").eq(questionIndex).fadeIn('fast')[0].play();
			});
			// Set OK to answer! 
			JP.answersAccepted = true;
		}
		setTimeout(setOKToAnswer,1500);
		
		// Fade in overlay
		$(this).hasClass("video") ? 0 : $(".overlay").fadeIn();
		
	});
	
	$("body").keyup(function(e){
	});
	
	// TODO: Remove this and set in intro function
	// Set first text for intro
	$("#categories h1").html(JP.boards[0].categories[0].title);
	
	// Keyboard events
	$("body").keyup(function(e){
	
		// Are we testing sound?
		if(isTestingSounds == 1){
			console.log("TESTING SOUNDS")
			if(e.keyCode >= 49 && e.keyCode <= 51){
				playerThatIsAnswering = e.keyCode - 48;
				// Play player sound
				$("#s" + playerThatIsAnswering)[0].play();
			
				// Show AWESOME pic from answering player
				$("#p" + playerThatIsAnswering + "pic").fadeIn('slow', function(e){
					$("#p" + playerThatIsAnswering + "pic").fadeOut('slow');	
				});
				return false;
				
	    	} else if (e.keyCode == 39) {
	    		isTestingSounds = 0;
	    		console.log("TEST IS OVER")
	    		$("#testSounds").fadeOut();
	    		
	    		return false;
	    	}
		}
		
		// Round intro!
		// Change category on key right
		// Don't if a qurstion is showing
		if(e.keyCode == 39 && round == 1 && !questionAvailable && !JP.answersAccepted){
			$("#categories h1").fadeOut('fast', function(e){
				currentCategoryHeader++;
				if(currentCategoryHeader >=3) {
					$('#round1 .category > div').hide();
					var delay = 80;
                    $("#categories").fadeOut(300, function(){
                        for (var i=0; i < 5; i++) {
                            $('#round1 .category:eq(0) > div:eq('+i+')').delay(delay*i).fadeIn();
                            $('#round1 .category:eq(1) > div:eq('+i+')').delay((delay*5)+delay*i).fadeIn();
                            $('#round1 .category:eq(2) > div:eq('+i+')').delay((delay*10)+delay*i).fadeIn();
                            $('#round1 .category:eq(3) > div:eq('+i+')').delay((delay*15)+delay*i).fadeIn();
                            $('#round1 .category:eq(4) > div:eq('+i+')').delay((delay*20)+delay*i).fadeIn();
                           
                        };
                    });
					return false;
				}
				$("#categories h1").html(JP.boards[0].categories[currentCategoryHeader].title).fadeIn('fast');
			});
		}
		
		// Round intro again!
		// Change category (for round 2) on key right
		if(e.keyCode == 39 && round == 2){
			$("#categories h1").fadeOut('fast', function(e){
				currentCategoryHeader++;
				if(currentCategoryHeader >=5) {
					$('#round2 .category > div').hide();
					var delay = 80;
                    $("#categories").fadeOut(300, function(){
                        for (var i=0; i < 5; i++) {
                            $('#round2 .category:eq(0) > div:eq('+i+')').delay(delay*i).fadeIn();
                            $('#round2 .category:eq(1) > div:eq('+i+')').delay((delay*5)+delay*i).fadeIn();
                            $('#round2 .category:eq(2) > div:eq('+i+')').delay((delay*10)+delay*i).fadeIn();
                            $('#round2 .category:eq(3) > div:eq('+i+')').delay((delay*15)+delay*i).fadeIn();
                            $('#round2 .category:eq(4) > div:eq('+i+')').delay((delay*20)+delay*i).fadeIn();
                        };
                    });
					
					
					return false;
				}
				$("#categories h1").html(JP.boards[1].categories[currentCategoryHeader].title).fadeIn('fast');
			});
		}
		
		// Is on almost last slide, will display the last question. PLACE YOUR BETS PEOPLE
		if(e.keyCode == 39	&& showingLastQuestionCategory == 1){
			showLastQuestion();
		}
		
		// Set OK to answer!
		if(e.keyCode == "13" && questionAvailable) {
			// OK to answer!
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
			// Is video playing? Pause it!
			$(".videoOverlay video:visible")[0] ? $(".videoOverlay video:visible")[0].pause() : console.log("No video is playing");
			
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
			if(!playerIsAnswering && e.keyCode == "87" && questionAvailable){
				$("#sBidup")[0].play();
				pauseAllSounds();
				removeOverlay();
				reset();
			}
			if(!playerIsAnswering) return false;
			// Right?
			if(e.keyCode == 82) {
				// Correct!							
				//$("#right").show();
				JP.players[playerThatIsAnswering-1].score += JP.currentQuestion.points;
				removeOverlay();
			

				
				// If right, and video queston - start playing the video again
				//$(".videoOverlay video:visible")[0] ? $(".videoOverlay video:visible")[0].play() : reset();
				if ($(".videoOverlay video:visible")[0]) {
					hideVideoAndReset()
				} else {
					reset();
					// If not videoOverlay, show points and count up
					showHighScoreAndAnimate(playerThatIsAnswering);
				}
								
			} else {
				// Wrong		
				JP.players[playerThatIsAnswering-1].score -= JP.currentQuestion.points;
				
				// Play wrong sound
				$("#sBidup")[0].play();

			
				
				//$("#wrong").show();
				// Remove overlay after 600 ms
				setTimeout(removeOverlay,600);	
				console.log("Player was wrong - turn sound on in 2s")
				setTimeout(soundOn,2000);


			}
		}	
		
		// MAN TRYCKER PÅ M
		if(e.keyCode == 77){
			cheatStartRound2();
		}

		if(e.keyCode == 67){
			if($("#finalscore").is(":visible")){
				$("#finalscore").hide();}
				else {$("#finalscore").show();}
		}

		// MAN TRYCKER PÅ Z
		if(e.keyCode == 90){
			pauseAllSounds();
		}
		
		// MAN TRYCKER PÅ H
		if(e.keyCode == 72){
			if(!questionAvailable) {
				toggleHighScores();	
			}
		}
		
		// Spacebar. Ifall en video visas, pausa / spela den
		if (e.keyCode == 32) {
			if (JP.currentQuestionElement.hasClass("video")) {
				toggleVisibleVideoPlayState();
			}
		}
		
		// Man trycker på "P". Spela dku
		if (e.keyCode == 80) {
			var theSound = $("#sdku")[0];
			if(theSound.paused) {
				theSound.play();
			} else {
				// If is playing, pause instead
				theSound.pause();
				theSound.currentTime = 0
			}
		}
		
	});
	
	function soundOn(){
		if(JP.currentQuestionElement.hasClass("sound")){
			console.log("SOUND DETECTED LINE 313")
			JP.currentQuestionElement.find("audio")[0].play();
				}
	}
	// TODO: Rename to newRound()
	function reset(){
		pauseAllSounds()		
		// Reset all cool stuff
		JP.answersAccepted = false,
		questionAvailable = 0,
		playerIsAnswering = 0;
		
		JP.playersThatHaveAnswered = [];
		// Reset UI
		$(".overlay").fadeOut();
		
		if(questionCount >= 15 && round == 1){
			showLastQuestionCategory();
		}
	}
	
	function allPlayersWereWrong(){
		// $("#sWrong")[0].play(); – Sound is too annoying. Change to a new one
		console.log("All were wrong")
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
		questionCount = 15;
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
		$(".videoOverlay video:visible")[0] ? $(".videoOverlay video:visible")[0].pause() : console.log("No video is playing");
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
	/*$("#highscore .p1").click(function(e){
		$("#nameOverlay").html("CLASS 01").fadeIn('fast');
	});
	
	$("#highscore .p2").click(function(e){
		$("#nameOverlay").html("CLASS 02").fadeIn('fast');
	});	
	
	$("#highscore .p3").click(function(e){
		$("#nameOverlay").html("CLASS 03").fadeIn('fast');
	});
	
	$("#nameOverlay").click(function(e){
		$(this).fadeOut('fast');
	});*/

	//#nameOverlay 

});