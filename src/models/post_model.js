import mongoose, { Schema } from 'mongoose';

// create a PostSchema
const PostSchema = new Schema({
  title: String,
  coverUrl: String,
  content: String,
  tags: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
},
{
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

// create model class
const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
