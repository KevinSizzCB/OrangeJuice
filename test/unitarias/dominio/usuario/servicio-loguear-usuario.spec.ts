import { ServicioLoguearUsuario } from 'src/dominio/usuario/servicio/servicio-loguear-usuario';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';
import UsuarioLogin from 'src/dominio/usuario/modelo/usuario-login';

describe('ServicioLoguearUsuario', () => {
  let servicioLoguearUsuario: ServicioLoguearUsuario;
  let repositorioUsuarioStub: SinonStubbedInstance<RepositorioUsuario>;
  const loginData: UsuarioLogin = {
    clave: '1234',
    nombre: 'Juan',
  };

  beforeEach(() => {
    repositorioUsuarioStub = createStubObj<RepositorioUsuario>([
      'existeNombreUsuario',
      'obtenerUsuarioPorNombre',
    ]);
    servicioLoguearUsuario = new ServicioLoguearUsuario(repositorioUsuarioStub);
  });

  it('Si no existe el nombre del usuario', async () => {
    repositorioUsuarioStub.existeNombreUsuario.returns(Promise.resolve(false));

    await expect(servicioLoguearUsuario.ejecutar(loginData)).rejects.toThrow(
      'No ha sido posible autenticarse',
    );
    expect(repositorioUsuarioStub.existeNombreUsuario.getCalls().length).toBe(
      1,
    );
    expect(
      repositorioUsuarioStub.existeNombreUsuario.calledWith(loginData.nombre),
    ).toBeTruthy();
  });

  it('Si las claves no coinciden', async () => {
    repositorioUsuarioStub.existeNombreUsuario.returns(Promise.resolve(true));
    const usuario = {
      nombre: 'Juan',
      clave: '12345',
      fecha_ultima_compra: new Date(),
      acumulacion_compras_mensual: 0,
      edad: 10,
      fecha_creacion: new Date(),
      id: 0,
    };
    repositorioUsuarioStub.obtenerUsuarioPorNombre.returns(
      Promise.resolve(usuario),
    );

    await expect(servicioLoguearUsuario.ejecutar(loginData)).rejects.toThrow(
      'No ha sido posible autenticarse',
    );
    expect(repositorioUsuarioStub.existeNombreUsuario.getCalls().length).toBe(
      1,
    );
    expect(
      repositorioUsuarioStub.existeNombreUsuario.calledWith(loginData.nombre),
    ).toBeTruthy();
    expect(
      repositorioUsuarioStub.obtenerUsuarioPorNombre.getCalls().length,
    ).toBe(1);
    expect(
      repositorioUsuarioStub.obtenerUsuarioPorNombre.calledWith(
        loginData.nombre,
      ),
    ).toBeTruthy();
  });

  it('Si el usuario se loguea correctamente', async () => {
    repositorioUsuarioStub.existeNombreUsuario.returns(Promise.resolve(true));
    const usuario = {
      nombre: 'Juan',
      clave: '1234',
      fecha_ultima_compra: new Date(),
      acumulacion_compras_mensual: 0,
      edad: 10,
      fecha_creacion: new Date(),
      id: 0,
    };
    repositorioUsuarioStub.obtenerUsuarioPorNombre.returns(
      Promise.resolve(usuario),
    );

    await expect(servicioLoguearUsuario.ejecutar(loginData)).resolves.toBe(
      usuario,
    );
    expect(repositorioUsuarioStub.existeNombreUsuario.getCalls().length).toBe(
      1,
    );
    expect(
      repositorioUsuarioStub.existeNombreUsuario.calledWith(loginData.nombre),
    ).toBeTruthy();
    expect(
      repositorioUsuarioStub.obtenerUsuarioPorNombre.getCalls().length,
    ).toBe(1);
    expect(
      repositorioUsuarioStub.obtenerUsuarioPorNombre.calledWith(
        loginData.nombre,
      ),
    ).toBeTruthy();
  });
});
