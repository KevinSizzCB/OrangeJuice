import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { ServicioLoguearUsuario } from 'src/dominio/usuario/servicio/servicio-loguear-usuario';

export function servicioLoguearUsuarioProveedor(repositorioUsuario: RepositorioUsuario) {
  return new ServicioLoguearUsuario(repositorioUsuario);
}
