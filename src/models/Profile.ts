
/**
 * Datos personales del usuario autenticado.
 *
 * A17 - Derechos ARCO:
 * Acceso y Rectificación.
 */
export interface Profile {
  id: number;
  firstName: string;
  paternalLastName: string;
  maternalLastName: string | null;
  age: number;
  sex: string;
  phone: string;
  email: string;
}

/**
 * Campos que el usuario puede rectificar.
 *
 * El identificador y el correo no se
 * modifican mediante este formulario.
 */
export type UpdateProfileInput = Pick<
  Profile,
  | 'firstName'
  | 'paternalLastName'
  | 'maternalLastName'
  | 'age'
  | 'sex'
  | 'phone'
>;
