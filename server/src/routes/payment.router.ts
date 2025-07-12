const express = require('express');
import {registerController, loginController} from "../controllers/auth.controller"
import { createCheckoutSession, handleStripeWebhook } from "../controllers/payment.controller";


const router = express.Router()

router.post('/create-checkout-session', express.json(), createCheckoutSession)
router.post('/webhook', express.raw({ type: "application/json" }), handleStripeWebhook);

module.exports = router