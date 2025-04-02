const express = require('express');
import passport from "passport";
import { googleCallback } from "../controllers/oauth.controller";
// import {registerController, loginController} from "../controllers/auth.controller"


const router = express.Router()

router.get('/google', passport.authenticate('google', { scope : ['profile', 'email']}))
router.get('/google/callback', passport.authenticate('google', {failureRedirect : '/'}), googleCallback)


module.exports = router