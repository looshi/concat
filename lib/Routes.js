FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render('Main', {content: 'Home'});
  },
  name: 'home'
});

FlowRouter.route('/game/:gameId/:isEditing', {
  action: function() {
    BlazeLayout.render('Main', {content: 'Play'});
  },
  name: 'game'
});
