import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';

import User from '../models/user_model';

// loads in .env file if needed
dotenv.config({ silent: true });

// options for local strategy, we'll use email AS the username
// not have separate ones
const localOptions = { usernameField: 'email' };

// options for jwt strategy
// we'll pass in the jwt in an `authorization` header
// so passport can find it there
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.AUTH_SECRET,
};
// NOTE: we are not calling this a bearer token (although it technically is), if you see people use Bearer in front of token on the internet you could either ignore it, use it but then you have to parse it out here as well as prepend it on the frontend.

// username/email + password authentication strategy
const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
  // find user by email and check password
  let user;
  let isMatch;
  try {
    user = await User.findOne({ email });
    isMatch = await user?.comparePassword(password);
  } catch (error) {
    return done(error);
  }

  if (!user) {
    // this is when the passed in email was not found in the email fields of any of the users.
    // it uses a mongoose command to do the search
    // The user was not found, so we pass false to done
    // done is a verify callback which passport uses to find a user, you either pass it false
    // if the credentials don't match or the user if the credentials match
    return done(null, false);
  } else if (!isMatch) {
    // this is when the passed in email was found in a user's email field,
    // but the password did not match the password in that user's password field
    // the password check was made using the compare function we built earlier.
    // this is when a user email was found, but the password was incorrect, so we pass false
    return done(null, false);
  } else {
    // this is when a user with the passed in email was found and the password
    // did match the password in that user's password field.
    // this is when the user email and password is correct, so we pass the user
    return done(null, user);
  }
});

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  // is called with confirmed jwt we just need to confirm that user exits
  let user;
  try {
    user = await User.findById(payload.sub);
  } catch (error) {
    // if an error occurs during the mongoose find then we should pass false and the error to done
    done(error, false);
  }
  if (user) {
    // if we found the user with the passed user id then we should pass the user to done
    done(null, user);
  } else {
    // if the user was not found then we should pass false to done
    done(null, false);
  }
});

// Tell passport to use this strategy
passport.use(jwtLogin); // for 'jwt'
passport.use(localLogin); // for 'local'

// middleware functions to use in routes
export const requireAuth = passport.authenticate('jwt', { session: false });
export const requireSignin = passport.authenticate('local', { session: false });
