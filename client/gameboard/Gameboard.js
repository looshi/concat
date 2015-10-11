var BRUSH_SIZE = 4;
var GRID_COLOR = '#ff00cc';
var GRID_COLOR_RGB = 'rgb(255, 0, 204)'
var OBJECT_COLOR = '#fff000';
var OBJECT_COLOR_RGB = 'rgb(255, 240, 0)';

Template.Gameboard.onCreated(function(){
  var currentGameId = FlowRouter.current().params.gameId;
  var self = this;
  self.subscribe('singleGameData', currentGameId, function(){
    self.isDrawing = new ReactiveVar(false);
    self.isErasing = new ReactiveVar(false);
    self.isMouseDown = new ReactiveVar(false);
    self.rows = new ReactiveVar(null);
    self.columns = new ReactiveVar(null);
    var rows = [];
    var columns = [];
    for(var i=0;i<80;i++){
      rows.push(i);
      columns[i] = [];
      for(var j=0;j<80;j++){
        var cell={
          row: i,
          column: j,
          color: '#ff00cc'
        }
        columns[i][j] = cell;
     }
    }
    self.rows.set(rows);
    self.columns.set(columns);
    $('body').on('mouseup',function(){self.isMouseDown.set(false)});
    $('body').on('mousedown',function(){self.isMouseDown.set(true)});
  });
});

Template.Gameboard.events({
  'mousedown .gameboard-cell' : function(e, template){
    template.isMouseDown.set(true);
  },
  'mouseover .gameboard-cell, mousedown .gameboard-cell': function(e, template){
    var isDrawing = template.isDrawing.get();
    var isErasing = template.isErasing.get();
    if(template.isMouseDown.get() && (isDrawing || isErasing) ){
      var selector = [];
      for(var i=this.row-BRUSH_SIZE/2;i<this.row+BRUSH_SIZE;i++){
        for(var j=this.column-BRUSH_SIZE/2;j<this.column+BRUSH_SIZE;j++){
          selector.push('#cell-'+i+'-'+j);
        }
      }
      var color = isDrawing? OBJECT_COLOR : GRID_COLOR;
      $(selector.join(', ')).css('background-color',color);
    }
  },
  'mouseup .gameboard-container, mouseleave .gameboard-container': function(e, template){
    var isDrawing = template.isDrawing.get();
    var isErasing = template.isErasing.get();
    if(isDrawing || isErasing)
      saveGameboard();
  },
  'mousedown #brush': function(e, template){
    template.isDrawing.set(!template.isDrawing.get());
    template.isErasing.set(false);
  },
  'mousedown #eraser': function(e, template){
    template.isErasing.set(!template.isErasing.get());
    template.isDrawing.set(false);
  }
})

Template.Gameboard.helpers({
  cell: function(row){
    return Template.instance().columns.get()[row];
  },
});

var saveGameboard = function(){
  var board = $('.gameboard-table')[0];
  var data = '';
  for(var i=0;i<board.rows.length;i++){
    for(var j=0;j<board.rows[i].cells.length;j++){
      data+=board.rows[i].cells[j].style.backgroundColor==GRID_COLOR_RGB?'1':'0';
    }
  }
}

