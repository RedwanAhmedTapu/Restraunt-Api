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


const sendConfirmationMail = async (email, userName, reservationDate, timeSlotId) => {
    try {
        const timeSlot = await TimeSlot.findById(timeSlotId);
        if (!timeSlot) {
            throw new Error('Time slot not found');
        }

        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // Use 12-hour clock
            timeZone: 'UTC' 
        };
        const reservationTime = new Date(timeSlot.startTime).toLocaleTimeString([], options);

        console.log('Time slot selected : ', new Date(timeSlot.startTime).toLocaleTimeString([], options))
        const mailOptions = {
            from: 'info@oliveandlime.co.uk',
            to: email,
            subject: 'Reservation Confirmation from Olive and Lime',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; background-color: #2c3e50; color: #ecf0f1;">
                    <h2 style="color: #27ae60;">Dear ${userName},</h2>
                    <p style="font-size: 14px; color: #ecf0f1;">Thank you for your recent reservation at Olive and Lime! Your reservation has been confirmed for ${new Date(reservationDate).toLocaleDateString()} at ${reservationTime}.</p>
                    <p style="font-size: 14px; color: #ecf0f1;">
                        Important: Please note that if you do not check in at the restaurant within 10 minutes of your selected time slot (${reservationTime}), your reservation may be canceled.
                    </p>
                    <p style="font-size: 14px; color: #ecf0f1;">We look forward to serving you!</p>
                    <p style="margin-top: 30px; font-size: 14px; color: #ecf0f1;">
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
                console.log('Confirmation email sent:', info.response);
            }
        });
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
};

router.post('/verify-otp', async (req, res) => {
    const { email, otp, reservationData } = req.body;
    const storedOtpData = otpStore.get(email);
    console.log(email,storedOtpData)

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

        // Create a reservation
        try {
            const reservation = new Reservation({
                ...reservationData,
                date: new Date(reservationData.date),
                timeSlot: reservationData.timeSlot,
            });

            await reservation.save();

            // Send confirmation email
            await sendConfirmationMail(email, reservationData.fullName, reservationData.date, reservationData.timeSlot);

            return res.status(200).json({ verified: true });
        } catch (error) {
            console.error('Error creating reservation:', error);
            return res.status(500).json({ message: 'Error creating reservation' });
        }
    } else {
        return res.status(400).json({ message: 'Invalid OTP' });
    }
});


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

        console.log(reservationCount)

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


