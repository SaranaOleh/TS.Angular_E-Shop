import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OrderService} from "../../../services/order/order.service";

class Product{
  id;
  name;
  price;
  amount;

  constructor(id: string, name: string, price: string, amount: number){
    this.id = id;
    this.name = name;
    this.price = price;
    this.amount = amount;
  }
}

@Component({
  selector: 'app-orders-edit',
  templateUrl: './orders-edit.component.html',
  styleUrls: ['./orders-edit.component.css']
})
export class OrdersEditComponent implements OnInit {
  @Input('prodId') prodId;
  @Output('editing') editing = new EventEmitter<boolean>();

  order = null;
  user = null;
  request: boolean = true;
  basketArray = null;
  mode = null;
  errors = null;


  constructor(private orders: OrderService, private elref: ElementRef) {}

  ngOnInit() {
    this.orders.show(this.prodId).subscribe(e => {
      if(e['id']){
          e['status'] === "processing" ? this.mode = "processing" : this.mode = "delivery";
          this.order = e;
          let tmpBasket = [];
          e['products'].forEach(elem => {
            tmpBasket.push(new Product(elem.id,elem.name,elem.price,elem.pivot.amount));
          });
          this.basketArray = tmpBasket;
          this.user = e['user'];
      }
      else{
        this.errors = e;
      }
    })
  }

  clearBasket(){
    return this.basketArray.filter(elem => {
      return elem.amount > 0;
    })
  }

  prepareOrder(){
    let formData = new FormData();
    formData.append("oldOrder",this.order.id +"");
    formData.append("price",this.orderPrice()+"");
    formData.append("amount",this.orderAmount()+"");
    formData.append("user",this.user.id);
    formData.append("products",JSON.stringify(this.clearBasket()));

    return formData;
  }

  onSubmit(){
      this.errors = null;
      if(this.request){
        this.request = false;
        if(this.orderAmount() < 1){
          this.orders.del(this.order.id).subscribe(e => {
            if(e['status']){
              this.errors = null;
              this.onClose();
            }else{
              this.errors = e;
            }
          })
        }
        if(!this.checkOrder()){
          this.errors = {error: "Недостаточно товаров"};
          this.request = true;
        }
        else{
          this.orders.update(this.prepareOrder()).subscribe(e => {
            this.request = true;
            if(e['status']){
              this.onClose();
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
  getproduct(name){
    let prod;
    this.order.products.forEach(elem => {
      if(elem.name === name) prod = elem;
    });
    return prod;
  }

  onClose(){
    this.editing.emit(true);
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
    if( this.basketArray[index].amount < this.getproduct(this.basketArray[index].name).amount){
      this.basketArray[index].amount += 1;
    }
  }

  delProd(index){
    if(this.basketArray[index].amount >= 1) this.basketArray[index].amount -= 1;
  }
  destroyProd(index){
    this.basketArray.splice(index, 1);
  }

  checkOrder(){
    let status = true;
    this.basketArray.forEach(elem =>{
      this.order.products.forEach(item => {
        if(elem.id === item.id){
          if(elem.amount > item.amount) status = false;
        }
      })
    });
    return status;
  }
}
