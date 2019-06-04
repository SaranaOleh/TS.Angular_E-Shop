import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  public getToken(){
    const token = localStorage.getItem('token');
    return token ? token : null;
  }

  constructor(private http:HttpClient) { }

  public all(params){
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    };
    return this.http.get(environment.apiUrl + 'order' + params,{headers})
  }

  public show(id){
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    };
    return this.http.get(environment.apiUrl + 'order/' + id,{headers})
  }

  public add(review){
    const headers = {
      'Authorization': 'Bearer '+this.getToken()+''
    };
    return this.http.post(environment.apiUrl + 'review/add',review,{headers})
  }

  public del(id){
    const params = new HttpParams().set("id", id);
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+this.getToken()+''
    };
    return this.http.delete(environment.apiUrl + 'order/del',{ headers,params })
  }

  public update(order) {
    const headers = {
      'Authorization': 'Bearer ' + this.getToken() + ''
    };
    return this.http.post(environment.apiUrl + 'order/update', order, {headers})
  }
}
