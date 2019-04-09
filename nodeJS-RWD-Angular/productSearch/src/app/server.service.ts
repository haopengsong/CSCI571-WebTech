import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";



@Injectable()
export class ServerService {
  ipApiUrl: string = 'http://ip-api.com/json';
  serverZip: string = 'http://571webhw7nodejs-env.myyyz4mkdb.us-west-2.elasticbeanstalk.com/api/zipauto/'; // needs prefix zip here
  serverFinding : string = 'http://571webhw7nodejs-env.myyyz4mkdb.us-west-2.elasticbeanstalk.com/api/finding?';
  serverFindingFlag : string =  'http://571webhw7nodejs-env.myyyz4mkdb.us-west-2.elasticbeanstalk.com/api/finding?';



  constructor(private http: HttpClient) {}

  getZipCodeAPI() {
    return this.http.get(this.ipApiUrl);
  }

  getAutoCompleteZip(zipPrefix) {
    const autoCompleteUrl = this.serverZip + zipPrefix;
    return this.http.get(autoCompleteUrl);
  }

  getEbayFindingService(formData) {
    this.serverFinding = this.serverFindingFlag;
    this.serverFinding += 'keywords=' + formData.keyword + '&';
    if (formData.categories !=="") {
      this.serverFinding += 'categoryId=' + formData.categories + '&';
    } else {
      this.serverFinding += 'categoryId=' + 'None' + '&';
    }
    this.serverFinding += 'buyerPostalCode=' + formData.Zip + '&';

    //condition
    if (!formData.new && !formData.use && !formData.unspecified) {
      this.serverFinding += 'condition[new]=NoCondition&';
    } else {
      if (formData.new) {
        this.serverFinding += 'condition[new]=true&';
      } else {
        this.serverFinding += 'condition[new]=false&';
      }

      if (formData.used) {
        this.serverFinding += 'condition[used]=true&';
      } else {
        this.serverFinding += 'condition[used]=false&';
      }

      if (formData.unspecified) {
        this.serverFinding += 'condition[unspecified]=true&';
      } else {
        this.serverFinding += 'condition[unspecified]=false&';
      }
    }


    //shipping
    if (!formData.freeshipping && !formData.localpickup) {
      this.serverFinding += 'shipping[freeshipping]=NoShippingOption&';
    } else {
      if (formData.freeshipping) {
        this.serverFinding += 'shipping[freeshipping]=true&';
      } else {
        this.serverFinding += 'shipping[freeshipping]=false&';
      }

      if (formData.localpickup) {
        this.serverFinding += 'shipping[localpickup]=true&';
      } else {
        this.serverFinding += 'shipping[localpickup]=false&';
      }
    }

    if (formData.Distance == null) {
      this.serverFinding += 'distance=10';
    } else {
      if (formData.Distance != "") {
        this.serverFinding += 'distance=' + formData.Distance + '&';
      } else {
        this.serverFinding += 'distance=10';
      }
    }



  //  console.log(this.serverFinding);
    return this.http.get(this.serverFinding);
  }

  getEbayShoppingService(itemId) {
    let serviceShopping = 'http://571webhw7nodejs-env.myyyz4mkdb.us-west-2.elasticbeanstalk.com/api/shopping?' + 'itemId=' + itemId;
    //console.log(serviceShopping);
    return this.http.get(serviceShopping);
  }

  getGCSE(itemTitle) {
    itemTitle = encodeURI(itemTitle);
    let serviceGCSE = 'http://571webhw7nodejs-env.myyyz4mkdb.us-west-2.elasticbeanstalk.com/api/gcse?q=' + itemTitle;
    //console.log(serviceGCSE);
    return this.http.get(serviceGCSE);
  }

  getSimilarItems(itemId) {
    let serviceSimilar = 'http://571webhw7nodejs-env.myyyz4mkdb.us-west-2.elasticbeanstalk.com/api/similar?' + 'itemId=' + itemId;
    return this.http.get(serviceSimilar);
  }

}

