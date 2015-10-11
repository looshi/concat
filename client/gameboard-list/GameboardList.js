Template.GameboardList.onCreated(function(){
  this.subscribe('allGameData', function(){
    console.log('subscribed!');
  });
});

Template.GameboardList.helpers({
  games: function(){
    return Games.find({});
  }
});