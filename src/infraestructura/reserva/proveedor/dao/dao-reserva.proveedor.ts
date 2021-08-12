import { DaoReserva } from 'src/dominio/reserva/puerto/dao/dao-reserva';
import { DaoReservaMysql } from 'src/infraestructura/reserva/adaptador/dao/dao-reserva-mysql';

export const daoReservaProvider = {
  provide: DaoReserva,
  useClass: DaoReservaMysql,
};
