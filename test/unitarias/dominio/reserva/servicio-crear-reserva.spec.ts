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
  const CINCO_PORCIENTO_JUGOS = (CANTIDAD_JUGOS*5)/100;
  // const DOS_PORCIENTO_JUGOS = (CANTIDAD_JUGOS*2)/100;
  // const RECARGO_FESTIVOS = 2000;
  // const PRECIO_JUGOS = 2000;


  beforeEach(() => {

    repositorioUsuarioStub = createStubObj<RepositorioUsuario>([
        'obtenerUsuario', 
        'actualizarAcumuladorMensual', 
        'actualizarCompras',
        'existeUsuario'
    ]);
    repositorioReservaStub = createStubObj<RepositorioReserva>(['guardar']);
    servicioRalizarReserva = new ServicioRalizarReserva(repositorioUsuarioStub,repositorioReservaStub);
  });

  it(`si el usuario es menor de edad y compra ${CANTIDAD_JUGOS} jugos`, async()=>{
    const usuario: UsuarioEntidad = {
        id:1, 
        acumulacion_compras_mensual:0, 
        clave:'1234', 
        fecha_ultima_compra: new Date(), 
        edad:10, 
        nombre:"juan", 
        fecha_creacion:new Date()
    }
    const reserva:Reserva = new Reserva(usuario.id, CANTIDAD_JUGOS, new Date().toISOString())

    repositorioUsuarioStub.existeUsuario.returns(Promise.resolve(true));
    repositorioUsuarioStub.obtenerUsuario.returns(Promise.resolve(usuario));
    reserva.precio_total = CANTIDAD_JUGOS - (CINCO_PORCIENTO_JUGOS)

    await servicioRalizarReserva.ejecutar(reserva)
    
    expect(repositorioUsuarioStub.obtenerUsuario.getCalls().length).toBe(1)
    expect(repositorioUsuarioStub.actualizarAcumuladorMensual.getCalls().length).toBe(1)
    expect(repositorioUsuarioStub.actualizarAcumuladorMensual.calledWith(usuario.id, usuario.acumulacion_compras_mensual + 1)).toBeTruthy()
    expect(repositorioUsuarioStub.actualizarCompras.getCalls().length).toBe(1)
    expect(repositorioUsuarioStub.actualizarCompras.calledWith(usuario.id, reserva.fecha_creacion)).toBeTruthy()
    expect(repositorioReservaStub.guardar.getCalls().length).toBe(1)
    expect(repositorioReservaStub.guardar.calledWith(reserva)).toBeTruthy()

  })

//   it('si el nombre de usuario ya existe no se puede crear y deberia retonar error', async () => {

//     repositorioUsuarioStub.existeNombreUsuario.returns(Promise.resolve(true));

//     await expect(
//         servicioRalizarReserva.ejecutar(
//         new Reserva('juan', '1234', new Date().toISOString(), 10),
//       ),
//     ).rejects.toThrow('El nombre de usuario juan ya existe');
//   });

//   it('si el nombre no existe guarda el usuario el repositorio', async () => {
//     const usuario = new Reserva('juan', '1234', new Date().toISOString(), 10);
//     repositorioUsuarioStub.existeNombreUsuario.returns(Promise.resolve(false));

//     await servicioRalizarReserva.ejecutar(usuario);

//     expect(repositorioUsuarioStub.guardar.getCalls().length).toBe(1);
//     expect(repositorioUsuarioStub.guardar.calledWith(usuario)).toBeTruthy();
//   });
});
