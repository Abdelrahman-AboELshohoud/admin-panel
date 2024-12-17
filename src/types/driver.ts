export default interface DriverType {
  id: number;
  city: string;
  rating: string;
  employmentType: string;
  personalInfo: {
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    phone: string;
    email: string;
  };
  bankInfo: {
    cardNumber: string;
    walletNumber: string;
    supportTerminalPayment: boolean;
  };
  documents: {
    passport: {
      series: string;
      number: string;
      issuedBy: string;
      addressRegistration: string;
      actualAddress: string;
    };
    driversLicense: {
      series: string;
      number: string;
      category: string;
      startDate: string;
    };
    snils: string;
    inn: string;
    ogrnip: string;
    medicalCertificate: string;
  };
  comment: string;
  partner: string;
  isBlocked: boolean;
  idCards: string[];
}
