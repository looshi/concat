

Template.Gameboard.onCreated(function(){
  var currentGameId = FlowRouter.current().params.gameId;
  var isEditing = FlowRouter.current().params.isEditing==='edit'?true:false;
  var self = this;
  self.isDrawing = new ReactiveVar(false);
  self.isErasing = new ReactiveVar(false);
  self.isMouseDown = new ReactiveVar(false);
  self.rows = new ReactiveVar(null);
  self.columns = new ReactiveVar(null);
  self._id = currentGameId;
  self.isEditing = new ReactiveVar(isEditing);
  self.name = new ReactiveVar('');
  self.gameData = new ReactiveVar(null);
  self.brushSize = new ReactiveVar(4);
  self.start = new ReactiveVar(null);

  self.subscribe('singleGameData', currentGameId, function(){
    var game = Games.findOne(self._id);
    var board = drawCells(game.data);
    self.rows.set(board.rows);
    self.columns.set(board.columns);
    self.name.set(game.name);
    self.gameData.set(game.data);
    self.start.set(game.start);
    $('body').on('mouseup',function(){self.isMouseDown.set(false)});
    $('body').on('mousedown',function(){self.isMouseDown.set(true)});
    $('body').on('reset', function(){resetBoard(self)});
  });
});

Template.Gameboard.events({
  'mousedown .gameboard-cell' : function(e, template){
    template.isMouseDown.set(true);
  },
  'mouseover .gameboard-cell, mousedown .gameboard-cell': function(e, template){
    var isDrawing = template.isDrawing.get();
    var isErasing = template.isErasing.get();
    var BRUSH_SIZE = Number(template.brushSize.get());
    if(template.isMouseDown.get() && (isDrawing || isErasing) ){
      var selector = [];
      if(BRUSH_SIZE>1){
        for(var i=this.row-BRUSH_SIZE/2;i<this.row+BRUSH_SIZE;i++){
          for(var j=this.column-BRUSH_SIZE/2;j<this.column+BRUSH_SIZE;j++){
            selector.push('#cell-'+i+'-'+j);
          }
        }
      }else{
        selector.push('#cell-'+this.row+'-'+this.column);
      }

      var color = isDrawing? OBJECT_COLOR_RGB : GRID_COLOR_RGB;
      $(selector.join(', ')).css('background-color',color);
    }
  },
  'mouseup .gameboard-container, mouseleave .gameboard-container': function(e, template){
    var isDrawing = template.isDrawing.get();
    var isErasing = template.isErasing.get();
    if(isDrawing || isErasing)
      saveGameboard(template._id, template);
  },
  'mousedown #brush': function(e, template){
    template.isDrawing.set(!template.isDrawing.get());
    template.isErasing.set(false);
  },
  'mousedown #eraser': function(e, template){
    template.isErasing.set(!template.isErasing.get());
    template.isDrawing.set(false);
  },
  'change #brush-size' : function(e, template) {
    var selected = $('#brush-size option:selected').val();
    template.brushSize.set(selected);
  },
  'change #startX, change #startY' : function(e, template) {
    var x = $('#startX').val();
    var y = $('#startY').val();
    Meteor.call('SaveGameStartPoint',template._id, x, y, function(err, res){
      if(err){

      }else{
        var game = Games.findOne(template._id);
        template.start.set(game.start);
      }
    });
  }
})

Template.Gameboard.helpers({
  cell: function(row){
    return Template.instance().columns.get()[row];
  },
  isEditingBoard: function(){
    var t = Template.instance();
    return (t.isDrawing.get() || t.isErasing.get())
  }
});

var saveGameboard = function(_id, template){
  var board = $('.gameboard-table')[0];
  var data = '';
  var color;
  for(var i=0;i<board.rows.length;i++){
    for(var j=0;j<board.rows[i].cells.length;j++){
      color =  board.rows[i].cells[j].style.backgroundColor;
      if(color==ERROR_COLOR_RGB || color==OBJECT_COLOR_RGB || color==OBJECT_COLOR_RGB){
        data+='0';
      }else{
        data+='1';
      }
    }
  }
  Meteor.call('SaveGameData', _id, data, function(err,res){
    if(err){
    }else{
       template.gameData.set(data);
    }
  })
}

var resetBoard = function(self){
  var gameData = self.gameData.get();
  var count = 0;
  var color;
  var board = $('.gameboard-table')[0];
  for(var i=0; i<board.rows.length; i++){
    for(var j=0; j<board.rows[i].cells.length; j++){
      color = gameData.charAt(count)==='0' ? OBJECT_COLOR_RGB : GRID_COLOR_RGB;
      board.rows[i].cells[j].style.backgroundColor=color;
      count++;
    }
  }
}

var drawCells = function(gameData){
  var count = 0;
  var rows = [];
  var columns = [];
  for(var i=0; i<GRID_SIZE; i++){
      rows.push(i);
      columns[i] = [];
      for(var j=0; j<GRID_SIZE; j++){
        var cell={
          row: i,
          column: j,
          color: gameData.charAt(count)==='0' ? OBJECT_COLOR_RGB : GRID_COLOR_RGB
        }
        columns[i][j] = cell;
        count = count + 1;
     }
    }
  return {rows:rows,columns:columns};
}
