import { Module } from '@nestjs/common';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { ServicioRegistrarUsuario } from 'src/dominio/usuario/servicio/servicio-registrar-usuario';
import { ReservaProveedorModule } from '../reserva/proveedor/reserva-proveedor.module';
import { UsuarioControlador } from './controlador/usuario.controlador';
import { repositorioUsuarioProvider } from './proveedor/repositorio/repositorio-usuario.proveedor';
import { UsuarioProveedorModule } from './proveedor/usuario-proveedor.module';

@Module({
  imports: [
    UsuarioProveedorModule,
    // ReservaProveedorModule,
  ],
  controllers: [UsuarioControlador],
  // providers:[repositorioUsuarioProvider],
  // providers:[{provide:"RepositorioUsuario", useValue:RepositorioUsuario,}],
  // exports:[RepositorioUsuario, ServicioRegistrarUsuario],
})
export class UsuarioModule {}
