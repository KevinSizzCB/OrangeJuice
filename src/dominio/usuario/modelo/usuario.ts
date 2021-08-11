import { ErrorLongitudInvalida } from 'src/dominio/errores/error-longitud-invalida';

const NUMERO_MINIMO_CARACTERES_CLAVE = 4;
export class Usuario {
  readonly #nombre: string;
  readonly #clave: string;
  readonly #fecha_creacion: Date;

  constructor(nombre: string, clave: string, fechaCreacion: string) {
    this.validarTamanoClave(clave);
    this.#nombre = nombre;
    this.#clave = clave;
    this.#fecha_creacion = new Date(fechaCreacion);
  }

  private validarTamanoClave(clave: string) {
    if (clave.length < NUMERO_MINIMO_CARACTERES_CLAVE) {
      throw new ErrorLongitudInvalida(
        `El tamaño mínimo de la clave debe ser ${NUMERO_MINIMO_CARACTERES_CLAVE}`,
      );
    }
  }

  get nombre(): string {
    return this.#nombre;
  }

  get clave(): string {
    return this.#clave;
  }

  get fecha_creacion(): Date {
    return this.#fecha_creacion;
  }
}
