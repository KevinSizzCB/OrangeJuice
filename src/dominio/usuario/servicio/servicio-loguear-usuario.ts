import { RepositorioUsuario } from '../puerto/repositorio/repositorio-usuario';
import { Usuario } from '../modelo/usuario';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import UsuarioLogin from '../modelo/usuario-login';

export class ServicioLoguearUsuario {

  constructor(private readonly _repositorioUsuario: RepositorioUsuario) {
  }

  async ejecutar(usuario: UsuarioLogin) {
    if (await this._repositorioUsuario.existeNombreUsuario(usuario.nombre)) {

      const _usuario = await this._repositorioUsuario.obtenerUsuarioPorNombre(usuario.nombre)

      if (_usuario.clave !== usuario.clave) {
        throw new ErrorDeNegocio('No ha sido posible autenticarse');
      } else {
        delete _usuario['clave']
        return _usuario
      }
    } else {
      throw new ErrorDeNegocio('No ha sido posible autenticarse');
    }
  }
}
