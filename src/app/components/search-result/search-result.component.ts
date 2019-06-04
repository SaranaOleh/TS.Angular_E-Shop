import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../services/product/product.service";
import {DomSanitizer} from "@angular/platform-browser";
import {BasketService} from "../../services/basket/basket.service";
import {CompareService} from "../../services/compare/compare.service";
import {FlashService} from "../../services/flash/flash.service";
import {NotifyService} from "../../services/notify/notify.service";

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  searchResults = null;
  searchValue = null;
  status = false;
  additionalBlocks = null;

  constructor(private aR:ActivatedRoute, private productService: ProductService,private sanitizer: DomSanitizer,
              private basketService: BasketService, private compareService: CompareService,
              private flashService: FlashService, private notifyService: NotifyService) {
    aR.params.subscribe(e => {
      this.searchValue = this.aR.snapshot.params["value"];
      this.onSearch();
    })
  }

  onSearch(){
    this.productService.search(this.searchValue,"?pag=16").subscribe(e => {
      if(e['prod'] && e['prod']['data'].length > 0){
        this.status = true;
        this.searchResults = e['prod']['data'];
        if(e['prod']['data'].length % 4 > 0){
          let addedBlocks = 0;
          let rest = e['prod']['data'].length % 4;
          if(rest === 1) addedBlocks = 3;
          if(rest === 2) addedBlocks = 2;
          if(rest === 3) addedBlocks = 1;
          this.additionalBlocks = new Array(addedBlocks);
        }
      }
      else{
        this.status = false;
      }
    })
  }

  ngOnInit() {
  }

  makeUrl(url){
    return this.sanitizer.bypassSecurityTrustStyle('url(' + url + ')');
  }

  buy(prod){
    this.basketService.addProduct(prod);
    this.basketService.bayed.next(true);
  }
  compare(prod){
    this.compareService.addProduct(prod);
    this.flashService.flashMessage.next("товар добавлен в сравнение");
  }

  notify(){
    this.notifyService.notification.next(true);
  }

}
