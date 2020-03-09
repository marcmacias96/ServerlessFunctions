module.exports = {
    TiposServicios: `query rep_tiposServicios($fechaInicio: timestamp!, $fechaFin: timestamp!) {
      TipoServicio(where: {OrdenTrabajo_Detalles: {ProformaFacturaDetalles: {FacturadoEn: {_gte: $fechaInicio, _lte: $fechaFin}}}}) {
    		TpServicio
        creacion: OrdenTrabajo_Detalles_aggregate(where: {ProformaFacturaDetalles: {FacturadoEn: {_gte: $fechaInicio, _lte: $fechaFin}}, OrdenTrabajo_Cabecera: {Estado: {_eq: 0}}}) {
          aggregate {
            sum {
              Cantidad
            }
          }
        }
        abierta: OrdenTrabajo_Detalles_aggregate(where: {ProformaFacturaDetalles: {FacturadoEn: {_gte: $fechaInicio, _lte: $fechaFin}}, OrdenTrabajo_Cabecera: {Estado: {_eq: 1}}}) {
          aggregate {
            sum {
              Cantidad
            }
          }
        }
        porCobrar: OrdenTrabajo_Detalles_aggregate(where: {ProformaFacturaDetalles: {FacturadoEn: {_gte: $fechaInicio, _lte: $fechaFin}}, OrdenTrabajo_Cabecera: {Estado: {_eq: 2}}}) {
          aggregate {
            sum {
              Cantidad
            }
          }
        }
        pagada: OrdenTrabajo_Detalles_aggregate(where: {ProformaFacturaDetalles: {FacturadoEn: {_gte: $fechaInicio, _lte: $fechaFin}}, OrdenTrabajo_Cabecera: {Estado: {_eq: 3}}}) {
          aggregate {
            sum {
              Cantidad
            }
          }
        }
        anulada: OrdenTrabajo_Detalles_aggregate(where: {ProformaFacturaDetalles: {FacturadoEn: {_gte: $fechaInicio, _lte: $fechaFin}}, OrdenTrabajo_Cabecera: {Estado: {_eq: 4}}}) {
          aggregate {
            sum {
              Cantidad
            }
          }
        }
        enProceso: OrdenTrabajo_Detalles_aggregate(where: {ProformaFacturaDetalles: {FacturadoEn: {_gte: $fechaInicio, _lte: $fechaFin}}, OrdenTrabajo_Cabecera: {Estado: {_eq: 5}}}) {
          aggregate {
            sum {
              Cantidad
            }
          }
        }
        paraEntrega: OrdenTrabajo_Detalles_aggregate(where: {ProformaFacturaDetalles: {FacturadoEn: {_gte: $fechaInicio, _lte: $fechaFin}}, OrdenTrabajo_Cabecera: {Estado: {_eq: 6}}}) {
          aggregate {
            sum {
              Cantidad
            }
          }
        }
        finalizada: OrdenTrabajo_Detalles_aggregate(where: {ProformaFacturaDetalles: {FacturadoEn: {_gte: $fechaInicio, _lte: $fechaFin}}, OrdenTrabajo_Cabecera: {Estado: {_eq: 7}}}) {
          aggregate {
            sum {
              Cantidad
            }
          }
        }
        total: OrdenTrabajo_Detalles_aggregate(where: {ProformaFacturaDetalles: {FacturadoEn: {_gte: $fechaInicio, _lte: $fechaFin}}}) {
          aggregate {
            sum {
              Cantidad
              AmountInvoiced
            }
          }
          nodes {
            OID
            Cantidad
            usuarioByIduserasignado {
              Cedula
              Nombres
              Apellidos
            }
          }
        }
      }
    }
    `
};
