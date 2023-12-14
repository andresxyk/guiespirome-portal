import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorArchivosComponent } from './visor-archivos.component';

describe('VisorArchivosComponent', () => {
  let component: VisorArchivosComponent;
  let fixture: ComponentFixture<VisorArchivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisorArchivosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisorArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
