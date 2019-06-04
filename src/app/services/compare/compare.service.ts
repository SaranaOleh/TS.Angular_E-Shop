import { Injectable } from '@angular/core';
import {Observable, Observer, Subject} from "rxjs/index";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CompareService {

  constructor(private http:HttpClient) {
    window.localStorage.getItem("compare-basket") ?
      window.localStorage.getItem("compare-basket") :
      window.localStorage.setItem("compare-basket",JSON.stringify([]));
  }
  compareObserver = null;
  // compared = new Subject();

  storageStream = Observable.create((observer:Observer<any>)=>{
    this.compareObserver = observer;
  });



  getProducts(){
    return JSON.parse(window.localStorage.getItem("compare-basket"));
  }

  setProduct(products,category){
    let tmpProducts = this.getProducts();
    tmpProducts.forEach((cat,index) =>{
      if(cat[0].category.name === category){
        if(products.length > 0){
          tmpProducts.splice(index, 1, products)
        }
        else{
          tmpProducts.splice(index, 1)
        }
      }
    });
    window.localStorage.setItem("compare-basket",JSON.stringify(tmpProducts));
    this.compareObserver.next(JSON.parse(window.localStorage.getItem("compare-basket")));
  }

  getCompareCategory(category){
    let tmpCategory = [];
    this.getProducts().forEach(cat =>{
      if(cat[0].category.name === category) tmpCategory = cat;
    });
    return tmpCategory;
  }

  addProduct(prod){
    let tmpProducts = this.getProducts();
    if(tmpProducts.length > 0){
      let exist = tmpProducts.some(elem => {
        return elem[0].Category_id === prod.Category_id;
      });
      if(exist){
        tmpProducts.forEach(elem => {
          if(elem[0].Category_id === prod.Category_id){
            let existProd = elem.some(newProd => {
              return prod.id === newProd.id;
            });
            if(!existProd){
             elem.push(prod)
            }
          }
        })
      }else{
        tmpProducts.push([prod]);
      }
    }
    else{
      tmpProducts.push([prod]);
    }
    window.localStorage.setItem("compare-basket",JSON.stringify(tmpProducts));
    this.compareObserver.next(JSON.parse(window.localStorage.getItem("compare-basket")))
  }
}
