const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcripyt = require('bcryptjs');
const cookieParser = require('cookie-parser');

const app = express();

const uri = 'mongodb://0.0.0.0:27017/L_signup_login';


const publicDirectoryPath = path.join(__dirname, '../Public');
app.use(express.static(publicDirectoryPath));
app.use(express.static(__dirname + '/public')); //for static css and js files
app.use(cookieParser());
app.use(express.json());

app.set('view engine', 'hbs');



mongoose.connect(uri).then(() => {
    console.log('connected to database successfully!');
})
    .catch((error) => {
        console.log('Cannot connect to database!')
    })


//user schema
const User = mongoose.model('User', {
    fullName: { type: String },
    email: { type: String },
    password: { type: String },
})




app.get('', (req, res) => {
    res.render('index', {
        // username: 'User',
    });
})


app.get('/login', (req, res) => {
    res.render('login', {
        // username: 'User',
    });
})

app.get('/home', (req, res) => {
    res.render('home', {
        // username: 'User',
    });
})




//sign up user
app.post('/', async (req, res) => {

    const userdata = req.body;
    if (!userdata) return res.status(400).send({ status: 'failed' });


    //check if user already exists
    const userEmail = userdata.email;

    User.findOne({ email: userEmail }).then(async (databaseUser) => {

        if (databaseUser) {
            return res.status(200).send({ status: 'user found', data: databaseUser, message: 'already exists' });
        } else {
            //save new user to database
            //hash password
            let hashedPassword = await bcripyt.hash(userdata.password, 8);

            let me = new User({
                fullName: userdata.fullName,
                email: userdata.email,
                password: hashedPassword
            })

            me.save().then(() => {
                return res.status(200).send({ status: 'sucess', data: me });
            }).catch((error) => {
                return res.status(400).send({ status: 'failed', data: error });
            })
        }

    })

})

//savedUserLogin
app.post('/login', (req, res) => {
    const user = req.body;

    if (!user) return res.status(400).send({ status: 'failed', message: 'failed' });

    const userEmail = user.email;
    const userPassword = user.password;

    User.findOne({ email: userEmail }).then(async (databaseUser) => {
        //check password
        const isMatch = await bcripyt.compare(userPassword, databaseUser.password);
        if (!isMatch) {
            //user password does not match
            return res.status(400).send({ status: 'failed', message: 'wrong' });
        }
        return res.status(200).send({ status: 'sucess', data: databaseUser })

    })
})


app.listen(3000, () => {
    console.log('server is up on port 3000');
})