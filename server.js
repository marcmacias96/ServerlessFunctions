const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");
const { GraphQLClient } = require("graphql-request");

const endpoint = "http://192.168.103.34:8080/v1/graphql";

const typeDefs = gql`
  type typeOfProcedure {
    type: String
    count: Int
    amount: Float
  }
  type Query {
    rep_typeOfProcedure: [typeOfProcedure]
  }
`;

const query = `
  query MyQuery {
    OrdenTrabajo_Cabecera(
      where: {
        FechaOT: { _lt: "2018-11-13 00:00:00", _gt: "2018-10-13 00:00:00" }
      }
    ) {
      OrdenTrabajo_Detalles {
        TipoServicio {
          TipoTramites_aggregate(
            where: { NombreHistorico: { _is_null: false } }
          ) {
            nodes {
              NombreHistorico
              Monto
            }
          }
        }
      }
    }
  }
`;

const resolvers = {
  Query: {
    rep_typeOfProcedure: async (parent, args, context) => {
      try {
        const graphQLClient = new GraphQLClient(endpoint);
        const data = await graphQLClient.request(query);
        const tramites = null;
        data.forEach(servicio => {
          servicio.forEach(tramite => {
            if (tramites.includes(tramite) == false) {
              tramites.push(tramite);
            }
          });
        });
        return tramites;
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  }
};
const context = ({ req }) => {};
const schema = new ApolloServer({ typeDefs, resolvers, context });
schema.listen({ port: 9090 }).then(({ url }) => {
  console.log(`schema ready at ${url}`);
});
