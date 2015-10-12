
var CAT_START_X = 0;
var CAT_START_Y = 20;
var POS = {}; // current cat position
var TIMER = 0; // times each cell draw call.

Template.CodeEditor.onCreated(function(){
  POS = {x: CAT_START_X, y: CAT_START_Y};
  Session.set('editorCode', null);
  var currentGameId = FlowRouter.current().params.gameId;
  var isEditing = FlowRouter.current().params.isEditing==='edit'?true:false;
  var self = this;
  self.game = new ReactiveVar(null);
  self.error = new ReactiveVar(false);
  self.isEditing = isEditing;
  self.subscribe('singleGameData', currentGameId, function(){
    var game = Games.findOne(currentGameId);
    self.game.set(game);
    if(game && game.solution && isEditing)
      Session.set('editorCode', game.solution);
  });
  addMoveFunctions();
})

Template.CodeEditor.onDestroyed(function(){
  Session.set('editorCode', null);
});

Template.CodeEditor.events({
  'click #show-solution': function(e, template){
    Session.set('editorCode', template.game.get().solution);
  },
  'keyup .CodeMirror': function(e, template) {
    if(template.isEditing){
      var code = $("#editor").val();
      var _id = template.game.get()._id;
      debounceSave(_id, code, template);
    }
  },
  'click #run' : function(e, template){
    var code = $("#editor").val();
    template.error.set(false);
    // try to keep code within reasonable bounds
    var remove = 'Meteor|\\$|window|jQuery|document|XMLHttpRequest';
    var regEx = new RegExp(remove, 'gi');
    code = code.replace(regEx, '');
    TIMER = 0;
    clearAllTimeouts();
    try{
      $('body').trigger('reset');
      POS.x = Games.findOne(template.game.get()._id).start.x;
      POS.y = Games.findOne(template.game.get()._id).start.y;
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
  window.right = function(amount){
    for(var i=0; i<amount; i++){
      POS.x++;
      TIMER++;
      drawCell(POS.x, POS.y, TIMER);
    }
  }
  window.left = function(amount){
    for(var i=amount; i>0; i--){
      POS.x--;
      TIMER++;
      drawCell(POS.x, POS.y, TIMER);
    }
  }
  window.down = function(amount){
    for(var i=0; i<amount; i++){
      POS.y++;
      TIMER++;
      drawCell(POS.x, POS.y, TIMER);
    }
  }
  window.up = function(amount){
    for(var i=amount; i>0; i--){
      POS.y--;
      TIMER++;
      drawCell(POS.x, POS.y, TIMER);
    }
  }
  window.move = function(x, y){
    if(x>0)
      right(x);
    else
      left(-x);

    if(y>0)
      down(y);
    else
      up(-y);
  }
}

var drawCell = function(x, y, TIMER){
  setTimeout(function(){
    var board = $('.gameboard-table')[0];
    var cell = board.rows[y].cells[x];
    if(cell.style.backgroundColor === OBJECT_COLOR_RGB){
      board.rows[y].cells[x].style.backgroundColor = ERROR_COLOR_RGB;
    }else{
      board.rows[y].cells[x].style.backgroundColor = CAT_COLOR_RGB;
    }
  }, TIMER*10);
}

var clearAllTimeouts = function(){
  // clear any intervals the template may have running
  var highestTimeoutId = setTimeout(";");
  for (var i = 0 ; i < highestTimeoutId ; i++) {
    clearTimeout(i);
  }
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

var debounceSave = _.debounce(function(id, code, template) {
  Meteor.call('SaveGameSolution', id, code, function(err, res){
    if(err){
      console.warn('solution save error', err);
    }else{
      template.error.set('Solution saved.');
    }
  })
},300);

