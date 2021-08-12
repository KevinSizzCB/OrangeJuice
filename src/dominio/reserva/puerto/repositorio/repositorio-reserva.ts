import { Injectable } from '@nestjs/common';
import { ReservaEntidad } from 'src/infraestructura/reserva/entidad/reserva.entidad';
import { Reserva } from '../../modelo/reserva';

@Injectable()
export abstract class RepositorioReserva {
  abstract guardar(reserva: Reserva): Promise<ReservaEntidad>;
}
