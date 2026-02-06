import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSolicitudLicencia } from './table-solicitud-licencia';

describe('TableSolicitudLicencia', () => {
  let component: TableSolicitudLicencia;
  let fixture: ComponentFixture<TableSolicitudLicencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableSolicitudLicencia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableSolicitudLicencia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
