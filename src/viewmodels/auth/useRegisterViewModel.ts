import {
    useCallback,
    useMemo,
    useState,
} from 'react';

import { AuthRepository } from '../../repositories/contracts/AuthRepository';

export type RegisterState =
    | 'idle'
    | 'sending_otp'
    | 'otp_sent'
    | 'registering'
    | 'success'
    | 'error';

type Gender =
    | 'masculino'
    | 'femenino'
    | 'otro'
    | '';

export function useRegisterViewModel(
    repository: AuthRepository,
) {
    const [firstName, setFirstName] =
        useState('');

    const [
        paternalLastName,
        setPaternalLastName,
    ] = useState('');

    const [
        maternalLastName,
        setMaternalLastName,
    ] = useState('');

    const [age, setAge] =
        useState('');

    const [sex, setSex] =
        useState<Gender>('');

    const [email, setEmail] =
        useState('');

    const [phone, setPhone] =
        useState('');

    const [password, setPassword] =
        useState('');

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState('');

    const [
        verificationCode,
        setVerificationCode,
    ] = useState('');

    const [
        acceptTerms,
        setAcceptTerms,
    ] = useState(false);

    const [state, setState] =
        useState<RegisterState>('idle');

    const [error, setError] =
        useState<string | null>(null);

    const [message, setMessage] =
        useState<string | null>(null);

    const [hasOtpBeenSent, setHasOtpBeenSent,]
        = useState(false);

    const normalizedEmail =
        useMemo(
            () =>
                email
                    .trim()
                    .toLowerCase(),
            [email],
        );

    const passwordChecks =
        useMemo(
            () => ({
                length:
                    password.length >= 8,
                uppercase:
                    /[A-Z]/.test(password),
                lowercase:
                    /[a-z]/.test(password),
                number:
                    /[0-9]/.test(password),
                special:
                    /[^A-Za-z0-9]/.test(
                        password,
                    ),
            }),
            [password],
        );

    const passwordsMatch =
        confirmPassword.length > 0 &&
        password === confirmPassword;

    const validateBasicData =
        useCallback((): boolean => {
            if (!firstName.trim()) {
                setError(
                    'Ingresa tu nombre.',
                );
                setState('error');

                return false;
            }

            if (
                !paternalLastName.trim()
            ) {
                setError(
                    'Ingresa tu apellido paterno.',
                );
                setState('error');

                return false;
            }

            const numericAge =
                Number(age);

            if (
                !age ||
                !Number.isInteger(
                    numericAge,
                ) ||
                numericAge < 1 ||
                numericAge > 120
            ) {
                setError(
                    'Ingresa una edad válida.',
                );
                setState('error');

                return false;
            }

            if (!sex) {
                setError(
                    'Selecciona tu sexo.',
                );
                setState('error');

                return false;
            }

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !emailRegex.test(
                    normalizedEmail,
                )
            ) {
                setError(
                    'Ingresa un correo electrónico válido.',
                );
                setState('error');

                return false;
            }

            if (
                phone.trim().length !== 10
            ) {
                setError(
                    'Ingresa un teléfono de 10 dígitos.',
                );
                setState('error');

                return false;
            }

            setError(null);

            return true;
        }, [
            age,
            firstName,
            normalizedEmail,
            paternalLastName,
            phone,
            sex,
        ]);

    const validatePassword =
        useCallback((): boolean => {
            const allChecksPassed =
                Object.values(
                    passwordChecks,
                ).every(Boolean);

            if (!allChecksPassed) {
                setError(
                    'La contraseña no cumple todos los requisitos de seguridad.',
                );
                setState('error');

                return false;
            }

            if (!passwordsMatch) {
                setError(
                    'Las contraseñas no coinciden.',
                );
                setState('error');

                return false;
            }

            const forbiddenSequences =
                [
                    '123',
                    '234',
                    '345',
                    '456',
                    '789',
                    'abc',
                    'qwe',
                ];

            const lowerPassword =
                password.toLowerCase();

            if (
                forbiddenSequences.some(
                    sequence =>
                        lowerPassword.includes(
                            sequence,
                        ),
                )
            ) {
                setError(
                    'La contraseña contiene una secuencia no permitida.',
                );
                setState('error');

                return false;
            }

            return true;
        }, [
            password,
            passwordChecks,
            passwordsMatch,
        ]);

    const sendOtp =
        useCallback(async () => {
            if (!validateBasicData()) {
                return false;
            }

            try {
                setState(
                    'sending_otp',
                );
                setError(null);
                setMessage(null);

                const result =
                    await repository.sendRegistrationOtp(
                        normalizedEmail,
                        firstName,
                    );

                if (!result.emailSent) {
                    setError(
                        result.message ||
                        'No fue posible enviar el código al correo.',
                    );

                    setState('error');

                    return false;
                }

                setHasOtpBeenSent(true);
                setMessage(result.message);
                setState('otp_sent');

                return true;
            } catch (sendError) {
                setError(
                    sendError instanceof Error
                        ? sendError.message
                        : 'No fue posible enviar el código de verificación.',
                );

                setState('error');

                return false;
            }
        }, [
            firstName,
            normalizedEmail,
            repository,
            validateBasicData,
        ]);

    const register =
        useCallback(async () => {
            if (!validateBasicData()) {
                return false;
            }

            if (!validatePassword()) {
                return false;
            }

            if (
                !verificationCode.trim()
            ) {
                setError(
                    'Ingresa el código de verificación enviado a tu correo.',
                );
                setState('error');

                return false;
            }

            if (!acceptTerms) {
                setError(
                    'Debes aceptar los términos y condiciones.',
                );
                setState('error');

                return false;
            }

            try {
                setState(
                    'registering',
                );
                setError(null);
                setMessage(null);

                await repository.register({
                    firstName:
                        firstName.trim(),
                    paternalLastName:
                        paternalLastName.trim(),
                    maternalLastName:
                        maternalLastName.trim()
                            ? maternalLastName.trim()
                            : null,
                    age: Number(age),
                    sex,
                    phone: phone.trim(),
                    email: normalizedEmail,
                    password,
                    verificationCode:
                        verificationCode.trim(),
                });

                setMessage(
                    'Tu cuenta fue creada correctamente.',
                );
                setState('success');

                return true;
            } catch (registerError) {
                setError(
                    registerError instanceof Error
                        ? registerError.message
                        : 'No fue posible crear la cuenta.',
                );

                setState('error');

                return false;
            }
        }, [
            acceptTerms,
            age,
            firstName,
            maternalLastName,
            normalizedEmail,
            password,
            paternalLastName,
            phone,
            repository,
            sex,
            validateBasicData,
            validatePassword,
            verificationCode,
        ]);

    const resetError =
        useCallback(() => {
            setError(null);

            if (state === 'error') {
                setState('idle');
            }
        }, [state]);

    return {
        firstName,
        paternalLastName,
        maternalLastName,
        age,
        sex,
        email,
        phone,
        password,
        confirmPassword,
        verificationCode,
        acceptTerms,

        state,
        error,
        message,

        passwordChecks,
        passwordsMatch,

        setFirstName,
        setPaternalLastName,
        setMaternalLastName,
        setAge,
        setSex,
        setEmail,
        setPhone,
        setPassword,
        setConfirmPassword,
        setVerificationCode,
        setAcceptTerms,

        sendOtp,
        register,
        resetError,

        isSendingOtp:
            state === 'sending_otp',

        isRegistering:
            state === 'registering',

        otpSent: hasOtpBeenSent,
    };
}