/* global angular */
(function() {
  'use strict';

angular.module('phpPinga', [])
  .factory('everyDayImShuffling', [
    everyDayImShufflingService
  ])
  .filter('shuffle', [
    'everyDayImShuffling',
    shuffleFilter
  ])
  .factory('QuestionService', [
    '$http',
    'everyDayImShuffling',
    QuestionService
  ])
  
  .controller('MainController', [
    'QuestionService',
    MainController
  ]);

  function everyDayImShufflingService() {
    // -> Fisher–Yates shuffle algorithm
    var shuffleArray = function(array) {
      var m = array.length, t, i;

      // While there remain elements to shuffle
      while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
      }

      return array;
    };

    return {
      shuffle: shuffleArray
    };
  }

  function shuffleFilter(everyDayImShuffling) {
    return function (input) {
      if (input instanceof Array) {
      return everyDayImShuffling.shuffle(input);
      }

      return input;
    };
  }

  function QuestionService($http, everyDayImShuffling) {
    return {
      getRandomQuestion: getRandomQuestion,
      isCorrect: isCorrect
    };

    function getQuestions() {
      return $http.get('/main.js');
    }

    function getRandomQuestion(cb) {
      getQuestions().success(function (data) {
        var perguntas = data.perguntas;
        perguntas = everyDayImShuffling.shuffle(perguntas);

        if (perguntas.length > 0) {
          cb(perguntas[0]);
          return;
        }
      });
    }

    function isCorrect(question, answer, cb) {
      getQuestions().success(function (data) {
        var filter = data.perguntas.filter(function (question) {
          return question.pergunta === question && question.alternativas[question.correta] === answer;
        });

        cb(filter.length > 0);
      });
    }
  }

  function MainController(QuestionService) {
    var vm = this;

    vm.state = 'welcome';

    vm.letsPlayAGame = function () {
      QuestionService.getRandomQuestion(function (question) {
        
        vm.state = 'questions';
      });
    };

    vm.responder = function (question, answer) {
      QuestionService.isCorrect(question, answer, function (isCorrect) {
        if (isCorrect) {

        }

        vm.state = (isCorrect) ? 'correct' : 'wrong';
      });
    };

  }

}());