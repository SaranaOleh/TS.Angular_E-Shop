import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChildren} from '@angular/core';
import {ProductService} from "../../../services/product/product.service";
import {DomSanitizer} from "@angular/platform-browser";
import {BasketService} from "../../../services/basket/basket.service";
import {CompareService} from "../../../services/compare/compare.service";
import {environment} from "../../../../environments/environment";
import {FlashService} from "../../../services/flash/flash.service";
import {NotifyService} from "../../../services/notify/notify.service";



@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('moverNew') moverNew;

  private mover: HTMLElement;

  scrollBound = null;
  dataArray = [
    "dotted",
    [
      "url('../../../"+environment.distUrl+"assets/mainSlides/1.jpg')",
      "url('../../../"+environment.distUrl+"assets/mainSlides/2.jpg')",
      "url('../../../"+environment.distUrl+"assets/mainSlides/3.jpg')",
      "url('../../../"+environment.distUrl+"assets/mainSlides/4.jpg')",
      "url('../../../"+environment.distUrl+"assets/mainSlides/5.jpg')"
    ]

  ];

  paralax = "url('../../../"+environment.distUrl+"assets/paralax.png')";

  newest = null;

  constructor(private products: ProductService, private elRef: ElementRef, private sanitizer: DomSanitizer,
              private basketService: BasketService, private compareService: CompareService,
              private flashService: FlashService, private notifyService: NotifyService) {
    products.all("?order=created_at&direction=DESC").subscribe(e => {
      if(e['prod']['data']) this.newest = e['prod']['data'];
    });
    if (!this.scrollBound) {
      this.scrollBound = this.scrollHandler.bind(this);
    }
    window.addEventListener('scroll',this.scrollBound);
  }

  ngOnInit() {
  }


  ngAfterViewInit(): void {

    this.moverNew.changes.subscribe(e => {
      this.mover = this.elRef.nativeElement.querySelector('.mover-new');
    });
  }

  scrollHandler(){
    let page = window.pageYOffset || document.documentElement.scrollTop;
    let pax = this.elRef.nativeElement.querySelector('.paralax');
    if(page <= 343){
      pax.style.backgroundPositionY = -page + "px";
    }
  }

  private timer = null;

  slideLeft() {
    if(this.timer !== null) return;
    let pos = -25;
    this.mover.insertBefore(this.mover.lastElementChild,this.mover.firstElementChild);
    this.mover.style.marginLeft = pos + "%";
    this.timer = setInterval(()=>{
      pos += 1;
      this.mover.style.marginLeft = pos + "%";
      if(pos <= 0) return;
      clearInterval(this.timer);
      this.mover.style.marginLeft = "";
      this.timer = null;
    },10);
  }

  slideRight() {
    if(this.timer !== null) return;
    let pos = 0;
    this.timer = setInterval(()=>{
      pos -= 1;
      this.mover.style.marginLeft = pos + "%";
      if(pos >= -25) return;
      clearInterval(this.timer);
      this.mover.appendChild(this.mover.firstElementChild);
      this.mover.style.marginLeft = "";
      this.timer = null;
    },10);
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

  ngOnDestroy(): void {
    window.removeEventListener('scroll',this.scrollBound);
  }
}
