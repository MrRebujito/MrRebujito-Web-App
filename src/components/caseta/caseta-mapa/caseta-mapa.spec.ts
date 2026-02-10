import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasetaMapa } from './caseta-mapa';

describe('CasetaMapa', () => {
  let component: CasetaMapa;
  let fixture: ComponentFixture<CasetaMapa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasetaMapa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasetaMapa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
