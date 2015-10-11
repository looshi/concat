
Template.Nav.events({
  'click .home-button': function () {
    console.log('home button');
    FlowRouter.go('/');
  }
});
