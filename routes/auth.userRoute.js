const router = require('express').Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const url = require('url');
const UserAuth = require('../helpers/checkAuth')

// Load models
const User = require('../models/userModel');

router.get('/', (req, res)=>{
  res.send('worked')  
})

router.post('/checkPhone', async (req, res) => {
    try {
        const { phone } = req.body
        var user = await User.findOne({ phone })
        if (user) {
            res.status(400).json({
                status: 1,
                message: 'phone number already used'
            })
        } else {
            res.json({
                status: 1,
                message: 'phone number not used'
            })
        }
    } catch (error) {
        req.status(500).json({
            status: 0,
            message: 'Something went wrong, Try again after some time'
        })
    }
})

router.post('/checkUsername', async (req, res) => {
    try {
        const { username } = req.body
        var user = await User.findOne({ username })
        if (user) {
            res.status(400).json({
                status: 1,
                message: 'username is not available'
            })
        } else {
            res.json({
                status: 1,
                message: 'username available'
            })
        }
    } catch (error) {
        req.status(500).json({
            status: 0,
            message: 'Something went wrong, Try again after some time'
        })
    }
})

router.post('/userRegister', async (req, res) => {
    try {
        const { username, phone, email, password, city, reg_id, device_type, latitude, longitude } = req.body
        var user = await User.findOne({ $or: [{ phone }, { username }] })
        if (user) {
            var error = '';
            if (user.username == username) {
                error = 'username already used';
            }
            if (user.phone == phone) {
                error = 'phone number already used';
            }
            res.status(400).json({ error })
        } else {
            user = await User.create({ username, phone, email, password, city, reg_id, device_type, latitude, longitude })

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            user = await user.save();

            const token = jwt.sign(
                { id: user._id, name: user.name, phone: user.phone },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    phone: user.phone
                }
            });
        }
    }
    catch (error) {
        req.status(500).json({
            status: 0,
            message: 'Something went wrong, Try again after some time'
        })
    }
})



router.post('/userLogin', async (req, res) => {
    try {
        const { username, password } = req.body
        var user = await User.findOne({ username })
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: 'Something went wrong in password hashing'
                    })
                } else if (result) {
                    const token = jwt.sign(
                        { id: user._id, name: user.name, phone: user.phone },
                        process.env.JWT_SECRET,
                        { expiresIn: "1d" }
                    );
                    res.json({
                        token,
                        user: {
                            id: user._id,
                            name: user.name,
                            phone: user.phone
                        }
                    });
                } else {
                    return res.status(400).json({
                        error: 'Passwords don\'t match'
                    })
                }
            })
        } else {
            res.status(400).json({ error: 'username not exist! please login' })
        }
    }
    catch (error) {
        req.status(500).json({
            status: 0,
            message: 'Something went wrong, Try again after some time'
        })
    }

})


module.exports = router
