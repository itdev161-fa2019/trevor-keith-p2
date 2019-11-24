import express from 'express';
import connectDatabase from './config/db';
import { check, validationResult } from 'express-validator';

// Initialize express application
const app = express();

//Connect database
connectDatabase();

// Configure middleware
app.use(express.json({ extended: false }));

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
        check('name', 'Please enter your name').not().isEmpty(),

        check('password', 'Please enter a password').not().isEmpty(),
        check('password', 'Please enter a password with 8 or more characters').isLength({ min: 6 }),

        check('role', 'Please enter a valid role').not().isEmpty(),

        check('email', 'Please enter a valid email').isEmail()

    ],
    (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });

        } else {
            return res.send(req.body);

        }

    }

);

// Connection listener
const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));