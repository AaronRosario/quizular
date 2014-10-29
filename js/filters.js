'use strict';

/* Filters */
angular.module('quizular.filters', [])
  .filter('getLetter', function(){
  return function(index){
    var map = ['A','B','C','D'];
    return map[index];
  };
});