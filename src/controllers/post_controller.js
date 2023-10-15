import Post from '../models/post_model';

export const createPost = async (postFields, user) => {
  const post = new Post();
  post.title = postFields.title;
  post.tags = postFields.tags;
  post.content = postFields.content;
  post.coverUrl = postFields.coverUrl;
  post.author = user;
  try {
    // await creating a post and returning it
    const savedpost = await post.save();
    return savedpost;
  } catch (error) {
    throw new Error(`create post error: ${error}`);
  }
};
export const getPosts = async () => {
  try {
    // await finding posts
    const posts = await Post.find({}, null, { sort: { createdAt: -1 } }).populate('author');
    return posts;
  } catch (error) {
    throw new Error(`finding posts error: ${error}`);
  }
};
export const getPost = async (id) => {
  try {
    // await finding one post
    const post = await Post.findById(id).populate('author');
    return post;
  } catch (error) {
    throw new Error(`finding post error: ${error}`);
  }
};
export const deletePost = async (id) => {
  try {
    // await deleting a post
    const post = await Post.findByIdAndDelete(id);
    // return confirmation
    return post;
  } catch (error) {
    throw new Error(`finding post error: ${error}`);
  }
};
export const updatePost = async (id, postFields) => {
  try {
    // await updating a post by id
    const post = await Post.findByIdAndUpdate(id, postFields, { new: true });
    // return *updated* post
    return post;
  } catch (error) {
    throw new Error(`finding post error: ${error}`);
  }
};
