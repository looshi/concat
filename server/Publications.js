/*
singleGameData
Publishes the current game.
*/

Meteor.publish("singleGameData", function (_id) {
  return Games.find({_id:_id});
});