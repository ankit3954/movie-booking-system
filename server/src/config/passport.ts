import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv"
import {authenticateOAuthUser} from "../services/oauth.service"

dotenv.config()

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: "/oauth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const result = await authenticateOAuthUser('google', profile.id, profile.displayName, profile?.emails?.[0].value || '');
                return done(null, result)
            } catch (error) {
                return done(error, null)
            }

        }
    )
)

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default passport;