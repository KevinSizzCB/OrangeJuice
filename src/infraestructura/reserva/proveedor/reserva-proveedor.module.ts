import { forwardRef, Module } from '@nestjs/common';
import { ServicioRalizarReserva } from 'src/dominio/reserva/servicio/servicio-crear-reserva';
import { RepositorioReserva } from 'src/dominio/reserva/puerto/repositorio/repositorio-reserva';
import { repositorioreservaProvider } from './repositorio/repositorio-reserva.proveedor';
import { daoReservaProvider } from './dao/dao-reserva.proveedor';
import { ManejadorRalizarReserva } from 'src/aplicacion/reserva/comando/realizar-reserva.manejador';
import { ManejadorListarReserva } from 'src/aplicacion/reserva/consulta/listar-pedidos.manejador';
import { DaoReserva } from 'src/dominio/reserva/puerto/dao/dao-reserva';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservaEntidad } from '../entidad/reserva.entidad';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { UsuarioEntidad } from 'src/infraestructura/usuario/entidad/usuario.entidad';
import { UsuarioModule } from 'src/infraestructura/usuario/usuario.module';
import { ServicioRegistrarUsuario } from 'src/dominio/usuario/servicio/servicio-registrar-usuario';
import { repositorioUsuarioProvider } from 'src/infraestructura/usuario/proveedor/repositorio/repositorio-usuario.proveedor';
import { daoUsuarioProvider } from 'src/infraestructura/usuario/proveedor/dao/dao-usuario.proveedor';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservaEntidad, UsuarioEntidad]),
    forwardRef(() => UsuarioModule),
  ],
  providers: [
    {
      provide: ServicioRegistrarUsuario,
      inject: [RepositorioUsuario],
      useClass: ServicioRalizarReserva
    },
    {
      provide: ServicioRalizarReserva,
      inject: [RepositorioReserva],
      useClass: ServicioRalizarReserva
    },
    repositorioreservaProvider,
    daoReservaProvider,
    ManejadorRalizarReserva,
    ManejadorListarReserva,

    repositorioUsuarioProvider,
    daoUsuarioProvider,
  ],
  exports: [
    ServicioRalizarReserva,
    ManejadorRalizarReserva,
    ManejadorListarReserva,
    RepositorioReserva,
    DaoReserva,
  ],
})
export class ReservaProveedorModule { }
