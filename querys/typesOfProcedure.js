module.exports = {
    tiposTramite : `query rep_tipoTramite($fechaInicio: timestamp!, $fechaFin: timestamp!) {
      OrdenTrabajo_Cabecera(where: {FechaOT: {_lt: $fechaFin, _gt: $fechaInicio}, Estado: {_eq: 3}}) {
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
