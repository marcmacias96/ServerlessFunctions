const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");
const { GraphQLClient } = require("graphql-request");
const { tiposTramite } = require('./querys/typesOfProcedure')
const endpoint = "http://192.168.103.34:8080/v1/graphql";

const typeDefs = gql`
  type typoDeTramite {
    DscaTipoTramite: String
    Cantidad: Int
    Monto: Float
  }
  type Query {
    rep_tiposTramite (fechaInicio: String!, fechaFin: String!, title: String, order: order_by!): [typoDeTramite]
  }
`;



const resolvers = {
  Query: {
    rep_tiposTramite: async (parent, args, context) => {
      try {
        const { fechaInicio, fechaFin, title, order } = args
        const variables = {
          fechaInicio,
          fechaFin,
          title,
          order
        }
        const graphQLClient = new GraphQLClient(endpoint);
        const data = await graphQLClient.request(tiposTramite, variables);
        var tramites = null;
        data.OrdenTrabajo_Cabecera.forEach(detalles => {
          detalles.OrdenTrabajo_Detalles.forEach(detalle=>{
            var auxiliar={};
            auxiliar.DscaTipoTramite= detalle.TipoTramite.DscaTipoTramite;
            auxiliar.Cantidad=1;
            auxiliar.Monto= detalle.AmountInvoiced;
            if(tramites==null){
              tramites=[];
              tramites.push(auxiliar);
            }else{
              var found=false;
              tramites.forEach(tramite_salida=>{
                if (tramite_salida.DscaTipoTramite==auxiliar.DscaTipoTramite) {
                  tramite_salida.Cantidad++;
                  tramite_salida.Monto+=auxiliar.Monto;
                  found=true;
                  return;
                }
              });
              if(found==false){
                tramites.push(auxiliar);
              }
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
