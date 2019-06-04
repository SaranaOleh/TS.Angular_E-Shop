import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {BasketService} from "../../services/basket/basket.service";
import {DomSanitizer} from "@angular/platform-browser";
import {OrderService} from "../../services/order/order.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.css']
})
export class OrderingComponent implements OnInit, OnDestroy {
  scrollBound = null;
  authOpen = false;
  authorized = false;
  basketArray = null;
  request: boolean = true;
  errors = null;
  authUser = null;
  requestUser = false;
  comment = "";
  basketInit = null;

  constructor(private auth: AuthService, private basketService: BasketService, private sanitizer: DomSanitizer,
              private elRef: ElementRef, private order: OrderService, private router: Router) {
    if (!this.scrollBound) {
      this.scrollBound = this.scrollHandler.bind(this);
    }
    window.addEventListener('scroll',this.scrollBound);
    auth.isAuth().subscribe(e=>{
      this.requestUser = true;
      if(e){
        this.updateUser();
      }
      this.authorized = e;
    });
    this.basketInit = basketService.storageStream.subscribe(e => {});
    this.basketArray = basketService.getProducts();
  }

  ngOnInit() {
  }

  scrollHandler(){
    let page = window.pageYOffset || document.documentElement.scrollTop;
    let upButton = this.elRef.nativeElement.querySelector('.up');
    if(page > 170){
      upButton.style.display = "block";
    }
    else{
      upButton.style.display = "none";
    }
  }

  updateUser(){
    this.auth.getUser().subscribe(e => {
      if(e['user']['id']){
        this.errors = null;
        this.authUser = e['user'];
      }
    })
  }

  openAuth(){
    this.authOpen = true;
  }

  onLogout() {
    this.auth.logout().subscribe(e=>{
      if(e){
        this.authUser = null;
        this.authorized = false;
      }
    })
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll',this.scrollBound);
    this.basketService.setProduct(this.basketArray);
    this.basketInit.unsubscribe();
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
    this.basketService.setProduct(this.basketArray);
  }

  delProd(index){
    if(this.basketArray[index].amount >= 1) this.basketArray[index].amount -= 1;
    this.basketService.setProduct(this.basketArray);
  }
  destroyProd(index){
    this.basketArray.splice(index, 1);
    this.basketService.setProduct(this.basketArray);
  }

  prepareOrder(){
    let formData = new FormData();
    formData.append("price",this.orderPrice()+"");
    formData.append("amount",this.orderAmount()+"");
    if(this.comment !== "") formData.append("comment",this.comment);
    formData.append("user",this.authUser.id);
    formData.append("products",JSON.stringify(this.basketArray));

    return formData;
  }

  onSubmit() {
    if(this.authUser){
      this.errors = null;
      if(this.request){
        if(this.orderAmount() < 1){
          this.errors = {error: "В заказе нет товаров"}
        }
        else{
          this.request = false;
          this.order.add(this.prepareOrder()).subscribe(e => {
            this.request = true;
            if(e['status']){
              this.basketArray = [];
              this.router.navigate(['/success',e['order']]);
            }
            if(e['statusText'] === 'To many requests'){
              this.errors = e;
            }
            else{
              this.errors = e;
            }
          },error => this.errors = {'error':error.error.message})
        }
      }
    }
    else{
      this.errors = {error: "Необходимо загерестрироватся"}
    }
  }
}
