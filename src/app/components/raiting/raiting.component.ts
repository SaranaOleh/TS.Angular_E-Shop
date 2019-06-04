import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-raiting',
  templateUrl: './raiting.component.html',
  styleUrls: ['./raiting.component.css']
})
export class RaitingComponent implements OnInit {
  @Input('kind') kind;
  @Input('rait') rait;
  @Output('setRaiting') setRaiting = new EventEmitter<number>();

  active = 0;
  readySet = false;
  raiting = null;
  mode = "";
  constructor() { }

  ngOnInit() {
    this.mode = this.kind;
    this.raiting = Math.round(this.rait);
  }

  fill(elem){
    if(!this.readySet){
      elem.classList.add('fas');
      this.active = elem.dataset.raiting;
    }
  }

  clear(elem){
    if(!this.readySet){
      elem.classList.remove('fas');
      this.active = 0;
    }
  }

  toggleActive(elem) {
    if(this.active === elem.dataset.raiting){
      if(!this.readySet){
        this.readySet = true;
        this.setRaiting.emit(this.active);
      }
      else{
        this.readySet = false;
        this.setRaiting.emit(0);
      }
    }
    else{
      this.active = elem.dataset.raiting;
      this.readySet = true;
      this.setRaiting.emit(this.active);
    }
  }
}
