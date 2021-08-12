import { Module } from '@nestjs/common';
import { ReservaControlador } from './controlador/reserva.controlador';
import { ReservaProveedorModule } from './proveedor/reserva-proveedor.module';

@Module({
  imports: [
    ReservaProveedorModule
  ],
  controllers: [ReservaControlador],
})
export class ReservaModule {}
