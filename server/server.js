const express = require('express');
const path = require('path');
const fs = require('fs');

let dataFile = path.join(__dirname, '../public/data.json');

let app = express();

let port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}`) );

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// This middleware logs each route that gets hit
app.use((req, res, next) => {
    console.log(`Route being hit:\t${req.url}`);
    next();
});

// Upon hitting the /signup route, the server will post the new registrant's JSON to the JSON file
app.post('/signup', (req, res) => {
    // Takes the info from the request and puts it in a new object
    let newOrganDonorInfo = ({
        "name": req.body.name,
        "address": req.body.address,
        "email": req.body.email,
        "password": req.body.password
    });

    try {
        // This checks to see if the data file is accessible, and readable or writable
        fs.accessSync(dataFile, fs.constants.R_OK | fs.constants.W_OK);
        // Then it pulls in the JSON from the file and parses it back into an array of objects
        let donorData = JSON.parse(fs.readFileSync(dataFile, 'utf-8', (err) => { if (err) throw err; }));
        // Then pushes the newest registrant object to the array
        donorData.push(newOrganDonorInfo);
        // Then overwrites the file with the updated array of objects
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