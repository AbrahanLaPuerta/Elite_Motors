import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculosPageComponent } from './vehiculos-page.component';

describe('VehiculosPageComponent', () => {
  let component: VehiculosPageComponent;
  let fixture: ComponentFixture<VehiculosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculosPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiculosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
