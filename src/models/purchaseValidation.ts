import { CreatePurchaseInput } from './Purchase';

export interface PurchaseValidationIssue {
  message: string;
  participantIndex?: number;
}

export function isValidBirthDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const today = new Date();
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    date.getTime() <=
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );
}

export function validatePurchase(
  data: CreatePurchaseInput,
): PurchaseValidationIssue | null {
  if (!Number.isSafeInteger(data.courseId) || data.courseId <= 0) {
    return { message: 'Selecciona un curso válido.' };
  }
  if (
    !Number.isSafeInteger(data.quantity) ||
    data.quantity < 1 ||
    data.quantity > 20
  ) {
    return { message: 'La cantidad de cupos debe estar entre 1 y 20.' };
  }
  if (
    !Array.isArray(data.participants) ||
    data.participants.length !== data.quantity
  ) {
    return { message: 'Debe existir un participante por cada cupo.' };
  }
  const ids = new Set<number>();
  for (let index = 0; index < data.participants.length; index++) {
    const item = data.participants[index];
    const fail = (message: string): PurchaseValidationIssue => ({
      message,
      participantIndex: index,
    });
    if (
      !item ||
      typeof item !== 'object' ||
      'participantId' in item === 'participant' in item
    ) {
      return fail(
        'Selecciona un participante existente o captura uno nuevo, pero no ambos.',
      );
    }
    if ('participantId' in item) {
      if (
        !Number.isSafeInteger(item.participantId) ||
        item.participantId <= 0 ||
        ids.has(item.participantId)
      ) {
        return fail(
          'El identificador del participante no es válido o está repetido.',
        );
      }
      ids.add(item.participantId);
      continue;
    }
    const p = item.participant;
    if (
      !p ||
      typeof p.firstName !== 'string' ||
      !p.firstName.trim() ||
      p.firstName.trim().length > 100 ||
      typeof p.paternalLastName !== 'string' ||
      !p.paternalLastName.trim() ||
      p.paternalLastName.trim().length > 100
    ) {
      return fail(
        `Completa el nombre y apellido paterno del participante ${
          index + 1
        } (máximo 100 caracteres).`,
      );
    }
    if (
      p.maternalLastName !== null &&
      (typeof p.maternalLastName !== 'string' ||
        p.maternalLastName.trim().length > 100)
    ) {
      return fail('El apellido materno debe tener máximo 100 caracteres.');
    }
    if (
      p.birthDate !== null &&
      (typeof p.birthDate !== 'string' || !isValidBirthDate(p.birthDate))
    ) {
      return fail(
        'La fecha de nacimiento debe ser válida y no estar en el futuro.',
      );
    }
    if (
      p.gender !== null &&
      !['Masculino', 'Femenino', 'Otro', 'Prefiere no indicar'].includes(
        p.gender,
      )
    ) {
      return fail('El sexo seleccionado no es válido.');
    }
    if (
      p.phone !== null &&
      (typeof p.phone !== 'string' || p.phone.trim().length > 20)
    ) {
      return fail('El teléfono debe tener máximo 20 caracteres.');
    }
    if (
      p.email !== null &&
      (typeof p.email !== 'string' ||
        p.email.trim().length > 150 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim()))
    ) {
      return fail(
        'El correo del participante debe ser válido y tener máximo 150 caracteres.',
      );
    }
  }
  if (
    data.userNotes !== null &&
    (typeof data.userNotes !== 'string' || data.userNotes.trim().length > 1000)
  ) {
    return {
      message: 'Las observaciones no deben superar los 1000 caracteres.',
    };
  }
  return null;
}

export function amountToCents(value: string): number | null {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(value.trim());
  if (!match) {
    return null;
  }
  const total =
    Number(match[1]) * 100 + Number((match[2] ?? '').padEnd(2, '0'));
  return Number.isSafeInteger(total) && total >= 0 ? total : null;
}
export function isValidAmount(value: string, pendingBalance: string): boolean {
  const amount = amountToCents(value);
  const balance = amountToCents(pendingBalance);
  return amount !== null && balance !== null && amount > 0 && amount <= balance;
}
export function isValidPaymentDate(value: string | Date): boolean {
  const timestamp = value instanceof Date ? value.getTime() : Date.parse(value);
  return Number.isFinite(timestamp) && timestamp <= Date.now() + 5 * 60 * 1000;
}
