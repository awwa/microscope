Template.postsList.helpers({
  posts: function() {
    return Posts.find({}, {sort: {submitted: -1}}/*{author: 'bob-smith', category: 'JavaScript'}*/);
  }
});
