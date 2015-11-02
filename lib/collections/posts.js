Posts = new Meteor.Collection('posts');
Posts.allow({
  // insert: function(userId, doc) {
  //   // only allow posting if you are logged in
  //   return !! userId;
  // }
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});

Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});

Meteor.methods({
  post: function(postAttributes) {

    var errors = validatePost(postAttributes);
    if (errors.title || errors.url)
      throw new Meteor.Error('invalidate-post', "You must set title and URL for your post");

    var user = Meteor.user(),
      postWithSameLink = Posts.findOne({url: postAttributes.url});

    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(
        401, "You need to login to post new stories"
      );

    // ensure the post has a title
    if (!postAttributes.title)
      throw new Meteor.Error(422, 'Please fill in a headline');

    // check that there are no previous posts with the same link
    if (postAttributes.url && postWithSameLink) {
      throw new Meteor.Error(302,
        'This link has already been posted',
        postWithSameLink._id
      );
    }

    // pick out the whitelisted keys
    var post = _.extend(_.pick(postAttributes, 'url', 'title', 'message'), {
      userId: user._id,
      author: user.username,
      submitted: new Date().getTime(),
      commentsCount: 0
    });

    var postId = Posts.insert(post);
    return postId;
  },
  upvote: function(postId) {
    //check(this.userId, String);
    //check(postId, String);
    // var post = Posts.findOne(postId);
    // if (!post)
    //   throw new Meteor.Error('invalid', 'Post not found');
    // if (_.include(post.upvoters, this.userId))
    //   throw new Meteor.Error('invalid', 'Already upvoted this post');
    // Posts.update(post._id, {
    //   $addToSet: {upvoters: this.userId},
    //   $inc: {votes: 1}
    // });
    var affected = Posts.update({
      _id: postId,
      upvoters: {$ne: this.userId}
    }, {
      $addToSet: {upvoters: this.userId},
      $inc: {votes: 1}
    });
    if (! affected)
      throw new Meteor.Error('invalid', "You weren't able to upvote that post");
  }
});

validatePost = function(post) {
  var errors = {};
  if (!post.title)
    errors.title = "Please fill in a headline";
  if (!post.url)
    errors.url = "Please fill in a URL";
  return errors;
};
