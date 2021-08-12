import { ErrorDeNegocio } from './error-de-negocio';

export class ErrorCantidadJugos extends ErrorDeNegocio {
  constructor(mensaje: string) {
    super(mensaje, ErrorCantidadJugos.name);
  }
}