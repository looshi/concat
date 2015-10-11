Template.CodeEditor.onCreated(function(){
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
    console.log(code);
    try{
      eval(code);
      template.error.set('Script ran successfully.');
    }catch(err){
      template.error.set('Error '+err);
    }

  }
});

Template.CodeEditor.helpers({
  editorOptions: function() {
    return {lineNumbers: true, mode: "javascript", theme : 'monokai'}
  },
  hasError: function(){
    var error = Template.instance().error.get();
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

