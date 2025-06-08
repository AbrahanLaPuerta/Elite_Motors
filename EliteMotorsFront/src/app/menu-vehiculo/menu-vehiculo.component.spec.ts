import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuVehiculoComponent } from './menu-vehiculo.component';

describe('MenuVehiculoComponent', () => {
  let component: MenuVehiculoComponent;
  let fixture: ComponentFixture<MenuVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuVehiculoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
