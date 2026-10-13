
import React, {
    useEffect,
} from 'react';

import {
    ActivityIndicator,
    Alert,
    Pressable,
    Text,
    View,
} from 'react-native';

import {
    KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';

import {
    FormField,
} from '../../components/auth/FormField';

import {
    PrimaryButton,
} from '../../components/common/PrimaryButton';

import {
    profileRepository,
} from '../../config/dependencies';

import {
    useSession,
} from '../../session/SessionContext';

import {
    colors,
} from '../../theme/colors';

import {
    useProfileViewModel,
} from '../../viewmodels/account/useProfileViewModel';

import {
    styles,
} from './PersonalDataScreen.styles';

const SEX_OPTIONS = [
    {
        label: 'Masculino',
        value: 'masculino',
    },
    {
        label: 'Femenino',
        value: 'femenino',
    },
    {
        label: 'Otro',
        value: 'otro',
    },
] as const;

/**
 * A17 - Derechos ARCO:
 *
 * Acceso: mostrar datos personales.
 * Rectificación: editar y guardar
 * información del perfil.
 */
export function PersonalDataScreen():
    React.JSX.Element {
    const {
        restoreSession,
    } = useSession();

    const {
        profile,
        form,
        status,
        error,
        isLoading,
        isSaving,
        updateField,
        loadProfile,
        saveProfile,
    } = useProfileViewModel(
        profileRepository,
    );

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleSave = async () => {
        const success =
            await saveProfile();

        if (!success) {
            return;
        }

        // Actualiza el nombre que aparece
        // en la pantalla Mi cuenta.
        await restoreSession();

        Alert.alert(
            'Datos actualizados',
            'Tu información personal se guardó correctamente.',
        );
    };

    if (isLoading && !profile) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator
                    size="large"
                    color={colors.primary}
                />

                <Text style={styles.loadingText}>
                    Consultando tus datos personales...
                </Text>
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorTitle}>
                    No pudimos cargar tus datos
                </Text>

                <Text style={styles.errorDescription}>
                    {error ??
                        'Verifica tu conexión e intenta nuevamente.'}
                </Text>

                <View style={styles.retryContainer}>
                    <PrimaryButton
                        label="Reintentar"
                        onPress={() => {
                            void loadProfile();
                        }}
                    />
                </View>
            </View>
        );
    }

    return (
        <KeyboardAwareScrollView
            style={styles.screen}
            contentContainerStyle={
                styles.container
            }
            bottomOffset={32}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={
                false
            }>
            <View style={styles.header}>
                <Text style={styles.eyebrow}>
                    PRIVACIDAD Y DATOS PERSONALES
                </Text>

                <Text style={styles.title}>
                    Mis datos personales
                </Text>

                <Text style={styles.description}>
                    Consulta la información
                    asociada a tu cuenta y corrige
                    los datos que necesites actualizar.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>
                    Derecho de acceso
                </Text>

                <Text style={styles.sectionDescription}>
                    Esta información pertenece a
                    tu cuenta autenticada.
                </Text>

                <Text style={styles.readonlyLabel}>
                    Correo electrónico
                </Text>

                <View style={styles.readonlyBox}>
                    <Text style={styles.readonlyText}>
                        {profile.email}
                    </Text>
                </View>

                <Text style={styles.helper}>
                    Por seguridad, el cambio de
                    correo requerirá un proceso
                    de verificación independiente.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>
                    Derecho de rectificación
                </Text>

                <Text style={styles.sectionDescription}>
                    Modifica los campos necesarios
                    y presiona Guardar cambios.
                </Text>

                <FormField
                    label="Nombre"
                    value={form.firstName}
                    onChangeText={value =>
                        updateField(
                            'firstName',
                            value,
                        )
                    }
                    autoCapitalize="words"
                    maxLength={100}
                    editable={!isSaving}
                />

                <FormField
                    label="Apellido paterno"
                    value={form.paternalLastName}
                    onChangeText={value =>
                        updateField(
                            'paternalLastName',
                            value,
                        )
                    }
                    autoCapitalize="words"
                    maxLength={100}
                    editable={!isSaving}
                />

                <FormField
                    label="Apellido materno (opcional)"
                    value={form.maternalLastName}
                    onChangeText={value =>
                        updateField(
                            'maternalLastName',
                            value,
                        )
                    }
                    autoCapitalize="words"
                    maxLength={100}
                    editable={!isSaving}
                />

                <FormField
                    label="Edad"
                    value={form.age}
                    onChangeText={value =>
                        updateField(
                            'age',
                            value
                                .replace(/\D/g, '')
                                .slice(0, 3),
                        )
                    }
                    keyboardType="number-pad"
                    maxLength={3}
                    editable={!isSaving}
                />

                <Text style={styles.fieldLabel}>
                    Sexo
                </Text>

                <View style={styles.sexOptions}>
                    {SEX_OPTIONS.map(option => {
                        const selected =
                            form.sex === option.value;

                        return (
                            <Pressable
                                key={option.value}
                                accessibilityRole="radio"
                                accessibilityState={{
                                    selected,
                                }}
                                onPress={() =>
                                    updateField(
                                        'sex',
                                        option.value,
                                    )
                                }
                                disabled={isSaving}
                                style={[
                                    styles.sexOption,
                                    selected &&
                                    styles.sexOptionSelected,
                                ]}>
                                <Text
                                    style={[
                                        styles.sexOptionText,
                                        selected &&
                                        styles.sexOptionTextSelected,
                                    ]}>
                                    {option.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <FormField
                    label="Teléfono"
                    value={form.phone}
                    onChangeText={value =>
                        updateField(
                            'phone',
                            value
                                .replace(/\D/g, '')
                                .slice(0, 10),
                        )
                    }
                    keyboardType="phone-pad"
                    maxLength={10}
                    editable={!isSaving}
                />

                {error ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>
                            {error}
                        </Text>
                    </View>
                ) : null}

                <View style={styles.saveContainer}>
                    <PrimaryButton
                        label={
                            isSaving
                                ? 'Guardando cambios...'
                                : 'Guardar cambios'
                        }
                        onPress={() => {
                            handleSave();
                        }}
                        disabled={
                            isSaving ||
                            isLoading ||
                            status === 'error'
                        }
                    />
                </View>
            </View>

            <View style={styles.notice}>
                <Text style={styles.noticeTitle}>
                    Tus datos están protegidos
                </Text>

                <Text style={styles.noticeText}>
                    Los cambios se envían a
                    CMP_Site mediante una
                    conexión autenticada. Solo
                    puedes modificar la
                    información de tu propia
                    cuenta.
                </Text>
            </View>
        </KeyboardAwareScrollView>
    );
}
