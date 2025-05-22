import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class ClientserviceService {

  constructor(private http:HttpClient) { }
  api_url = environment.apiUrl

  AllCathe() {
    return this.http.get(this.api_url+"/admin/cathegories", );
  }
  AllsousCathebycath(body:any) {
    return this.http.post(this.api_url+"/admin/cathegoriesbycath", body);
  }
}
