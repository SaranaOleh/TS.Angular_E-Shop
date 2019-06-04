import {Component, OnDestroy, OnInit} from '@angular/core';
import {BasketService} from "../../services/basket/basket.service";



@Component({
  selector: 'app-basket-icon',
  templateUrl: './basket-icon.component.html',
  styleUrls: ['./basket-icon.component.css']
})
export class BasketIconComponent implements OnInit, OnDestroy {
  basket = null;
  basketArray = [];

  constructor(private basketService: BasketService) {
    this.basketArray = basketService.getProducts();
    this.basket = basketService.storageStream.subscribe(e => {
      this.basketArray = e;
    })
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.basket.unsubscribe();
  }

  countProducts(){
    let sum = 0;
    this.basketArray.forEach(elem => {
      sum += elem.amount;
    });
    return sum;
  }
}
