import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {OrderService} from "../../../services/order/order.service";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  addMode = false;
  editMode = 0;
  errors = null;
  ordersArray = null;

  request: boolean = true;
  params: Params = {
    order: 'id',
    direction: 'ASC',
    page: 1
  };
  colums = [
    {name: "id",value: "номер"},
    {name: "status",value: "статус"},
    {name: "price",value: "сумма"},
    {name: "amount",value: "объем"},
    {name: "created_at",value: "дата"},
  ];
  paginationData = null;

  constructor(private orders: OrderService,  private aR:ActivatedRoute,) {

    aR.params.subscribe(e => {
      if(e['page']){
        this.params.order = e['order'];
        this.params.direction = e['direction'];
        this.params.page = e['page'];
        this.updateOrders();
      }
      else{
        this.params.order = 'id';
        this.params.direction = 'ASC';
        this.params.page = 1;
        if(aR.snapshot.params.page) this.params = aR.snapshot.params;
        this.updateOrders();
      }
    });
  }

  ngOnInit() {
  }
  prepareParams(){
    let queryParams ="?";
    for(let key in this.params){
      queryParams += key + "=" + this.params[key] + "&"
    }
    return queryParams;
  }

  updateOrders(){
    if(this.request){
      this.request = false;
      this.orders.all(this.prepareParams()).subscribe(e => {
        this.request = true;
        if(e['orders']){
          this.ordersArray = e['orders']['data'];
          this.paginationData = {
            current: e['orders'].current_page,
            last: e['orders'].last_page,
            previous: e['orders'].prev_page_url ? e['orders'].prev_page_url.split('=')[1] : e['orders'].prev_page_url,
            next: e['orders'].next_page_url ? e['orders'].next_page_url.split('=')[1] : e['orders'].next_page_url,
            order: this.params.order,
            direction: this.params.direction
          }
        }
        if(e['statusText'] === 'To many requests') {
          this.errors = e;
        }
        else{
          this.errors = e;
        }
      },error => this.errors = {'error':error.error.message})
    }
  }

  onDelete(id){
    this.orders.del(id).subscribe(e => {
      if(e['status']){
        this.errors = null;
        this.updateOrders();
      }else{
        this.errors = e;
      }
    })
  }

}
