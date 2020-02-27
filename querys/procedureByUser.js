module.exports = {
    tiposTramite : `query ($fechaInicio: timestamp!, $fechaFin: timestamp!) {
        Usuario(where: {usuarioOtsByIduserasignado: {FechaRegistro: {_lte: $fechaFin, _gte: $fechaInicio}}}) {
          Departamento {
            IdDpto
          }
          Nombres
          Apellidos
          usuarioOtsByIduserasignado(where: {FechaRegistro: {_lte: $fechaFin, _gte: $fechaInicio}}) {
            FechaRegistro
            OrdenTrabajo_Detalle {
              TipoServicio {
                TpServicio
              }
              Cantidad
              TipoTramite {
                DscaTipoTramite
              }
              StatusOT
            }
          }
        }
      }
    `
};