import { ServicioRalizarReserva } from 'src/dominio/reserva/servicio/servicio-crear-reserva';
import { Reserva } from 'src/dominio/reserva/modelo/reserva';
import { RepositorioReserva } from 'src/dominio/reserva/puerto/repositorio/repositorio-reserva';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';
import { UsuarioEntidad } from 'src/infraestructura/usuario/entidad/usuario.entidad';

describe('ServicioRalizarReserva', () => {
  let servicioRalizarReserva: ServicioRalizarReserva;
  let repositorioReservaStub: SinonStubbedInstance<RepositorioReserva>;
  let repositorioUsuarioStub: SinonStubbedInstance<RepositorioUsuario>;
  const CANTIDAD_JUGOS = 20;
  const PRECIO_JUGOS = 2000;
  const SUBTOTAL_JUGOS = PRECIO_JUGOS * CANTIDAD_JUGOS;
  const CINCO_PORCIENTO_JUGOS = (CANTIDAD_JUGOS * 5 * PRECIO_JUGOS) / 100;
  const DOS_PORCIENTO_JUGOS = (CANTIDAD_JUGOS * 2 * PRECIO_JUGOS) / 100;
  const RECARGO_FESTIVOS = 2000;
  const usuario: UsuarioEntidad = {
    id: 1,
    acumulacion_compras_mensual: 0,
    clave: '1234',
    fecha_ultima_compra: new Date(),
    edad: 10,
    nombre: 'juan',
    fecha_creacion: new Date(),
  };

  beforeEach(() => {
    repositorioUsuarioStub = createStubObj<RepositorioUsuario>([
      'obtenerUsuario',
      'actualizarAcumuladorMensual',
      'actualizarCompras',
    ]);
    repositorioReservaStub = createStubObj<RepositorioReserva>(['guardar']);
    servicioRalizarReserva = new ServicioRalizarReserva(
      repositorioUsuarioStub,
      repositorioReservaStub,
    );
  });

  it(`si el usuario es menor de edad y compra ${CANTIDAD_JUGOS} jugos`, async () => {
    const reserva: Reserva = new Reserva(
      usuario.id,
      CANTIDAD_JUGOS,
      new Date().toISOString(),
    );

    repositorioUsuarioStub.obtenerUsuario.returns(Promise.resolve(usuario));
    const PRECIO_ESPERADO = SUBTOTAL_JUGOS - CINCO_PORCIENTO_JUGOS;

    await servicioRalizarReserva.ejecutar(reserva);

    expect(repositorioUsuarioStub.obtenerUsuario.getCalls().length).toBe(1);
    expect(
      repositorioUsuarioStub.actualizarAcumuladorMensual.getCalls().length,
    ).toBe(1);
    expect(
      repositorioUsuarioStub.actualizarAcumuladorMensual.calledWith(
        usuario.id,
        usuario.acumulacion_compras_mensual + 1,
      ),
    ).toBeTruthy();
    expect(repositorioUsuarioStub.actualizarCompras.getCalls().length).toBe(1);
    expect(
      repositorioUsuarioStub.actualizarCompras.calledWith(
        usuario.id,
        reserva.fecha_creacion,
      ),
    ).toBeTruthy();
    expect(repositorioReservaStub.guardar.getCalls().length).toBe(1);
    expect(repositorioReservaStub.guardar.calledWith(reserva)).toBeTruthy();
    expect(reserva.precio_total).toBe(PRECIO_ESPERADO);
  });

  it(`si el usuario tiene más de 5 compras en el mes y compra ${CANTIDAD_JUGOS} jugos`, async () => {
    usuario.edad = 19;
    usuario.acumulacion_compras_mensual = 6;

    const reserva: Reserva = new Reserva(
      usuario.id,
      CANTIDAD_JUGOS,
      new Date().toISOString(),
    );

    repositorioUsuarioStub.obtenerUsuario.returns(Promise.resolve(usuario));
    const PRECIO_ESPERADO = SUBTOTAL_JUGOS - DOS_PORCIENTO_JUGOS;

    await servicioRalizarReserva.ejecutar(reserva);


    expect(repositorioUsuarioStub.obtenerUsuario.getCalls().length).toBe(1);
    expect(
      repositorioUsuarioStub.actualizarAcumuladorMensual.getCalls().length,
    ).toBe(1);
    expect(
      repositorioUsuarioStub.actualizarAcumuladorMensual.calledWith(
        usuario.id,
        usuario.acumulacion_compras_mensual + 1,
      ),
    ).toBeTruthy();
    expect(repositorioUsuarioStub.actualizarCompras.getCalls().length).toBe(1);
    expect(
      repositorioUsuarioStub.actualizarCompras.calledWith(
        usuario.id,
        reserva.fecha_creacion,
      ),
    ).toBeTruthy();
    expect(repositorioReservaStub.guardar.getCalls().length).toBe(1);
    expect(repositorioReservaStub.guardar.calledWith(reserva)).toBeTruthy();
    expect(reserva.precio_total).toBe(PRECIO_ESPERADO);
  });

  it(`si el usuario realiza la compra un día festivo y compra ${CANTIDAD_JUGOS} jugos`, async () => {
    usuario.edad = 19;
    usuario.acumulacion_compras_mensual = 0;

    const DIA_FESTIVO = new Date();
    DIA_FESTIVO.setDate(DIA_FESTIVO.getDate() + 1);

    const reserva: Reserva = new Reserva(
      usuario.id,
      CANTIDAD_JUGOS,
      DIA_FESTIVO.toISOString(),
    );

    repositorioUsuarioStub.obtenerUsuario.returns(Promise.resolve(usuario));
    const PRECIO_ESPERADO = SUBTOTAL_JUGOS + RECARGO_FESTIVOS;

    await servicioRalizarReserva.ejecutar(reserva);


    expect(repositorioUsuarioStub.obtenerUsuario.getCalls().length).toBe(1);
    expect(
      repositorioUsuarioStub.actualizarAcumuladorMensual.getCalls().length,
    ).toBe(1);
    expect(
      repositorioUsuarioStub.actualizarAcumuladorMensual.calledWith(
        usuario.id,
        usuario.acumulacion_compras_mensual + 1,
      ),
    ).toBeTruthy();
    expect(repositorioUsuarioStub.actualizarCompras.getCalls().length).toBe(1);
    expect(
      repositorioUsuarioStub.actualizarCompras.calledWith(
        usuario.id,
        reserva.fecha_creacion,
      ),
    ).toBeTruthy();
    expect(repositorioReservaStub.guardar.getCalls().length).toBe(1);
    expect(repositorioReservaStub.guardar.calledWith(reserva)).toBeTruthy();
    expect(reserva.precio_total).toBe(PRECIO_ESPERADO);
  });

  it('si el usuario no existe', async () => {
    repositorioUsuarioStub.obtenerUsuario.returns(Promise.resolve(null));

    const reserva: Reserva = new Reserva(
      usuario.id,
      CANTIDAD_JUGOS,
      new Date().toISOString(),
    );
    await expect(servicioRalizarReserva.ejecutar(reserva)).rejects.toThrow(
      'Usuario no encontrado',
    );

  });
});
