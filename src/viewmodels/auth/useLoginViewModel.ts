import { useCallback, useState } from 'react';

import {
    LoginResult,
    User,
} from '../../models/User';
import { AuthRepository } from '../../repositories/contracts/AuthRepository';

export type LoginState =
    | 'idle'
    | 'loading'
    | 'authenticated'
    | 'mfa_required'
    | 'error';

export function useLoginViewModel(
    repository: AuthRepository,
) {
    const [email, setEmail] = useState('');
    const [password, setPassword] =
        useState('');

    const [state, setState] =
        useState<LoginState>('idle');

    const [error, setError] =
        useState<string | null>(null);

    const [user, setUser] =
        useState<User | null>(null);

    const [mfaEmail, setMfaEmail] =
        useState<string | null>(null);

    const validate = useCallback((): boolean => {
        const normalizedEmail =
            email.trim();

        if (!normalizedEmail) {
            setError(
                'Ingresa tu correo electrónico.',
            );
            setState('error');

            return false;
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailRegex.test(normalizedEmail)
        ) {
            setError(
                'Ingresa un correo electrónico válido.',
            );
            setState('error');

            return false;
        }

        if (!password) {
            setError(
                'Ingresa tu contraseña.',
            );
            setState('error');

            return false;
        }

        setError(null);

        return true;
    }, [email, password]);

    const login =
        useCallback(async (): Promise<LoginResult | null> => {
            if (!validate()) {
                return null;
            }

            try {
                setState('loading');
                setError(null);
                setMfaEmail(null);

                const result =
                    await repository.login(
                        email,
                        password,
                    );

                if (
                    result.status ===
                    'authenticated'
                ) {
                    setUser(result.user);
                    setState('authenticated');

                    return result;
                }

                setMfaEmail(result.email);
                setState('mfa_required');

                return result;
            } catch (loginError) {
                setUser(null);

                setError(
                    loginError instanceof Error
                        ? loginError.message
                        : 'No fue posible iniciar sesión.',
                );

                setState('error');

                return null;
            }
        }, [
            email,
            password,
            repository,
            validate,
        ]);

    const resetError = useCallback(() => {
        setError(null);

        if (state === 'error') {
            setState('idle');
        }
    }, [state]);

    return {
        email,
        password,
        state,
        error,
        user,
        mfaEmail,

        setEmail,
        setPassword,

        login,
        resetError,

        isLoading:
            state === 'loading',
    };
}