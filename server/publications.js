Meteor.publish('posts', function(options/*author*/){
  // check(options, {
  //   sort: Object,
  //   limit: Number
  // });
  return Posts.find({}, options
    /*{}, {fields: {title: false}}*/
    /*{'author':'Tom Coleman'}*/
    /*{flagged: false, author: auther}*/
  );
});
Meteor.publish('singlePost', function(id){
  //check(id, String);
  return Posts.find(id);
});
Meteor.publish('comments', function(postId) {
  //check(postId, String);
  return Comments.find({postId: postId});
});
Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});
