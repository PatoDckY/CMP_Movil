
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
  };
