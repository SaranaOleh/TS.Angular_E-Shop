import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.css']
})
export class SuccessPageComponent implements OnInit {
  orderId = null;

  constructor(private aR: ActivatedRoute) {
    this.orderId = aR.snapshot.params['id'];
  }

  ngOnInit() {
  }

}
