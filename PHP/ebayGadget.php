<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>HW 6</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>

        body {
            width: 1350px;
            height: 100vh;
            margin-left: auto;
            margin-right: auto;
        }

        .theform {
            margin-left: auto;
            margin-right: auto;
            width : 750px;
        }
        fieldset {
            border: 4px solid rgba(0, 0, 0, 0.2);
            background-color: #f2f2f2;
        }

        h1 {
            text-align : center;
            font-weight: 200;
            margin:0;
        }

        hr {
            border: 1.5px solid rgba(0, 0, 0, 0.2);
        }

        input {
            margin-left:    15px;
            margin-bottom: 15px;
        }

        .category {
            margin-bottom: 15px;
        }

        .keyword {
            margin-left: 0px;
        }

        .nearby_enable {
            margin-left: -12px;
        }

        .grey_area {
            display : inline;
            border: #f2f2f2;
        }

        .grey_area table {
            margin-left: 200px;
            margin-top: -35px;

        }

        .zipCode {
            margin-left : -4px;
        }

        li {
            list-style-type: none;
        }

        #grey_text1 {
            color : #b6b1b1;
        }

        #grey_text2 {
            color : #b6b1b1;
        }

        .form_button {
            text-align : center;
        }

        #zip_error {
            text-align: center;
            margin-top: 25px;
            border: 2px solid #d9d9d9;
            background-color: #e6e6e6;
            display: none;
        }

        #productDisplay {
            margin-left: auto;
            margin-right: auto;
            width: 1300px;
            margin-top: 25px;
            display: none;
        }

        #productDisplay table,   #productDisplay th,   #productDisplay td{
            border-collapse: collapse;
            border: 2px solid #d9d9d9;
        }

        #productDisplay strong {
            margin-left: 9px;
            display: block;
            margin-top: 5px;
        }



        #noRecords,  #noSellerMessage {
            text-align: center;
            margin-top: 25px;
            border: 2px solid #d9d9d9;
            background-color: #e6e6e6;
            display: none;
        }

        #noRecords {
            text-align: center;
            width: 830px;
            margin-left: auto;
            margin-right: auto;
        }

        #noSimilarMessage {
            width: 850px;
            height: 30px;
            border: 3px solid #d9d9d9;
            display: none;
            margin-top: 25px;
            text-align: center;
            margin-left: auto;
            margin-right: auto;
        }

        #noSimilarMessage div {
            border: 1px solid #d9d9d9;
            width:750px;
            height: 20px;
            font-weight: 800;
            text-align: center;
            margin-left: auto;
            margin-right: auto;
            margin-top: 3px;
        }

        a {
            text-decoration: none;
            color: black;
        }

        a:hover {
            color: #928787;
        }

        #itemDetails {
            margin-left: auto;
            margin-right: auto;
            width: 800px;
        }

        #itemDetails td {
            padding-left: 9px;
        }

        #itemDetails th {
            width: 180px;
        }

        #sellerMessage {
            display: block;
            width: 1050px;  
            border-width: 0px;
            font-weight:800;
            margin-left: auto;
            margin-right: auto;
        }

        .down_arrow {
            transform: rotate(45deg);
            display: inline-block;
            border: solid #ab9f9f;
            border-width: 0px 5px 5px 0px;
            padding: 10px;
            padding-bottom: 10px;
        }

        .subSection {
            text-align: center;
            margin-top: 30px;
        }


        .subSection div {
            color: #ab9f9f;
        }


        #similarItemsContainer {
            width: 1150px;
            height: 380px;
            text-align: center;
            overflow-x: scroll;
            overflow-y: hidden;
            border: 2px solid #dcd6d6;
            margin-left: auto;
            margin-right: auto;
            padding: 0px;
        }

        #similarItemsContainer img {
            margin-bottom: 6px;
        }

        .similarItem {
            width: 215px;
            height: 210px;
            padding: 22px;
        }


        .similarItem a {
            margin-top: 5px;
        }

        #itemDetailsHeader {
            font-size: 30px;
            text-align: center;
        }

   

    </style>
    <script>
        //retrieve location from  IP
        locationZipCode = "";
        ebayResponse = "";
        iframeContent = "";
        itemId = "";
        distanceMiles = "";

        function getGeolocation () {
           
            urlIp = "http://ip-api.com/json";
            //console.log("Getting location ...");
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", urlIp, false);
            try {
                xmlhttp.send();
            } catch (error) {
                console.warn("Can't get location");
                return;
            }
            jsonObj = JSON.parse(xmlhttp.responseText);
            if('city' in jsonObj && jsonObj['city'] != undefined) {
                document.getElementById('location_data').value = jsonObj['city'];
            } else {
                alert('Unable to obtain location!');
            }
            setTimeout(enableSearch, 1000);
            //enableSearch();
            locationZipCode = jsonObj['zip'];
            //console.log(jsonObj);
        }

        function enableSearch() {
            document.getElementById("search_button").disabled = false;
        }

        function enableGreyedout() {
            if( document.getElementById("enable_nearby_search").checked == false) {
                //reset value
                var greyZipText = document.getElementById("grey_zip_text_input");
                greyZipText.value = greyZipText.defaultValue;
                document.getElementById("grey_radio_here").checked = true;
                var greyDistanceInput = document.getElementById("grey_distance_input");
                greyDistanceInput.value = greyDistanceInput.defaultValue;

                greyDistanceInput.disabled = true;
                document.getElementById("grey_text1").style.color = "#b6b1b1";
                document.getElementById("grey_radio_here").disabled = true;
                document.getElementById("grey_text2").style.color = "#b6b1b1";
                document.getElementById("grey_zip_radio").disabled = true;
                greyZipText.disabled = true;

                
            } else {
                document.getElementById("grey_distance_input").disabled = false;
                document.getElementById("grey_text1").style.color = "black";
                document.getElementById("grey_radio_here").disabled = false;
                document.getElementById("grey_text2").style.color = "black";
                document.getElementById("grey_zip_radio").disabled = false;
                

            }

            if(document.getElementById("grey_radio_here").disabled == false) {
                document.getElementById("grey_zip_text_input").disabled = true;
            } 
            
        }

        function resetForm() {
            document.getElementById("enable_nearby_search").checked = false;
            document.getElementById("grey_distance_input").disabled = true;
            document.getElementById("grey_text1").style.color = "#b6b1b1";
            document.getElementById("grey_radio_here").disabled = true;
            document.getElementById("grey_text2").style.color = "#b6b1b1";
            document.getElementById("grey_zip_radio").disabled = true;
            document.getElementById("grey_zip_text_input").disabled = true;
            document.getElementById('productDisplay').style.display = 'none';
            document.getElementById('noRecords').style.display = 'none';
        }

        function enableZipText() {
            if(document.getElementById("grey_zip_radio").checked == true) {
                document.getElementById("grey_zip_text_input").disabled = false;
            } else {
                document.getElementById("grey_zip_text_input").disabled = true;
            }
        }
        function disableZipText() {
            if(document.getElementById("grey_radio_here").checked == true) {
                document.getElementById("grey_zip_text_input").disabled = true;
            } else {
                document.getElementById("grey_zip_text_input").disabled = false;
            }
        }

        function checkDistance() {
            var _MaxDistance = parseInt(distanceMiles); 
            if (Number.isInteger(_MaxDistance)) {
                if (_MaxDistance < 5 || _MaxDistance > 2147483647) {
                    return false;
                } 
            } else {
                return false; 
            } 
            return true;
        }

        function checkZipCode() {
            var zipCode = document.getElementById("grey_zip_text_input").value;
                var pattern =  /^\d{5}$/;
                var result = pattern.test(zipCode);
                if(result != true) {
                    return false;
                } 
                return true;
        }

        function displayContent(formData) {
            //check distance field
            if (document.getElementById("enable_nearby_search").checked == true) {
                if (formData.miles.value == "") {
                    distanceMiles = "10";
                } else {
                    distanceMiles = formData.miles.value;
                }
                if (document.getElementById("grey_zip_text_input").disabled == false) {
                    if (!checkDistance() && !checkZipCode()) {
                        document.getElementById('productDisplay').style.display = "none";
                        noRecordsFound('noRecords', 'Zipcode and Distance are invalid');
                        return false;
                    } else if (!checkDistance()) {
                        document.getElementById('productDisplay').style.display = "none";
                        noRecordsFound('noRecords', 'Distance is invalid');
                        return false;
                    } else if (!checkZipCode()) {
                        document.getElementById('productDisplay').style.display = "none";
                        noRecordsFound('noRecords', 'Zipcode is invalid');
                        return false;
                    }
                }
                if (!checkDistance()) {
                    document.getElementById('productDisplay').style.display = "none";
                    noRecordsFound('noRecords', 'Distance is invalid');
                    return false;
                }
                //console.log(distanceMiles);
            }
            SendDataToPHP(formData);
            return false;
        }
        function itemFilter(field) {
            this.name = field;
            this.optionChecked = [];
        } 

        function SendDataToPHP(formData) {
            /*
            1. build filter
            */
            var urlFilterArray = [];
            var urlItem = [];

            //1. condition
            conditionNodeList = formData.condition;
            var condition = new itemFilter("Condition");
            for (var i = 0; i < conditionNodeList.length; i++) {
                if (conditionNodeList[i].checked == true) {
                    condition.optionChecked.push(conditionNodeList[i].value);
                }
            }
            if (condition.optionChecked.length != 0) {
                urlFilterArray.push(condition);
            }
            //2. shipping options

            shippingOptionNodeList = formData.shipping;
            
            for (var i = 0; i < shippingOptionNodeList.length; i++) {
                if (shippingOptionNodeList[i].checked == true) {
                    var shippingOption = new itemFilter("ShippingOption");
                    shippingOption.optionChecked.push(shippingOptionNodeList[i].value);
                    urlFilterArray.push(shippingOption);
                }
            }
            //3. MaxDistance
            
            if (formData.nearby_search.checked == true) {
                var distance = new itemFilter("MaxDistance");
                distance.optionChecked.push(distanceMiles);
                urlFilterArray.push(distance);
            } 

            //4. HideDuplicateItems
            var hideDup = new itemFilter("HideDuplicateItems");
            hideDup.optionChecked.push("true");
            urlFilterArray.push(hideDup);
            //console.log(urlFilterArray);

            //5. keyword
            var keyword = new itemFilter("keywords");
            keyword.optionChecked.push(formData.keyword.value);
            urlItem.push(keyword);

            //6. categoryId
            var categoryId = new itemFilter("categoryId");
            var categorySelected = formData.category.value;
            if (categorySelected != "") {
                var categoryIdArray = categorySelected.split(" ");
                for (var i = 0; i < categoryIdArray.length; i++) {
                    categoryId.optionChecked.push(categoryIdArray[i]);
                }
            }
            urlItem.push(categoryId);

            //7. buyerPostalCode
            if (document.getElementById("enable_nearby_search").checked == true) {
                var zip = new itemFilter("buyerPostalCode");
                var zipCode;
                if (document.getElementById("grey_zip_text_input").disabled == true) {
                    zipCode = locationZipCode;
                } else {
                    zipCode = document.getElementById("grey_zip_text_input").value;
                }
                zip.optionChecked.push(zipCode);
                urlItem.push(zip);
            }

            //send form input to to PHP
            userInputFilter = JSON.stringify(urlFilterArray);
            userInputItem = JSON.stringify(urlItem);
            requestDataFromServer(userInputFilter, userInputItem);
            //ebayResponse = JSON.parse(ebayResponse);
            
        }

        function requestDataFromServer(userInputFilter, userInputItem) {
            var xmlhttp = new XMLHttpRequest();
            //synchronous
            xmlhttp.open("POST", "productSearch.php", false);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send("userInputFilter=" + userInputFilter + "&" + "userInputItem=" + userInputItem);

            //console.log(this.responseText);
            apilink = xmlhttp.responseText;
            //apilink = apilink.replace(/\s+/g, '');
            dataReceived = apilink.split('</html>');
            ebayResponse = dataReceived[dataReceived.length-1];
            if (parseJSONProductSearch(JSON.parse(ebayResponse)) == true) {
                document.getElementById('productDisplay').innerHTML = htmlContent;
                document.getElementById('productDisplay').style.display = "block";
                document.getElementById('noRecords').style.display = "none";
            } else {
                document.getElementById('productDisplay').style.display = "none";
                noRecordsFound('noRecords','No Records has been found');
            }
        }

        function parseJSONProductSearch(jsonData) {
            
            //check input
            if (jsonData.hasOwnProperty('findItemsAdvancedResponse') == false) {
                //todo # 1
                //console.log(" #1: url error");
                return false;
            } else if (jsonData.findItemsAdvancedResponse[0]['ack'] != 'Success') {
                //todo # 2
                //console.log(" #2: failure");
                return false;
            } else if (jsonData.findItemsAdvancedResponse[0]['searchResult'][0]["@count"] == 0) {
                //todo # 3
                //console.log(" #3: didn't find anything");
                return false;
            } 

            //generate HTML content
            itemData = jsonData.findItemsAdvancedResponse[0]['searchResult'][0]['item'];
            htmlContent = "<table  align = 'center'>";
            
           
            htmlContent += "<tr>";

            //append header
            htmlContent += "<th>Index</th> <th>Photo</th> <th>Name</th> <th>Price</th> <th>Zip code</th> <th>Condition</th> <th>Shipping Option</th>";
            htmlContent += "</tr>";

            var itemLength = itemData.length;
            for (var i = 0; i < itemLength; i++) {
                var currRow = itemData[i];
                var index = i+1;
                htmlContent += "<tr><td>" + index + "</td>";
                if (currRow.hasOwnProperty("galleryURL") == true) {
                    htmlContent += "<td><img src = '" + currRow['galleryURL'][0] + "'width='" + 130 + "'height ='" + 115 + "' ></td>";
                } else {
                    htmlContent += "<td><img alt = \"N/A\" src = \"\"></td>";
                }

                if (currRow.hasOwnProperty('title') == true) {
                    itemId = currRow['itemId'][0];
                    //console.log(itemId);
                    htmlContent += "<td><a href=\"javascript:;\" onclick = \" requestProductDetails('"+itemId+"'); \">" + currRow['title'][0] + "</a></td>";
                } else {
                    htmlContent += "<td>" + " N/A "+ "</td>";
                }

                if (currRow.hasOwnProperty('sellingStatus') == true) {
                    if (currRow['sellingStatus'][0].hasOwnProperty('currentPrice') == true) {
                        htmlContent += "<td> $" + currRow['sellingStatus'][0]['currentPrice'][0]['__value__'] + "</td>";
                    } else {
                        htmlContent += "<td> N/A"  + "</td>";
                    }
                } else {
                    htmlContent += "<td> N/A"  + "</td>";
                }

                if (currRow.hasOwnProperty('postalCode') == true) {
                    htmlContent += "<td style=\"width:75px;\" >" + currRow['postalCode'][0] + "</td>";
                } else {
                    htmlContent += "<td style=\"width:75px;\"> N/A"  + "</td>";
                }

                if (currRow.hasOwnProperty('condition') == true) {
                    if (currRow['condition'][0].hasOwnProperty('conditionDisplayName') == true) {
                        htmlContent += "<td style=\"width:105px;\" id = \" productCondition \">" + currRow['condition'][0]['conditionDisplayName'][0]+ "</td>";
                    } else {
                        htmlContent += "<td style=\"width:105px;\" id = \" productCondition \"> N/A" +  "</td>";
                    }
                } else {
                    htmlContent += "<td style=\"width:105px;\" id = \" productCondition \"> N/A" +  "</td>";
                }

                if (currRow.hasOwnProperty('shippingInfo') == true) {
                    if (currRow['shippingInfo'][0].hasOwnProperty('shippingServiceCost')== true) {
                        if (currRow['shippingInfo'][0]['shippingServiceCost'][0]['__value__'] == "0.0") {
                            htmlContent += "<td style=\"width:125px;\"> Free Shipping </td>";
                        } else if (currRow['shippingInfo'][0]['shippingServiceCost'][0]['__value__'] != "" && currRow['shippingInfo'][0]['shippingServiceCost'][0]['__value__'] != null) {
                            htmlContent += "<td style=\"width:125px;\"> $ "+ currRow['shippingInfo'][0]['shippingServiceCost'][0]['__value__'] + "</td>";
                        } else {
                            htmlContent += "<td style=\"width:125px;\"> N/A </td>";
                        }
                    } else {
                        htmlContent += "<td style=\"width:125px;\"> N/A </td>";
                    }
                } else {
                    htmlContent += "<td style=\"width:125px;\"> N/A </td>";
                }
                htmlContent += "</tr>";
            }
           
            htmlContent += "</table>";
            return true;
        }

        function requestProductDetails(itemId) {
            //console.log('here');
            //seller message
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "productSearch.php", false);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send("itemId="+itemId);

            productDetails = xmlhttp.responseText;
            dataReceived = productDetails.split("</html>");
            jsonProductDetails = JSON.parse(dataReceived[dataReceived.length-1]);
            if (parseJSONProductDetails(jsonProductDetails) == true) {
                document.getElementById('productDisplay').innerHTML = htmlContent;
                var iframeElement = document.getElementById('sellerMessage');
                if (iframeElement) {
                    iframeElement.setAttribute('srcdoc', iframeContent);
                }
            } else {
                document.getElementById('productDisplay').style.display = "none";
                return;
            }

            //similar Items
            var xmlhttp2 = new XMLHttpRequest();
             //synchronous 
            xmlhttp2.open("POST", "productSearch.php", false);
            xmlhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp2.send("similarID="+itemId);
            //console.log(xmlhttp.responseText);
            dataReceived2 = xmlhttp2.responseText.split("</html>");
            similarItemData = JSON.parse(dataReceived2[dataReceived2.length-1]);
            if (parseJSONSimilarItems(similarItemData)) {
                document.getElementById('similarItemsContainer').innerHTML = similarItemContent;
            } 
        }

        function parseJSONSimilarItems(JsonSimilar) {
            similarItemContent = "";
            if (JsonSimilar["getSimilarItemsResponse"]['ack'] != 'Success') {
                return false;
            }

            itemArray = JsonSimilar["getSimilarItemsResponse"]['itemRecommendations']['item'];
            if (itemArray == null || itemArray.length == 0) {
                 return false;
            }
            
            for (var i = 0; i < itemArray.length; i++) {
                var lookUpId;
                similarItemContent += "<li class = \"similarItem\">";
                if (itemArray[i].hasOwnProperty('itemId')) {    
                    lookUpId = itemArray[i]['itemId'];
                }
                if (itemArray[i].hasOwnProperty('imageURL')) {
                    similarItemContent += "<img src = "+ itemArray[i]['imageURL'] +  " width = '"+ 180 + "' height = '"+ 190 +"'>";
                } else {
                    similarItemContent += "<a> N/A </a>";
                }

                if (itemArray[i].hasOwnProperty('title')) {
                    similarItemContent += "<a href=\"javascript:;\" onclick = \"requestProductDetails('"+lookUpId+"'); \">" + itemArray[i]['title'] + "</a>";
                }

                if (itemArray[i].hasOwnProperty('buyItNowPrice')) {
                    if (itemArray[i]['buyItNowPrice']['__value__'] == "0.00") {
                        if (itemArray[i].hasOwnProperty('currentPrice') && itemArray[i]['currentPrice']['__value__'] != "0.00") {
                            similarItemContent += "<strong> $" + itemArray[i]['currentPrice']['__value__'] + "</strong>";
                        } else {
                            similarItemContent += "<strong> $" + itemArray[i]['buyItNowPrice']['__value__'] + "</strong>";
                        }
                    } else {
                        similarItemContent += "<strong> $" + itemArray[i]['buyItNowPrice']['__value__'] + "</strong>";
                    }
                }

                similarItemContent += "</li>";
            }

           
            return true;
        }

        function parseJSONProductDetails(jsonData) {
            if (jsonData['Ack'] != 'Success') {
                noRecordsFound('noRecords','No Details has been found');
                return false;
            }

            itemData = jsonData['Item'];
            //itemId = itemData['ItemID'];
            htmlContent = "<div id = \"itemDetailsHeader\"> <strong> Item Details </strong> </div>";
            htmlContent += "<table id = 'itemDetails' style='text-align: left;'>";
           

            if (itemData['PictureURL'] != undefined) {
                htmlContent += "<tr><th><strong>Photo</strong></th>";
                htmlContent += "<td><img src = " + itemData['PictureURL'][0] + " width = '"+ 215 + "' height = '"+ 230 +"'></td>";
                htmlContent += "</tr>";
            } 

            if (itemData['Title'] != undefined) {
                htmlContent += "<tr><th><strong>Title</strong></th>";
                htmlContent += "<td>" + itemData['Title'] + "</td>";
                htmlContent += "</tr>";
            }

            if (itemData['Subtitle'] != undefined) {
                htmlContent += "<tr><th><strong>Subtitle</strong></th>";
                htmlContent += "<td>" + itemData['Subtitle'] + "</td>";
                htmlContent += "</tr>";
            } 

            if (itemData['CurrentPrice'] != undefined) {
                htmlContent += "<tr><th><strong>Price</strong></th>";
                htmlContent += "<td>" + itemData['CurrentPrice']['Value']+ " " + itemData['CurrentPrice']['CurrencyID'] + "</td>";
                htmlContent += "</tr>";
            } 

            if (itemData['Location'] != undefined) {
                htmlContent += "<tr><th><strong>Location</strong></th>";
                htmlContent += "<td>" + itemData['Location'] + ", "+ itemData['PostalCode'] +"</td>";
                htmlContent += "</tr>";
            } 

            if (itemData['Seller'] != undefined) {
                htmlContent += "<tr><th><strong>Seller</strong></th>";
                htmlContent += "<td>" + itemData['Seller']['UserID'] + "</td>";
                htmlContent += "</tr>";
            } 

            if (itemData['ReturnPolicy'] != undefined) {
                htmlContent += "<tr><th><strong>Return Policy(US)</strong></th>";
                if (itemData['ReturnPolicy']['ReturnsAccepted'] == "Returns Accepted") {
                    htmlContent += "<td>" + itemData['ReturnPolicy']['ReturnsAccepted'] + " within " + itemData['ReturnPolicy']['ReturnsWithin'] + "</td>";
                } else {
                    htmlContent += "<td>" + itemData['ReturnPolicy']['ReturnsAccepted'] + "</td>";
                }
                htmlContent += "</tr>";
            } 

            if (itemData['ItemSpecifics'] != undefined) {
                itemSpec = itemData['ItemSpecifics']['NameValueList'];
                itemSpecLen = itemSpec.length;
                for (var i = 0; i < itemSpecLen; i++) {
                    
                    var entryName = itemSpec[i]['Name'];
                    var entryValue = itemSpec[i]['Value'];
                    if (entryValue.length > 0) {
                        htmlContent += "<tr><th><strong>" + entryName + "</strong></th>";
                        htmlContent += "<td>" + entryValue[0] + "</td>";
                        htmlContent += "</tr>";
                    }

                }
            }
            
            htmlContent += "</table>";

            //diplay seller message
            if (itemData.hasOwnProperty('Description') == true && itemData['Description'] != "" && itemData['Description'] != null) {
                iframeContent = itemData['Description'];
            } else {
                iframeContent = "";
            }
            
            htmlContent += "<div class=\"subSection\" onclick = \" showSellerMessage() \"> <div id=\"clickSeller\"> click to show seller message </div>";
            htmlContent += "<div style='margin-top:6px;'><i style='transform: rotate(45deg);' id=\"clickSellerArrow\" class=\"down_arrow\"></i></div>"
            htmlContent += "</div>";
            htmlContent += "<div id = \"noSellerMessage\"></div>"
            htmlContent += "<iframe id=\"sellerMessage\" onload=\" contentLoaded(this) \"></iframe>";
            
            
            htmlContent += "<div class=\"subSection\" onclick = \" showSimilarItems() \"> <div id=\"clickSimilar\"> click to show similar items </div>";
            htmlContent += "<div style='margin-top:6px;'><i style='transform: rotate(45deg);' id=\"clickSimilarArrow\" class=\"down_arrow\"></i></div>"
            htmlContent += "</div>";
            htmlContent += "<div id = \"noSimilarMessage\"><div></div></div>"
            htmlContent += "<ul style='display:"+"none"+";' id = \"similarItemsContainer\"></<ul>";
            return true;
        }

        function showSimilarItems() {
            hideSellerMessage();
            document.getElementById('sellerMessage').style.display = "none";
            document.getElementById('noSellerMessage').style.display = "none";
            var similarShow = document.getElementById('similarItemsContainer');
            if (similarItemContent != "") {
                if (similarShow.style.display == "none") {
                    similarShow.style.display = "flex";
                    displaySimilar();
                } else {
                    similarShow.style.display = "none";
                    hideSimilar();
                }
            } else {
                document.getElementById('noSimilarMessage').style.display = "none";
                noSimilarFound();
                if (document.getElementById('clickSimilarArrow').style.transform == "rotate(45deg)") {
                    displaySimilar();
                    document.getElementById('noSimilarMessage').style.display = "display";
                } else {
                    hideSimilar();
                    document.getElementById('noSimilarMessage').style.display = "none";
                }
            }
        }

        function displaySimilar() {
            document.getElementById('clickSimilar').innerHTML = "click to hide similar items";
            document.getElementById('clickSimilarArrow').style.transform = "rotate(226deg)";
        }

        function hideSimilar() {
            document.getElementById('clickSimilar').innerHTML = "click to show similar items";
            document.getElementById('clickSimilarArrow').style.transform = "rotate(45deg)";
        }

        function showSellerMessage() {
            hideSimilar();
            document.getElementById('similarItemsContainer').style.display = "none";
            document.getElementById('noSimilarMessage').style.display = "none";
            var iframeShow = document.getElementById('sellerMessage');
            //iframeShow.style.height = iframeHeight;
            if (iframeContent != "") {
                if (iframeShow.style.display == "none") {
                    iframeShow.style.display = "block";
                    displaySellerMessage();
                } else {
                    iframeShow.style.display = "none";
                    hideSellerMessage();
                }
            } else {
                document.getElementById('noSellerMessage').style.display = "none";
                noRecordsFound('noSellerMessage','No Seller Message Found.');
                if (document.getElementById('clickSellerArrow').style.transform == "rotate(45deg)") {
                    displaySellerMessage();
                    document.getElementById('noSellerMessage').style.display = "display";
                } else {
                    hideSellerMessage();
                    document.getElementById('noSellerMessage').style.display = "none";
                }
            }   
        }

        function displaySellerMessage() {
            document.getElementById('clickSeller').innerHTML = "click to hide seller message";
            document.getElementById('clickSellerArrow').style.transform = "rotate(226deg)";
        }

        function hideSellerMessage() {
            document.getElementById('clickSeller').innerHTML = "click to show seller message";
            document.getElementById('clickSellerArrow').style.transform = "rotate(45deg)";
        }

        function contentLoaded(iframeObj) {
            iframeObj.style.display = "block";
            iframeHeight = iframeObj.contentDocument.getElementsByTagName('html')[0].scrollHeight + "px";
            iframeObj.contentDocument.getElementsByTagName('html')[0].style.overflow = "hidden";
            iframeObj.style.height = iframeHeight;
            iframeObj.style.display = "none";

            
        }

        function noRecordsFound(eleTag, ErrorMessage) {
            document.getElementById(eleTag).innerHTML = ErrorMessage; 
            document.getElementById(eleTag).style.display = 'block';
        }

        function noSimilarFound() {
            document.getElementById('noSimilarMessage').firstElementChild.innerHTML = "No Similar Item found.";
            document.getElementById('noSimilarMessage').style.display = "block";
        }
    </script>
