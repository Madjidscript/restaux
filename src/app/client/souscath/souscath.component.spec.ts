import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SouscathComponent } from './souscath.component';

describe('SouscathComponent', () => {
  let component: SouscathComponent;
  let fixture: ComponentFixture<SouscathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SouscathComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SouscathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
