import { NextFunction, Request, Response } from "express";
import { createStripeCheckoutSession, stripeWebhook } from "../config/stripe";
import { sendResponse } from "../utils/responseHandler";
import { executeQuery } from "../config/db";
import { getBookingDetails } from "./movies.controller";
import { generateTicketPDF } from "../email/generateTicket";
import { sendBookingConfirmationEmail } from "../email/sendEmail";

const _getBookingStatus = () => `
    select
        status
    from
        bookings
    where
        id = ?
`

export const createCheckoutSession = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {
        const { movieName, amount, quantity, bookingId } = req.body;
        const session = await createStripeCheckoutSession(movieName, amount, quantity, bookingId)

        sendResponse(true, res, 201, { url: session.url }, "Checkout Session Created")
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


export const getBookingStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { bookingId } = req.query;
        console.log(bookingId)
        const result = await executeQuery(_getBookingStatus(), [bookingId])
        const bookingStatus = result[0]
        console.log(bookingStatus)
        sendResponse(true, res, 200, bookingStatus, "Status Successfully Fetched")
    } catch (error) {
        next(error)
    }

}


export const handlePaymentSuccess = async(bookingId: string) => {
    try {
        const results = await getBookingDetails(bookingId);
        const booking = results[0]
        if(!booking){
            console.error("Booking Details not found")
            return
        }

        const pdfPath = await generateTicketPDF(booking);
        await sendBookingConfirmationEmail(booking.userEmail, booking, pdfPath);
    } catch (error) {
        console.error(error)
    }
}


module.exports = {
    createCheckoutSession,
    handleStripeWebhook,
    getBookingStatus,
    handlePaymentSuccess
}