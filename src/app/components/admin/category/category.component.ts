import { Component, OnInit } from '@angular/core';
import {CategoryService} from "../../../services/category/category.service";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  addMode = false;
  editMode = 0;
  errors = null;
  categoriesArray = null;

  request: boolean = true;
  params: Params = {
    order: 'id',
    direction: 'ASC',
    page: 1
  };
  colums = [
    {name: "id",value: "номер"},
    {name: "name",value: "наименование"},
    {name: "parent_category",value: "родительская"}
    ];
  paginationData = null;

  constructor(private categories: CategoryService,  private aR:ActivatedRoute,) {

    aR.params.subscribe(e => {
      if(e['page']){
        this.params.order = e['order'];
        this.params.direction = e['direction'];
        this.params.page = e['page'];
        this.updateCategories();
      }
      else{
        this.params.order = 'id';
        this.params.direction = 'ASC';
        this.params.page = 1;
        if(aR.snapshot.params.page) this.params = aR.snapshot.params;
        this.updateCategories();
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

  updateCategories(){
    if(this.request){
      this.request = false;
      this.categories.all(this.prepareParams()).subscribe(e => {
        this.request = true;
        if(e['category']){
          this.categoriesArray = e['category']['data'];
          this.paginationData = {
            current: e['category'].current_page,
            last: e['category'].last_page,
            previous: e['category'].prev_page_url ? e['category'].prev_page_url.split('=')[1] : e['category'].prev_page_url,
            next: e['category'].next_page_url ? e['category'].next_page_url.split('=')[1] : e['category'].next_page_url,
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
    this.categories.del(id).subscribe(e => {
      if(e['status']){
        this.errors = null;
        this.updateCategories();
      }else{
        this.errors = e;
      }
    })
  }

}
