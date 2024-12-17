import { gql } from '@apollo/client';
import client from './apolloClient';

export const DRIVER_REQUEST = {
  query: gql`
    query Driver($id: ID!) {
      driver(id: $id) {
        id
        firstName
        lastName
        mobileNumber
        status
      }
    }
  `,
  variables: { id: '' }
};

export const DRIVERS_REQUEST = {
  query: gql`
    query Drivers($filter: DriverFilter!, $paging: OffsetPaging, $sorting: [DriverSort!]) {
      drivers(filter: $filter, paging: $paging, sorting: $sorting) {
        nodes {
          id
          firstName
          lastName
          mobileNumber
          status
        }
        totalCount
      }
    }
  `,
  variables: {
    filter: {},
    paging: { offset: 0, limit: 10 },
    sorting: []
  }
};

export const drivers = async (page: number = 1, limit: number = 10, filter = {}, sorting = []) => {
  try {
    const response = await client.query({ ...DRIVERS_REQUEST, variables: { filter, paging: { offset: (page - 1) * limit, limit }, sorting } });
    return response.data.drivers;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    throw error;
  }
};

export const DRIVER_TRANSACTIONS_REQUEST = {
  query: gql`
    query DriverTransactions($filter: DriverTransactionFilter!, $paging: OffsetPaging, $sorting: [DriverTransactionSort!]) {
      driverTransactions(filter: $filter, paging: $paging, sorting: $sorting) {
        nodes {
          id
          createdAt
          status
          amount
          currency
          driverId
        }
        totalCount
      }
    }
  `,
  variables: {
    filter: {},
    paging: { offset: 0, limit: 10 },
    sorting: []
  }
};

export const ORDERS_REQUEST = {
  query: gql`
    query Orders($filter: OrderFilter!, $paging: OffsetPaging, $sorting: [OrderSort!]) {
      orders(filter: $filter, paging: $paging, sorting: $sorting) {
        nodes {
          id
          createdOn
          status
          riderId
          driverId
        }
        totalCount
      }
    }
  `,
  variables: {
    filter: {},
    paging: { offset: 0, limit: 10 },
    sorting: []
  }
};

export const ANNOUNCEMENTS_REQUEST = {
  query: gql`
    query Announcements($filter: AnnouncementFilter!, $paging: OffsetPaging, $sorting: [AnnouncementSort!]) {
      announcements(filter: $filter, paging: $paging, sorting: $sorting) {
        nodes {
          id
          title
          description
          url
          userType
          startAt
          expireAt
        }
        totalCount
      }
    }
  `,
  variables: {
    filter: {},
    paging: { offset: 0, limit: 10 },
    sorting: []
  }
};

export const SERVICES_REQUEST = {
  query: gql`
    query Services($filter: ServiceFilter!, $sorting: [ServiceSort!]) {
      services(filter: $filter, sorting: $sorting) {
        id
        name
        description
        categoryId
        baseFare
        perHundredMeters
        perMinuteDrive
        prepayPercent
        minimumFee
        searchRadius
        maximumDestinationDistance
        paymentMethod
      }
    }
  `,
  variables: {
    filter: {},
    sorting: []
  }
};

export const REGIONS_REQUEST = {
  query: gql`
    query Regions($filter: RegionFilter!, $paging: OffsetPaging, $sorting: [RegionSort!]) {
      regions(filter: $filter, paging: $paging, sorting: $sorting) {
        nodes {
          id
          name
          currency
        }
        totalCount
      }
    }
  `,
  variables: {
    filter: {},
    paging: { offset: 0, limit: 10 },
    sorting: []
  }
};

export const PAYMENT_GATEWAYS_REQUEST = {
  query: gql`
    query PaymentGateways($filter: PaymentGatewayFilter!, $paging: OffsetPaging, $sorting: [PaymentGatewaySort!]) {
      paymentGateways(filter: $filter, paging: $paging, sorting: $sorting) {
        nodes {
          id
          title
          type
          enabled
        }
        totalCount
      }
    }
  `,
  variables: {
    filter: {},
    paging: { offset: 0, limit: 10 },
    sorting: []
  }
};

export const CAR_MODELS_REQUEST = {
  query: gql`
    query CarModels($filter: CarModelFilter!, $paging: OffsetPaging, $sorting: [CarModelSort!]) {
      carModels(filter: $filter, paging: $paging, sorting: $sorting) {
        nodes {
          id
          name
        }
        totalCount
      }
    }
  `,
  variables: {
    filter: {},
    paging: { offset: 0, limit: 10 },
    sorting: []
  }
};

export const DISTRESS_SIGNALS_REQUEST = {
  query: gql`
    query DistressSignals($paging: OffsetPaging) {
      distressSignals(paging: $paging) {
        nodes {
          id
          status
          createdAt
          location
          submittedByRider
          requestId
        }
        totalCount
      }
    }
  `,
  variables: {
    paging: { offset: 0, limit: 10 }
  }
};

