// import { Usuario } from 'src/dominio/usuario/modelo/usuario';
// import { ErrorLongitudInvalida } from 'src/dominio/errores/error-longitud-invalida';
import { Reserva } from 'src/dominio/reserva/modelo/reserva';
import { ErrorCantidadJugos } from 'src/dominio/errores/error-cantidad-jugos';

describe('Reserva', () => {

    
    const _Reserva = Reserva //as any;
  
    it('Cantidad de jugos de naranja igual o menor a cero', () => {
      return expect(async () => new _Reserva(1, 0, new Date().toISOString()))
        .rejects
        .toStrictEqual(new ErrorCantidadJugos("La cantidad de jugos debes ser mayor a 0"));
    });
  
    it('Cantidad de jugos bien', () => {
      const reserva = new _Reserva(1, 1, new Date().toISOString());

      expect(reserva.precio_total).toEqual(2000)
    });

  });