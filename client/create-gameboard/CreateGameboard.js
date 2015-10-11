Template.CreateGameboard.rendered = function(){
  $('#new-game-controls').hide();
}

Template.CreateGameboard.events({
  'click #create-game-btn' : function(e){
    $('#new-game-controls').show();
    $('#game-name-field').val('');
    $('#game-name-field').focus();
    $('#new-game-error').html('');
    $('#create-game-btn').hide();
  },

  'mouseup #confirm-game' : function(e){
    var name = $('#game-name-field').val();
    if(name.length<2 || name.length>30){
      $('#new-game-error').html('Name must be between 2 and 30 characters.');
      return;
    }
    Meteor.call('CreateNewGame', name, function(err, res){
      if(err || res === 0){
        $('#new-game-error').html('Error, could not create game.');
        console.warn("error", err,res );
      }else{
        FlowRouter.go('/game/'+res+'/edit');
      }
    });
  },
  'click #cancel-game' : function(e){
    $('#create-game-btn').show();
    $('#new-game-controls').hide();
    $('#game-name-field').val('');
  },

});
