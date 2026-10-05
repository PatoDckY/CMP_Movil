export type CourseFlowParamList = {
  Catalog: undefined;

  CourseDetail: {
    courseId: number;
  };
};

export type PublicStackParamList =
  CourseFlowParamList & {
    Home: undefined;
    Login: undefined;
    Register: undefined;
  };

export type AuthenticatedStackParamList =
  CourseFlowParamList & {
    Home: undefined;
    MyCourses: undefined;
    PurchaseHistory: undefined;

    PurchaseDetail: {
      purchaseId: number;
    };

    Account: undefined;
  };