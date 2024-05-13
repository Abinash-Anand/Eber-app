import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRideComponent } from './confirm-ride.component';

describe('ConfirmRideComponent', () => {
  let component: ConfirmRideComponent;
  let fixture: ComponentFixture<ConfirmRideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmRideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
