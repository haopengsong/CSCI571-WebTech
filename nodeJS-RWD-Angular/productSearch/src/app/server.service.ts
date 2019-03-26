import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ServerService {
  ipApiUrl: string = 'http://ip-api.com/json';
  constructor(private http: HttpClient) {}


  getZipCodeAPI() {
    return this.http.get(this.ipApiUrl);
  }

}
