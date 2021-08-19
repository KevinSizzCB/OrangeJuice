import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { FiltroExcepcionesDeNegocio } from 'src/infraestructura/excepciones/filtro-excepciones-negocio';
import { UsuarioControlador } from 'src/infraestructura/usuario/controlador/usuario.controlador';
import { ServicioRegistrarUsuario } from 'src/dominio/usuario/servicio/servicio-registrar-usuario';
import { ManejadorRegistrarUsuario } from 'src/aplicacion/usuario/comando/registar-usuario.manejador';
import { ManejadorListarUsuario } from 'src/aplicacion/usuario/consulta/listar-usuarios.manejador';
import { AppLogger } from 'src/infraestructura/configuracion/ceiba-logger.service';
import { createSandbox, SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';
import { RepositorioReserva } from 'src/dominio/reserva/puerto/repositorio/repositorio-reserva';
import { DaoReserva } from 'src/dominio/reserva/puerto/dao/dao-reserva';
import { ManejadorListarReserva } from 'src/aplicacion/reserva/consulta/listar-pedidos.manejador';
import { ManejadorRalizarReserva } from 'src/aplicacion/reserva/comando/realizar-reserva.manejador';
import { ServicioRalizarReserva } from 'src/dominio/reserva/servicio/servicio-crear-reserva';
import { ReservaControlador } from 'src/infraestructura/reserva/controlador/reserva.controlador';
import { ComandoRalizarReserva } from 'src/aplicacion/reserva/comando/realizar-reserva.comando';
import { ManejadorLoguearUsuario } from 'src/aplicacion/usuario/comando/loguear-usuario.manejador';
import { ServicioLoguearUsuario } from 'src/dominio/usuario/servicio/servicio-loguear-usuario';
import { servicioLoguearUsuarioProveedor } from 'src/infraestructura/usuario/proveedor/servicio/servicio-loguear-usuario.proveedor';

/**
 * Un sandbox es util cuando el módulo de nest se configura una sola vez durante el ciclo completo de pruebas
 * */
const sinonSandbox = createSandbox();

describe('Pruebas al controlador de reservas', () => {
  let app: INestApplication;

  let repositorioReserva: SinonStubbedInstance<RepositorioReserva>;
  let daoReserva: SinonStubbedInstance<DaoReserva>;
  let repositorioUsuario: SinonStubbedInstance<RepositorioUsuario>;
  let daoUsuario: SinonStubbedInstance<DaoUsuario>;

  /**
   * No Inyectar los módulos completos (Se trae TypeORM y genera lentitud al levantar la prueba, traer una por una las dependencias)
   **/

  beforeAll(async () => {
    repositorioUsuario = createStubObj<RepositorioUsuario>(
      [
        'actualizarAcumuladorMensual',
        'actualizarCompras',
        'existeUsuario',
        'obtenerUsuario',
      ],
      sinonSandbox,
    );
    daoUsuario = createStubObj<DaoUsuario>(['listar'], sinonSandbox);
    repositorioReserva = createStubObj<RepositorioReserva>(
      ['guardar'],
      sinonSandbox,
    );
    daoReserva = createStubObj<DaoReserva>(['listar'], sinonSandbox);
    const moduleRef = await Test.createTestingModule({
      controllers: [UsuarioControlador, ReservaControlador],
      providers: [
        AppLogger,
        {
          provide: ServicioRegistrarUsuario,
          inject: [RepositorioUsuario],
          useClass: ServicioRalizarReserva,
        },
        {
          provide: ServicioRalizarReserva,
          inject: [RepositorioReserva],
          useClass: ServicioRalizarReserva,
        },
        {
          provide: ServicioLoguearUsuario,
          inject: [RepositorioUsuario],
          useFactory: servicioLoguearUsuarioProveedor,
        },
        { provide: RepositorioReserva, useValue: repositorioReserva },
        { provide: DaoReserva, useValue: daoReserva },
        { provide: RepositorioUsuario, useValue: repositorioUsuario },
        { provide: DaoUsuario, useValue: daoUsuario },
        ManejadorRegistrarUsuario,
        ManejadorListarUsuario,
        ManejadorListarReserva,
        ManejadorRalizarReserva,
        ManejadorLoguearUsuario,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    const logger = await app.resolve(AppLogger);
    logger.customError = sinonSandbox.stub();
    app.useGlobalFilters(new FiltroExcepcionesDeNegocio(logger));
    await app.init();
  });

  afterEach(() => {
    sinonSandbox.restore();
  });

  afterAll(async () => {
    await app.close();
  });

  it('debería listar las reservas realizadas', async () => {
    const reservas: any[] = [
      {
        id: 1,
        uid: 1,
        cantidad_jugos: 1,
        precio_total: 2000,
        fecha_creacion: new Date().toISOString(),
      },
    ];
    daoReserva.listar.returns(Promise.resolve(reservas));

    const response = await request(app.getHttpServer())
      .get('/reservas')
      .expect(HttpStatus.OK);

    expect(response.body).toStrictEqual(reservas);
  });

  it('debería fallar alrealizar la reserva porque el usuario no existe', async () => {
    const reserva: ComandoRalizarReserva = {
      cantidad_jugos: 1,
      uid: 0,
      fecha_creacion: new Date().toISOString(),
    };
    const mensaje = 'Usuario no encontrado';
    repositorioUsuario.existeUsuario.returns(Promise.resolve(false));

    const response = await request(app.getHttpServer())
      .post('/reservas')
      .send(reserva)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.message).toBe(mensaje);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });
});
