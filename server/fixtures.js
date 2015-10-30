if (Posts.find().count() === 0) {
  Posts.insert({
    title: 'Introducing Telescope2',
    url: 'http://sachagreif.com/introducing-telescope/'
  });

  Posts.insert({
    title: 'Meteor2',
    url: 'http://meteor.com'
  });

  Posts.insert({
    title: 'The Meteor Book2',
    url: 'http://themeteorbook.com'
  });
}
