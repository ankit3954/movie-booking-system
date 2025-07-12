import dotenv from "dotenv"

dotenv.config()

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const YOUR_DOMAIN = 'http://localhost:3000'


export const createStripeCheckoutSession = async (movieName: string, amount: number, quantity: number) => {

    const amountInPaise = amount * 100;
    console.log(movieName, amount, quantity)
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
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/success`,
        cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    return session

}


export const stripeWebhook = (body: any, sig: string) => {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        console.log("✅ Payment successful:", session.id);

        // Update booking status in your DB here using session ID or metadata
    }

    // res.status(200).send("Webhook received");

}

module.exports = {
    createStripeCheckoutSession,
    stripeWebhook
}