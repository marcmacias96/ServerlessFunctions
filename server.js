const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");
const { GraphQLClient } = require("graphql-request");
const { tiposTramite } = require("./querys/typesOfProcedure");
const endpoint = "http://192.168.103.34:8080/v1/graphql";

const typeDefs = gql`
  type objResTramites {
    index: Int
    tipoDeTramite: typoDeTramite
  }
  type typoDeTramite {
    NombreHistorico: String
    Cantidad: Int
    Monto: Float
  }
  type Query {
    rep_tiposTramite: [objResTramites]
  }
`;

const resolvers = {
  Query: {
    rep_tiposTramite: async (parent, args, context) => {
      try {
        const { fechaInicio, fechaFin } = args;
        const variables = {
          fechaInicio,
          fechaFin
        };
        const graphQLClient = new GraphQLClient(endpoint);
        const data = await graphQLClient.request(tiposTramite, variables);
        var tramites = null;
        data.OrdenTrabajo_Cabecera.forEach(detalles => {
          detalles.OrdenTrabajo_Detalles.forEach(servicio => {
            servicio.TipoServicio.TipoTramites_aggregate.nodes.forEach(
              tramite => {
                var auxiliar = {};
                auxiliar.NombreHistorico = tramite.NombreHistorico;
                auxiliar.Cantidad = 1;
                auxiliar.Monto = tramite.Monto;
                if (tramites.tipoDeTramite == null) {
                  tramites.index = tramites.length + 1;
                  tramites.tipoDeTramite = [];
                  tramites.tipoDeTramite.push(auxiliar);
                } else {
                  var found = false;
                  tramites.forEach(tramite_salida => {
                    if (
                      tramite_salida.NombreHistorico == auxiliar.NombreHistorico
                    ) {
                      tramite_salida.Cantidad++;
                      tramite_salida.Monto += auxiliar.Monto;
                      found = true;
                    }
                  });
                  if (found == false) {
                    tramites.index = tramites.length + 1;
                    tramites.push(auxiliar);
                  }
                }
              }
            );
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
