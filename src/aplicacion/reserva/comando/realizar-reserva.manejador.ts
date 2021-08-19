import { Injectable } from '@nestjs/common';
import { ServicioRalizarReserva } from 'src/dominio/reserva/servicio/servicio-crear-reserva';
import { ComandoRalizarReserva } from './realizar-reserva.comando';
import { Reserva } from 'src/dominio/reserva/modelo/reserva';

@Injectable()
export class ManejadorRalizarReserva {
  constructor(private _servicioRalizarReserva: ServicioRalizarReserva) { }

  async ejecutar(comandoRealizarReserva: ComandoRalizarReserva) {
    return this._servicioRalizarReserva.ejecutar(
      new Reserva(
        comandoRealizarReserva.uid,
        comandoRealizarReserva.cantidad_jugos,
        comandoRealizarReserva.fecha_creacion,
      ),
    );
  }
}
