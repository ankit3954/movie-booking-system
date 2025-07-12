import { NextFunction, Request, Response } from "express";
import { createStripeCheckoutSession, stripeWebhook } from "../config/stripe";
import { sendResponse } from "../utils/responseHandler";

export const createCheckoutSession = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {
        const { movieName, amount, quantity } = req.body;
        const session = await createStripeCheckoutSession(movieName, amount, quantity)

        sendResponse(true, res, 201, {url: session.url}, "Checkout Session Created")
    } catch (error) {
        next(error)
    }
}


export const handleStripeWebhook = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sig = req.headers["stripe-signature"] as string;
        stripeWebhook(req.body, sig)
        sendResponse(true, res, 200, {}, "Webhook Received")
    } catch (error) {
        console.error("Webhook error:", error);
        next(error)
    }
}


module.exports = {
    createCheckoutSession,
    handleStripeWebhook
}