import { RepositorioReserva } from '../puerto/repositorio/repositorio-reserva';
import { RepositorioUsuario } from '../../usuario/puerto/repositorio/repositorio-usuario';
import { Reserva } from '../modelo/reserva';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { forwardRef, Inject } from '@nestjs/common';

function calcularPorcentaje(valor:number, porcentaje:number):number{
    return (valor*porcentaje)/ 100;
}

export class ServicioRalizarReserva {

  constructor(
    @Inject(forwardRef(() => RepositorioUsuario)) private readonly _repositorioUsuario: RepositorioUsuario,
    private readonly _repositorioReserva: RepositorioReserva
    ) {
    
  }

  async ejecutar(reserva: Reserva) {
    if(!await this._repositorioUsuario.existeUsuario(reserva.uid)){
      throw new ErrorDeNegocio("Usuario no encontrado");
    }

    const {edad, fecha_ultima_compra, acumulacion_compras_mensual} = await this._repositorioUsuario.obtenerUsuario(reserva.uid);
    
    if(edad < 18){
        reserva.precio_total = reserva.precio_total - calcularPorcentaje(reserva.precio_total, 5);
    }
    if(acumulacion_compras_mensual > 5){
        reserva.precio_total = reserva.precio_total - calcularPorcentaje(reserva.precio_total, 2);
    }
    if(reserva.validarDiaFestivo(reserva.fecha_creacion)){
        reserva.precio_total = reserva.precio_total + 2000;
    }
    
    const now = new Date();
    if(fecha_ultima_compra.getMonth() === now.getMonth() && fecha_ultima_compra.getFullYear() === now.getFullYear()){
      await this._repositorioUsuario.actualizarAcumuladorMensual(reserva.uid, acumulacion_compras_mensual+1);
    }else{
      await this._repositorioUsuario.actualizarAcumuladorMensual(reserva.uid, 0);
    }

    await this._repositorioUsuario.actualizarCompras(reserva.uid, reserva.fecha_creacion);
    return await this._repositorioReserva.guardar(reserva);
  }
}
