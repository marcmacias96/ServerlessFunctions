module.exports = {
    tiposTramite : `query rep_tipoTramite($fechaInicio: timestamp!, $fechaFin: timestamp!, $title: String, $order: String!) {
      OrdenTrabajo_Cabecera (where: {FechaOT: {_lt: $fechaFin, _gt: $fechaInicio}, _or: [{Estado: {_eq: 3}}, {Estado:{_eq: 7}},{_and:[{Estado:{_eq: 5}}, {OrdenPostPago:{_eq:false}}]} ]}) {
        OrdenTrabajo_Detalles(where: {TipoServicio: {TpServicio: {_neq: "ZERROR"}}, TipoTramite: {DscaTipoTramite: {_ilike: $title}}}, order_by: {TipoTramite: {DscaTipoTramite: $order}}){
          TipoTramite {
            DscaTipoTramite
          }
          AmountInvoiced
        }
      }
    }
    `
};