</head>
<body onload="getGeolocation()">
    <form action="" method="POST" name="myform" class="theform" onsubmit="return displayContent(this)">
        <input type="hidden" name="user_location" id="location_data" value="">
        <fieldset>
            <h1> <i> Product Search </i> </h1>
            <hr>
            <b>Keyword</b> <input class="keyword" name="keyword" type="text" required> <br>
            <b>Category</b>
            <select class="category" name="category">
                <option value="" selected> All Categories</option>
                <option value="550">Art</option>
                <option value="2984">Baby</option>
                <option value="267">Books</option>
                <option value="11450">Clothing, Shoes & Accessories</option>
                <option value="58058">Computers/Tablets & Networking</option>
                <option value="26395">Health & Beauty</option>
                <option value="11233">Music</option>
                <option value="1249"> Video Games & Consoles</option>
            </select>
            <br>
            <b>Condition</b>
            <input type="checkbox" name="condition" value="New">New
            <input type="checkbox" name="condition" value="Used">Used
            <input type="checkbox" name="condition" value="Unspecified">Unspecified
            <br>
            <b>Shipping Options</b>
            <input type="checkbox" name="shipping" value="LocalPickupOnly">Local Pickup
            <input type="checkbox" name="shipping" value="FreeShippingOnly">Free Shipping
            <br>
            <fieldset class="grey_area">
                <span>
                    <input id = "enable_nearby_search" class="nearby_enable" type="checkbox" name="nearby_search" onchange="enableGreyedout()"
                        enable>
                    <b>Enable Nearby Search</b>
                </span>
                <table>
                    <tr>
                        <th>
                            <input type="text" name="miles" id="grey_distance_input" placeholder="10" disabled>
                            <b id="grey_text1">miles from</b>
                        </th>
                        <td>
                            <input onchange="disableZipText()" type="radio" name="distance" value="nozip" id="grey_radio_here"
                                checked disabled>
                            <a id="grey_text2">Here</a>
                        </td>
                    </tr>
                    <tr>
                        <th rowspan="1"></th>
                        <td>
                            <input onchange="enableZipText()" type="radio" name="distance" value="withzip" id="grey_zip_radio"
                                disabled>
                            <input class="zipCode" type="text" name="zipCode" placeholder="zip code" id="grey_zip_text_input"
                                disabled required>
                        </td>
                    </tr>
                </table>
            </fieldset>
            <div class="form_button">
                <input type="hidden" name="data" value="">
                <input type="submit" id="search_button" value="Search"  disabled>
                <input type="reset" value="Clear" onclick="resetForm()">
            </div>
        </fieldset>
    </form>
    <div id = "resetArea">
        <div id="productDisplay"></div>
        <div id="noRecords"></div>
    </div>
