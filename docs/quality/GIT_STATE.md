# Estado de Git tras la corrección de identidad visual

Fecha: 2026-10-18. Rama: `fix/A17-sesion-movil`. Sin commit, push, merge, staging ni cambio de rama.

43 archivos rastreados modificados, 42 sin seguimiento, 85 acumulados; 0 staged. Se conservan los avances previos. `git diff --stat` excluye los archivos nuevos, enumerados individualmente abajo. `git diff --check`: código 0, sin errores; advertencias LF→CRLF.

## git status --short

```text
 M README.md
 M __tests__/repositories/AuthRepositoryImpl.test.ts
 M __tests__/services/httpClient.test.ts
 M docs/architecture/MVVM.md
 M jest.config.js
 M src/components/auth/FormField.tsx
 M src/components/auth/PasswordField.styles.ts
 M src/components/auth/PasswordField.tsx
 M src/components/common/PrimaryButton.styles.ts
 M src/components/common/PrimaryButton.tsx
 M src/config/dependencies.ts
 M src/mappers/profileMapper.ts
 M src/mappers/userMapper.ts
 M src/navigation/AuthenticatedNavigator.tsx
 M src/navigation/PublicNavigator.tsx
 M src/navigation/RootNavigator.tsx
 M src/navigation/types.ts
 M src/repositories/implementations/AuthRepositoryImpl.ts
 M src/repositories/implementations/MyCoursesRepositoryImpl.ts
 M src/repositories/implementations/PurchaseRepositoryImpl.ts
 M src/screens/account/AccountScreen.styles.ts
 M src/screens/account/AccountScreen.tsx
 M src/screens/account/PersonalDataScreen.tsx
 M src/screens/catalog/CatalogScreen.tsx
 M src/screens/home/HomeScreen.tsx
 M src/screens/purchases/CreatePurchaseScreen.tsx
 M src/screens/purchases/PurchaseDetailScreen.tsx
 M src/services/contracts/AuthService.ts
 M src/services/http/httpClient.ts
 M src/services/implementations/authService.ts
 M src/services/implementations/courseService.ts
 M src/services/implementations/myCourseService.ts
 M src/services/implementations/profileService.ts
 M src/services/implementations/purchaseService.ts
 M src/services/security/tokenStorage.ts
 M src/session/SessionContext.tsx
 M src/viewmodels/account/useProfileViewModel.ts
 M src/viewmodels/auth/useLoginViewModel.ts
 M src/viewmodels/auth/useRegisterViewModel.ts
 M src/viewmodels/catalog/useCatalogViewModel.ts
 M src/viewmodels/catalog/useCourseDetailViewModel.ts
 M src/viewmodels/purchases/usePurchaseDetailViewModel.ts
 M src/viewmodels/purchases/usePurchaseViewModel.ts
?? __tests__/academic/
?? __tests__/account/
?? __tests__/helpers/
?? __tests__/navigation/
?? __tests__/product/
?? __tests__/quality/
?? __tests__/services/CoursePurchaseContracts.test.ts
?? __tests__/session/
?? __tests__/viewmodels/AuthConcurrency.test.tsx
?? __tests__/viewmodels/Catalog.test.tsx
?? __tests__/viewmodels/Purchases.test.tsx
?? docs/quality/
?? src/components/account/
?? src/mappers/accountMapper.ts
?? src/models/AccountDeletion.ts
?? src/models/LogoutError.ts
?? src/models/purchaseValidation.ts
?? src/repositories/contracts/AccountRepository.ts
?? src/repositories/implementations/AccountRepositoryImpl.ts
?? src/screens/account/AccountDeletionScreen.styles.ts
?? src/screens/account/AccountDeletionScreen.tsx
?? src/screens/account/LegalInformationScreen.styles.ts
?? src/screens/account/LegalInformationScreen.tsx
?? src/services/contracts/AccountService.ts
?? src/services/dto/AccountDto.ts
?? src/services/implementations/accountService.ts
?? src/services/security/sessionEvents.ts
?? src/viewmodels/account/useAccountDeletionViewModel.ts
?? src/viewmodels/catalog/catalogFilters.ts
```

## git diff --stat

