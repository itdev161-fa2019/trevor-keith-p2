import express from 'express';
import connectDatabase from './config/db';
import { check, validationResult } from 'express-validator';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import User from './models/User';

// Initialize express application
const app = express();

//Connect database
connectDatabase();

// Configure middleware
app.use(express.json({ extended: false }));
app.use(
    cors({
        origin: 'http://localhost:3000'

    })

);

// API endpoints
/*
    @route GET
    @desc Test endpoint
*/
app.get('/', (req, res) =>
    res.send('HTTP get request successfully sent to root API endpoint')

);

/*
    @route POST api/users
    @desc Register user
*/
app.post(
    '/api/users',
    [
        check('name', 'Please enter your name')
            .not()
            .isEmpty(),

        check('password', 'Please enter a password')
            .not()
            .isEmpty(),
        check('password', 'Please enter a password with 8 or more characters')
            .isLength({ min: 6 }),

        check('role', 'Please enter a valid role')
            .not()
            .isEmpty(),

        check('email', 'Please enter a valid email')
            .isEmail()

    ],
    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });

        } else {
            const { name, password, role, email } = req.body;

            try {
                //Check if user exists
                let user = await User.findOne({ email: email });

                if(user) {
                    return res
                        .status(400)
                        .json({ errors: [{ msg: 'User already exists' }] });

                }

                //Create a new user
                user = new User({
                    name: name,
                    password: password,
                    role: role,
                    email: email

                });

                //Encrypt the password
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);

                //Save to the db and return
                await user.save();

                const payload = {
                    use: {
                        id: user.id

                    }

                };

                jwt.sign(
                    payload,
                    config.get('jwtsecret'),
                    { expiresIn: '10hr' },
                    (err, token) => {
                        if (err) throw err;

                        res.json({ token: token });

                    }
                );

            } catch(error) {
                res.status(500).send('Server error');

            }

        }

    }

);

// Connection listener
const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));