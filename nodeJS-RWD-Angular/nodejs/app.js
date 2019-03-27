const express = require('express');
const Joi = require('joi');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const app = express();


app.get('/api/zipauto/:prefix' , (req, res) => {
    //schema for joi
    const schema = {
        //not important
    };
    //call geonames.org
    let zipCodeStart = req.params.prefix;
    let URL = `http://api.geonames.org/`;
    URL += `postalCodeSearchJSON?postalcode_startsWith=${zipCodeStart}`;
    URL += `&username=jasonsonghp&country=US&maxRows=5`;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", URL, false);
    try {
        xhr.send();
    } catch (error) {
        res.send('ERROR');
        return;
    }
    res.send(xhr.responseText);
});

app.get('/api/courses', (req ,res) => {
    res.send([1,2,3,4]);
});


// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port : ${port}`));
