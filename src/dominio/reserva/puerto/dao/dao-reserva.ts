import { ReservaDto } from 'src/aplicacion/reserva/consulta/dto/reserva.dto';

export abstract class DaoReserva {
  abstract listar(): Promise<ReservaDto[]>;
}
