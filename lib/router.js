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

PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,
  postsLimit: function() {
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: this.soft, limit: this.postsLimit()};
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
    //var nextPath = this.route.path({postsLimit: this.postsLimit() + this.increment});
    return {
      posts: this.posts(),
      ready: this.postsSub.ready,
      nextPath: hasMore ? this.nextPath() : null
    };
//    return {posts: Posts.find({}, this.findOptions())};
  }
});

NewPostsController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    var l = this.postsLimit2();
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment});
  }
});

BestPostsController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment});
  }
});

Router.route('/', {
  name: 'home',
  controller: NewPostsController
});
//Router.route('newPosts', {path: '/new/:postsLimit?'});
Router.route('/new/:postsLimit?', {name: 'newPosts'});
//Router.route('bestPosts', {path: '/best/:postsLimit?'});
Router.route('/best/:postsLimit?', {name: 'bestPosts'});

//Router.map(function() {
  Router.route('/posts/:_id', {
    name: 'postPage',
    waitOn: function() {
      return [
        Meteor.subscribe('singlePost', this.params._id),
        Meteor.subscribe('comments', this.params._id)
      ];
    },
    data: function() { return Posts.findOne(this.params._id);}
  });

  Router.route('/posts/:_id/edit', {
    name: 'postEdit',
    waitOn: function() {
      return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() { return Posts.findOne(this.params._id);}
  });

  Router.route('/submit', {name: 'postSubmit'});

  // Router.route('postsList', {
  //   path: '/:postsLimit?'//,
  //   // waitOn: function() {
  //   //   var limit = parseInt(this.params.postsLimit) || 5;
  //   //   return Meteor.subscribe('posts', {sort: {submitted: -1}, limit: limit});
  //   // },
  //   // data: function() {
  //   //   var limit = parseInt(this.params.postsLimit) || 5;
  //   //   return {
  //   //     posts: Posts.find({}, {sort: {submitted: -1}, limit: limit})
  //   //   };
  //   // }
  // });
//});

var requireLogin = function() {
  if (!Meteor.user()) {
     this.render('accessDenied');
   } else {
     this.next();
   }
};
Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
