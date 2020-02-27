module.exports = {
    tiposTramite : `query rep_tipoTramite($fechaInicio: timestamp!, $fechaFin: timestamp!, $title: String, $order: order_by!) {
      OrdenTrabajo_Cabecera (where: {FechaOT: {_lte: $fechaFin, _gte: $fechaInicio},  _or: [{Estado: {_eq: 3}}, {Estado: {_eq: 7}}, {Estado: {_eq: 5}}, {Estado: {_eq: 6}}]}) {
        OrdenTrabajo_Detalles(where: {TipoServicio: {TpServicio: {_neq: "ZERROR"}}, TipoTramite: {DscaTipoTramite: {_ilike: $title}}}, order_by: {TipoTramite: {DscaTipoTramite: $order}}){
          TipoTramite {
            DscaTipoTramite
          }
          Cantidad
          AmountInvoiced
        }
      }
    }
    `,
    tiposDepartamento : `query ($fechaInicio: timestamp!, $fechaFin: timestamp!, $departamento: String!) {
      Usuario_OT(where: {FechaRegistro: {_lte: $fechaFin, _gte: $fechaInicio}, OrdenTrabajo_Detalle: {usuarioByIduserasignado: {Departamento: {IdDpto: {_ilike: $departamento}}}}}) {
        EstadoTarea
        OrdenTrabajo_Detalle {
          usuarioByIduserasignado {
            Nombres
            Apellidos
          }
          Cantidad
        }
      }
    }
  `
};
