export default interface OrganizationType {
    fullName: string
    serviceName: string
    legalAddress: string
    postalAddress: string
    directorName: string
    directorPosition: string
    accountantName: string
    taxId: string
    taxCode: string
    registrationNumber: string
    phone: string
    email: string
    website: string
    contactPerson: {
      lastName: string
      firstName: string
      middleName: string
      phone: string
      email: string
    }
  }
  
  