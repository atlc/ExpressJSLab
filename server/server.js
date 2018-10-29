const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

let app = express();

let dataFile = path.join(__dirname, '../public/data.json');

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log(req.url);
    next();
});

app.post('/signup', (req, res) => {
    let organDonorInfo = JSON.stringify({
        "name": req.body.name,
        "address": req.body.address,
        "email": req.body.email,
        "password": req.body.password
    });
    
    console.log(organDonorInfo);

    fs.readFileSync(dataFile, (err, data) => {
        if (err) throw err;
        let humanInfo = JSON.parse(data);
        console.log(humanInfo)
        humanInfo.push(organDonorInfo);
        console.log(humanInfo);
        fs.appendFileSync(dataFile, JSON.stringify(humanInfo));
    });
    
    res.send('Thanks for letting us harvest your data! A representative will be by to collect blood and other human samples shortly.');
});

app.get('/data', (req, res) => {
    res.send(JSON.parse(fs.readFileSync(dataFile, (err) => { if (err) throw err; })));
});

app.listen(3000);