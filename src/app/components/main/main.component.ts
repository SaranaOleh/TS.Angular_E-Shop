import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {CategoryService} from "../../services/category/category.service";
import {filter} from "rxjs/internal/operators";
import {BasketService} from "../../services/basket/basket.service";
import {FlashService} from "../../services/flash/flash.service";
import {NotifyService} from "../../services/notify/notify.service";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy{
  categoriesArray = null;
  basketOpen = null;
  menu = false;
  scrollBound = null;
  openBasket = null;
  flashMessage = null;
  flashContainer = null;
  notify = false;
  notification = null;

  constructor(private router: Router, private elRef: ElementRef, private categories: CategoryService,
              private basketService: BasketService, private flashService: FlashService, private notifyService: NotifyService) {
    this.notification = this.notifyService.notification.subscribe(status => {
      this.notify = !!status;
    });
    this.flashMessage = flashService.flashMessage.subscribe(msg => {
      this.flashContainer = msg;
      setTimeout(()=>{this.flashContainer = null}, 1000);
    });
    this.openBasket = basketService.bayed.subscribe(e => {
      this.basketOpen = e;
    });
    categories.all("").subscribe(e => {
      this.categoriesArray = e['category']['data']
    });

    router.events
      .pipe(
        filter(e => e instanceof NavigationEnd)
      )
      .subscribe( (navEnd:NavigationEnd) => {
        if(navEnd.urlAfterRedirects !== "/" && navEnd.urlAfterRedirects.search(/comparing/) < 1 ){
          if (!this.scrollBound) {
            this.scrollBound = this.scrollHandler.bind(this);
          }
          window.addEventListener('scroll',this.scrollBound);
        }
        else{
          let header = this.elRef.nativeElement.querySelector('.header');
          let strong = this.elRef.nativeElement.querySelector('strong');
          let first = this.elRef.nativeElement.querySelector('.first');
          let logo = this.elRef.nativeElement.querySelector('.logo');
          let headerHidden = this.elRef.nativeElement.querySelector('.headerHidden');
          headerHidden.style.display = "none";
          strong.style.display = "";
          first.style.border = "";
          logo.style.display = "";
          header.style.position = "";
          header.style.width = "";
          header.style.maxWidth = "1";
          header.style.top = "";
          header.style.left = "";
          header.style.transform = "";
          header.style.zIndex = "";
          window.removeEventListener('scroll',this.scrollBound);
        }
      });
  }

  ngOnInit() {

  }
  scrollHandler(){
      let page = window.pageYOffset || document.documentElement.scrollTop;
      let header = this.elRef.nativeElement.querySelector('.header');
      let headerHidden = this.elRef.nativeElement.querySelector('.headerHidden');
      let block = this.elRef.nativeElement.querySelector('.block');
      let strong = this.elRef.nativeElement.querySelector('strong');
      let first = this.elRef.nativeElement.querySelector('.first');
      let logo = this.elRef.nativeElement.querySelector('.logo');
        if( header.getBoundingClientRect().bottom < 0){
          headerHidden.style.display = "block";
          headerHidden.style.height = header.clientHeight + "px";
          header.style.position = "fixed";
          header.style.backgroundColor = "#c7dcde";
          header.style.top = "0";
          header.style.left = "0";
          header.style.right = "0";
          header.style.zIndex = "1000";
          block.style.margin = "auto";
          block.style.maxWidth = "1024px";
          strong.style.display = "none";
          first.style.border = "1px solid #45acc8";
          logo.style.display = "block";
        }
        if(page < 90){
          headerHidden.style.display = "none";
          header.style.position = "";
          header.style.width = "";
          header.style.maxWidth = "1";
          header.style.top = "";
          header.style.left = "";
          header.style.transform = "";
          header.style.zIndex = "";
          strong.style.display = "";
          first.style.border = "";
          logo.style.display = "";
        }
  }

  closeNotify() {
    this.notifyService.notification.next(false);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll',this.scrollBound);
    this.openBasket.unsubscribe();
    this.flashMessage.unsubscribe();
    this.notification.unsubscribe();
  }
}
