export class LogoutError extends Error {
  constructor(public readonly phase: 'local' | 'remote') {
    super(
      phase === 'local'
        ? 'El acceso quedó bloqueado, pero no se pudieron eliminar las credenciales del dispositivo. La limpieza local no se completó; intenta cerrar sesión nuevamente.'
        : 'La sesión local se cerró y sus credenciales fueron eliminadas, pero no se pudo confirmar la revocación en el servidor.',
    );
    this.name = 'LogoutError';
  }
}
