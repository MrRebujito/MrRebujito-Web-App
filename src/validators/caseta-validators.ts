import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CasetaService } from '../service/caseta-service';

export class CasetaValidators {
  
  /**
   * Validador asíncrono para verificar que el número de caseta sea único
   */
  static numeroUnico(
    casetaService: CasetaService, 
    idCasetaActual?: number
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return casetaService.getAllCasetas().pipe(
        map((casetas: any[]) => {
          const numeroExiste = casetas.some(caseta => 
            caseta.numero === Number(control.value) && 
            caseta.id !== idCasetaActual
          );
          
          return numeroExiste ? { numeroNoUnico: true } : null;
        }),
        catchError(() => of(null))
      );
    };
  }
}