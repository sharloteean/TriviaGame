//Categories
// Celebrities = 26
// Videogames = 15
// Science and Nature = 17
// Japanese Anime and Manga = 31
// Sports = 21
// History = 23

var players;
var diff = "easy";
var cat = "15";
var question = 0;
var answers = [];
var token;
var wins = 0;
var questions = [];
var answer;
var elem = document.getElementById("myBar");   
var width = 1;
var theme = document.getElementById("theme");
var bgSound = document.getElementById("back-noise");
var amt = 10;

$(".level").hide();
$(".cat").hide();
$(".quiz").hide();
$("#wins").hide();
$("#myProgress").hide();
$(".replay").hide();

$(".single").on("click", function(){
  $(".player").hide(1000);
  $(".level").show(1000);
});

$(".level").on("click", function(){
  if ($(this).html() == "Easy"){
    diff = "easy";
  }
  else if ($(this).html() == "Medium"){
    diff = "medium";
  }
  else if ($(this).html() == "Hard"){
    diff = "hard";
    //amt = 4;
  }
  $(".level").hide(1000);
  $(".cat").show(1000);
  //bgSound.src = "assets/sounds/"
});

$(".cat").on("click", function(){
  if ($(this).html() == "Science And Nature"){
    cat = "17";
  }
  else if ($(this).html() == "Videogames"){
    cat = "15";
  }
  else if ($(this).html() == "Sports"){
    cat = "21";
  }
  else if ($(this).html() == "History"){
    cat = "23";
  }
  else if ($(this).html() == "Japanese Anime and Manga"){
    cat = "31";
  }
  else if ($(this).html() == "Animals"){
    cat = "27";
  }

  $(".cat").hide(1000);
  $(".quiz").show(1000);
  $("#wins").show(1000);
  $("#myProgress").show(1000);

    /**
      * Randomize array element order in-place.
      * Using Durstenfeld shuffle algorithm.
    */
    function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
          }
      return array;
    }

    function tryAgain(){
      $("#wins").html("Sorry, please try again!");
      setTimeout(function(){ 
        gameOver() }, 3000);
    }

    function createQuestions(){
    var queryURL = "https://opentdb.com/api.php?amount="+ amt +"&category="+ cat +"&difficulty="+diff+"&type=multiple";

       $.ajax({
          url: queryURL,
          dataType: "json",
          crossDomain: true,
          method:"GET",
        }).done(function(response) {
          if (response.response_code === 1){
           console.log(response.response_code);
           tryAgain();
          }
          
          else if (response.response_code === 0){
            for (var i = 0; i<response.results.length; i++){
              questions[i] = response.results[i];
          }
          shuffleArray(questions);
          console.log(questions);
          nextQuestion();
        }
    });
    }


    function nextQuestion(){
          //If we haven't reached the end of the questions 
          if (question <= (amt-1)){
            for (var j = 0; j < 3; j++){
              answers[j] = questions[question].incorrect_answers[j];
            }
            console.log(question);
            answers[3] = questions[question].correct_answer;
            answer = questions[question].correct_answer;

            shuffleArray(answers);

            display(questions[question].question, answers);
          }
          else gameOver();
        
    }


    function display(quest, answers){
          $(".question").html(quest);
          $("#choicea").html(answers[0]);
          $("#choiceb").html(answers[1]);
          $("#choicec").html(answers[2]);
          $("#choiced").html(answers[3]);
    }

    //Checks for correct answer
    $(".answer").on("click", function (){
      //if correct, make background green
      var myAnswer = ($(this).text());
       if(myAnswer === answer){
          $(this).css("background", "green");
          console.log("Correct!");
          bgSound.src = "assets/sounds/correct.mp3";
          question++;
          setTimeout(function(){ 
            $(".answer").css("background", "beige");
            nextQuestion(); }, 1500);
          width = 1;
          wins++;
       }
       else { 
        //if chosen answer is wrong, make background red and highlight 
        //correct answer in green
        console.log("Wrong!");
        $(this).css("background", "red");
        $("section:contains("+answer+")").css("background","green");
        bgSound.src = "assets/sounds/wrong.mp3";
        question++;
        setTimeout(function(){ 
          $(".answer").css("background", "beige");
          nextQuestion(); }, 1500);
        width =1;
      }
      $("#wins").html("Correct: "+wins);
    });


    //Create a progress bar
    var id = setInterval(frame, 200);

    function frame() {
      if (width >= 100) {
        nextQuestion();
          width =1;
          question++;
          bgSound.src = "assets/sounds/wrong.mp3";
        } else {
          width++; 
          elem.style.width = width + '%'; 
        }
    }

    //Stop progress bar
    function stop(){
      clearInterval(id);
    }

    //tokens for resetting question
    //not implemented in this version
    function newToken(){
      var query = "https://opentdb.com/api_token.php?command=request";

      $.ajax({
        url: query,
        dataType: "json",
        crossDomain: true,
        method:"GET",
        }).done(function(response) {
          token = response.token;
        });
    }

    function resetToken(){
      var query = "https://opentdb.com/api_token.php?command=reset&token=" + token;
      $.ajax({
        url: query,
        dataType: "json",
        crossDomain: true,
        method:"GET",
        }).done(function(response) {
          token = response.token;
        });
    }

    //ends the game and asks player to restart
    function gameOver(){
      if (wins>=1){
        theme.src = "assets/sounds/winning.wav";
      }
      $(".quiz").hide();
      $("#myProgress").hide();
      stop();
        $(".replay").show(2000);
    }

    //Initializes the first question
    createQuestions();
});


//reloads the game
function restart(){
  document.location.reload();
}

$(".replay").on("click", function(){
  restart();
});