</body>
</html>

<?php
function buildFilter($_FilterData) {
    $_filter = "";
    for ($i = 0; $i < count($_FilterData); $i++) {
        $_curArray = $_FilterData[$i];
        if ($_curArray['name'] == 'ShippingOption') {
            $_optionValue = $_curArray['optionChecked'][0];
            $_filter .= "&itemFilter(" . $i . ").name=" . $_optionValue;
            $_filter .= "&itemFilter(" . $i . ").value=" . "true";
        } else {
            if ($_curArray['name'] != "Condition") {
                $_filter .= "&itemFilter(" . $i . ").name=" . $_curArray['name'];
                $_filter .= "&itemFilter(" . $i . ").value=" . $_curArray['optionChecked'][0];
            } else {
                $_filter .= "&itemFilter(" . $i . ").name=" . $_curArray['name'];
                for ($j = 0; $j < count($_curArray['optionChecked']); $j++) {
                    $_filter .= "&itemFilter(" . $i . ").value" . "(" . $j . ")=" . $_curArray['optionChecked'][$j];
                }
            }
        }
    }
    return $_filter;
}

function buildItem($_itemData) {
    $_item = "";
    for ($i = 0; $i < count($_itemData); $i++) {
        if ($_itemData[$i]['name'] == "keywords") {
            $_item .= "&" . $_itemData[$i]['name'] . "=" . rawurlencode($_itemData[$i]['optionChecked'][0]);
        } else if ($_itemData[$i]['name'] == "categoryId") {
            $_num_id = count($_itemData[$i]['optionChecked']);
            for ($j = 0; $j < $_num_id; $j++) {
                $_item .= "&" . $_itemData[$i]['name'] . "=" . $_itemData[$i]['optionChecked'][$j];
            }
        } else if (count($_itemData[$i]['optionChecked']) > 0) {
            $_item .= "&" . $_itemData[$i]['name'] . "=" . $_itemData[$i]['optionChecked'][0];
        }
    }
    return $_item;
}

