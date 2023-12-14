import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerarchivoComponent } from './verarchivo.component';

describe('VerarchivoComponent', () => {
  let component: VerarchivoComponent;
  let fixture: ComponentFixture<VerarchivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerarchivoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerarchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
