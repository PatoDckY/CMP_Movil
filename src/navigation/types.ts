
export type CourseFlowParamList = {
  Catalog: undefined;

  CourseDetail: {
    courseId: number;
  };
};

export type PublicStackParamList =
  CourseFlowParamList & {
    Home: undefined;
    Login: {purchaseCourseId?: number} | undefined;
    Register: {purchaseCourseId?: number} | undefined;
    PasswordRecovery: {purchaseCourseId?: number} | undefined;
    LegalInformation: undefined;
  };

export type AuthenticatedStackParamList =
  CourseFlowParamList & {
    Home: undefined;
    MyCourses: undefined;
    PurchaseHistory: undefined;
    Notifications: undefined;

    CreatePurchase: {
      courseId: number;
    };

    PurchaseDetail: {
      purchaseId: number;
    };

    MyCourseDetail: {
      enrollmentId: number;
    };

    Account: undefined;

    // A17 - Acceso y Rectificación.
    PersonalData: undefined;
    AccountDeletion: undefined;
    LegalInformation: undefined;
  };
