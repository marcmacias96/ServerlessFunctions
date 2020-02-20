module.exports = {
    tiposTramite : `query rep_tipoTramite($fechaInicio: timestamp!, $fechaFin: timestamp!) {
      OrdenTrabajo_Cabecera (where: {FechaOT: {_lt: $fechaFin, _gt: $fechaInicio}, _or: [{Estado: {_eq: 3}}, {Estado:{_eq: 7}},{_and:[{Estado:{_eq: 5}}, {OrdenPostPago:{_eq:false}}]} ]}) {
        OrdenPostPago
        OrdenTrabajo_Detalles{
          TipoTramite {
            DscaTipoTramite
          }
          AmountInvoiced
        }
      }
    }
    
    `
};
