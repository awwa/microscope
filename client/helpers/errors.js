// Local (client-only) Collection
Errors = new Mongo.Collection(null);

throwError = function(message) {
  Errors.insert({message: message});
};
