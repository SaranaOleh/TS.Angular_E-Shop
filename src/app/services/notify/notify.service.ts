import { Injectable } from '@angular/core';
import {Subject} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor() { }

  notification = new Subject();
}
