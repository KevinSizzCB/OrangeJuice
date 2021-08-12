import { RepositorioReserva } from 'src/dominio/reserva/puerto/repositorio/repositorio-reserva';
import { ServicioRalizarReserva } from 'src/dominio/reserva/servicio/servicio-crear-reserva';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';

export function servicioRegistrarreservaProveedor(repositorioreserva: RepositorioReserva, repositorioUsuario: RepositorioUsuario) {
  return new ServicioRalizarReserva(repositorioUsuario,repositorioreserva);
}
