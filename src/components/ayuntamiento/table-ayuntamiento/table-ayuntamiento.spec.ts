import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAyuntamiento } from './table-ayuntamiento';

describe('TableAyuntamiento', () => {
  let component: TableAyuntamiento;
  let fixture: ComponentFixture<TableAyuntamiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableAyuntamiento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableAyuntamiento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
