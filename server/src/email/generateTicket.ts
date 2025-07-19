import fs from 'fs';
import PDFDocument from 'pdfkit';
import path from 'path';
// import { BookingDetails } from '../types/BookingDetails';

export interface BookingDetails {
  userName: string;
  movieName: string;
  theaterName: string;
  seats: string[];
  bookingId: string;
  startTime: string;
  showTime: string;
  userEmail: string;
}


export const generateTicketPDF = (
  booking: BookingDetails,
  outputDir: string = 'tickets'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const outputPath = path.join(outputDir, `ticket-${booking.bookingId}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    doc.fontSize(20).text('🎟️ Movie Ticket Confirmation', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Booking ID: ${booking.bookingId}`);
    doc.text(`User: ${booking.userName}`);
    doc.text(`Movie: ${booking.movieName}`);
    doc.text(`Theater: ${booking.theaterName}`);
    doc.text(`Date: ${booking.showTime}`);
    doc.text(`Start Time: ${booking.startTime}`);
    doc.text(`Seats: ${booking.seats.join(', ')}`);
    doc.moveDown();
    doc.text('✅ Enjoy your movie!', { align: 'center' });

    doc.end();

    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
};
