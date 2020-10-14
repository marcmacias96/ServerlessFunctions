const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");
const { GraphQLClient } = require("graphql-request");
const { TiposServicios, DetallesTareas, DetallesExcel, eliminarLinderos,mutacion } = require('../src/querys/querys')
const endpoint = "http://192.168.105.34:8080/v1/graphql"
const moment = require("../node_modules/moment")
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
    Tareas: [typeTask]
  }
  type typeTask {
    Cantidad: Int
    Codigo: String
    DscaTipoTramite: String
    OID: [Int]
  }
  type taskList{
    TpServicio: String
    DscaTipoTramite: String
    StatusOT: Int
    CreadoEn: String
    FechaInscripcion: String
    FechaInicioTrabajo: String
    FechaEstimadaEntrega: String
    FechaPospuestaEntrega: String
    FechaRealEntrega: String
    Avaluo: Int
    AmountInvoiced: Float
    FojasAdc: Int
    Cantidad: Int
    NombresAsi: String
    NombresCre: String
    FechaFinalizacion: String
    NroOrden: String
    Estado: Int
    Nombres: String
    Observacion: String
    Estilo: typeStyle
  }
  type typeStyle{
    isGreen: Boolean
    isBlue: Boolean
    isRed: Boolean
    isYellow: Boolean
  }
  type serviceList{
    TpServicio: String
    Cantidad: Int
    tareas: [taskList]
  }
  type dataEcxel{
    Nro: String
    TpServicio: String
    fRegistro: String
    Etarea: String
    Asignado: String
    tpTramite: String
    NroOrden: String
    FEfin: String
    Observacion: String
    CreadoEn: String
    FInscripcion: String
    FInicioTrabajo: String
    FPostpuestaEntrega: String
    FRealEntrega: String
    Avaluo: String
    Monto: String
    FojasAdc: String
    Cantidad: String
    CreadoPor: String
    FFinalizacion: String
    ExcentoCobro: String
    OrdenGubernamental: String
    EstadoOrden: String
    Cliente: String
    Empresa: String
    RepLegal: String
    TerceraEdad: String
    Discapacidad: String
  }
  type linderos{
    OID: Int
    lindero: String
  }
  type Query {
    rep_tiposServicios(fechaInicio: String!, fechaFin: String!): [typeOfService]
    lista_servicios(fechaInicio: String!, fechaFin: String!, cedula: String!): [serviceList]
    detalles_excel(fechaInicio: String!, fechaFin: String!, status: [Int]): [dataEcxel]
    del_linderos: [linderos]
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
          Tareas: []
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
            Tareas: null
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
          servicio.total.nodes.forEach(tarea=>{
            var auxTareas={
              OID: [],
              Codigo: tarea.TipoTramite.Codigo,
              DscaTipoTramite: tarea.TipoTramite.DscaTipoTramite,
              Cantidad: tarea.Cantidad
            }
            auxTareas.OID.push(tarea.OID)
            if(aux.Tareas == null){
              aux.Tareas= [];
              aux.Tareas.push(auxTareas);
            }else{
              var found=false;
              aux.Tareas.forEach(tar=>{
                if(auxTareas.Codigo == tar.Codigo){
                  tar.Cantidad+= auxTareas.Cantidad;
                  tar.OID.push(tarea.OID);
                  found=true;
                  return;
                }
              });
              if(found==false){
                aux.Tareas.push(auxTareas);
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
            if(lista.Tareas != null){
              lista.Tareas.sort(function(a,b){
                if (a.DscaTipoTramite > b.DscaTipoTramite){
                    return 1;
                }
                if (a.DscaTipoTramite < b.DscaTipoTramite){
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
    },
    lista_servicios: async (parent, args, context) =>{
      try{
        var { fechaInicio, fechaFin, cedula} = args
        const variables = {
          fechaInicio,
          fechaFin,
          cedula
        }
        const graphQLClient = new GraphQLClient(endpoint);
        const data = await graphQLClient.request(DetallesTareas, variables);
        var listaDetalles = []
        data.TipoServicio.forEach(servicio=>{
          var auxD= {
            TpServicio: servicio.TpServicio,
            Cantidad: servicio.OrdenTrabajo_Detalles_aggregate.aggregate.sum.Cantidad,
            tareas: []
          }
          servicio.OrdenTrabajo_Detalles.forEach(ordenes=>{
            var auxO= {
              TpServicio: ordenes.TipoServicio.TpServicio,
              DscaTipoTramite: ordenes.TipoTramite.DscaTipoTramite,
              StatusOT: ordenes.StatusOT,
              CreadoEn: ordenes.CreadoEn,
              FechaInscripcion: ordenes.FechaInscripcion,
              FechaInicioTrabajo: ordenes.FechaInicioTrabajo,
              FechaEstimadaEntrega: ordenes.FechaEstimadaEntrega,
              FechaPospuestaEntrega: ordenes.FechaPospuestaEntrega,
              FechaRealEntrega: ordenes.FechaRealEntrega,
              Avaluo: ordenes.Avaluo,
              AmountInvoiced: ordenes.AmountInvoiced,
              FojasAdc: ordenes.FojasAdc,
              Cantidad: ordenes.Cantidad,
              NombresAsi: ordenes.usuarioByIduserasignado.Apellidos+" "+ordenes.usuarioByIduserasignado.Nombres,
              NombresCre: ordenes.usuarioByCreadopor.Apellidos+" "+ordenes.usuarioByCreadopor.Nombres,
              FechaFinalizacion: ordenes.Usuario_OTs[0].FechaFinalizacion,
              NroOrden: ordenes.OrdenTrabajo_Cabecera.NroOrden,
              Estado: ordenes.OrdenTrabajo_Cabecera.Estado,
              Nombres: ordenes.OrdenTrabajo_Cabecera.clienteByClientefactura.Apellidos+" "+ordenes.OrdenTrabajo_Cabecera.clienteByClientefactura.Nombres+ordenes.OrdenTrabajo_Cabecera.clienteByClientefactura.NombreEmpresa,
              Observacion: ordenes.Observacion,
              Estilo: {
                isBlue: false,
                isRed: false,
                isGreen: false,
                isYellow: false
              }
            }
            var inicio = moment(new Date())
            var fin = moment(auxO.FechaEstimadaEntrega, 'YYYY-MM-DD h:m:s').toDate()
            if (auxO.StatusOT !== 5) {
              if (auxO.FechaEstimadaEntrega == null || auxO.StatusOT === 6) {
                auxO.Estilo.isBlue = true
              } else {
                if ((fin - inicio) / (1000 * 60 * 60 * 24) > 1) {
                  auxO.Estilo.isGreen = true
                } else if ((fin - inicio) / (1000 * 60 * 60) > 2) {
                  auxO.Estilo.isYellow = true
                } else {
                  auxO.Estilo.isRed = true
                }
              }
            }
            auxD.tareas.push(auxO);
          });
          listaDetalles.push(auxD);
        });
        if(listaDetalles != null){
          listaDetalles.sort(function(a,b){
            if (a.TpServicio > b.TpServicio){
                return 1;
            }
            if (a.TpServicio < b.TpServicio){
                return -1;
            }
            return 0;
          });
          listaDetalles.forEach(lista=>{
            if(lista.tareas != null){
              lista.tareas.sort(function(a,b){
                if (a.FechaEstimadaEntrega > b.FechaEstimadaEntrega){
                    return 1;
                }
                if (a.FechaEstimadaEntrega < b.FechaEstimadaEntrega){
                    return -1;
                }
                return 0;
            });
            }
          })
        }
        return listaDetalles;
      } catch (e) {
        console.log(e);
        return null;
      }
    },
    detalles_excel:async (parent, args, context) =>{
      try{
        var { fechaInicio, fechaFin, status } = args
        const variables = {
          fechaInicio,
          fechaFin,
          status
        }
        const graphQLClient = new GraphQLClient(endpoint);
        const data = await graphQLClient.request(DetallesExcel, variables);
        var count = 0;
        var tasksStatus = [
          'No Iniciado',
          'Rev Jurídico',
          'Rev Jurídico C',
          'En Proceso',
          'Por Firmar',
          'Completado',
          'Pendiente',
          'Anulado'
        ]
        var rows = data.OrdenTrabajo_Detalle.map(det => {
          if(det.OrdenTrabajo_Cabecera == null){
            det.OrdenTrabajo_Cabecera = {
              ExcentoCobro: null,
              OrdenGubernamental: null,
              NroOrden: null,
              Estado: null,
              clienteByClientefactura: {
                NombreEmpresa: null,
                RepresentanteLegal: null,
                TerceraEdad: null,
                Nombres: null,
                Apellidos: null,
                DiscapacidadValidaParaDescuento: null
              }
            }
          }
          var aux = {
            Nro: count++,
            TpServicio: det.TipoServicio == null ? '' : det.TipoServicio.TpServicio,
            fRegistro: det.Usuario_OTs.length == 0 ? '' : moment(det.Usuario_OTs[0].FechaRegistro).format('YYYY-MM-DD hh:mm:ss'),
            Etarea: tasksStatus[det.StatusOT] == null ? '' : tasksStatus[det.StatusOT],
            Asignado: det.usuarioByIduserasignado == null ? '' : `${det.usuarioByIduserasignado.Nombres} ${det.usuarioByIduserasignado.Apellidos}`,
            tpTramite: det.TipoTramite == null ? '' : det.TipoTramite.DscaTipoTramite,
            NroOrden: det.OrdenTrabajo_Cabecera.NroOrden == null ? '' : det.OrdenTrabajo_Cabecera.NroOrden,
            FEfin: det.FechaEstimadaEntrega == null ? '' : moment(det.FechaEstimadaEntrega).format('YYYY-MM-DD hh:mm:ss'),
            Observacion: det.Observacion == null ? '' : det.Observacion,
            CreadoEn: det.CreadoEn == null ? '' : moment(det.CreadoEn).format('YYYY-MM-DD hh:mm:ss'),
            FInscripcion: det.FechaInscripcion == null ? '' : moment(det.FechaInscripcion).format('YYYY-MM-DD hh:mm:ss'),
            FInicioTrabajo: det.FechaInicioTrabajo == null ? '' : moment(det.FechaInicioTrabajo).format('YYYY-MM-DD hh:mm:ss'),
            FPostpuestaEntrega: det.FechaPospuestaEntrega == null ? '' : moment(det.FechaPospuestaEntrega).format('YYYY-MM-DD hh:mm:ss'),
            FRealEntrega: det.FechaRealEntrega == null ? '' : moment(det.FechaRealEntrega).format('YYYY-MM-DD hh:mm:ss'),
            Avaluo: det.Avaluo == null ? '' : det.Avaluo,
            Monto: det.AmountInvoiced == null ? '' : det.AmountInvoiced,
            FojasAdc: det.FojasAdc == null ? '' : det.FojasAdc,
            Cantidad: det.FojasAdc == null ? '' : det.FojasAdc,
            CreadoPor: det.usuarioByCreadopor == null ? '' : `${det.usuarioByCreadopor.Nombres} ${det.usuarioByCreadopor.Apellidos}`,
            FFinalizacion: det.Usuario_OTs.length == 0 ? '' : moment(det.Usuario_OTs[0].FechaFinalizacion).format('YYYY-MM-DD hh:mm:ss'),
            ExcentoCobro: det.OrdenTrabajo_Cabecera.ExcentoCobro == null ? '' : det.OrdenTrabajo_Cabecera.ExcentoCobro,
            OrdenGubernamental: det.OrdenTrabajo_Cabecera.OrdenGubernamental == null ? '' : det.OrdenTrabajo_Cabecera.OrdenGubernamental,
            EstadoOrden: det.OrdenTrabajo_Cabecera.Estado == null ? '' : det.OrdenTrabajo_Cabecera.Estado,
            Cliente: det.OrdenTrabajo_Cabecera.clienteByClientefactura.Nombres == null ? '' : `${det.OrdenTrabajo_Cabecera.clienteByClientefactura.Nombres} ${det.OrdenTrabajo_Cabecera.clienteByClientefactura.Apellidos}`,
            Empresa: det.OrdenTrabajo_Cabecera.clienteByClientefactura.NombreEmpresa == null ? '' : det.OrdenTrabajo_Cabecera.clienteByClientefactura.NombreEmpresa,
            RepLegal: det.OrdenTrabajo_Cabecera.clienteByClientefactura.RepresentanteLegal == null ? '' : det.OrdenTrabajo_Cabecera.clienteByClientefactura.RepresentanteLegal,
            TerceraEdad: det.OrdenTrabajo_Cabecera.clienteByClientefactura.TerceraEdad == null ? '' : det.OrdenTrabajo_Cabecera.clienteByClientefactura.TerceraEdad,
            Discapacidad: det.OrdenTrabajo_Cabecera.clienteByClientefactura.DiscapacidadValidaParaDescuento == null ? '' : det.OrdenTrabajo_Cabecera.clienteByClientefactura.DiscapacidadValidaParaDescuento
          }
          return aux
        })
        return rows;
      } catch (e) {
        console.log(e);
        return null;
      }
    },
    del_linderos: async (parent, args, context) =>{
      try{
        const graphQLClient = new GraphQLClient(endpoint);
        const data = await graphQLClient.request(eliminarLinderos);
        var respuesta= []
        data.Ficha_Registral.forEach(rep=>{
          var res = rep.Lindero.split("SOLVENCVIA");
          const aux ={
            OID: rep.OID,
            lindero: res[0]
          }
          graphQLClient.request(mutacion, aux);
          respuesta.push(aux);
        });       
        return respuesta;
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
