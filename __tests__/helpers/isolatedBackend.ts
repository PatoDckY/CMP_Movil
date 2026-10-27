import { course, purchase, myCourseDto } from './fixtures';
const fixturePassword = 'Fixture!58Xx';
export { fixturePassword };

export function createIsolatedBackend() {
  let accessToken = '';
  let refreshToken = '';
  let serial = 0;
  const state = {
    registered: false,
    active: true,
    offline: false,
    enrolled: false,
    deletionStatus: 202,
    malformedReceipt: false,
    profile: {
      id: 1,
      nombre: 'Cliente',
      apellidoPaterno: 'Prueba',
      apellidoMaterno: null as string | null,
      edad: 25,
      sexo: 'otro',
      telefono: '5555555555',
      correo: 'cliente@example.com',
    },
  };
  const calls: { method: string; path: string }[] = [];
  const json = (status: number, data: unknown): Response =>
    ({
      status,
      ok: status >= 200 && status < 300,
      text: async () => JSON.stringify(data),
    } as Response);
  const user = () => ({
    ...state.profile,
    nombreCompleto: [
      state.profile.nombre,
      state.profile.apellidoPaterno,
      state.profile.apellidoMaterno,
    ]
      .filter(Boolean)
      .join(' '),
    rol: 'cliente',
    email: state.profile.correo,
  });
  const courseDto = {
    idCurso: course.id,
    tituloCurso: course.title,
    descripcion: course.description,
    idInstructor: 1,
    instructorNombre: 'Ana',
    idCategoria: 1,
    categoriaNombre: 'Salud',
    idUbicacion: null,
    idModalidad: 1,
    modalidadNombre: 'Presencial',
    fechaInicio: course.startDate,
    fechaFin: course.endDate,
    horario: null,
    dirigidoA: null,
    cupoMaximo: 20,
    cuposOcupados: 0,
    costo: '100.00',
    urlImagenPortada: null,
    activo: true,
  };
  const compra = {
    idCompra: 1,
    folioCompra: 'TEST-1',
    usuarioId: 1,
    cursoId: 1,
    tituloCurso: course.title,
    cantidadCupos: 1,
    precioUnitario: '100.00',
    subtotal: '100.00',
    descuento: '0.00',
    total: '100.00',
    estado: purchase.status,
    fechaCompra: purchase.purchaseDate,
    fechaLimitePago: purchase.paymentDeadline,
    observaciones: null,
  };
  const fetch: typeof globalThis.fetch = async (input, options = {}) => {
    if (state.offline) {
      throw new TypeError('Offline fixture');
    }
    const path = new URL(String(input)).pathname;
    const method = options.method ?? 'GET';
    calls.push({ method, path });
    const body = options.body ? JSON.parse(String(options.body)) : {};
    if (path === '/api/auth/send-otp') {
      return json(200, {
        success: true,
        message: 'Código ficticio enviado',
        email: body.email,
        emailEnviado: true,
      });
    }
    if (path === '/api/auth/register') {
      state.registered = true;
      return json(201, {
        mensaje: 'Cuenta ficticia creada',
        usuario: { ...state.profile, rolId: 1, activo: true },
      });
    }
    if (path === '/api/auth/mobile/login') {
      if (!state.active) {
        return json(403, { message: 'Cuenta inactiva' });
      }
      if (!state.registered || body.contrasena !== fixturePassword) {
        return json(401, { message: 'Credenciales incorrectas' });
      }
      accessToken = 'journey-access-' + ++serial;
      refreshToken = 'journey-refresh-' + serial;
      return json(200, {
        message: 'Acceso ficticio',
        usuario: user(),
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: 900,
        refreshExpiresIn: 10000,
      });
    }
    if (path === '/api/auth/mobile/refresh') {
      if (
        !state.active ||
        body.refreshToken !== refreshToken ||
        !refreshToken
      ) {
        return json(401, { message: 'Sesión revocada' });
      }
      accessToken = 'journey-renewed-' + ++serial;
      return json(200, { accessToken, tokenType: 'Bearer', expiresIn: 900 });
    }
    if (path === '/api/cursos') {
      return json(200, [courseDto]);
    }
    if (path === '/api/cursos/1') {
      return json(200, courseDto);
    }
    if (
      !state.active ||
      !accessToken ||
      new Headers(options.headers).get('Authorization') !==
        'Bearer ' + accessToken
    ) {
      return json(401, { message: 'No autenticado' });
    }
    if (path === '/api/auth/check-session') {
      return json(200, { ok: true, usuario: user() });
    }
    if (path === '/api/auth/mobile/logout') {
      accessToken = '';
      refreshToken = '';
      return json(200, { message: 'Revocada' });
    }
    if (path === '/api/profile') {
      if (method === 'PUT') {
        Object.assign(state.profile, body);
      }
      return json(200, { profile: state.profile });
    }
    if (path === '/api/account' && method === 'DELETE') {
      if (state.deletionStatus !== 202) {
        return json(state.deletionStatus, { message: 'No aceptada' });
      }
      if (
        Object.keys(body).length !== 2 ||
        body.confirmacion !== true ||
        body.contrasena !== fixturePassword
      ) {
        return json(403, { message: 'Contraseña actual incorrecta' });
      }
      return json(202, {
        message: 'Solicitud en proceso',
        solicitudId: 17,
        estado: 'pendiente',
        eliminacionCompletada: state.malformedReceipt,
      });
    }
    if (path === '/api/compras-cursos') {
      return method === 'POST'
        ? json(201, { compra, participantes: [] })
        : json(200, { compras: [compra], total: 1 });
    }
    if (path === '/api/compras-cursos/1') {
      return json(200, {
        compra,
        participantes: [],
        metodosPago: [],
        pagos: [],
        resumenPago: {
          totalCompra: '100.00',
          totalReportado: '0.00',
          saldoPendiente: '100.00',
          pagoCompletoReportado: false,
        },
      });
    }
    if (path === '/api/cliente/mis-cursos') {
      return json(200, {
        success: true,
        resumen: {
          totalInscripciones: state.enrolled ? 1 : 0,
          cursosProximos: 0,
          cursosEnCurso: state.enrolled ? 1 : 0,
          cursosFinalizados: 0,
          cursosCompletados: 0,
        },
        cursos: state.enrolled ? [{ ...myCourseDto, proximaSesion: null }] : [],
      });
    }
    if (path === '/api/cliente/mis-cursos/7' && state.enrolled) {
      return json(200, { success: true, curso: myCourseDto });
    }
    return json(404, { message: 'Ruta o recurso ficticio no disponible' });
  };
  return { state, calls, fetch };
}
