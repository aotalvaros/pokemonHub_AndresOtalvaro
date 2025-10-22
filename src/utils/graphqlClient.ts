const GRAPHQL_URL = 'https://beta.pokeapi.co/graphql/v1beta';

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export const graphqlClient = async <T = unknown>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> => {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = (await response.json()) as GraphQLResponse<T>;

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data as T;
};