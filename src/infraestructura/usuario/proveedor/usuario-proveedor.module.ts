import { Module } from '@nestjs/common';
import { ServicioRegistrarUsuario } from 'src/dominio/usuario/servicio/servicio-registrar-usuario';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { servicioRegistrarUsuarioProveedor } from './servicio/servicio-registrar-usuario.proveedor';
import { repositorioUsuarioProvider } from './repositorio/repositorio-usuario.proveedor';
import { daoUsuarioProvider } from './dao/dao-usuario.proveedor';
import { ManejadorRegistrarUsuario } from 'src/aplicacion/usuario/comando/registar-usuario.manejador';
import { ManejadorListarUsuario } from 'src/aplicacion/usuario/consulta/listar-usuarios.manejador';
import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntidad } from '../entidad/usuario.entidad';
import { ServicioLoguearUsuario } from 'src/dominio/usuario/servicio/servicio-loguear-usuario';
import { servicioLoguearUsuarioProveedor } from './servicio/servicio-loguear-usuario.proveedor';
import { ManejadorLoguearUsuario } from 'src/aplicacion/usuario/comando/loguear-usuario.manejador';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntidad])],
  providers: [
    {
      provide: ServicioRegistrarUsuario,
      inject: [RepositorioUsuario],
      useFactory: servicioRegistrarUsuarioProveedor,
    },
    {
      provide: ServicioLoguearUsuario,
      inject: [RepositorioUsuario],
      useFactory: servicioLoguearUsuarioProveedor,
    },

    repositorioUsuarioProvider,
    daoUsuarioProvider,
    ManejadorRegistrarUsuario,
    ManejadorListarUsuario,
    ManejadorLoguearUsuario,
  ],
  exports: [
    ServicioRegistrarUsuario,
    ManejadorRegistrarUsuario,
    ManejadorListarUsuario,
    ManejadorLoguearUsuario,
    RepositorioUsuario,
    DaoUsuario,
  ],
})
export class UsuarioProveedorModule { }
