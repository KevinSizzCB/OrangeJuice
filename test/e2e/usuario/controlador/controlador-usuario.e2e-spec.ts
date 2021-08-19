import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { FiltroExcepcionesDeNegocio } from 'src/infraestructura/excepciones/filtro-excepciones-negocio';
import { UsuarioControlador } from 'src/infraestructura/usuario/controlador/usuario.controlador';
import { ServicioRegistrarUsuario } from 'src/dominio/usuario/servicio/servicio-registrar-usuario';
import { servicioRegistrarUsuarioProveedor } from 'src/infraestructura/usuario/proveedor/servicio/servicio-registrar-usuario.proveedor';
import { ManejadorRegistrarUsuario } from 'src/aplicacion/usuario/comando/registar-usuario.manejador';
import { ManejadorListarUsuario } from 'src/aplicacion/usuario/consulta/listar-usuarios.manejador';
import { ComandoRegistrarUsuario } from 'src/aplicacion/usuario/comando/registrar-usuario.comando';
import { AppLogger } from 'src/infraestructura/configuracion/ceiba-logger.service';
import { createSandbox, SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';
import { ServicioLoguearUsuario } from 'src/dominio/usuario/servicio/servicio-loguear-usuario';
import { servicioLoguearUsuarioProveedor } from 'src/infraestructura/usuario/proveedor/servicio/servicio-loguear-usuario.proveedor';
import { ManejadorLoguearUsuario } from 'src/aplicacion/usuario/comando/loguear-usuario.manejador';
import { UsuarioEntidad } from 'src/infraestructura/usuario/entidad/usuario.entidad';

/**
 * Un sandbox es util cuando el módulo de nest se configura una sola vez durante el ciclo completo de pruebas
 * */
const sinonSandbox = createSandbox();

describe('Pruebas al controlador de usuarios', () => {
  let app: INestApplication;
  let repositorioUsuario: SinonStubbedInstance<RepositorioUsuario>;
  let daoUsuario: SinonStubbedInstance<DaoUsuario>;

  /**
   * No Inyectar los módulos completos (Se trae TypeORM y genera lentitud al levantar la prueba, traer una por una las dependencias)
   **/
  beforeAll(async () => {
    repositorioUsuario = createStubObj<RepositorioUsuario>(
      ['existeNombreUsuario', 'guardar', 'obtenerUsuarioPorNombre'],
      sinonSandbox,
    );
    daoUsuario = createStubObj<DaoUsuario>(['listar'], sinonSandbox);
    const moduleRef = await Test.createTestingModule({
      controllers: [UsuarioControlador],
      providers: [
        AppLogger,
        {
          provide: ServicioRegistrarUsuario,
          inject: [RepositorioUsuario],
          useFactory: servicioRegistrarUsuarioProveedor,
        },
        {
          provide: ServicioLoguearUsuario,
          inject: [RepositorioUsuario],
          useFactory: servicioLoguearUsuarioProveedor,
        },
        { provide: RepositorioUsuario, useValue: repositorioUsuario },
        { provide: DaoUsuario, useValue: daoUsuario },
        ManejadorRegistrarUsuario,
        ManejadorListarUsuario,
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

  it('debería fallar al loguear el usuario porque el usuario no existe', async () => {
    const usuario: ComandoRegistrarUsuario = {
      nombre: 'Lorem ipsum',
      fecha_creacion: new Date().toISOString(),
      clave: '123',
      edad: 10,
    };
    const mensaje = 'No ha sido posible autenticarse';
    repositorioUsuario.existeNombreUsuario.returns(Promise.resolve(false));

    const response = await request(app.getHttpServer())
      .post('/usuario/login')
      .send(usuario)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(mensaje);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('debería fallar al loguear el usuario porque las contraseñas no coinciden', async () => {
    const usuario: ComandoRegistrarUsuario = {
      nombre: 'Lorem ipsum',
      fecha_creacion: new Date().toISOString(),
      clave: '1234',
      edad: 10,
    };
    const usuario2: UsuarioEntidad = {
      acumulacion_compras_mensual: 0,
      clave: '12345',
      nombre: 'Lorem ipsum',
      fecha_creacion: new Date(),
      edad: 10,
      fecha_ultima_compra: new Date(),
      id: 0,
    };
    const mensaje = 'No ha sido posible autenticarse';
    repositorioUsuario.existeNombreUsuario.returns(Promise.resolve(true));
    repositorioUsuario.obtenerUsuarioPorNombre.returns(
      Promise.resolve(usuario2),
    );

    const response = await request(app.getHttpServer())
      .post('/usuario/login')
      .send(usuario)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(mensaje);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('debería listar los usuarios registrados', () => {
    const usuarios: any[] = [
      {
        nombre: 'Lorem ipsum',
        fechaCreacion: new Date().toISOString(),
        edad: 10,
      },
    ];
    daoUsuario.listar.returns(Promise.resolve(usuarios));

    return request(app.getHttpServer())
      .get('/usuario')
      .expect(HttpStatus.OK)
      .expect(usuarios);
  });

  it('debería fallar al registar un usuario clave muy corta', async () => {
    const usuario: ComandoRegistrarUsuario = {
      nombre: 'Lorem ipsum',
      fecha_creacion: new Date().toISOString(),
      clave: '123',
      edad: 10,
    };
    const mensaje = 'El tamaño mínimo de la clave debe ser 4';

    const response = await request(app.getHttpServer())
      .post('/usuario/registro')
      .send(usuario)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(mensaje);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('debería fallar al registar un usuario ya existente', async () => {
    const usuario: ComandoRegistrarUsuario = {
      nombre: 'Lorem ipsum',
      fecha_creacion: new Date().toISOString(),
      clave: '1234',
      edad: 10,
    };
    const mensaje = `El nombre de usuario ${usuario.nombre} ya existe`;
    repositorioUsuario.existeNombreUsuario.returns(Promise.resolve(true));

    const response = await request(app.getHttpServer())
      .post('/usuario/registro')
      .send(usuario)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(mensaje);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });
});
