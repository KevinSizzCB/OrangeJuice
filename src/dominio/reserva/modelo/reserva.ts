import { ErrorCantidadJugos } from 'src/dominio/errores/error-cantidad-jugos';

const PRECIO_JUGO = 2000;
const MAnANA = new Date();
MAnANA.setDate(MAnANA.getDate() + 1);
const AYER = new Date();
AYER.setDate(AYER.getDate() - 1);
const DIAS_FESTIVOS = [
  MAnANA.toISOString().split('T')[0],
  AYER.toISOString().split('T')[0]
];
export class Reserva {
  readonly #uid: number;
  readonly #fecha_creacion: Date;
  readonly #cantidad_jugos: number;
  #precio_total: number;

  constructor(uid: number, cantidad_jugos: number, fecha_creacion: string) {
    this.validarCantidadJugos(cantidad_jugos);
    this.calcularSubTotal(cantidad_jugos);
    this.#uid = uid;
    this.#cantidad_jugos = cantidad_jugos;
    this.#fecha_creacion = new Date(fecha_creacion);
  }

  private calcularSubTotal(cantidad_jugos: number) {
    this.#precio_total = cantidad_jugos * PRECIO_JUGO;
  }

  private validarCantidadJugos(cantidad_jugos: number) {
    if (cantidad_jugos <= 0) {
      throw new ErrorCantidadJugos('La cantidad de jugos debes ser mayor a 0');
    }
  }

  validarDiaFestivo(fecha_creacion: Date) {
    const [fecha] = fecha_creacion.toISOString().split('T');
    return DIAS_FESTIVOS.includes(fecha);
  }

  get uid(): number {
    return this.#uid;
  }

  get cantidad_jugos(): number {
    return this.#cantidad_jugos;
  }

  get precio_total(): number {
    return this.#precio_total;
  }

  set precio_total(precio: number) {
    this.#precio_total = precio;
  }

  get fecha_creacion(): Date {
    return this.#fecha_creacion;
  }
}
