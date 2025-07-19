import dotenv from "dotenv"
import { updateBookingsStatus } from "../controllers/movies.controller"
import { handlePaymentSuccess } from "../controllers/payment.controller"

dotenv.config()

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const YOUR_DOMAIN = 'http://localhost:3000'


export const createStripeCheckoutSession = async (movieName: string, amount: number, quantity: number, bookingId: string) => {

    const amountInPaise = amount * 100;
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: movieName,
                    },
                    unit_amount: amountInPaise,  // Amount in paise
                },
                quantity: quantity,
            },
        ],
        metadata:{
            bookingId: bookingId,
        },
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/payment/success?bookingId=${bookingId}`,
        cancel_url: `${YOUR_DOMAIN}/payment/cancel?bookingId=${bookingId}`,
    });

    return session

}


export const stripeWebhook = (body: any, sig: string) => {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const bookingId = session.metadata?.bookingId;

        //updating booking status in db after confirming payment using webhook
        if(bookingId){
            updateBookingsStatus(bookingId)
            // sendBookingConfirmationMail(bookingId)
            handlePaymentSuccess(bookingId)
        }
    }

}

module.exports = {
    createStripeCheckoutSession,
    stripeWebhook
}