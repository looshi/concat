var CAT_COLOR_RGB = 'rgb(0, 0, 0)'
var CAT_START_X = 0;
var CAT_START_Y = 20;
var POS = {}; // current cat position
Template.CodeEditor.onCreated(function(){
  POS = {x: CAT_START_X, y: CAT_START_Y};
  Session.set('editorCode', null);
  var currentGameId = FlowRouter.current().params.gameId;
  var self = this;
  self.game = new ReactiveVar(null);
  self.error = new ReactiveVar(false);
  self.subscribe('singleGameData', currentGameId, function(){
    var game = Games.findOne(currentGameId);
    self.game.set(game);
    if(game && game.solution)
      Session.set('editorCode', game.solution);
  });
  addMoveFunctions();
})

Template.CodeEditor.onDestroyed(function(){
  Session.set('editorCode', null);
});

Template.CodeEditor.events({
  'keyup .CodeMirror': function(e, template) {
    var code = $("#editor").val();
    var _id = template.game.get()._id;
    debounceSave(_id, code);
  },
  'click #run' : function(e, template){
    var code = $("#editor").val();
    template.error.set(false);
    // try to keep code within reasonable bounds
    var remove = 'Meteor|\\$|window|jQuery|document|XMLHttpRequest';
    var regEx = new RegExp(remove, 'gi');
    code = code.replace(regEx, '');
    try{
      $('body').trigger('reset');
      POS.x = CAT_START_X;
      POS.y = CAT_START_Y;
      eval(code);
      template.error.set('Script ran successfully.');
    }catch(err){
      template.error.set('Error '+err);
    }
  },
  'click #reset': function(){
    $('body').trigger('reset');
  }
});

// adds move functions to window context
var addMoveFunctions = function(){
  window.R = function(amount){
    console.log("R executed!", amount, POS);

    for(var i=0; i<amount; i++){
      drawCell(POS.x, POS.y);
      POS.x++;
    }

  }
}


var drawCell = function(x, y){
  var board = $('.gameboard-table')[0];
  board.rows[y].cells[x].style.backgroundColor = CAT_COLOR_RGB;
}


Template.CodeEditor.helpers({
  editorOptions: function() {
    return {lineNumbers: true, mode: "javascript", theme : 'monokai'}
  },
  hasError: function(){
    var error = Template.instance().error.get();
    if(error)
      return error.indexOf('Error')!==-1;
  }
});

var debounceSave = _.debounce(function(id, code) {
  console.log('db', code);
  Meteor.call('SaveGameSolution', id, code, function(err, res){
    if(err){
      console.warn('solution save error', err);
    }else{
      console.log('solution saved.')
    }
  })
},300);

