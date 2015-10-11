Template.CreateGameboard.rendered = function(){
  $('#new-game-controls').hide();
  $('#create-new-game-btn').prop('disabled', true);
}

Template.CreateGameboard.events({
  'click #create-game-btn' : function(e){
    $('.menu-button').show();
    $('.menu-confirmation').hide();
    $('#create-new-game-btn').hide();
    $('#new-game-controls').show();
    $('#game-name-field').val('');
    $('#game-name-field').focus();
    $('#new-game-error').html('');
  },

  'mouseup #confirm-new-game-btn' : function(e){
    var name = $('#game-name-field').val();
    if(name.length<2 || name.length>30){
      $('#new-game-error').html('Must be between 2 and 30 chars.');
      return;
    }
    Meteor.call('CreateNewGame',name,function(err,res){
      if(err || res === 0){
        console.warn("new game error! ", err,res );
      }else{
        FlowRouter.go('/game/'+res);  // navigate to the new game
      }

    });
  },
  'click #cancel-new-game-btn' : function(e){
    $('#create-new-game-btn').show();
    $('#new-game-controls').hide();
    $('#game-name-field').val('');
  },

});
