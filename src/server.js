const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");
const { GraphQLClient } = require("graphql-request");
const { TiposServicios } = require('../src/querys/querys')
const endpoint = "http://192.168.105.34:8080/v1/graphql";
const {ordenar} = require("./utils/helpers")
const typeDefs = gql`
  type typeOfService {
    Nombre: String
    Creacion: Int
    Abierta: Int
    porCobrar: Int
    Pagada: Int
    Anulada: Int
    enProceso: Int
    paraEntrega: Int
    Finalizada: Int
    Total: Int
    totalRecaudado: Float
    Usuarios: [typeUser]
  }
  type typeUser {
    OID: [Int]
    Cedula: String
    Nombre: String
    Cantidad: Int
  }
  type Query {
    rep_tiposServicios(fechaInicio: String!, fechaFin: String!): [typeOfService]
  }
`;

const resolvers = {
  Query: {
    rep_tiposServicios: async (parent, args, context) =>{
      try{
        var { fechaInicio, fechaFin} = args
        const variables = {
          fechaInicio,
          fechaFin
        }
        const graphQLClient = new GraphQLClient(endpoint);
        const data = await graphQLClient.request(TiposServicios, variables);
        var listaServicios = [];
        var total = {
          Nombre: 'TOTAL',
          Creacion: 0,
          Abierta: 0,
          porCobrar: 0,
          Pagada: 0,
          Anulada: 0,
          enProceso: 0,
          paraEntrega: 0,
          Finalizada: 0,
          Total: 0,
          totalRecaudado: 0,
          Usuarios: []
        }
        data.TipoServicio.forEach(servicio=>{
          var aux = {
            Nombre: servicio.TpServicio,
            Creacion: servicio.creacion.aggregate.sum.Cantidad == null ? 0 : servicio.creacion.aggregate.sum.Cantidad,
            Abierta: servicio.abierta.aggregate.sum.Cantidad == null ? 0 : servicio.abierta.aggregate.sum.Cantidad,
            porCobrar: servicio.porCobrar.aggregate.sum.Cantidad == null ? 0 : servicio.porCobrar.aggregate.sum.Cantidad,
            Pagada: servicio.pagada.aggregate.sum.Cantidad == null ? 0 : servicio.pagada.aggregate.sum.Cantidad,
            Anulada: servicio.anulada.aggregate.sum.Cantidad == null ? 0 : servicio.anulada.aggregate.sum.Cantidad,
            enProceso: servicio.enProceso.aggregate.sum.Cantidad == null ? 0 : servicio.enProceso.aggregate.sum.Cantidad,
            paraEntrega: servicio.paraEntrega.aggregate.sum.Cantidad == null ? 0 : servicio.paraEntrega.aggregate.sum.Cantidad,
            Finalizada: servicio.finalizada.aggregate.sum.Cantidad == null ? 0 : servicio.finalizada.aggregate.sum.Cantidad,
            Total: servicio.total.aggregate.sum.Cantidad == null ? 0 : servicio.total.aggregate.sum.Cantidad,
            totalRecaudado: servicio.total.aggregate.sum.AmountInvoiced == null ? 0 : servicio.total.aggregate.sum.AmountInvoiced,
            Usuarios: null
          }
          total.Creacion += aux.Creacion
          total.Abierta += aux.Abierta
          total.porCobrar += aux.porCobrar
          total.Pagada += aux.Pagada
          total.Anulada += aux.Anulada
          total.enProceso += aux.enProceso
          total.paraEntrega += aux.paraEntrega
          total.Finalizada += aux.Finalizada
          total.Total += aux.Total
          total.totalRecaudado += aux.totalRecaudado
          servicio.total.nodes.forEach(usuario=>{
            if(usuario.usuarioByIduserasignado != null){
              var auxUsuarios={
                OID: [],
                Cedula: usuario.usuarioByIduserasignado.Cedula,
                Nombre: usuario.usuarioByIduserasignado.Apellidos+" "+usuario.usuarioByIduserasignado.Nombres,
                Cantidad: usuario.Cantidad
              }
            }else{
              var auxUsuarios={
                OID: [],
                Cedula: "",
                Nombre: "SIN ASIGNAR",
                Cantidad: usuario.Cantidad
              }
            }
            auxUsuarios.OID.push(usuario.OID)
            if(aux.Usuarios == null){
              aux.Usuarios= [];
              aux.Usuarios.push(auxUsuarios);
            }else{
              var found=false;
              aux.Usuarios.forEach(usu=>{
                if(auxUsuarios.Cedula == usu.Cedula){
                  usu.Cantidad+= auxUsuarios.Cantidad;
                  usu.OID.push(usuario.OID);
                  found=true;
                  return;
                }
              });
              if(found==false){
                aux.Usuarios.push(auxUsuarios);
              }
            }
          });
          listaServicios.push(aux)
        });
        if(listaServicios != null){
          listaServicios.sort(function(a,b){
            if (a.Nombre > b.Nombre){
                return 1;
            }
            if (a.Nombre < b.Nombre){
                return -1;
            }
            return 0;
        });
          listaServicios.forEach(lista=>{
            if(lista.Usuarios != null){
              lista.Usuarios.sort(function(a,b){
                if (a.Nombre > b.Nombre){
                    return 1;
                }
                if (a.Nombre < b.Nombre){
                    return -1;
                }
                return 0;
            });
            }
          })
          listaServicios.push(total);
        }
        return listaServicios;
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
