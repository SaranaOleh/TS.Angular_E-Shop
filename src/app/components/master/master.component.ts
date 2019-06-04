import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit, OnDestroy {
  scrollBound = null;

  constructor(private elRef: ElementRef) {
    if (!this.scrollBound) {
      this.scrollBound = this.scrollHandler.bind(this);
    }
    window.addEventListener('scroll',this.scrollBound);
  }

  ngOnInit() {
  }

  scrollHandler(){
    let page = window.pageYOffset || document.documentElement.scrollTop;
    let upButton = this.elRef.nativeElement.querySelector('.up');
    if(page > 170){
      upButton.style.display = "block";
    }
    else{
      upButton.style.display = "none";
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll',this.scrollBound);
  }

}
