import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ComandoRalizarReserva } from 'src/aplicacion/reserva/comando/realizar-reserva.comando';
import { ManejadorRalizarReserva } from 'src/aplicacion/reserva/comando/realizar-reserva.manejador';
import { ManejadorListarReserva } from 'src/aplicacion/reserva/consulta/listar-pedidos.manejador';
import { ReservaDto } from 'src/aplicacion/reserva/consulta/dto/reserva.dto';

@Controller('reservas')
export class ReservaControlador {
  constructor(
    private readonly _manejadorRalizarReserva: ManejadorRalizarReserva,
    private readonly _manejadorListarReserva: ManejadorListarReserva,
  ) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(@Body() comandoRealizarReserva: ComandoRalizarReserva) {
    return this._manejadorRalizarReserva.ejecutar(comandoRealizarReserva);
  }

  @Get()
  async listar(): Promise<ReservaDto[]> {
    return this._manejadorListarReserva.ejecutar();
  }
}
