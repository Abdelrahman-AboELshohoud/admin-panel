import { gql } from "@apollo/client";
import client from "./apolloClient";

const LOGIN_MUTATION = gql`
  query Login($userName: String!, $password: String!) {
    login(userName: $userName, password: $password) {
      token
    }
  }
`;

// Example usage:
export const loginUser = async (userName: string, password: string) => {
  try {
    const response = await client.query({
      query: LOGIN_MUTATION,
      variables: {
        userName,
        password
      }
    });

    if(response.data.login.token) {
      localStorage.setItem('token', response.data.login.token);
    return {status: true, message: 'Login successful'}
    }
    return {status: false, message: 'Login failed'}
  } catch (error: any) {
    console.error('Login error:', error);
    return {status: false, message: error.message}
  }
};

const GET_ALL_RIDERS = gql`
  query GetAllRiders($filter: RiderFilter, $sorting: [RiderSort!], $paging: OffsetPaging) {
    riders(filter: $filter, sorting: $sorting, paging: $paging) {
      nodes {
        id
        firstName
        lastName
        mobileNumber
        email
        gender
        status
        registrationTimestamp
        address
        walletBalance
        orders {
          totalCount
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
`;

export const getAllRiders = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await client.query({
      query: GET_ALL_RIDERS,
      variables: {
        paging: {
          offset: (page - 1) * limit,
          limit: limit
        },
        sorting: [
          {
            field: "id",
            direction: "DESC"
          }
        ]
      },
      fetchPolicy: "network-only"
    });
    return response.data.riders;
  } catch (error) {
    console.error('Error fetching riders:', error);
    throw error;
  }
};