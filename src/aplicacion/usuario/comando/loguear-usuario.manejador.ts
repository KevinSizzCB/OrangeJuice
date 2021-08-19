import { Injectable } from '@nestjs/common';
import { ServicioLoguearUsuario } from 'src/dominio/usuario/servicio/servicio-loguear-usuario';
import { ComandoLoguearUsuario } from './loguear-usuario.comando';

@Injectable()
export class ManejadorLoguearUsuario {
  constructor(private _servicioRegistrarUsuario: ServicioLoguearUsuario) { }

  async ejecutar(comandoLoguearUsuario: ComandoLoguearUsuario) {
    return this._servicioRegistrarUsuario.ejecutar(comandoLoguearUsuario);
  }
}
