import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAyuntamiento } from './detail-ayuntamiento';

describe('DetailAyuntamiento', () => {
  let component: DetailAyuntamiento;
  let fixture: ComponentFixture<DetailAyuntamiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailAyuntamiento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailAyuntamiento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
