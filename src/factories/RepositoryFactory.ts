import {AuthRepository} from '../repositories/contracts/AuthRepository';
import {AuthRepositoryImpl} from '../repositories/implementations/AuthRepositoryImpl';
import {authService} from '../services/implementations/authService';

export class RepositoryFactory {
  static createAuthRepository():
    AuthRepository {
    return new AuthRepositoryImpl(
      authService,
    );
  }
}