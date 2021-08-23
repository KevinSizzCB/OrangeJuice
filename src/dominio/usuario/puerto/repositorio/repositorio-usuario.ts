import { Injectable } from '@nestjs/common';
import { UsuarioEntidad } from 'src/infraestructura/usuario/entidad/usuario.entidad';
import { Usuario } from '../../modelo/usuario';

@Injectable()
export abstract class RepositorioUsuario {
  abstract existeNombreUsuario(nombre: string): Promise<boolean>;
  abstract guardar(usuario: Usuario): Promise<UsuarioEntidad | null>;
  abstract obtenerUsuario(uid: number): Promise<UsuarioEntidad | null>;
  // abstract existeUsuario(uid: number): Promise<boolean>;
  abstract actualizarCompras(uid: number, fecha: Date): Promise<boolean>;
  abstract actualizarAcumuladorMensual(
    uid: number,
    acumulacion_compras_mensual: number,
  ): Promise<boolean>;
  abstract obtenerUsuarioPorNombre(
    nombre: string,
  ): Promise<UsuarioEntidad | null>;
}
