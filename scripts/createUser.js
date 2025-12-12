// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const User = require('../models/User');
// require('dotenv').config();

// mongoose.connect(process.env.MONGO_URI).then(async () => {
//     console.log('Connected to MongoDB');

//     // Hash user password
//     const hashedPassword = await bcrypt.hash('user123', 10);

//     // Create user user
//     const user = new User({
//         username: 'user',
//         password: hashedPassword,
//         admin: false
//     });

//     try {
//         await user.save();
//         console.log('User user created successfully!');
//         console.log('Username: user');
//         console.log('Password: user123');
//         mongoose.connection.close();
//     } catch (err) {
//         if (err.code === 11000) {
//             console.log('Admin user already exists');
//         } else if (err.name === 'ValidationError') {
//             console.error('Validation error:', err.message);
//         } else {
//             console.error('Error creating user:', err);
//         }
//         mongoose.connection.close();
//     }
// }).catch(err => {
//     console.error('MongoDB connection error:', err);
// });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('Connected to MongoDB');

    const usersToCreate = [
        { username: 'user1', password: 'abc123', admin: false },
        { username: 'user2', password: 'dfe123', admin: false },
    ];

    // Hash all passwords
    const hashedUsers = await Promise.all(
        usersToCreate.map(async (u) => ({
            username: u.username,
            password: await bcrypt.hash(u.password, 10),
            admin: u.admin
        }))
    );

    try {
        await User.insertMany(hashedUsers);
        console.log('Users created successfully!');
        usersToCreate.forEach(u => {
            console.log(`- Username: ${u.username}, Password: ${u.password}`);
        });

    } catch (err) {
        if (err.code === 11000) {
            console.log('One or more usernames already exist!');
        } else {
            console.error('Error creating users:', err);
        }
    } finally {
        mongoose.connection.close();
    }
}).catch(err => {
    console.error('MongoDB connection error:', err);
});