if ($_POST['userInputFilter'] && $_POST['userInputItem']) {

    $url .= "http://svcs.ebay.com/services/search/FindingService/v1";
    $url .= "?OPERATION-NAME=findItemsAdvanced";
    $url .= "&SERVICE-VERSION=1.0.0";
    $url .= "&SECURITY-APPNAME=jasonson-571hw-PRD-016e08212-81d2fca4";
    $url .= "&RESPONSE-DATA-FORMAT=JSON";
    $url .= "&REST-PAYLOAD=true";
    $url .= "&paginationInput.entriesPerPage=20";

    $_userInputFilter = json_decode($_POST['userInputFilter'], true);
    $_userInputItem = json_decode($_POST['userInputItem'],true);

    $_urlFilter = buildFilter($_userInputFilter);
    $_urlItem = buildItem($_userInputItem);

    $url = $url . $_urlItem . $_urlFilter;

    $response = file_get_contents($url);
    //$response = json_decode($response);
    header( "Content-Type: application/json" );
    echo $response;   
}

if ($_POST['itemId']) {
    $_itemId = json_decode($_POST['itemId'], true);

    $urlProductDetails = "http://open.api.ebay.com/shopping?";
    $urlProductDetails .= "callname=GetSingleItem";
    $urlProductDetails .= "&responseencoding=JSON&appid=jasonson-571hw-PRD-016e08212-81d2fca4";
    $urlProductDetails .= "&siteid=0";
    $urlProductDetails .= "&version=967";
    $urlProductDetails .= "&ItemID=" . $_itemId;
    $urlProductDetails .= "&IncludeSelector=Description,Details,ItemSpecifics";

    $response_product_details = file_get_contents($urlProductDetails);
    header( "Content-Type: application/json" );
    echo $response_product_details;
}

if ($_POST['similarID']) {
    $_similarID = json_decode($_POST['similarID'], true);

    $urlSimilarItems = "http://svcs.ebay.com/MerchandisingService?";
    $urlSimilarItems .= "OPERATION-NAME=getSimilarItems&SERVICE-NAME=MerchandisingService&SERVICE-VERSION=1.1.0";
    $urlSimilarItems .= "&CONSUMER-ID=jasonson-571hw-PRD-016e08212-81d2fca4";
    $urlSimilarItems .= "&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&itemId=" . $_similarID;
    $urlSimilarItems .= "&maxResults=8";

    $response_similar_items = file_get_contents($urlSimilarItems);
    header( "Content-Type: application/json" );
    echo $response_similar_items;
}

exit;
?>
