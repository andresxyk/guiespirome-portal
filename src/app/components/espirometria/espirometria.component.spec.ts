import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspirometriaComponent } from './espirometria.component';

describe('EspirometriaComponent', () => {
  let component: EspirometriaComponent;
  let fixture: ComponentFixture<EspirometriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspirometriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EspirometriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
