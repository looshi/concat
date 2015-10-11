var BRUSH_SIZE = 4;
var GRID_COLOR = '#ff00cc';
var OBJECT_COLOR = '#fff000';
Template.Gameboard.onCreated(function(){
  this.isDrawing = new ReactiveVar(false);
  this.isErasing = new ReactiveVar(false);
  this.isMouseDown = new ReactiveVar(false);
  this.rows = new ReactiveVar(null);
  this.columns = new ReactiveVar(null);
  var rows = [];
  var columns = [];
  for(var i=0;i<=80;i++){
    rows.push(i);
    columns[i] = [];
    for(var j=0;j<=80;j++){
      var cell={
        row: i,
        column: j,
        color: '#ff00cc'
      }
      columns[i][j] = cell;
   }
  }
  this.rows.set(rows);
  this.columns.set(columns);
  var self = this;
  $('body').on('mouseup',function(){self.isMouseDown.set(false)});
  $('body').on('mousedown',function(){self.isMouseDown.set(true)});
});

Template.Gameboard.events({
  'mouseover .gameboard-cell': function(e, template){
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

