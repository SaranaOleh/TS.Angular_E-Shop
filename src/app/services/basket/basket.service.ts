import { Injectable } from '@angular/core';
import {Observable, Observer, Subject} from "rxjs/index";

class Product{
  id;
  name;
  price;
  image;
  amount;

  constructor(id: string, name: string, price: string, image: string, amount: number){
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.amount = amount;
  }
}

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  constructor() {
    window.localStorage.getItem("basket") ?
      window.localStorage.getItem("basket") :
      window.localStorage.setItem("basket",JSON.stringify([]));
  }
  basket = new Subject();
  basketObserver = null;

  storageStream = Observable.create((obserrver:Observer<any>)=>{
    this.basketObserver = obserrver;
  });

  bayed = new Subject();

  getProducts(){
    return JSON.parse(window.localStorage.getItem("basket"));
  }

  setProduct(products){
    let newBasket = [];
    products.forEach(elem => {
      if(elem.amount >= 1){
        newBasket.push(elem)
      }
    });
    window.localStorage.setItem("basket",JSON.stringify(newBasket));
    this.basketObserver.next(JSON.parse(window.localStorage.getItem("basket")))
  }

  addProduct(prod){
    let tmpProducts = this.getProducts();
    if(tmpProducts.length > 0){
      let exist = tmpProducts.some(elem => {
        return elem.id === prod.id;
      });
      if(exist){
        tmpProducts.forEach(elem => {
            if(elem.id === prod.id){
              elem.amount += 1;
            }
        })
      }else{
        tmpProducts.push(new Product(prod.id,prod.name,prod.price,prod.image,1));
      }
    }
    else{
      tmpProducts.push(new Product(prod.id,prod.name,prod.price,prod.image,1));
    }
    window.localStorage.setItem("basket",JSON.stringify(tmpProducts));
    this.basketObserver.next(JSON.parse(window.localStorage.getItem("basket")))
  }
}
