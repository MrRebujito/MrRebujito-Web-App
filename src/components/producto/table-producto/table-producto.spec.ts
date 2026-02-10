import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableProducto } from './table-producto';

describe('TableProducto', () => {
  let component: TableProducto;
  let fixture: ComponentFixture<TableProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableProducto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableProducto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});