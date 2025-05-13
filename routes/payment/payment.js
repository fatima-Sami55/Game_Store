const express = require('express');
const router = express.Router();
const { pool, sql, poolConnect } = require('../../database/db');
const { v4: uuidv4 } = require('uuid');

router.post('/complete', async (req, res) => {
    const user = req.session.user?.uuid;
    const { billId, cardNumber, cvc, expiryDate,  cardType } = req.body;

    if (!user) return res.redirect('/login');

    // Only allow card payments
    const paymentMethod = 'Card';

    try {
        await poolConnect;

        // Server-side validation
        if (!cardNumber || !cvc || !expiryDate  || !cardType) {
            return res.render('payment', {
                message: 'All card fields are required.',
                totalAmount: Number(req.body.totalAmount) || 0,
                billId,
                user,
            });
        }

        // Validate card type
        if (cardType !== 'Visa' && cardType !== 'MasterCard') {
            return res.render('payment', {
                message: 'Invalid card type selected.',
                totalAmount: Number(req.body.totalAmount) || 0,
                billId,
                user,
            });
        }

        // Validate card number and CVC
        if (!/^\d{16}$/.test(cardNumber)) {
            return res.render('payment', {
                message: 'Card number must be 16 digits.',
                totalAmount: Number(req.body.totalAmount) || 0,
                billId,
                user,
            });
        }

        if (!/^\d{3,4}$/.test(cvc)) {
            return res.render('payment', {
                message: 'CVC must be 3 or 4 digits.',
                totalAmount: Number(req.body.totalAmount) || 0,
                billId,
                user,
            });
        }
        // Validate expiry date: at least one month in the future
const expiry = new Date(expiryDate);
const now = new Date();
now.setMonth(now.getMonth() + 1);

if (expiry < now) {
    return res.render('payment', {
        message: 'Expiry date must be at least one month in the future.',
        totalAmount: Number(req.body.totalAmount) || 0,
        billId,
        user,
    });
}

// Optional: reject obviously fake or repeated card numbers
const repeatedDigits = /^(\d)\1{15}$/; // e.g., 1111111111111111
if (repeatedDigits.test(cardNumber)) {
    return res.render('payment', {
        message: 'Invalid card number.',
        totalAmount: Number(req.body.totalAmount) || 0,
        billId,
        user,
    });
    }
        

    // First get the latest order ID for this user
    const orderResult = await pool.request()
        .input('userId', sql.UniqueIdentifier, user)
        .query(`
            SELECT TOP 1 o_id
            FROM orders
            WHERE user_id = @userId
            ORDER BY o_id DESC
        `);

    if (orderResult.recordset.length === 0) {
        throw new Error('No order found for this user');
    }

    const orderId = orderResult.recordset[0].o_id;

    // Now insert card details with the order ID
    await pool.request()
        .input('userId', sql.UniqueIdentifier, user)
        .input('orderId', sql.Int, orderId)
        .input('cardNumber', sql.Char(16), cardNumber)
        .input('cvc', sql.Char(4), cvc)
        .input('expiryDate', sql.Date, expiryDate)  
        .input('cardType', sql.VarChar(50), cardType)
        .query(`
            INSERT INTO card_details (user_id, o_id, c_number, cvc, expiry_date, type)
            VALUES (@userId, @orderId, @cardNumber, @cvc, @expiryDate, @cardType)
        `);

    // Save into payment table
    await pool.request()
        .input('billId', sql.Int, parseInt(billId))
        .input('paymentMethod', sql.VarChar(50), paymentMethod)
        .query(`
            INSERT INTO payment (bill_id, p_method)
            VALUES (@billId, @paymentMethod)
        `);

        res.redirect(`/order/confirmation/${billId}`);


    } catch (err) {
        console.error("❌ Payment processing error:", err);
        res.status(500).send("Payment failed");
    }
});

module.exports = router;
