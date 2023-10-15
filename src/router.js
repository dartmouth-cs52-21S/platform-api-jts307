import { Router } from 'express';
import * as Posts from './controllers/post_controller';
import * as UserController from './controllers/user_controller';
import { requireAuth, requireSignin } from './services/passport';
import signS3 from './services/s3';

const router = Router();

// default index route
router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

router.get('/sign-s3', signS3);

router.route('/posts')
  .post(requireAuth, async (req, res) => {
    try {
      // use req.body to await from controller function
      const result = await Posts.createPost(req.body, req.user);
      // send back the result
      res.json(result);
    } catch (error) {
      // or catch the error and send back an error
      res.status(500).json({ error });
    }
  })
  .get(async (req, res) => {
    try {
      // await from controller function
      const result = await Posts.getPosts();
      // send back the result
      res.json(result);
    } catch (error) {
      // or catch the error and send back an error
      res.status(500).json({ error });
    }
  });

router.route('/posts/:id')
  .get(async (req, res) => {
    try {
      // await from controller function
      const result = await Posts.getPost(req.params.id);
      // send back the result
      res.json(result);
    } catch (error) {
      // or catch the error and send back an error
      res.status(500).json({ error });
    }
  })
  .put(requireAuth, async (req, res) => {
    try {
      // await from controller function
      const result = await Posts.updatePost(req.params.id, req.body);
      // send back the result
      res.json(result);
    } catch (error) {
      // or catch the error and send back an error
      res.status(500).json({ error });
    }
  })
  .delete(requireAuth, async (req, res) => {
    try {
      // await from controller function
      const result = await Posts.deletePost(req.params.id);
      // send back the result
      res.json(result);
    } catch (error) {
      // or catch the error and send back an error
      res.status(500).json({ error });
    }
  });

router.post('/signin', requireSignin, async (req, res) => {
  try {
    const token = UserController.signin(req.user);
    res.json({ token, email: req.user.email });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const token = await UserController.signup(req.body);
    res.json({ token, email: req.body.email, username: req.body.username });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

export default router;
