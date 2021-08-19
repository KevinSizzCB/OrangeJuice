import { RepositorioReserva } from '../puerto/repositorio/repositorio-reserva';
import { RepositorioUsuario } from '../../usuario/puerto/repositorio/repositorio-usuario';
import { Reserva } from '../modelo/reserva';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { forwardRef, Inject } from '@nestjs/common';

export class ServicioRalizarReserva {
  constructor(
    @Inject(forwardRef(() => RepositorioUsuario))
    private readonly _repositorioUsuario: RepositorioUsuario,
    private readonly _repositorioReserva: RepositorioReserva,
  ) { }

  private readonly edadMaximaParaDescuento = 18;
  private readonly minimoComprasMensualesParaDescuento = 5;
  private readonly descuentoMenoresDeEdad = 5;
  private readonly descuentoMaximoComprasMensuales = 2;
  private readonly recargoDiasFestivos = 2000;
  private readonly cienPorciento = 100;

  private calcularPorcentaje(valor: number, porcentaje: number): number {
    return (valor * porcentaje) / this.cienPorciento;
  }

  async ejecutar(reserva: Reserva) {
    if (!(await this._repositorioUsuario.existeUsuario(reserva.uid))) {
      throw new ErrorDeNegocio('Usuario no encontrado');
    }

    const {
      edad,
      fecha_ultima_compra,
      acumulacion_compras_mensual,
    } = await this._repositorioUsuario.obtenerUsuario(reserva.uid);

    if (edad < this.edadMaximaParaDescuento) {
      reserva.precio_total =
        reserva.precio_total -
        this.calcularPorcentaje(
          reserva.precio_total,
          this.descuentoMenoresDeEdad,
        );
    }
    if (
      acumulacion_compras_mensual > this.minimoComprasMensualesParaDescuento
    ) {
      reserva.precio_total =
        reserva.precio_total -
        this.calcularPorcentaje(
          reserva.precio_total,
          this.descuentoMaximoComprasMensuales,
        );
    }
    if (reserva.validarDiaFestivo(reserva.fecha_creacion)) {
      reserva.precio_total = reserva.precio_total + this.recargoDiasFestivos;
    }

    const now = new Date();
    if (
      fecha_ultima_compra.getMonth() === now.getMonth() &&
      fecha_ultima_compra.getFullYear() === now.getFullYear()
    ) {
      await this._repositorioUsuario.actualizarAcumuladorMensual(
        reserva.uid,
        acumulacion_compras_mensual + 1,
      );
    } else {
      await this._repositorioUsuario.actualizarAcumuladorMensual(
        reserva.uid,
        0,
      );
    }

    await this._repositorioUsuario.actualizarCompras(
      reserva.uid,
      reserva.fecha_creacion,
    );
    return this._repositorioReserva.guardar(reserva);
  }
}
