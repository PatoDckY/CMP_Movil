import {
  validatePurchase,
  isValidAmount,
} from '../../src/models/purchaseValidation';
import { mapUserDtoToModel } from '../../src/mappers/userMapper';
import { mapProfileDtoToModel } from '../../src/mappers/profileMapper';
import { UserDto } from '../../src/services/dto/UserDto';
import { ProfileDto } from '../../src/services/dto/ProfileDto';
import { CreatePurchaseInput } from '../../src/models/Purchase';
import { purchaseInput } from '../helpers/fixtures';

const participant = {
  firstName: 'Cliente',
  paternalLastName: 'Prueba',
  maternalLastName: null,
  birthDate: null,
  gender: null,
  phone: null,
  email: null,
};
describe('PU/PS - datos inválidos y reglas compartidas verificadas contra backend', () => {
  test('el contrato permite datos opcionales nulos del participante', () => {
    expect(
      validatePurchase({ ...purchaseInput, participants: [{ participant }] }),
    ).toBeNull();
  });
  test('un participante menor de edad es válido: la regla de 18 años es solo de la cuenta (#146)', () => {
    const year = new Date().getUTCFullYear() - 5;
    expect(
      validatePurchase({
        ...purchaseInput,
        participants: [
          { participant: { ...participant, birthDate: year + '-01-15' } },
        ],
      }),
    ).toBeNull();
  });
  test.each([
    { firstName: 'a'.repeat(101) },
    { paternalLastName: '' },
    { maternalLastName: 'a'.repeat(101) },
    { email: 'correo-invalido' },
    { phone: '1'.repeat(21) },
    { birthDate: '2026-02-30' },
    { birthDate: '2999-01-01' },
    { gender: 'valor-no-permitido' },
  ])('rechaza participante inválido %j', fields => {
    const input = {
      ...purchaseInput,
      participants: [{ participant: { ...participant, ...fields } }],
    } as CreatePurchaseInput;
    expect(validatePurchase(input)?.participantIndex).toBe(0);
  });
  test('no acepta simultáneamente participanteId y participante nuevo', () => {
    expect(
      validatePurchase({
        ...purchaseInput,
        participants: [{ participantId: 5, participant }],
      }),
    ).not.toBeNull();
  });
  test.each(['9007199254740993', '1e2', 'NaN', '-1', '0.001'])(
    'dinero inválido %s se rechaza igual en vista y ViewModel',
    value => {
      expect(isValidAmount(value, '100.00')).toBe(false);
    },
  );
  test.each([
    null,
    { id: 0 },
    {
      id: 1,
      nombre: 'Fixture',
      nombreCompleto: 'Fixture',
      correo: 'fixture@example.com',
      rol: undefined,
    },
  ])('no construye una identidad autenticada desde datos incompletos', dto => {
    expect(() => mapUserDtoToModel(dto as unknown as UserDto)).toThrow(
      'identidad',
    );
  });
  test.each([null, { id: 1 }, { id: '1' }])(
    'no presenta un perfil incompatible como válido',
    dto => {
      expect(() => mapProfileDtoToModel(dto as unknown as ProfileDto)).toThrow(
        'perfil',
      );
    },
  );
});
