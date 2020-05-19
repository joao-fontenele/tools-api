const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: String,
  link: String,
  description: String,
  tags: [String],
});

schema.set('toJSON', {
  // used for the `id` virtual. toJSON will map `_id` to `id` attribute
  virtuals: true,
  // This is used to detect possible patch update conflicts
  // But since mongoose doesn't handle it by default, for now, it's not used
  // TODO: check how to handle conflicts later
  versionKey: false, // remove __v.
  transform(doc, ret) {
    // eslint-disable-next-line no-param-reassign
    ret._id = undefined; // usually more efficient than deleting the attribute
  },
});

const Tool = mongoose.model('tool', schema);

module.exports = Tool;
