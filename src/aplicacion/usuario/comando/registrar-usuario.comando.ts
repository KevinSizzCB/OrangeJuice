import { IsDateString, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ComandoRegistrarUsuario {
  @IsString()
  @ApiProperty({ example: 'William' })
  public nombre: string;

  @IsNumber()
  @ApiProperty({ example: 0 })
  public edad: number;

  @IsString()
  @ApiProperty({ minLength: 4, example: '1234' })
  public clave: string;

  @IsDateString()
  @ApiProperty({ type: Date })
  public fecha_creacion: string;
}
