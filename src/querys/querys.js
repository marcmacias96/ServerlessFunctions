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
          nodes{
            OID
            Cantidad
            TipoTramite{
              Codigo
              DscaTipoTramite
            }
          }
        }
      }
    }
    `,
    DetallesTareas: `query lista_servicios($fechaInicio: timestamp!, $fechaFin: timestamp!, $cedula: String!) {
      TipoServicio(where: {OrdenTrabajo_Detalles: {usuarioByIduserasignado: {Cedula: {_eq: $cedula}}, Usuario_OTs: {FechaRegistro: {_gte: $fechaInicio, _lte: $fechaFin}}}}) {
        TpServicio
        OrdenTrabajo_Detalles_aggregate(where: {Usuario_OTs: {FechaRegistro: {_gte: $fechaInicio, _lte: $fechaFin}}, usuarioByIduserasignado: {Cedula: {_eq: $cedula}}}) {
          aggregate {
            sum {
              Cantidad
            }
          }
        }
        OrdenTrabajo_Detalles(where: {Usuario_OTs: {FechaRegistro: {_gte: $fechaInicio, _lte: $fechaFin}}, usuarioByIduserasignado: {Cedula: {_eq: $cedula}}}) {
          TipoServicio {
            TpServicio
          }
          TipoTramite {
            DscaTipoTramite
          }
          Observacion
          StatusOT
          CreadoEn
          FechaInscripcion
          FechaInicioTrabajo
          FechaEstimadaEntrega
          FechaPospuestaEntrega
          FechaRealEntrega
          Avaluo
          AmountInvoiced
          FojasAdc
          Cantidad
          usuarioByIduserasignado{
            Nombres
            Apellidos
          }
          usuarioByCreadopor {
            Nombres
            Apellidos
          }
          Usuario_OTs {
            FechaFinalizacion
          }
          OrdenTrabajo_Cabecera {
            NroOrden
            Estado
            clienteByClientefactura {
              Nombres
              Apellidos
              NombreEmpresa
            }
          }
        }
      }
    }
    `,
    DetallesExcel: `query detalles_excel($fechaInicio: timestamp!, $fechaFin: timestamp!, $status: [Int!]) {
      OrdenTrabajo_Detalle(where: {CreadoEn: {_gte: $fechaInicio, _lte: $fechaFin}, StatusOT: {_in: $status}}) {
        TipoServicio {
          TpServicio
        }
        TipoTramite {
          DscaTipoTramite
        }
        StatusOT
        CreadoEn
        FechaInscripcion
        FechaInicioTrabajo
        FechaEstimadaEntrega
        FechaPospuestaEntrega
        FechaRealEntrega
        Avaluo
        AmountInvoiced
        FojasAdc
        Cantidad
        usuarioByIduserasignado {
          Nombres
          Apellidos
        }
        usuarioByCreadopor {
          Nombres
          Apellidos
        }
        Usuario_OTs {
          FechaRegistro
          FechaFinalizacion
        }
        OrdenTrabajo_Cabecera {
          ExcentoCobro
          OrdenGubernamental
          NroOrden
          Estado
          clienteByClientefactura {
            NombreEmpresa
            RepresentanteLegal
            TerceraEdad
            Nombres
            Apellidos
            DiscapacidadValidaParaDescuento
          }
        }
        Observacion
      }
      OrdenTrabajo_Detalle_aggregate(where: {CreadoEn: {_gte: $fechaInicio, _lte: $fechaFin}, StatusOT: {_in: $status}}) {
        aggregate {
          count
        }
      }
    }
    `,
    eliminarLinderos: `
    query del_linderos {
      Ficha_Registral(where: {Lindero: {_like: "%SOLVENCIA%"}}, limit: 1000) {
        OID
        Lindero
      }
    }    
    `,
    mutacion: `
    mutation($OID: Int!, $lindero: String!){
      update_Ficha_Registral(where:{OID:{_eq: $OID}}, 
        _set:{Lindero: $lindero}){
        returning{
          OID
          Lindero
        }
      }
    }
    `
};
