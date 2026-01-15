import { PrismaClient, TacticCategory, ImpactLevel, TemplateCategory } from '@prisma/client';

const prisma = new PrismaClient();

const tactics = [
  {
    name: 'Queja SAT por Facturas',
    slug: 'sat-invoice-complaint',
    category: TacticCategory.TAX,
    description:
      'Reportar la falta de emisión de CFDI (facturas) por pagos de renta. La ley mexicana obliga a los arrendadores a emitir facturas digitales por todos los pagos de arrendamiento.',
    agencyName: 'SAT (Servicio de Administración Tributaria)',
    agencyUrl: 'https://sat.gob.mx/aplicacion/50409/presenta-tu-queja-o-denuncia',
    agencyPhone: '55-88-52-22-22',
    agencyEmail: 'denuncias@sat.gob.mx',
    estimatedCost: 0,
    timeToFile: '15 min',
    impactLevel: ImpactLevel.HIGH,
    potentialFine: '$1,200 - $79,000 MXN por infracción',
    requiredDocs: [
      'Comprobantes de transferencia bancaria',
      'Fechas de facturas faltantes',
      'Copia del contrato',
      'RFC del arrendador',
    ],
    legalBasis: 'Código Fiscal de la Federación, Art. 29-A',
    sortOrder: 1,
  },
  {
    name: 'Denuncia por Evasión Fiscal',
    slug: 'sat-tax-evasion',
    category: TacticCategory.TAX,
    description:
      'Reporte anónimo por posible ingreso de arrendamiento no declarado. Activa una auditoría por parte de la división de Auditoría Fiscal del SAT.',
    agencyName: 'SAT - Auditoría Fiscal',
    agencyUrl: 'https://sat.gob.mx/aplicacion/50409/presenta-tu-queja-o-denuncia',
    agencyPhone: '55-88-52-22-22',
    agencyEmail: 'denuncias@sat.gob.mx',
    estimatedCost: 0,
    timeToFile: '20 min',
    impactLevel: ImpactLevel.VERY_HIGH,
    potentialFine: 'Auditoría fiscal + impuestos atrasados + multas + intereses',
    requiredDocs: [
      'RFC del arrendador',
      'Dirección del inmueble',
      'Montos de renta pagados',
      'Comprobantes de pago',
    ],
    legalBasis: 'Ley del ISR, Régimen de Arrendamiento',
    sortOrder: 2,
  },
  {
    name: 'Conciliación PROSOC',
    slug: 'prosoc-conciliation',
    category: TacticCategory.ADMINISTRATIVE,
    description:
      'Solicitar "amigable composición" para disputas de arrendamiento. Obliga al arrendador a comparecer a audiencias de conciliación obligatorias.',
    agencyName: 'Procuraduría Social de CDMX',
    agencyUrl: 'https://prosoc.cdmx.gob.mx',
    agencyPhone: '55-5128-5000',
    agencyEmail: 'contacto@prosoc.cdmx.gob.mx',
    estimatedCost: 0,
    timeToFile: '30 min',
    impactLevel: ImpactLevel.HIGH,
    potentialFine: 'Comparecencia obligatoria + sanciones administrativas por incomparecencia',
    requiredDocs: [
      'Contrato de arrendamiento',
      'INE del solicitante',
      'Comprobante de domicilio',
      'Escrito de queja describiendo la disputa',
    ],
    legalBasis: 'Ley de la Procuraduría Social del DF',
    sortOrder: 3,
  },
  {
    name: 'Queja ante Administración del Edificio',
    slug: 'building-complaint',
    category: TacticCategory.ADMINISTRATIVE,
    description:
      'Reportar problemas de mantenimiento, seguridad o áreas comunes que afecten el goce pacífico del inmueble.',
    agencyName: 'Administración del Edificio / Comité de Condóminos',
    estimatedCost: 0,
    timeToFile: '15 min',
    impactLevel: ImpactLevel.MEDIUM,
    potentialFine: 'Crea documentación para demandas por incumplimiento de contrato',
    requiredDocs: [
      'Fotos/videos de los problemas',
      'Bitácora fechada de incidentes',
      'Escrito de queja',
    ],
    legalBasis: 'Ley de Propiedad en Condominio, Cláusula de goce pacífico del contrato',
    sortOrder: 4,
  },
  {
    name: 'Aviso de Terminación Certificado',
    slug: 'certified-notice',
    category: TacticCategory.COMMUNICATION,
    description:
      'Solicitud formal de terminación por escrito mediante correo certificado con acuse de recibo.',
    agencyName: 'Correos de México / DHL / FedEx',
    agencyUrl: 'https://www.correosdemexico.gob.mx',
    agencyPhone: '800-701-7000',
    estimatedCost: 500,
    timeToFile: '1-2 días',
    impactLevel: ImpactLevel.MEDIUM,
    potentialFine: 'Crea constancia legal válida con comprobante de entrega',
    requiredDocs: [
      'Carta de terminación',
      'Referencia del contrato',
      'Solicitud de acuse de recibo',
    ],
    legalBasis: 'Cláusula de notificaciones del contrato, Código Civil CDMX',
    sortOrder: 5,
  },
  {
    name: 'Carta de Demanda de Abogado',
    slug: 'demand-letter',
    category: TacticCategory.LEGAL,
    description:
      'Demanda legal formal (carta de demanda) de un abogado titulado amenazando con litigio.',
    agencyName: 'Abogado Particular (Abogado Titulado)',
    estimatedCost: 15000,
    timeToFile: '3-5 días',
    impactLevel: ImpactLevel.VERY_HIGH,
    potentialFine: 'Amenaza de demanda + honorarios legales + daños y perjuicios',
    requiredDocs: [
      'Contrato',
      'Todos los recibos de pago',
      'Evidencia de incumplimientos',
      'Historial de comunicaciones',
    ],
    legalBasis: 'Código Civil CDMX Art. 2418, 2431',
    sortOrder: 6,
  },
  {
    name: 'Demanda Civil',
    slug: 'civil-lawsuit',
    category: TacticCategory.LEGAL,
    description:
      'Juicio de rescisión de contrato - demanda formal para rescisión de contrato y daños.',
    agencyName: 'Tribunales Civiles de CDMX',
    agencyUrl: 'https://www.poderjudicialcdmx.gob.mx',
    agencyPhone: '55-5134-1100',
    estimatedCost: 50000,
    timeToFile: '1-2 semanas',
    impactLevel: ImpactLevel.MAXIMUM,
    potentialFine: 'Recuperación total del depósito + daños + intereses + honorarios legales',
    requiredDocs: [
      'Toda la evidencia recopilada',
      'Representación de abogado',
      'Gastos de presentación',
      'Lista de testigos',
    ],
    legalBasis: 'Código Civil CDMX, Código de Procedimientos Civiles CDMX',
    sortOrder: 7,
  },
  {
    name: 'Consignación de Rentas',
    slug: 'rent-consignment',
    category: TacticCategory.LEGAL,
    description:
      'Depositar pagos de renta ante el tribunal (consignación de rentas) para protegerse contra demandas por incumplimiento durante el litigio.',
    agencyName: 'Tribunales Civiles de CDMX',
    estimatedCost: 5000,
    timeToFile: '1 semana',
    impactLevel: ImpactLevel.HIGH,
    potentialFine: 'Protección contra acusaciones de incumplimiento durante la disputa',
    requiredDocs: [
      'Documentación del juicio pendiente',
      'Cálculo del monto de renta',
      'Escrito de consignación',
    ],
    legalBasis: 'Código Civil CDMX, Consignación en pago',
    sortOrder: 8,
  },
];

