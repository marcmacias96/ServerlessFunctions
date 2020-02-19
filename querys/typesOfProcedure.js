module.exports = {
    tiposTramite : `query rep_tipoTramite($fechaInicio: timestamp!,$fechaFin: timestamp!) {
        OrdenTrabajo_Cabecera(where: {FechaOT: {_lt: $fechaFin, _gt: $fechaInicio}}) {
          OrdenTrabajo_Detalles {
            TipoServicio {
              TipoTramites_aggregate(where: {NombreHistorico: {_is_null: false}}) {
                nodes {
                  NombreHistorico
                  Monto
                }
              }
            }
          }
        }
      }
    `
};
