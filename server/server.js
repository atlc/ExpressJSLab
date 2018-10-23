const express = require('express');
const path = require('path');

let app = express();

app.use(express.static(path.join(__dirname, '../public')));


app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/order/:name', (req, res) => {
    let id = req.params.name;
    let email = req.query.email;
    res.send(`ID:${id}\t\tEmail:${email}`);
});

app.listen(3000);