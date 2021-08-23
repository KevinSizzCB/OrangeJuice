import { Injectable } from '@nestjs/common';
import { UsuarioEntidad } from 'src/infraestructura/usuario/entidad/usuario.entidad';
import { UpdateResult } from 'typeorm';
import { Usuario } from '../../modelo/usuario';

@Injectable()
export abstract class RepositorioUsuario {
  abstract existeNombreUsuario(nombre: string): Promise<boolean>;
  abstract guardar(usuario: Usuario): Promise<UsuarioEntidad | null>;
  abstract obtenerUsuario(uid: number): Promise<UsuarioEntidad | null>;
  abstract actualizarCompras(
    uid: number,
    fecha: Date,
    acumulacion_compras_mensual: number,
  ): Promise<UpdateResult>;
  abstract obtenerUsuarioPorNombre(
    nombre: string,
  ): Promise<UsuarioEntidad | null>;
}
