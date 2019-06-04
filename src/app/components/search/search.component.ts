import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, timer} from "rxjs/index";
import {debounce} from "rxjs/internal/operators";
import {ProductService} from "../../services/product/product.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Router} from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  clickBound = null;
  request = true;
  searchResults = null;
  searchValue = "";

  constructor(private productService: ProductService, private sanitizer: DomSanitizer,
              private router: Router,) {
    router.events.subscribe(e => {
      if(router.navigated){
        this.searchValue = "";
        this.searchResults = null;
      }

    })
  }

  ngOnInit() {}

  search = new Subject();

  onSearch(value){
    this.search.next(value)
  }

  consoleSearch = this.search.pipe(debounce( ()=> timer(1000) )).subscribe(e => {
    if(e !== ""){
      if(this.request){
        this.request = false;
        this.productService.search(e,"").subscribe(e => {
          this.request = true;
          if(e['prod']) this.searchResults = e['prod'];
        })
      }
    }
  });

  makeUrl(url){
    return this.sanitizer.bypassSecurityTrustStyle('url(' + url + ')');
  }
  onSubmit(){
    if(this.searchValue !== ""){
      this.router.navigate(['/search',this.searchValue])
    }
  }

  onFocus(){
    if (!this.clickBound) {
      this.clickBound = this.clickHandler.bind(this);
    }
    window.addEventListener('click',this.clickBound);
  }

  clickHandler(e){
    if(!e.target.classList.contains('blur')){
      this.searchResults = null;
      window.removeEventListener('click',this.clickBound);
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('click',this.clickBound);
    this.consoleSearch.unsubscribe();
  }

}