const templates = [
  {
    name: 'Carta de Solicitud de Terminación',
    slug: 'termination-request',
    category: TemplateCategory.TERMINATION_REQUEST,
    language: 'es',
    subject: 'Solicitud de Terminación de Contrato de Arrendamiento',
    content: `Estimado {{landlordRepresentative}},

Por medio de la presente, solicito formalmente la terminación anticipada del contrato de arrendamiento celebrado el {{leaseStartDate}}, respecto del inmueble ubicado en {{propertyAddress}}.

Solicito asimismo la devolución íntegra del depósito en garantía por la cantidad de {{depositAmount}} dentro de los 30 días siguientes a la desocupación del inmueble.

Quedo a sus órdenes para coordinar la entrega del inmueble y la firma del convenio de terminación correspondiente.

Atentamente,
{{tenantRepresentative}}
{{tenantName}}`,
    placeholders: [
      'landlordRepresentative',
      'leaseStartDate',
      'propertyAddress',
      'depositAmount',
      'tenantRepresentative',
      'tenantName',
    ],
    sortOrder: 1,
  },
  {
    name: 'Queja SAT por Facturas',
    slug: 'sat-invoice-complaint',
    category: TemplateCategory.SAT_COMPLAINT,
    language: 'es',
    subject: 'Queja por Incumplimiento de Obligaciones Fiscales',
    content: `QUEJA POR INCUMPLIMIENTO DE OBLIGACIONES FISCALES

Denunciado: {{landlordName}}
RFC: {{landlordRfc}}
Domicilio: {{landlordAddress}}

HECHOS:
El denunciado ha incumplido con la obligación de expedir Comprobantes Fiscales Digitales por Internet (CFDI) por concepto de arrendamiento de inmueble ubicado en {{propertyAddress}}.

Se han realizado pagos de renta mensuales por la cantidad de {{monthlyRent}} mediante transferencia bancaria, sin recibir las facturas correspondientes.

Solicito se inicie el procedimiento correspondiente y se impongan las sanciones aplicables.

DATOS DEL DENUNCIANTE:
{{tenantName}}
RFC: {{tenantRfc}}`,
    placeholders: [
      'landlordName',
      'landlordRfc',
      'landlordAddress',
      'propertyAddress',
      'monthlyRent',
      'tenantName',
      'tenantRfc',
    ],
    sortOrder: 2,
  },
  {
    name: 'Solicitud de Conciliación PROSOC',
    slug: 'prosoc-complaint',
    category: TemplateCategory.PROSOC_COMPLAINT,
    language: 'es',
    subject: 'Solicitud de Amigable Composición en Materia de Arrendamiento',
    content: `SOLICITUD DE AMIGABLE COMPOSICIÓN EN MATERIA DE ARRENDAMIENTO

C. PROCURADOR(A) SOCIAL DE LA CIUDAD DE MÉXICO
PRESENTE

{{tenantRepresentative}}, en representación de {{tenantName}} (RFC: {{tenantRfc}}), con domicilio en {{propertyAddress}}, solicito el procedimiento de AMIGABLE COMPOSICIÓN respecto del contrato de arrendamiento celebrado con {{landlordName}} (RFC: {{landlordRfc}}).

HECHOS:
1. Con fecha {{leaseStartDate}} se celebró contrato de arrendamiento.
2. Se entregó depósito en garantía por {{depositAmount}}.
3. He solicitado la terminación anticipada del contrato sin obtener respuesta favorable.

PETICIÓN:
Solicito se cite al arrendador a audiencia de conciliación.

PROTESTO LO NECESARIO

{{currentDate}}

{{tenantRepresentative}}`,
    placeholders: [
      'tenantRepresentative',
      'tenantName',
      'tenantRfc',
      'propertyAddress',
      'landlordName',
      'landlordRfc',
      'leaseStartDate',
      'depositAmount',
      'currentDate',
    ],
    sortOrder: 3,
  },
  {
    name: 'Carta de Demanda Legal',
    slug: 'demand-letter',
    category: TemplateCategory.DEMAND_LETTER,
    language: 'es',
    subject: 'Carta de Demanda',
    content: `CARTA DE DEMANDA

{{landlordRepresentative}}
{{landlordName}}
{{landlordAddress}}

Por medio de la presente, en representación de {{tenantName}}, le comunico:

PRIMERO.- Mi representada ha manifestado su intención de dar por terminado el contrato de arrendamiento celebrado el {{leaseStartDate}}, sin llegar a acuerdo.

SEGUNDO.- En términos de los artículos 2418 y 2431 del Código Civil para la Ciudad de México, le REQUIERO para que dentro de 15 DÍAS HÁBILES:

a) Formalice la terminación del contrato
b) Devuelva el depósito en garantía por {{depositAmount}}

TERCERO.- De no atender este requerimiento, procederemos a interponer JUICIO DE RESCISIÓN DE CONTRATO y DEMANDA DE DAÑOS Y PERJUICIOS.

Sin otro particular, quedo de usted.

ATENTAMENTE

{{currentDate}}

___________________________
Abogado Titulado
Cédula Profesional No. _______`,
    placeholders: [
      'landlordRepresentative',
      'landlordName',
      'landlordAddress',
      'tenantName',
      'leaseStartDate',
      'depositAmount',
      'currentDate',
    ],
    sortOrder: 4,
  },
  {
    name: 'Carta de Seguimiento',
    slug: 'follow-up-letter',
    category: TemplateCategory.FOLLOW_UP,
    language: 'es',
    subject: 'Seguimiento a Solicitud de Terminación',
    content: `Estimado {{landlordRepresentative}},

Por medio de la presente, doy seguimiento a mi comunicación previa de fecha _______, en la cual solicité la terminación del contrato de arrendamiento del inmueble ubicado en {{propertyAddress}}.

Han transcurrido ____ días sin recibir respuesta de su parte, por lo que le reitero mi solicitud de:

1. Formalizar la terminación del contrato
2. Acordar fecha para entrega del inmueble
3. Coordinar la devolución del depósito por {{depositAmount}}

De no recibir respuesta en los próximos 5 días hábiles, me veré en la necesidad de iniciar los procedimientos legales correspondientes.

Atentamente,
{{tenantRepresentative}}
{{tenantName}}
Teléfono: ___________
Email: ___________`,
    placeholders: [
      'landlordRepresentative',
      'propertyAddress',
      'depositAmount',
      'tenantRepresentative',
      'tenantName',
    ],
    sortOrder: 5,
  },
];

async function main() {
  console.log('Seeding pressure tactics...');

  for (const tactic of tactics) {
    await prisma.pressureTactic.upsert({
      where: { slug: tactic.slug },
      update: tactic,
      create: tactic,
    });
    console.log(`  - ${tactic.name}`);
  }

  console.log('Seeding message templates...');

  for (const template of templates) {
    await prisma.messageTemplate.upsert({
      where: { slug: template.slug },
      update: template,
      create: template,
    });
    console.log(`  - ${template.name}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
