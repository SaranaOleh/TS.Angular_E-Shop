import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CompareService} from "../../services/compare/compare.service";
import {DomSanitizer} from "@angular/platform-browser";
import {CategoryService} from "../../services/category/category.service";
import {BasketService} from "../../services/basket/basket.service";
import {NotifyService} from "../../services/notify/notify.service";

@Component({
  selector: 'app-comparing',
  templateUrl: './comparing.component.html',
  styleUrls: ['./comparing.component.css']
})
export class ComparingComponent implements OnInit, AfterViewInit ,OnDestroy {
  @ViewChildren('rows') rows;

  categoryArray = null;
  categoryAttrs = null;
  scrollBound = null;
  rowsMode = "show";

  constructor(private aR:ActivatedRoute, private compareService: CompareService, private sanitizer: DomSanitizer,
              private categoryService: CategoryService, private basketService: BasketService,
              private router: Router, private elRef: ElementRef, private notifyService: NotifyService){
    aR.params.subscribe(e => {
      this.categoryArray = this.compareService.getCompareCategory(this.aR.snapshot.params['category']);
      if(this.categoryArray.length > 0){
        this.updateCategory(this.categoryArray[0].Category_id);

        if (!this.scrollBound) {
          this.scrollBound = this.scrollHandler.bind(this);
        }
        window.addEventListener('scroll',this.scrollBound);
      }
      else{
        this.router.navigateByUrl("/");
      }
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.rows.changes.subscribe(e => {
      this.checkRows();
    });
  }

  checkRows(){
    let row = this.elRef.nativeElement.querySelectorAll('.rows');
    if(row.length > 0){
      row.forEach(elem => {
        let results = [];
        for(let i = 0; i < elem.children.length; i++){
          if(i !== 0){
            results.push(elem.children[i].textContent);
          }
        }
        let check = results.reduce(function (prev,curr) {
          if(prev === curr){
            return curr;
          }
          else{
            return false;
          }
        });
        if(check || check === ""){
          elem.className = 'rows same';
        }
        else{
          elem.className = 'rows diff';
        }
      })
    }
  }

  hideRows(){
    this.rowsMode = "hide";
    let row = this.elRef.nativeElement.querySelectorAll('.rows');
    if(row.length > 0){
      row.forEach(elem => {
        if(elem.classList.contains('same')){
          elem.classList.add('hidden');
        }
      })
    }
  }

  showRows(){
    this.rowsMode = "show";
    let row = this.elRef.nativeElement.querySelectorAll('.rows');
    if(row.length > 0){
      row.forEach(elem => {
        if(elem.classList.contains('hidden')){
          elem.classList.remove('hidden');
        }
      })
    }
  }

  scrollHandler(){
    let header = this.elRef.nativeElement.querySelector('.headerRow');
    if(header){
      let block = this.elRef.nativeElement.querySelector('.menu');
      if( header.getBoundingClientRect().bottom  < 110){
        block.style.display = "block";
      }
      if( header.getBoundingClientRect().bottom  > 110){
        block.style.display = "none";
      }
    }
  }

  updateCategory(id){
    this.categoryService.show(id).subscribe(e => {
      if(e['attributes']) this.categoryAttrs = e['attributes'];
    })
  }
  makeUrl(url){
    return this.sanitizer.bypassSecurityTrustStyle('url(' + url + ')');
  }

  buy(prod){
    this.basketService.addProduct(prod);
    this.basketService.bayed.next(true);
  }

  destroyProd(index){
    this.categoryArray.splice(index, 1);
    this.compareService.setProduct(this.categoryArray, this.aR.snapshot.params['category']);
    this.checkRows();
    if(this.categoryArray.length === 0) this.router.navigateByUrl('/');
  }

  destroyAllProd(){
    this.compareService.setProduct([], this.aR.snapshot.params['category']);
    this.router.navigateByUrl('/');
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll',this.scrollBound);
  }

  notify(){
    this.notifyService.notification.next(true);
  }
}
