import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CathComponent } from './cath.component';

describe('CathComponent', () => {
  let component: CathComponent;
  let fixture: ComponentFixture<CathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CathComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
