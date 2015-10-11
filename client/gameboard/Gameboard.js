var BRUSH_SIZE = 4;

Template.Gameboard.onCreated(function(){
  this.isDrawing = new ReactiveVar(false);
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
  $('body').mouseup(function(){self.isDrawing.set(false);});
  $('body').mouseleave(function(){self.isDrawing.set(false);});
});

Template.Gameboard.events({
  'mousedown .gameboard-cell': function(){
    Template.instance().isDrawing.set(true);
  },
  'mouseover .gameboard-cell': function(e){
    if(Template.instance().isDrawing.get()){
      var selector = [];
      for(var i=this.row;i<this.row+BRUSH_SIZE;i++){
        for(var j=this.column;j<this.column+BRUSH_SIZE;j++){
          selector.push('#cell-'+i+'-'+j);
        }
      }
      $(selector.join(', ')).css('background-color','#fff000');
    }
  }
})

Template.Gameboard.helpers({
  rows: function(){
    return Template.instance().rows.get();
  },
  cell: function(row){
    return Template.instance().columns.get()[row];
  }
})