
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Profile,
  UpdateProfileInput,
} from '../../models/Profile';

import {
  ProfileRepository,
} from '../../repositories/contracts/ProfileRepository';

export type ProfileStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'saving'
  | 'error';

export type ProfileForm = {
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  age: string;
  sex: string;
  phone: string;
};

const EMPTY_FORM: ProfileForm = {
  firstName: '',
  paternalLastName: '',
  maternalLastName: '',
  age: '',
  sex: '',
  phone: '',
};

const VALID_SEX_VALUES = [
  'masculino',
  'femenino',
  'otro',
];

function profileToForm(
  profile: Profile,
): ProfileForm {
  return {
    firstName: profile.firstName,
    paternalLastName:
      profile.paternalLastName,
    maternalLastName:
      profile.maternalLastName ?? '',
    age: String(profile.age),
    sex: profile.sex,
    phone: profile.phone,
  };
}

function validateForm(
  form: ProfileForm,
): string | null {
  if (
    !form.firstName.trim() ||
    form.firstName.trim().length > 100
  ) {
    return 'Ingresa un nombre válido.';
  }

  if (
    !form.paternalLastName.trim() ||
    form.paternalLastName.trim().length > 100
  ) {
    return 'Ingresa un apellido paterno válido.';
  }

  if (
    form.maternalLastName.trim().length > 100
  ) {
    return 'El apellido materno es demasiado largo.';
  }

  const age = Number(form.age);

  if (
    !form.age.trim() ||
    !Number.isInteger(age) ||
    age < 1 ||
    age > 120
  ) {
    return 'Ingresa una edad válida entre 1 y 120 años.';
  }

  if (
    !VALID_SEX_VALUES.includes(form.sex)
  ) {
    return 'Selecciona una opción de sexo válida.';
  }

  if (!/^\d{10}$/.test(form.phone)) {
    return 'El teléfono debe tener 10 dígitos.';
  }

  return null;
}

/**
 * A17 - Derechos ARCO.
 *
 * ViewModel de Acceso y Rectificación.
 *
 * Administra la consulta y actualización
 * del perfil mediante ProfileRepository.
 */
export function useProfileViewModel(
  repository: ProfileRepository,
  onSaved?: (profile: Profile) => void,
) {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [form, setForm] =
    useState<ProfileForm>(EMPTY_FORM);

  const [status, setStatus] =
    useState<ProfileStatus>('idle');

  const [error, setError] =
    useState<string | null>(null);

  const mountedRef = useRef(true);
  const requestIdRef = useRef(0);
  const savingRef = useRef(false);
  const loadingRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
      loadingRef.current = false;
    };
  }, []);

  const updateField = useCallback(
    (
      field: keyof ProfileForm,
      value: string,
    ) => {
      setForm(current => ({
        ...current,
        [field]: value,
      }));

      setError(null);
    },
    [],
  );

  const loadProfile =
    useCallback(async (): Promise<void> => {
      if (loadingRef.current || savingRef.current) { return; }
      loadingRef.current = true;
      const requestId =
        ++requestIdRef.current;

      try {
        setStatus('loading');
        setError(null);

        const result =
          await repository.getProfile();

        if (
          !mountedRef.current ||
          requestId !==
            requestIdRef.current
        ) {
          return;
        }

        setProfile(result);
        setForm(
          profileToForm(result),
        );
        setStatus('ready');
      } catch (err) {
        if (
          !mountedRef.current ||
          requestId !==
            requestIdRef.current
        ) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'No fue posible consultar los datos personales.',
        );

        setStatus('error');
      } finally {
        if (requestId === requestIdRef.current) { loadingRef.current = false; }
      }
    }, [repository]);

  const saveProfile =
    useCallback(async (): Promise<boolean> => {
      if (
        savingRef.current ||
        status === 'loading' ||
        !profile
      ) {
        return false;
      }

      const validationError =
        validateForm(form);

      if (validationError) {
        setError(validationError);
        return false;
      }

      const input: UpdateProfileInput = {
        firstName:
          form.firstName.trim(),
        paternalLastName:
          form.paternalLastName.trim(),
        maternalLastName:
          form.maternalLastName.trim() ||
          null,
        age: Number(form.age),
        sex: form.sex,
        phone: form.phone.trim(),
      };

      savingRef.current = true;

      try {
        setStatus('saving');
        setError(null);

        const updated =
          await repository.updateProfile(
            input,
          );

        if (mountedRef.current) {
          onSaved?.(updated);
          setProfile(updated);
          setForm(
            profileToForm(updated),
          );
          setStatus('ready');
        }

        return mountedRef.current;
      } catch (err) {
        if (mountedRef.current) {
          setError(
            err instanceof Error
              ? err.message
              : 'No fue posible guardar los cambios.',
          );

          setStatus('ready');
        }

        return false;
      } finally {
        savingRef.current = false;
      }
    }, [
      form,
      profile,
      repository,
      onSaved,
      status,
    ]);

  return {
    profile,
    form,
    status,
    error,
    isLoading:
      status === 'loading',
    isSaving:
      status === 'saving',
    updateField,
    loadProfile,
    saveProfile,
  };
}
