import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { BookingDetails } from './generateTicket';

dotenv.config();

export const sendBookingConfirmationEmail = async (
  to: string,
  booking: BookingDetails,
  attachmentPath: string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: booking.userEmail,
    subject: '🎫 Your Movie Ticket is Confirmed!',
    html: `
      <p>Hi ${booking.userName},</p>
      <p>Your booking for <strong>${booking.movieName}</strong> is confirmed!</p>
      <p><strong>Seats:</strong> ${booking.seats.join(', ')}<br/>
      <p>Your ticket is attached as a PDF.</p>
      <p>🎬 Enjoy the show!</p>
    `,
    attachments: [
      {
        filename: 'movie_ticket.pdf',
        path: attachmentPath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
