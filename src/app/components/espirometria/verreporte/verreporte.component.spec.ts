import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerreporteComponent } from './verreporte.component';

describe('VerreporteComponent', () => {
  let component: VerreporteComponent;
  let fixture: ComponentFixture<VerreporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerreporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerreporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
