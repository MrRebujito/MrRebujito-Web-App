import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAyuntamiento } from './form-ayuntamiento';

describe('FormAyuntamiento', () => {
  let component: FormAyuntamiento;
  let fixture: ComponentFixture<FormAyuntamiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAyuntamiento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAyuntamiento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
