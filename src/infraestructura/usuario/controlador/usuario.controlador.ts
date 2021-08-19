import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ComandoRegistrarUsuario } from 'src/aplicacion/usuario/comando/registrar-usuario.comando';
import { ManejadorRegistrarUsuario } from 'src/aplicacion/usuario/comando/registar-usuario.manejador';
import { ManejadorListarUsuario } from 'src/aplicacion/usuario/consulta/listar-usuarios.manejador';
import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';
import { ComandoLoguearUsuario } from 'src/aplicacion/usuario/comando/loguear-usuario.comando';
import { ManejadorLoguearUsuario } from 'src/aplicacion/usuario/comando/loguear-usuario.manejador';

@Controller('usuario')
export class UsuarioControlador {
  constructor(
    private readonly _manejadorRegistrarUsuario: ManejadorRegistrarUsuario,
    private readonly _manejadorListarUsuario: ManejadorListarUsuario,
    private readonly _manejadorLoguearUsuario: ManejadorLoguearUsuario,
  ) { }

  @Post('/registro')
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(@Body() comandoRegistrarUsuario: ComandoRegistrarUsuario) {
    return this._manejadorRegistrarUsuario.ejecutar(comandoRegistrarUsuario);
  }

  @Post('/login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async loguear(@Body() comandoLoguearUsuario: ComandoLoguearUsuario) {
    return this._manejadorLoguearUsuario.ejecutar(comandoLoguearUsuario);
  }

  @Get()
  async listar(): Promise<UsuarioDto[]> {
    return this._manejadorListarUsuario.ejecutar();
  }
}
