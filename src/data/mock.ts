export const CONTRATOS = [
  {
    nombre: 'Contrato Áreas Verdes',
    empresa: 'Arauco Mantenciones S.A.',
    presupuesto: '$120.000.000',
    vigencia: '31/12/2026',
    alertas: 2,
    nivel: 'alerta' as const,
  },
  {
    nombre: 'Camiones de Aseo',
    empresa: 'LimpiaMar Ltda.',
    presupuesto: '$210.000.000',
    vigencia: '31/12/2026',
    alertas: 2,
    nivel: 'alerta' as const,
  },
  {
    nombre: 'Contrato Remodelación',
    empresa: 'Constructora Pacifico',
    presupuesto: '$320.000.000',
    vigencia: '31/12/2026',
    alertas: 5,
    nivel: 'multa' as const,
  },
  {
    nombre: 'Contrato Aseo zona centro',
    empresa: 'LimpiaMar Ltda.',
    presupuesto: '$100.000.000',
    vigencia: '31/12/2026',
    alertas: 1,
    nivel: 'alerta' as const,
  },
  {
    nombre: 'Contrato Iluminaria Pública',
    empresa: 'ElectroValpo SpA',
    presupuesto: '$200.000.000',
    vigencia: '31/12/2026',
    alertas: 0,
    nivel: 'ok' as const,
  },
];

export const REPORTES = [
  {
    titulo: "Plaza O'higgins - Contrato Áreas Verdes",
    fecha: '18/10/2026',
    inspector: 'Juan Pérez',
    checklist: '2/3',
    estado: 'Alerta de incumplimiento',
    nivel: 'alerta' as const,
  },
  {
    titulo: 'Camión GL PT 98 - Contrato Camiones Aseo',
    fecha: '21/05/2026',
    inspector: 'Miguel Jimenez',
    checklist: '2/3',
    estado: 'Alerta de incumplimiento',
    nivel: 'alerta' as const,
  },
  {
    titulo: 'Calle Las Heras - Contrato Iluminaria Pública',
    fecha: '28/06/2026',
    inspector: 'Jose Rios',
    checklist: '3/3',
    estado: 'Cumple / Sin observaciones',
    nivel: 'ok' as const,
  },
  {
    titulo: 'Obras Errazuriz - Contrato Remodelacion',
    fecha: '04/09/2026',
    inspector: 'Andres Valdes',
    checklist: '1/3',
    estado: 'Multa Aplicada',
    nivel: 'multa' as const,
  },
  {
    titulo: 'Basureros - Contrato Aseo zona centro',
    fecha: '18/02/2026',
    inspector: 'Jose Rios',
    checklist: '3/3',
    estado: 'Cumple / Sin observaciones',
    nivel: 'ok' as const,
  },
  {
    titulo: 'Plaza Echaurren - Contrato Áreas Verdes',
    fecha: '07/10/2026',
    inspector: 'Juan Martinez',
    checklist: '2/3',
    estado: 'Alerta de incumplimiento',
    nivel: 'alerta' as const,
  },
];

export const TRAZAS = [
  {
    id: '#0532',
    detalle: 'Multa Aplicada → $500.000',
    fecha: '05/09/2026 16:40',
    admin: 'Andrés Valdés',
    ref: 'Obras Errázuriz (Inspector José Rios)',
  },
  {
    id: '#0723',
    detalle: 'Fiscalización pendiente',
    fecha: '21/09/2026 12:32',
    admin: 'Juan Rojas',
    ref: "Plaza O'higgins (Inspector José Rios)",
  },
  {
    id: '#0611',
    detalle: 'Multa Aplicada → $1.300.000',
    fecha: '21/07/2026 17:45',
    admin: 'Andrés Valdés',
    ref: 'Camión GL PT 98 (Inspector Andres Luz)',
  },
  {
    id: '#0576',
    detalle: 'Fiscalización completa',
    fecha: '23/09/2026 18:54',
    admin: 'Manuel Borges',
    ref: 'Calle Las Heras (Inspector Juan Martinez)',
  },
];

export const CHECKLIST_ITEMS = [
  'Cumplimiento de horario',
  'Implementos de seguridad',
  'Calidad del servicio',
];

export const COMUNAS = [
  'Viña del Mar',
  'Valparaíso',
  'Quilpué',
  'Villa Alemana',
  'Quillota',
  'La Calera',
  'Concón',
  'Ventanas',
  'Casablanca',
  'Placilla',
  'San Antonio',
  'Reñaca',
  'Papudo',
  'Zapallar',
  'La Ligua',
  'Limache',
];