export const REWARDS_REQUEST = {
  query: gql`
    query Rewards {
      rewards {
        id
        title
        startDate
        endDate
        appType
        beneficiary
        event
        creditGift
        tripFeePercentGift
        creditCurrency
      }
    }
  `,
  variables: {}
};

export const FLEETS_REQUEST = {
  query: gql`
    query Fleets($filter: FleetFilter!, $sorting: [FleetSort!]) {
      fleets(filter: $filter, sorting: $sorting) {
        id
        name
        phoneNumber
        mobileNumber
        accountNumber
        commissionSharePercent
        commissionShareFlat
        feeMultiplier
        address
      }
    }
  `,
  variables: {
    filter: {},
    sorting: []
  }
};

export const getDriver = async (id: string) => {
  try {
    const response = await client.query({
      query: DRIVER_REQUEST.query,
      variables: { id }
    });
    return response.data.driver;
  } catch (error) {
    console.error('Error fetching driver:', error);
    throw error;
  }
};

export const getDrivers = async (page: number = 1, limit: number = 10, filter = {}, sorting = []) => {
  try {
    const response = await client.query({
      query: DRIVERS_REQUEST.query,
      variables: {
        filter,
        paging: {
          offset: (page - 1) * limit,
          limit
        },
        sorting
      }
    });
    return response.data.drivers;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    throw error;
  }
};

export const getDriverTransactions = async (page: number = 1, limit: number = 10, filter = {}, sorting = []) => {
  try {
    const response = await client.query({
      query: DRIVER_TRANSACTIONS_REQUEST.query,
      variables: {
        filter,
        paging: {
          offset: (page - 1) * limit,
          limit
        },
        sorting
      }
    });
    return response.data.driverTransactions;
  } catch (error) {
    console.error('Error fetching driver transactions:', error);
    throw error;
  }
};

export const getOrders = async (page: number = 1, limit: number = 10, filter = {}, sorting = []) => {
  try {
    const response = await client.query({
      query: ORDERS_REQUEST.query,
      variables: {
        filter,
        paging: {
          offset: (page - 1) * limit,
          limit
        },
        sorting
      }
    });
    return response.data.orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getAnnouncements = async (page: number = 1, limit: number = 10, filter = {}, sorting = []) => {
  try {
    const response = await client.query({
      query: ANNOUNCEMENTS_REQUEST.query,
      variables: {
        filter,
        paging: {
          offset: (page - 1) * limit,
          limit
        },
        sorting
      }
    });
    return response.data.announcements;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};

export const getServices = async (filter = {}, sorting = []) => {
  try {
    const response = await client.query({
      query: SERVICES_REQUEST.query,
      variables: { filter, sorting }
    });
    return response.data.services;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const getRegions = async (page: number = 1, limit: number = 10, filter = {}, sorting = []) => {
  try {
    const response = await client.query({
      query: REGIONS_REQUEST.query,
      variables: {
        filter,
        paging: {
          offset: (page - 1) * limit,
          limit
        },
        sorting
      }
    });
    return response.data.regions;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

export const getPaymentGateways = async (page: number = 1, limit: number = 10, filter = {}, sorting = []) => {
  try {
    const response = await client.query({
      query: PAYMENT_GATEWAYS_REQUEST.query,
      variables: {
        filter,
        paging: {
          offset: (page - 1) * limit,
          limit
        },
        sorting
      }
    });
    return response.data.paymentGateways;
  } catch (error) {
    console.error('Error fetching payment gateways:', error);
    throw error;
  }
};

export const getCarModels = async (page: number = 1, limit: number = 10, filter = {}, sorting = []) => {
  try {
    const response = await client.query({
      query: CAR_MODELS_REQUEST.query,
      variables: {
        filter,
        paging: {
          offset: (page - 1) * limit,
          limit
        },
        sorting
      }
    });
    return response.data.carModels;
  } catch (error) {
    console.error('Error fetching car models:', error);
    throw error;
  }
};

export const getDistressSignals = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await client.query({
      query: DISTRESS_SIGNALS_REQUEST.query,
      variables: {
        paging: {
          offset: (page - 1) * limit,
          limit
        }
      }
    });
    return response.data.distressSignals;
  } catch (error) {
    console.error('Error fetching distress signals:', error);
    throw error;
  }
};

export const getRewards = async () => {
  try {
    const response = await client.query({
      query: REWARDS_REQUEST.query
    });
    return response.data.rewards;
  } catch (error) {
    console.error('Error fetching rewards:', error);
    throw error;
  }
};

export const getFleets = async (filter = {}, sorting = []) => {
  try {
    const response = await client.query({
      query: FLEETS_REQUEST.query,
      variables: { filter, sorting }
    });
    console.log(response, "ssss");
    return response.data.fleets;
  } catch (error: any) {
    console.error('Error fetching fleets:', error.message);
    throw error;
  }
};