```text
 README.md                                          |   9 +
 __tests__/repositories/AuthRepositoryImpl.test.ts  |  19 +-
 __tests__/services/httpClient.test.ts              |  25 +-
 docs/architecture/MVVM.md                          |   8 +-
 jest.config.js                                     |   1 +
 src/components/auth/FormField.tsx                  |   3 +-
 src/components/auth/PasswordField.styles.ts        |  17 +-
 src/components/auth/PasswordField.tsx              |  65 +++-
 src/components/common/PrimaryButton.styles.ts      |  15 +-
 src/components/common/PrimaryButton.tsx            |  75 ++---
 src/config/dependencies.ts                         |   4 +
 src/mappers/profileMapper.ts                       |   8 +
 src/mappers/userMapper.ts                          |  10 +-
 src/navigation/AuthenticatedNavigator.tsx          |   5 +
 src/navigation/PublicNavigator.tsx                 |   4 +-
 src/navigation/RootNavigator.tsx                   |   5 +-
 src/navigation/types.ts                            |   3 +
 .../implementations/AuthRepositoryImpl.ts          |  85 ++++-
 .../implementations/MyCoursesRepositoryImpl.ts     |   3 +
 .../implementations/PurchaseRepositoryImpl.ts      |  12 +
 src/screens/account/AccountScreen.styles.ts        | 176 +++-------
 src/screens/account/AccountScreen.tsx              | 365 ++++++---------------
 src/screens/account/PersonalDataScreen.tsx         |   7 +-
 src/screens/catalog/CatalogScreen.tsx              |  70 +---
 src/screens/home/HomeScreen.tsx                    |   5 +-
 src/screens/purchases/CreatePurchaseScreen.tsx     | 117 +------
 src/screens/purchases/PurchaseDetailScreen.tsx     |  39 +--
 src/services/contracts/AuthService.ts              |   4 +-
 src/services/http/httpClient.ts                    | 130 +++++++-
 src/services/implementations/authService.ts        |  14 +-
 src/services/implementations/courseService.ts      |   9 +-
 src/services/implementations/myCourseService.ts    |   2 +
 src/services/implementations/profileService.ts     |   2 +
 src/services/implementations/purchaseService.ts    |   8 +
 src/services/security/tokenStorage.ts              | 169 +++++++---
 src/session/SessionContext.tsx                     |  78 ++++-
 src/viewmodels/account/useProfileViewModel.ts      |  11 +-
 src/viewmodels/auth/useLoginViewModel.ts           |   9 +-
 src/viewmodels/auth/useRegisterViewModel.ts        |  14 +-
 src/viewmodels/catalog/useCatalogViewModel.ts      |  18 +-
 src/viewmodels/catalog/useCourseDetailViewModel.ts |  23 +-
 .../purchases/usePurchaseDetailViewModel.ts        |  50 +--
 src/viewmodels/purchases/usePurchaseViewModel.ts   |  73 +----
 43 files changed, 873 insertions(+), 896 deletions(-)
```

## Archivos sin seguimiento

```text
__tests__/academic/MyCourses.test.tsx
__tests__/account/AccountDeletion.test.tsx
__tests__/account/InstitutionalScreens.test.tsx
__tests__/account/Profile.test.tsx
__tests__/helpers/fixtures.ts
__tests__/helpers/isolatedBackend.ts
__tests__/helpers/renderHook.tsx
__tests__/navigation/AccountNavigation.test.tsx
__tests__/product/ProductJourneys.test.tsx
__tests__/quality/ReviewValidation.test.ts
__tests__/services/CoursePurchaseContracts.test.ts
__tests__/session/logout.test.tsx
__tests__/viewmodels/AuthConcurrency.test.tsx
__tests__/viewmodels/Catalog.test.tsx
__tests__/viewmodels/Purchases.test.tsx
docs/quality/BACKEND_CONTRACTS.md
docs/quality/COMPLIANCE_MATRIX.md
docs/quality/GIT_STATE.md
docs/quality/IMPLEMENTATION_REPORT.md
docs/quality/INSTITUTIONAL_REDESIGN.md
docs/quality/INTEGRAL_VALIDATION.md
docs/quality/SAFE_INTEGRATION.md
docs/quality/TEST_MATRIX.md
docs/quality/VISUAL_IDENTITY_CORRECTION.md
src/components/account/AccountPresentation.styles.ts
src/components/account/AccountPresentation.tsx
src/mappers/accountMapper.ts
src/models/AccountDeletion.ts
src/models/LogoutError.ts
src/models/purchaseValidation.ts
src/repositories/contracts/AccountRepository.ts
src/repositories/implementations/AccountRepositoryImpl.ts
src/screens/account/AccountDeletionScreen.styles.ts
src/screens/account/AccountDeletionScreen.tsx
src/screens/account/LegalInformationScreen.styles.ts
src/screens/account/LegalInformationScreen.tsx
src/services/contracts/AccountService.ts
src/services/dto/AccountDto.ts
src/services/implementations/accountService.ts
src/services/security/sessionEvents.ts
src/viewmodels/account/useAccountDeletionViewModel.ts
src/viewmodels/catalog/catalogFilters.ts
```

Informe: [VISUAL_IDENTITY_CORRECTION.md](VISUAL_IDENTITY_CORRECTION.md). Las capturas de informes anteriores son históricas.
