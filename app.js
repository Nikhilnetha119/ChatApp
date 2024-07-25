const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Asnpn@123',
    database: 'chatapp'
});



// Signup endpoint
app.post('/signup', async (req, res) => {
    const { username, email, phone_number, password } = req.body;
    // Ensure all fields are provided
    if (!username || !email || !phone_number || !password) {
        return res.status(400).send('All fields are required');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = { username, email, phone_number, password: hashedPassword };
    const sql = 'INSERT INTO users SET ?';

    db.query(sql, user, (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.status(500).send('Error saving user');
            return;
        }
        res.send('User registered successfully');
    });
});

// Serve the signup form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
