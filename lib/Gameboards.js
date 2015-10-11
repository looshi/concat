/*
Games
owner: String, userId of the game owner.
data: String, Cell level data, e.g. "1010010101"
public: Boolean, if true, this gameboard is accessible by all users.
solutions: [
  solution: String, a solution for this gameboard.
  userId: String, User who wrote this solution.
]
*/

Games = new Mongo.Collection('Games');