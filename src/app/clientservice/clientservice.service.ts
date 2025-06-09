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
  detailcmmdbyindex(index:any) {
    return this.http.get(this.api_url+`/detailcmdindex/${index}`,);
  }

   getallcmdbyemonid(emon_id:any) {
    return this.http.get(this.api_url+`/admin/getallcmdbyemonid/${emon_id}`,);
  }
  AllsousCathebycath(body:any) {
    return this.http.post(this.api_url+"/admin/cathegoriesbycath", body);
  }

  validationcmmd(body:any) {
    return this.http.post(this.api_url+"/admin/validationcmmd", body);
  }

  // Editstatut(id:any) {
  //   return this.http.get(this.api_url+`/admin/commandes/${id}`, );
  // }

  annulecmd(index:any,num:any,statut:any) {
    return this.http.delete(this.api_url+`/admin/annulecommandesbyclient/${index}/${num}/${statut}`,);
  }

  sigleqr(token:any,) {
    return this.http.get(this.api_url+`/admin/sigleqrcode/${token}`,);
  }


  AllCommande() {
    return this.http.get(this.api_url+"/admin/commandes", );
  }

  gettatut() {
    return this.http.get(this.api_url+"/admin/getstatut");
  }
}
