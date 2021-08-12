import { RepositorioReserva } from 'src/dominio/reserva/puerto/repositorio/repositorio-reserva';
import { Reserva } from 'src/dominio/reserva/modelo/reserva';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservaEntidad } from '../../entidad/reserva.entidad';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RepositorioReservaMysql implements RepositorioReserva {
  constructor(
    @InjectRepository(ReservaEntidad)
    private readonly repositorio: Repository<ReservaEntidad>,
  ) {}

  async guardar(reserva: Reserva):Promise<ReservaEntidad> {
    const entidad = new ReservaEntidad();
    entidad.fecha_creacion = reserva.fecha_creacion;
    entidad.cantidad_jugos=reserva.cantidad_jugos;
    entidad.uid=reserva.uid;
    entidad.precio_total=reserva.precio_total;
    const {id} = await this.repositorio.save(entidad);
    return await this.repositorio.findOne({where:{id}});
  }
}
