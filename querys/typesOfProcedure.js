module.exports = {
    tiposTramite : `query rep_tipoTramite($fechaInicio: timestamp!, $fechaFin: timestamp!) {
      OrdenTrabajo_Cabecera(where: {FechaOT: {_lt: $fechaFin, _gt: $fechaInicio}, Estado: {_gt: 2, _lt: 8}, _not: {Estado: {_eq: 4}}, OrdenPostPago: {_eq: false}}) {
        OrdenTrabajo_Detalles {
          TipoTramite {
            DscaTipoTramite
          }
          AmountInvoiced
        }
      }
    }
    `
};
