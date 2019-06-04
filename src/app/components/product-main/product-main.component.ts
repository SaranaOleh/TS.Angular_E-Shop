import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../services/product/product.service";
import {DomSanitizer} from "@angular/platform-browser";
import {CategoryService} from "../../services/category/category.service";
import {BasketService} from "../../services/basket/basket.service";
import {AuthService} from "../../services/auth/auth.service";
import {ReviewService} from "../../services/review/review.service";
import {CompareService} from "../../services/compare/compare.service";
import {FlashService} from "../../services/flash/flash.service";
import {NotifyService} from "../../services/notify/notify.service";

@Component({
  selector: 'app-product-main',
  templateUrl: './product-main.component.html',
  styleUrls: ['./product-main.component.css']
})
export class ProductMainComponent implements OnInit {
  product = null;
  slides = null;
  attributes = null;
  leavingComment = false;
  authorized = false;
  comment = "";
  errors = null;
  setRaiting = 0;
  zoom = false;

  constructor(private aR:ActivatedRoute, private products:ProductService,  private sanitizer: DomSanitizer
  , private category: CategoryService, private basketService: BasketService, private auth: AuthService,
              private reviewService: ReviewService, private compareService: CompareService,
              private flashService: FlashService, private notifyService: NotifyService) {
    aR.params.subscribe(e => {
      this.updateProduct();
    })
  }

  ngOnInit() {

  }

  updateProduct(){
    this.products.show(this.aR.snapshot.params["id"]).subscribe(e => {
      if(e['id']){
        this.category.show(e['Category_id']).subscribe(e => {
          this.attributes = e['attributes'];
        });
        this.product = e;
        let slides = [];
        let data: Array<any> = ["icons"];
        e['images'].forEach(elem => {
          slides.push(this.makeUrl(elem.url))
        });
        data.push(slides);
        this.slides = data;
      }
    })
  }

  makeUrl(url){
    return this.sanitizer.bypassSecurityTrustStyle('url(' + url + ')');
  }

  buy(prod){
    this.basketService.addProduct(prod);
    this.basketService.bayed.next(true);
  }

  leaveComment(){
    this.auth.isAuth().subscribe(e => {
      if(!e){
        this.leavingComment = true;
        this.authorized = false;
      }
      else{
        this.leavingComment = false;
        this.authorized = true;
      }
    })
  }

  prepareReview(user){
    let formData = new FormData();
    formData.append("text",this.comment);
    formData.append("Users_id",user.id);
    formData.append("name",user.name);
    formData.append("Products_id",this.product.id);
    formData.append("value",0 + "");
    if(this.setRaiting){
      formData.append("raiting",this.setRaiting + "");
      formData.append("value",this.setRaiting + "");
    }

    return formData;
  }

  compare(prod){
    this.compareService.addProduct(prod);
    this.flashService.flashMessage.next("товар добавлен в сравнение");
  }

  notify(){
    this.notifyService.notification.next(true);
  }

  onSubmit(){
    if(this.comment !== ""){
      this.auth.getUser().subscribe(e =>{
        if(e['user']){
          this.reviewService.add(this.prepareReview(e['user'])).subscribe(e => {
            if(e['status']){
              this.updateProduct();
              this.authorized = false;
              this.comment = "";
              this.errors = null;
            }
            else{
              this.errors = e;
              this.authorized = false;
              this.comment = "";
            }
          })
        }
      })
    }
  }
}
