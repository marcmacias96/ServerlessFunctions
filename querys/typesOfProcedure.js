module.exports = {
    tiposTramite : `query rep_tipoTramite($fechaInicio: timestamp!, $fechaFin: timestamp!, $title: String, $order: order_by!) {
      OrdenTrabajo_Cabecera(where: {FechaOT: {_lt: $fechaFin, _gt: $fechaInicio}, Estado: {_eq: 3}}) {
        OrdenTrabajo_Detalles(where: {TipoServicio: {TpServicio: {_neq: "ZERROR"}}, TipoTramite: {DscaTipoTramite: {_ilike: $title}}}, order_by: {TipoTramite: {DscaTipoTramite: $order}}) {
          TipoTramite {
            DscaTipoTramite
          }
          AmountInvoiced
        }
      }
    }
    `
};
