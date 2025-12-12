const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Hash admin password
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Create admin user
        const admin = new User({
            username: 'admin',
            password: hashedPassword,
            admin: true
        });

        try {
            await admin.save();
            console.log('Admin user created successfully!');
            console.log('Username: admin');
            console.log('Password: admin123');
            mongoose.connection.close();
        } catch (err) {
            if (err.code === 11000) {
                console.log('Admin user already exists');
            } else {    
                console.error('Error creating admin:', err);
            }
            mongoose.connection.close();
        }
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });