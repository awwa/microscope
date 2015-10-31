Meteor.publish('posts', function(/*author*/){
  return Posts.find(
    /*{}, {fields: {title: false}}*/
    /*{'author':'Tom Coleman'}*/
    /*{flagged: false, author: auther}*/
  );
});
Meteor.publish('comments', function(postId) {
  //check(postId, String);
  return Comments.find({postId: postId});
});
Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});
