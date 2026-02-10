import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasetaSocios } from './caseta-socios';

describe('CasetaSocios', () => {
  let component: CasetaSocios;
  let fixture: ComponentFixture<CasetaSocios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasetaSocios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasetaSocios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
