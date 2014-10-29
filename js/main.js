/* Functions */
function shuffle(sourceArray) {
    for (var n = 0; n < sourceArray.length - 1; n++) {
        var k = n + Math.floor(Math.random() * (sourceArray.length - n));

        var temp = sourceArray[k];
        sourceArray[k] = sourceArray[n];
        sourceArray[n] = temp;
    }
}

/* AngularJS app init */
var app = angular.module("quizular", ['ngRoute','quizular.filters']);
/* Routes */
app.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: "templates/home.html",
		controller: 'HomeController'
	})
	.when('/quiz', {
		templateUrl: 'templates/quiz.html',
		controller: 'QuizController'
	})
	.otherwise({ redirectTo: '/' });
});

/* Factories for passing data between controllers */
app.factory('home', function () {
    return { name: '' };
});
app.factory('quiznum', function() {
	return { quesnum: '' };
});
app.factory('resulttext', function() {
	return { resulttext: '' };
});
app.factory('quiztype', function() {
	return { quiztype: ''};
});


/* Controllers */
app.controller('HomeController', function($scope, $location, home, quiznum, resulttext, quiztype) {
  $scope.home = home;
  $scope.quiznum = quiznum;
  $scope.resulttext = resulttext;
  $scope.name = $('#name').val();
  $scope.email = $('#email').val();
  $scope.quiztype = quiztype;

  $scope.setQuizType = function setQuizType() {
  	$scope.quiztype.quiztype = $('#quiztype :selected').val();
  	console.log('setting quiz type to:'+$('#quiztype :selected').val());
  }

  $scope.setQuestionNum = function setQuestionNum(theQuestionNum) {
  	$('#quiznum').hide();
	$('.questionnum').css('background-color','#272822');
	$('.questionnum').removeClass('active');
	$('#'+theQuestionNum).css('background-color', '#008cba');
	$('#'+theQuestionNum).addClass('active');
	$scope.quiznum.quesnum = theQuestionNum;
}
  $scope.submitit = function() { 
  	if (quiznum.quesnum == undefined || quiznum.quesnum == 'undefined' || quiznum.quesnum == '') {
  		$('#quiznum').show();
  		return;
  	}
  	else {
  		$('#quiznum').hide();
	  	if ($('#name').val() == '' || $('#email').val() == '') { return; } 
	  	else { var selectionObj = {};
	  		/*var questionnumber = $('.questionnum.active').attr('myvalue');
	  		if (questionnumber == 'undefined') { questionnumber = 10; }
	        $scope.quesnum = questionnumber;*/
	        $scope.quiztype.quiztype = $('#quiztype :selected').val();
	        window.location.assign("#/quiz"); 
	    }  
	}
  };
});

app.controller('QuizController', function($scope, $location, $http, home, quiznum, resulttext, quiztype) {
  $scope.home = home;
  $scope.quiznum = quiznum;
  $scope.resulttext = resulttext;
  $scope.quiztype = quiztype;
  console.log('quiztype: '+quiztype.quiztype);

  $http.get('questions/'+quiztype.quiztype+'_questions.json').success(function (questions){
  	questions = questions.slice(0,quiznum.quesnum);
    shuffle(questions);
    for (var key in questions) {
      var obj = questions[key];
      var istruefalse = questions[key].choice[0].indexOf('True');
      //console.log('istruefalse: '+istruefalse);
      if(istruefalse !== '0') { shuffle(questions[key].choice); }
      //console.log(questions[key].choice);
    }
    /*console.log('questions:');
    console.log(questions);
    console.log('choices:');
    console.log(questions[0].choice);*/
    $scope.questions = questions;
    $scope.currentq = 0;
    $scope.total = questions.length;
    $scope.results = [];
  });	

  $scope.currentnext = function(index, selection, answer) {
  	var selectionObj;
  	var totalcorrect = 0;  	
  	$scope.currentq = index + 1;
  	selectionObj = {
  		selected: selection,
  		answer: answer,
  		correct: selection === answer
  	};
  	$scope.results.push(selectionObj);

  	if (index == quiznum.quesnum - 1) { 
  		$scope.showResults = true; 
  		for(i=0;i<quiznum.quesnum;i++) {
  			var x = $scope.results[i];
  			var y = x.correct;
  			if (x.correct === true) { totalcorrect++; }
  		}
  		var resultPercent = Math.floor((totalcorrect / quiznum.quesnum) * 100);
  		if (resultPercent < 50) { 
  			$scope.resulttext.resulttext = 'Nice try ';
  			$scope.verb = 'Try ';   } 
  		else { 
  			$scope.resulttext.resulttext = 'Congratulations ';
  			$scope.verb = 'Play '; 
  		}
  		$scope.result = resultPercent;
  	}
  };

});
