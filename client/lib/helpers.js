GRID_COLOR = '#ff00cc';
GRID_COLOR_RGB = 'rgb(255, 0, 204)'
OBJECT_COLOR = '#ececec';
OBJECT_COLOR_RGB = 'rgb(236, 236, 236)';  //spacing matters.
ERROR_COLOR_RGB = 'rgb(0, 0, 0)';
GRID_SIZE = 40;
CAT_COLOR_RGB = 'rgb(255, 240, 0)';

Template.registerHelper('instance', function() {
  return Template.instance();
});