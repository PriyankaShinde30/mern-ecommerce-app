const { v4: uuidv4 } = require('uuid');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const { fname, lname, email, phone } = req.body;

        const [existing] = await userModel.getUserByPhone(phone);

        if(existing.length>0) {
            return res.status(400).json({message: 'User already exists'});
        }

        const user_id = uuidv4();

        await userModel.createUser({user_id, fname, lname, email, phone});

        res.status(201).json({message: 'User registered successfully', user_id});
    } catch (err) {
        res.status(500).json({message: 'Server Error', err});
    }
};

exports.loginUser = async (req, res) => {
    try{ 
        const { phone } = req.body;

        const [users] = await userModel.getUserByPhone(phone);

        if(users.length === 0) {
            return res.status(404).json({message: 'User not found'});
        }

        const user = users[0];

        const token = jwt.sign({user_id: user.user_id}, "secretkey", {expiresIn: "1d"});

        res.status(200).json({message: 'Login successful', token});
    } catch (err) {
        res.status(500).json({message: 'Server error', err})
    }
}