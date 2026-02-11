import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    // Se obtiene el token almacenado en sessionStorage (guardado al iniciar sesión)
    const token = sessionStorage.getItem("token");
    if (token) {
        const reqWithToken = req.clone({
            setHeaders: {
                // El backend espera el formato: "Authorization: Bearer <token>"
                Authorization: `Bearer ${token}`,
            }
        });
        // Se continúa con la petición ya modificada
        return next(reqWithToken);
    }
    //Si no hay token, se deja la petición igual y se continúa
    return next(req);
};