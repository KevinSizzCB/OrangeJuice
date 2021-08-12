import { RepositorioReserva } from 'src/dominio/reserva/puerto/repositorio/repositorio-reserva';
import { RepositorioReservaMysql } from 'src/infraestructura/reserva/adaptador/repositorio/repositorio-reserva-mysql';

export const repositorioreservaProvider = {
  provide: RepositorioReserva,
  useClass: RepositorioReservaMysql,
};
