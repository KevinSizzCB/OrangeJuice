import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntidad } from '../../entidad/usuario.entidad';
import { Repository, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RepositorioUsuarioMysql implements RepositorioUsuario {
  constructor(
    @InjectRepository(UsuarioEntidad)
    private readonly repositorio: Repository<UsuarioEntidad>,
  ) { }

  async existeNombreUsuario(nombre: string): Promise<boolean> {
    return (await this.repositorio.count({ nombre })) > 0;
  }

  async obtenerUsuario(uid: number): Promise<UsuarioEntidad | null> {
    return this.repositorio.findOne({ where: { id: uid } });
  }

  async actualizarCompras(
    uid: number,
    fecha: Date,
    acumulacion_compras_mensual: number,
  ): Promise<UpdateResult> {
    return this.repositorio.update(
      { id: uid },
      { fecha_ultima_compra: fecha, acumulacion_compras_mensual },
    );
  }

  async obtenerUsuarioPorNombre(
    nombre: string,
  ): Promise<UsuarioEntidad | null> {
    return this.repositorio.findOne({ where: { nombre } });
  }

  async guardar(usuario: Usuario) {
    const entidad = new UsuarioEntidad();
    entidad.clave = usuario.clave;
    entidad.fecha_creacion = usuario.fecha_creacion;
    entidad.nombre = usuario.nombre;
    entidad.edad = usuario.edad;
    entidad.fecha_ultima_compra = usuario.fecha_creacion;
    const usuarioGuardado = await this.repositorio.save(entidad);
    delete usuarioGuardado['clave'];
    return usuarioGuardado;
  }
}
