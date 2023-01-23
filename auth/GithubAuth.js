/** @format */

const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User.js");
const port = process.env.PORT || 3000;
const { nanoid } = require("nanoid");

const apiUrl = () => {
  if (port === 3000) {
    return "http://localhost:3000";
  } else {
    return "https://web-production-b3d5e.up.railway.app";
  }
};

module.exports = GithubAuth = (passport) => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GIT_CLIENT_ID,
        clientSecret: process.env.GIT_CLIENT_SECRECT,
        callbackURL: `${apiUrl()}/auth/github/callback`,
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const checkId = await User.findOne({ GithubId: profile.id });
          const userId = nanoid();

          if (checkId) {
            return done(null, checkId);
          } else {
            const newGithubUser = new User({
              GithubId: profile.id,

              username: profile.displayName,
              email:
                profile.emails.length > 0
                  ? profile.emails[0].value
                  : profile.nodeId,
              profileUrl: profile.photos[0].value,
              userId,
            });
            await newGithubUser.save();
            return done(null, newGithubUser);
          }
        } catch (error) {
          console.log(error);
          return done(error);
        }
      }
    )
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
