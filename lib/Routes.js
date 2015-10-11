FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render('Main', {content: 'Home'});
  },
  name: 'home'
});

FlowRouter.route('/game/:gameId', {
  action: function() {
    BlazeLayout.render('Main', {content: 'Gameboard'});
  },
  name: 'game'
});
