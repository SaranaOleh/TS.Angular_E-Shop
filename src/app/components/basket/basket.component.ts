import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {BasketService} from "../../services/basket/basket.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit, OnDestroy {
  @Output('close') close = new EventEmitter<boolean>();

  basketArray = null;

  constructor(private basketService: BasketService, private sanitizer: DomSanitizer) {
    this.basketArray = basketService.getProducts();
  }

  ngOnInit() {
  }

  closeWindow() {
    this.close.emit(true);
    this.basketService.bayed.next(false);
  }

  ngOnDestroy(): void {
    this.basketService.setProduct(this.basketArray);
  }

  makeUrl(url){
    return this.sanitizer.bypassSecurityTrustStyle('url(' + url + ')');
  }

  orderAmount(){
    let sum = 0;
    if(this.basketArray && this.basketArray.length > 0){
      this.basketArray.forEach(elem => {
        sum += elem.amount;
      })
    }
    return sum;
  }

  orderPrice(){
    let sum = 0;
    if(this.basketArray && this.basketArray.length > 0){
      this.basketArray.forEach(elem => {
        if(elem.amount >= 1){
          sum += (elem.price*elem.amount)
        }
      })
    }
    return sum;
  }

  addProd(index){
    this.basketArray[index].amount += 1;
  }

  delProd(index){
    if(this.basketArray[index].amount >= 1) this.basketArray[index].amount -= 1;
  }
  destroyProd(index){
    this.basketArray.splice(index, 1)
  }

}
