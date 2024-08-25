const express = require('express');
const router = express.Router();
const TimeSlot = require('../models/time-slot-model');
const Reservation = require('../models/reservation-model');
const UnavailableTimeSlot = require('../models/unavailable-time-slot-model');
const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    host: "smtp.ionos.co.uk",
    port: 587, // Try 465 if 587 doesn't work
    secure: false, // Set to true if using port 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});



const otpStore = new Map(); // Store OTPs and expiry times
const OTP_VALIDITY = 60 * 1000; // 60 seconds

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const SendMail = (to, userName, otp, timeLimit, supportContact) => {
    const mailOptions = {
        from: 'info@oliveandlime.co.uk',
        to: to,
        subject: 'Reservation Verification Code From Olive and Lime',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #2c3e50;">Hello ${userName},</h2>
                <p>We're excited to confirm your upcoming reservation at Olive and Lime! To complete the booking process, please enter the following verification code:</p>
                <p style="font-size: 18px; font-weight: bold; color: #e74c3c; margin: 20px 0;">
                    Verification Code: ${otp}
                </p>
                <p style="font-size: 14px; color: #7f8c8d;">
                    This code is valid for ${timeLimit}.
                </p>
                <p>If you did not request this verification code, please disregard this email and contact our support team at <a href="mailto:${supportContact}" style="color: #3498db;">${supportContact}</a>.</p>
                <p>We look forward to serving you!</p>
                <p style="margin-top: 30px; font-size: 14px; color: #95a5a6;">
                    Best regards,<br>
                    The Olive and Lime Team
                </p>
            </div>
        `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error occurred:', err);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

router.post('/send-otp', (req, res) => {
    const { email, userName } = req.body;
    const otp = generateOTP();
    const expiry = Date.now() + OTP_VALIDITY;
    const timeLimit = '60 seconds';
    const supportContact = 'info@oliveandlime.co.uk';
    otpStore.set(email, { otp, expiry });

    SendMail(email, userName, otp, timeLimit, supportContact);

    res.status(200).json({ message: 'OTP sent to email' });
});

router.post('/verify-otp', async (req, res) => {
    const { email, otp, reservationData } = req.body; // Extract reservation data from the request body
    const storedOtpData = otpStore.get(email);

    if (!storedOtpData) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const { otp: storedOtp, expiry } = storedOtpData;

    if (Date.now() > expiry) {
        otpStore.delete(email);
        return res.status(400).json({ message: 'OTP expired' });
    }

    if (otp === storedOtp) {
        otpStore.delete(email); // Remove OTP after successful verification

        try {
            // Create a new reservation
            const newReservation = new Reservation(reservationData);
            await newReservation.save();

            // Respond with success
            return res.status(200).json({ verified: true, status:true });
        } catch (error) {
            // Respond with error if reservation fails
            console.error('Error saving reservation:', error);
            return res.status(500).json({ message: 'Failed to create reservation' });
        }
    } else {
        return res.status(400).json({ message: 'Invalid OTP' });
    }
});


router.get('/time', async (req, res) => {
    try {
        // Get the date from the query parameters
        const { date: queryDate } = req.query;

        // Validate and parse the date
        if (!queryDate) {
            return res.status(400).json({ message: 'Date query parameter is required.' });
        }
        const date = new Date(queryDate);

        const timeSlots = await TimeSlot.find(); // Fetch all time slots
        const reservations = await Reservation.find(); // Fetch reservations for the given date
        const unavailableSlots = await UnavailableTimeSlot.find(); // Fetch unavailable slots for the given date

        const filteredReservation = reservations.filter(day => {
            const dayDate = new Date(day.date).toISOString().split('T')[0]; // Extract date part
            const filterDate = date.toISOString().split('T')[0]; // Extract date part
            return dayDate === filterDate;
        });

        const filteredUnavailable = unavailableSlots.filter(day => {
            const dayDate = new Date(day.date).toISOString().split('T')[0]; // Extract date part
            const filterDate = date.toISOString().split('T')[0]; // Extract date part
            return dayDate === filterDate;
        });

        // Create a Set of unavailable slot IDs
        const unavailableSlotIds = new Set(filteredUnavailable.map(slot => slot.timeSlot.toString()));

        // Create a map to count the number of reservations per time slot
        const reservationCount = {};
        filteredReservation.forEach(reservation => {
            if (reservationCount[reservation.timeSlot]) {
                reservationCount[reservation.timeSlot]++;
            } else {
                reservationCount[reservation.timeSlot] = 1;
            }
        });

        // Modify the availability based on reservations and unavailability
        const modifiedTimeSlots = timeSlots.map(slot => {
            const slotId = slot._id.toString();
            let updatedSlot = { ...slot.toObject() };

            // Check reservation count
            if (reservationCount[slotId] >= 10) {
                updatedSlot.availability = false;
            }

            // Check if the slot is in unavailable slots
            if (unavailableSlotIds.has(slotId)) {
                updatedSlot.status = false;
            }

            return updatedSlot;
        });

        res.status(200).json(modifiedTimeSlots); // Send the modified time slots as the response
    } catch (error) {
        console.error('Error fetching time slots:', error); // Log the error
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;


