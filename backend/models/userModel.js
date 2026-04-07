const db = require('../config/db');

exports.createUser = async (user) => {
    const { user_id, fname, lname, email, phone} = user;

    const query =  `INSERT INTO users (user_id, fname, lname, email, phone) VALUES (?, ?, ?, ?, ?)`;

    return db.execute(query, [user_id, fname, lname, email, phone]);
};

exports.getUserByPhone = async (phone) => {
    return db.execute(`SELECT * FROM users WHERE phone = ?`, [phone]);
};