Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() {
    //return [Meteor.subscribe('posts'), Meteor.subscribe('comments')];
    //return Meteor.subscribe('posts');
    //return [Meteor.subscribe('posts'), Meteor.subscribe('notifications')];
    return [Meteor.subscribe('notifications')];
  }
});

Router.map(function() {
  Router.route('postPage', {
    path: '/posts/:_id',
    waitOn: function() {
      return [
        Meteor.subscribe('singlePost', this.params._id),
        Meteor.subscribe('comments', this.params._id)
      ];
    },
    data: function() { return Posts.findOne(this.params._id);}
  });

  Router.route('postEdit', {
    path: '/posts/:_id/edit',
    waitOn: function() {
      return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() { return Posts.findOne(this.params._id);}
  });

  Router.route('postSubmit', {
    path: '/submit'
  });

  Router.route('postsList', {
    path: '/:postsLimit?'//,
    // waitOn: function() {
    //   var limit = parseInt(this.params.postsLimit) || 5;
    //   return Meteor.subscribe('posts', {sort: {submitted: -1}, limit: limit});
    // },
    // data: function() {
    //   var limit = parseInt(this.params.postsLimit) || 5;
    //   return {
    //     posts: Posts.find({}, {sort: {submitted: -1}, limit: limit})
    //   };
    // }
  });
});

PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,
  postsLimit: function() {
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: {submitted: -1}, limit: this.postsLimit()};
  },
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  // waitOn: function() {
  //   return Meteor.subscribe('posts', this.findOptions());
  // },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.posts().count() === this.postsLimit();
    var nextPath = this.route.path({postsLimit: this.postsLimit() + this.increment});
    return {
      posts: this.posts(),
      ready: this.postsSub.ready,
      nextPath: hasMore ? nextPath : null
    };
//    return {posts: Posts.find({}, this.findOptions())};
  }
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
