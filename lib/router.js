Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() {
    return Meteor.subscribe('posts');
  }
});

Router.map(function() {
  Router.route('postsList', {path: '/'});

  Router.route('postPage', {
    path: '/posts/:_id',
    data: function() { return Posts.findOne(this.params._id);}
  });

  Router.route('postEdit', {
    path: '/posts/:_id/edit',
    data: function() { return Posts.findOne(this.params._id);}
  });

  Router.route('postSubmit', {
    path: '/submit'
  });
});

var requireLogin = function() {
  if (!Meteor.user()) {
     this.render('accessDenied');
   } else {
     this.next();
   }
};
Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
