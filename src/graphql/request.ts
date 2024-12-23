import client from "./apolloClient";
import {
  DocumentNode,
  TypedDocumentNode,
  useSubscription,
} from "@apollo/client";

export const handledRequest = async ({
  variables,
  gql,
  type = "query",
}: {
  variables?: any;
  gql: DocumentNode | TypedDocumentNode<any, any>;
  type: "query" | "mutation" | "subscription";
}) => {
  try {
    let res: any;
    switch (type) {
      case "query":
        res = await client.query({ query: gql, variables });
        break;
      case "mutation":
        res = await client.mutate({ mutation: gql, variables });
        break;
      case "subscription":
        res = useSubscription(gql, { variables });
        break;
      default:
        res = await client.query({ query: gql, variables });
    }

    if (res.data) {
      return { statusCode: 200, status: true, data: res.data };
    }
    return { statusCode: 400, status: false, data: res };
  } catch (error: any) {
    console.log("errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:\n", error);
    return {
      statusCode: error?.response?.status || 500,
      status: false,
      data: error?.message || "Something went wrong",
    };
  }
};
