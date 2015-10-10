/*
Gameboard
level: [], Array of cell level data.
width: Number, width of the gameboard.
height: Number, height of the gameboard.
public: Boolean, if true, this gameboard is accessible by all users.
solutions: [
  solution: String, a solution for this gameboard.
  userId: String, User who wrote this solution.
]
*/

Gameboards = new Mongo.Collection('Gameboards');