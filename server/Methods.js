 Meteor.methods({
  CreateNewGame: function(name){
    check(name, String);

    var owner = 'anonymous';
    if(this.userId){
      owner = this.userId;
    }
    var game = {
      owner: owner,
      name: name,
      public: false,
      created: new Date(),
      data: ''
    }
    var gameId = Games.insert(game);
    return gameId;
  },
});