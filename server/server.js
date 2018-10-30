const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

let dataFile = path.join(__dirname, '../public/data.json');

let app = express();

let port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log(req.url);
    next();
});

app.post('/signup', (req, res) => {
    let newOrganDonorInfo = ({
        "name": req.body.name,
        "address": req.body.address,
        "email": req.body.email,
        "password": req.body.password
    });

    try {
        fs.accessSync(dataFile, fs.constants.R_OK | fs.constants.W_OK);
        let donorData = JSON.parse(fs.readFileSync(dataFile, 'utf-8', (err) => { if (err) throw err; }));
        donorData.push(newOrganDonorInfo);
        fs.writeFileSync(dataFile, JSON.stringify(donorData, null, 2), 'utf-8', (err) => { if (err) throw err; });
    } catch (err) {
        throw err;
    }

    res.send('Thanks for letting us harvest your data! A representative will be by to harvest blood and other samples shortly!');
});

app.get('/formsubmissions', (req, res) => {
    let dataString = JSON.parse(fs.readFileSync(dataFile, (err) => { if (err) throw err; }));
    // Prints in an expanded JSON format, instead of collapsing to 1 line
    res.format({
        'text/html': function(){
            res.send(
                `<pre>${JSON.stringify(dataString, null, 2)}</pre>`
            );
        }
    });
});