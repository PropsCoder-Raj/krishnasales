import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeOrderHistoryComponent } from './employee-order-history.component';

describe('EmployeeOrderHistoryComponent', () => {
  let component: EmployeeOrderHistoryComponent;
  let fixture: ComponentFixture<EmployeeOrderHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeOrderHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeOrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
