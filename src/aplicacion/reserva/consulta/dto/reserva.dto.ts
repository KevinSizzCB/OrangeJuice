import { ApiProperty } from '@nestjs/swagger';

export class ReservaDto {
  @ApiProperty({ example: 0 })
  uid: number;

  @ApiProperty({ example: 0 })
  cantidad_jugos: number;

  @ApiProperty({ type: Date })
  fecha_creacion: string;
}
