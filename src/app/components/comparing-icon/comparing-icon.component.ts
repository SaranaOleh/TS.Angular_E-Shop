import {Component, OnDestroy, OnInit} from '@angular/core';
import {CompareService} from "../../services/compare/compare.service";

@Component({
  selector: 'app-comparing-icon',
  templateUrl: './comparing-icon.component.html',
  styleUrls: ['./comparing-icon.component.css']
})
export class ComparingIconComponent implements OnInit, OnDestroy {
  compare = null;
  compareArray = [];

  constructor(private compareService: CompareService) {
    this.compareArray = compareService.getProducts();
    this.compare = compareService.storageStream.subscribe(e => {
      this.compareArray = e;
    })
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.compare.unsubscribe();
  }

  countProducts(){
    let sum = 0;
    this.compareArray.forEach(elem => {
      sum += elem.length;
    });
    return sum;
  }

}
