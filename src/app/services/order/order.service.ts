import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public getToken(){
    const token = localStorage.getItem('token');
    return token ? token : null;
  }

  constructor(private http:HttpClient, private router:Router) { }

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

  public add(order){
    const headers = {
      'Authorization': 'Bearer '+this.getToken()+''
    };
    return this.http.post(environment.apiUrl + 'order/add',order,{headers})
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
