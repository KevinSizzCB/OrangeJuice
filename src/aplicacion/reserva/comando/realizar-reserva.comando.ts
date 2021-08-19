import { IsDateString, IsNumber, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ComandoRalizarReserva {
  @IsNumber()
  @ApiProperty({ example: 0 })
  public uid: number;

  @IsNumber()
  @ApiProperty({ example: 0 })
  public cantidad_jugos: number;

  @IsDateString()
  @ApiProperty({ type: Date })
  public fecha_creacion: string;
}
