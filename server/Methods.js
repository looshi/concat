Fiber = Npm.require('fibers');
Future = Npm.require('fibers/future');

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
      data: '',
      solution: '//Enter code here.'
    }
    var gameId = Games.insert(game);
    return gameId;
  },
  SaveGameData: function(_id, data){
    check(_id, String);
    check(data, String);
    var future = new Future();
    var fields = {data: data};
    Games.update({_id:_id},{$set:fields},function(err,res){
      if(err||res===0){
        future.throw('SaveGame error '+err);
      }else{
        future.return(res);
      }
    });
    return future.wait();
  },
  SaveGameSolution: function(_id, solution){
    check(_id, String);
    check(solution, String);
    var future = new Future();
    var fields = {solution: solution};
    Games.update({_id:_id},{$set:fields},function(err,res){
      if(err||res===0){
        future.throw('Save Solution error '+err);
      }else{
        future.return(res);
      }
    });
    return future.wait();
  },
});
