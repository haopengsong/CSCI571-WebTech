const express = require('express');
const cors = require('cors');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const app = express();

let serverFindingService = 'http://svcs.ebay.com/services/search/FindingService/v1';
serverFindingService += '?OPERATION-NAME=findItemsAdvanced';
serverFindingService += '&SERVICE-VERSION=1.0.0';
serverFindingService += '&SECURITY-APPNAME=jasonson-571hw-PRD-016e08212-81d2fca4';
serverFindingService += '&RESPONSE-DATA-FORMAT=JSON';
serverFindingService += '&REST-PAYLOAD=true';
serverFindingService += '&paginationInput.entriesPerPage=50';

function ItemFilter(name) {
    this.name = name;
    this.option = [];
}

app.use(cors());

app.get('/api/zipauto/:prefix', (req, res) => {
    //call geonames.org
    let zipCodeStart = req.params.prefix;
    if (zipCodeStart.length >= 3 && zipCodeStart.length <= 5) {
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
    }
});

app.get('/api/finding?', (req, res) => {
    let apiInquery = "";
    apiInquery += '&keywords=' + encodeURI(req.query.keywords);

    if (req.query.categoryId !== 'None') {
        apiInquery += '&categoryId=' + req.query.categoryId;
    }
    apiInquery += '&buyerPostalCode=' + req.query.buyerPostalCode;

    //*******userInputFilter
    let filterData = [];

    //condition
    if (req.query.condition.new !== 'NoCondition') {
        let condition_filter = new ItemFilter('Condition');
        if (req.query.condition.new === 'true') {
            condition_filter.option.push('New');
        }
        if (req.query.condition.used === 'true') {
            condition_filter.option.push('Used');
        }
        if (req.query.condition.unspecified === 'true') {
            condition_filter.option.push('Unspecified');
        }
        filterData.push(condition_filter);
    }

    //shipping
    if (req.query.shipping.freeshipping !== 'NoShippingOption') {
        if (req.query.shipping.freeshipping === 'true') {
            let shipping_filter_free = new ItemFilter('shipping');
            shipping_filter_free.option.push('FreeShippingOnly');
            filterData.push(shipping_filter_free);
        }
        if (req.query.shipping.localpickup === 'true') {
            let shipping_filter_local = new ItemFilter('shipping');
            shipping_filter_local.option.push('LocalPickupOnly');
            filterData.push(shipping_filter_local);
        }
    }

    //distance
    let distance_filter = new ItemFilter('distance');
    if (req.query.distance !== "") {
        distance_filter.option.push(req.query.distance);
    } else {
        distance_filter.option.push("10");
    }
    filterData.push(distance_filter);

    //hidedup
    let hide_filter = new ItemFilter('HideDuplicateItems');
    hide_filter.option.push('true');

    filterData.push(hide_filter);
    //console.log(filterData);
    //build filterURL
    let filterURL = "";
    for (let i = 0; i < filterData.length; i++) {
        if (filterData[i].name === 'Condition') {
            filterURL += '&itemFilter(' + i + ').name=Condition';
            for (let j = 0; j < filterData[i].option.length; j++) {
                filterURL += '&itemFilter(' + i + ').value(' + j + ')=' + filterData[i].option[j];
            }
        } else if (filterData[i].name === 'shipping') {
            filterURL += '&itemFilter(' + i + ').name=' + filterData[i].option[0];
            filterURL += '&itemFilter(' + i + ').value=true';
        } else if (filterData[i].name === 'distance') {
            filterURL += '&itemFilter(' + i + ').name=MaxDistance';
            filterURL += '&itemFilter(' + i + ').value=' + filterData[i].option[0];
        } else if (filterData[i].name === 'HideDuplicateItems') {
            filterURL += '&itemFilter(' + i + ').name=HideDuplicateItems';
            filterURL += '&itemFilter(' + i + ').value=true';
        }
    }
    filterURL += '&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo';
    let requestURL = "";
    requestURL =  serverFindingService + apiInquery + filterURL;
    console.log( requestURL );
    let xhr = new XMLHttpRequest();
    xhr.open("GET", requestURL, false);
    try {
        xhr.send();
    } catch (error) {
        res.send('ERROR');
        return;
    }
    res.send(xhr.responseText);
});

app.get('/api/shopping?', (req, res) => {

    let id = req.query.itemId;
    let serviceShopping = "http://open.api.ebay.com/shopping?";
    serviceShopping += "callname=GetSingleItem";
    serviceShopping += "&responseencoding=JSON&appid=jasonson-571hw-PRD-016e08212-81d2fca4";
    serviceShopping += "&siteid=0";
    serviceShopping += "&version=967";
    serviceShopping += "&ItemID=" + id;
    serviceShopping += "&IncludeSelector=Description,Details,ItemSpecifics";
    let xhr = new XMLHttpRequest();
    xhr.open("GET", serviceShopping, false);
    try {
        xhr.send();
    } catch (error) {
        res.send('ERROR');
        return;
    }
    res.send(xhr.responseText);
});

app.get('/api/gcse?', (req, res) => {

    let q = req.query.q;
    console.log(q);
    let customSearch = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyC8mE_ovX9tn1GQQNAAr2mmF40QrBwMH-o';
    customSearch += '&cx=009040521061041562740:2pm4lt6jkpc';
    customSearch += '&imgSize=huge&imgType=news&num=8&searchType=image';
    customSearch += '&q=' + encodeURI(q) ;
    console.log(customSearch);
    let xhr = new XMLHttpRequest();
    xhr.open("GET", customSearch, false);
    try {
        xhr.send();
    } catch (error) {
        res.send('ERROR');
        return;
    }
    res.send(xhr.responseText);

});

app.get('/api/similar?', (req, res) => {
    let itemID = req.query.itemId;
    let serviceSimilar =  "http://svcs.ebay.com/MerchandisingService?";
    serviceSimilar += "OPERATION-NAME=getSimilarItems&SERVICE-NAME=MerchandisingService&SERVICE-VERSION=1.1.0";
    serviceSimilar += "&CONSUMER-ID=jasonson-571hw-PRD-016e08212-81d2fca4";
    serviceSimilar += "&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&itemId=" + itemID;
    serviceSimilar += "&maxResults=20";

    let xhr = new XMLHttpRequest();
    xhr.open("GET", serviceSimilar, false);
    try {
        xhr.send();
    } catch (error) {
        res.send('ERROR');
        return;
    }
    res.send(xhr.responseText);

});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port : ${port}`));
