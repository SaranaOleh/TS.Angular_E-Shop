import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparingIconComponent } from './comparing-icon.component';

describe('ComparingIconComponent', () => {
  let component: ComparingIconComponent;
  let fixture: ComponentFixture<ComparingIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparingIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparingIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
