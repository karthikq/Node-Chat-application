/** @format */

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const { nanoid } = require("nanoid");
const port = process.env.PORT || 3000;
const CheckUser = require("../routes/CheckUser");

const apiUrl = () => {
  if (port === 3000) {
    return "http://localhost:3000";
  } else {
    return "https://chatroomapp1.herokuapp.com";
  }
};
module.exports = async function GoogleAuth(passport) {
  try {
    passport.use(
      new GoogleStrategy(
        {
          clientID: " ",
          clientSecret: " ",
          callbackURL: `${apiUrl()}/auth/user/redirect`,
        },
        async function (accessToken, refreshToken, profile, cb) {
          try {
            const userExsits = await User.findOne({ GoogleId: profile.id });
            if (userExsits) {
              return cb(null, userExsits);
            } else {
              const userId = nanoid();
              const user = new User({
                GoogleId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value,
                profileUrl: profile.photos[0].value,
                userId,
              });
              await user.save();
              return cb(null, user);
            }
          } catch (error) {
            return cb(error);
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
  } catch (error) {
    console.log(error);
  }
};
