const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");
const { GraphQLClient } = require("graphql-request");
const { tiposTramite, tiposDepartamento } = require('./querys/querys')
const endpoint = "http://192.168.105.34:8080/v1/graphql";
const typeDefs = gql`
  type typoDeTramite {
    DscaTipoTramite: String
    Cantidad: Int
    Monto: Float
  }
  type taskByUser {
    Nombre: String
    noIniciado: Int
    revisionJuridico: Int
    revisionJuridicoCompletado: Int
    enProceso: Int
    porFirmar: Int
    Completados: Int
    Pendiente: Int
    Anulado: Int
    Total: Int
  }
  type Query {
    rep_tiposTramite (fechaInicio: String!, fechaFin: String!, title: String, order: String): [typoDeTramite]
    rep_departamento(fechaInicio: String!, fechaFin: String!, departamento: String!): [taskByUser]
  }
`;



const resolvers = {
  Query: {
    rep_tiposTramite: async (parent, args, context) => {
      try {
        var { fechaInicio, fechaFin, title, order } = args
        title = '%'+title+'%'
        const variables = {
          fechaInicio,
          fechaFin,
          title,
          order
        }
        const graphQLClient = new GraphQLClient(endpoint);
        const data = await graphQLClient.request(tiposTramite, variables);
        var tramites = null;
        var total= {};
        total.DscaTipoTramite='Total';
        total.Cantidad=0;
        total.Monto=0;
        //Crear lista personalizada
        data.OrdenTrabajo_Cabecera.forEach(detalles => {
          detalles.OrdenTrabajo_Detalles.forEach(detalle=>{
            var auxiliar={};
            auxiliar.DscaTipoTramite= detalle.TipoTramite.DscaTipoTramite;
            auxiliar.Cantidad=detalle.Cantidad;
            auxiliar.Monto= detalle.AmountInvoiced;
            total.Cantidad+=auxiliar.Cantidad;
            total.Monto+=auxiliar.Monto;
            if(tramites==null){
              tramites=[];
              tramites.push(auxiliar);
            }else{
              var found=false;
              tramites.forEach(tramite_salida=>{
                if (tramite_salida.DscaTipoTramite==auxiliar.DscaTipoTramite) {
                  tramite_salida.Cantidad+=auxiliar.Cantidad;
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
        //funcion para ordenar la lista
        if(tramites!=null){
          tramites.sort(function(a,b){
            if (a.DscaTipoTramite > b.DscaTipoTramite){
              return 1;
            }
            if (a.DscaTipoTramite < b.DscaTipoTramite){
              return -1;
            }
            return 0;
          });
        }
        if(tramites!=null)
          tramites.push(total);
        return tramites;
      } catch (e) {
        console.log(e);
        return null;
      }
    },
    rep_departamento: async (parent, args, context) =>{
      try{
        var { fechaInicio, fechaFin, departamento } = args
        departamento="%"+departamento+"%";
        const variables = {
          fechaInicio,
          fechaFin,
          departamento
        }
        const graphQLClient = new GraphQLClient(endpoint);
        const data = await graphQLClient.request(tiposDepartamento, variables);
        var departamentos= null;
        var totales= {};
        totales.Nombre= "Total";
        totales.noIniciado= 0;
        totales.revisionJuridico= 0;
        totales.revisionJuridicoCompletado= 0;
        totales.enProceso= 0;
        totales.porFirmar= 0;
        totales.Completados= 0;
        totales.Pendiente= 0;
        totales.Anulado= 0;
        totales.Total= 0;
        data.Usuario_OT.forEach(usuot => {
          var aux ={};
          aux.Nombre= usuot.OrdenTrabajo_Detalle.usuarioByIduserasignado.Apellidos+" "+usuot.OrdenTrabajo_Detalle.usuarioByIduserasignado.Nombres;  
          aux.noIniciado= 0;
          aux.revisionJuridico= 0;
          aux.revisionJuridicoCompletado= 0;
          aux.enProceso= 0;
          aux.porFirmar= 0;
          aux.Completados= 0;
          aux.Pendiente= 0;
          aux.Anulado= 0;
          aux.Total= 0;
          switch (usuot.EstadoTarea){
            case 0: 
              aux.noIniciado= usuot.OrdenTrabajo_Detalle.Cantidad;
              totales.noIniciado+= aux.noIniciado;
              break;
            case 1: 
              aux.revisionJuridico= usuot.OrdenTrabajo_Detalle.Cantidad;
              totales.revisionJuridico+= aux.revisionJuridico;
              break;
            case 2:
              aux.revisionJuridicoCompletado= usuot.OrdenTrabajo_Detalle.Cantidad;
              totales.revisionJuridicoCompletado+= aux.revisionJuridicoCompletado;
              break;
            case 3:
              aux.enProceso= usuot.OrdenTrabajo_Detalle.Cantidad;
              totales.enProceso+= aux.enProceso;
              break;
            case 4:
              aux.porFirmar= usuot.OrdenTrabajo_Detalle.Cantidad;
              totales.porFirmar+= aux.porFirmar;
              break;
            case 5:
              aux.Completados= usuot.OrdenTrabajo_Detalle.Cantidad;
              totales.Completados+= aux.Completados;
              break;
            case 6:
              aux.Pendiente= usuot.OrdenTrabajo_Detalle.Cantidad;
              totales.Pendiente+= aux.Pendiente;
              break;
            case 7:
              aux.Anulado= usuot.OrdenTrabajo_Detalle.Cantidad;
              totales.Anulado+= aux.Anulado;
              break;
          }
          aux.Total= usuot.OrdenTrabajo_Detalle.Cantidad;
          totales.Total+= aux.Total;
          if(departamentos==null){
            departamentos=[];
            departamentos.push(aux);
          }else{
            var found=false;
            departamentos.forEach(dep=>{
              if (dep.Nombre==aux.Nombre) {
                dep.noIniciado+= aux.noIniciado;
                dep.revisionJuridico+= aux.revisionJuridico;
                dep.revisionJuridicoCompletado+= aux.revisionJuridicoCompletado;
                dep.enProceso+= aux.enProceso;
                dep.porFirmar+= aux.porFirmar;
                dep.Completados+= aux.Completados;
                dep.Pendiente+= aux.Pendiente;  
                dep.Anulado+= aux.Anulado;
                dep.Total+= aux.Total;
                found=true;
                return;
              }
            });
            if(found==false){
              departamentos.push(aux);
            }
          }
        });
        if(departamentos!=null)
          departamentos.push(totales);
        return departamentos;
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
