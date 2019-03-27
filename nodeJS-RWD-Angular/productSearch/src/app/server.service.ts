import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ServerService {
  ipApiUrl: string = 'http://ip-api.com/json';
  autoCompleteUrl: string = 'localhost:5555/api/zipauto/'; // needs prefix zip here
  constructor(private http: HttpClient) {}


  getZipCodeAPI() {
    return this.http.get(this.ipApiUrl);
  }

  getAutoCompleteZip(zipPrefix) {

    this.autoCompleteUrl += zipPrefix;
    return this.http.get(this.autoCompleteUrl);

  }

}
