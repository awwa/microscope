Meteor.publish('posts', function(/*author*/){
  return Posts.find(
    /*{}, {fields: {title: false}}*/
    /*{'author':'Tom Coleman'}*/
    /*{flagged: false, author: auther}*/
  );
});
