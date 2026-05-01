const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

process.env.JWT_SECRET = 'alumniReferralNetworkSecretKey2024';
process.env.JWT_EXPIRE = '7d';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/alumni', require('./routes/alumniRoutes'));
app.use('/api/referrals', require('./routes/referralRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Alumni Referral Network API is running' });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});