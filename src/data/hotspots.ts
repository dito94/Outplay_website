import type { Hotspot } from './types';

/**
 * Callout hotspots for products/<id>/diagram.jpg, one per callout printed in the 2026 catalogue.
 * x/y are % of the diagram image; each point is where the catalogue's leader line meets the structure
 * (computed from the PDF vector geometry, not eyeballed). Sources: lamella pergola PDF 10, PVC roof PDF 15,
 * automatic glass roof PDF 22, fixed glass roof PDF 26, thermo-panel roof PDF 28, vertical ZIP PDF 52.
 */
export const diagramHotspots: Record<string, Hotspot[]> = {
  'balance': [
    { x: 6.6, y: 22.6, label: { bg: 'Висококачествена прахово боядисана алуминиева конструкция', en: 'High-grade powder-coated aluminium structure' } },
    { x: 31.9, y: 8.9, label: { bg: 'Скрита система за водооттичане', en: 'Concealed drainage system' } },
    { x: 53.0, y: 15.8, label: { bg: 'Интегрирани улуци', en: 'Integrated gutters' } },
    { x: 71.6, y: 16.5, label: { bg: 'LED осветление от всички страни', en: 'LED lighting on all four sides' } },
    { x: 92.6, y: 20.7, label: { bg: 'Автоматизирана ротация на ламелите от 0° до 120°', en: 'Motorised louvre rotation from 0° to 120°' } },
  ],
  'infinity': [
    { x: 6.6, y: 22.6, label: { bg: 'Висококачествена прахово боядисана алуминиева конструкция', en: 'High-grade powder-coated aluminium structure' } },
    { x: 31.9, y: 8.9, label: { bg: 'Скрита система за водооттичане', en: 'Concealed drainage system' } },
    { x: 53.0, y: 15.8, label: { bg: 'Интегрирани улуци', en: 'Integrated gutters' } },
    { x: 71.6, y: 16.5, label: { bg: 'LED осветление от всички страни', en: 'LED lighting on all four sides' } },
    { x: 92.6, y: 20.7, label: { bg: 'Автоматизирана ротация на ламелите от 0° до 120° с възможност за събирането им в края на конструкцията', en: 'Motorised louvre rotation from 0° to 120°, with the louvres able to stack at one end of the structure' } },
  ],
  'flat': [
    { x: 7.8, y: 21.6, label: { bg: 'Висококачествена прахово боядисана алуминиева конструкция', en: 'High-grade powder-coated aluminium structure' } },
    { x: 32.4, y: 20.1, label: { bg: 'Интегрирани улуци', en: 'Integrated gutters' } },
    { x: 53.0, y: 21.0, label: { bg: 'Водонепромокаемо и ветроустойчиво покритие', en: 'Waterproof, wind-resistant fabric roof' } },
    { x: 71.1, y: 11.8, label: { bg: 'Вградено LED осветление', en: 'Integrated LED lighting' } },
    { x: 91.6, y: 8.3, label: { bg: 'Скрита система за водооттичане', en: 'Concealed drainage system' } },
  ],
  'automatic-glass-roof': [
    { x: 13.7, y: 52.9, label: { bg: 'Интегрирани улуци', en: 'Integrated gutters' } },
    { x: 35.1, y: 34.9, label: { bg: 'Долно ламинирано стъкло', en: 'Laminated lower glass' } },
    { x: 51.6, y: 24.4, label: { bg: 'Подвижни панели с висококачествени уплътнения за пълна водонепропускливост', en: 'Sliding panels with high-grade seals for complete watertightness' } },
    { x: 68.6, y: 9.0, label: { bg: 'Горно закалено стъкло „STOP RAY“', en: 'Tempered STOP RAY upper glass' } },
    { x: 86.4, y: 15.6, label: { bg: 'Прахово боядисана алуминиева конструкция', en: 'Powder-coated aluminium structure' } },
  ],
  'fixed-glass-roof': [
    { x: 11.2, y: 9.3, label: { bg: 'Интегрирани улуци', en: 'Integrated gutters' } },
    { x: 30.6, y: 13.0, label: { bg: 'Скрита система за водооттичане', en: 'Concealed drainage system' } },
    { x: 49.9, y: 19.5, label: { bg: 'Фиксирани стъклени панели с висококачествени уплътнения за пълна водонепропускливост', en: 'Fixed glass panels with high-grade seals for complete watertightness' } },
    { x: 69.8, y: 9.3, label: { bg: 'Наклонен или плосък вариант на изпълнение', en: 'Available sloped or flat' } },
    { x: 88.4, y: 9.3, label: { bg: 'Прахово боядисана алуминиева конструкция', en: 'Powder-coated aluminium structure' } },
  ],
  'thermo-panel-roof': [
    { x: 7.2, y: 27.2, label: { bg: 'Вградени улуци със скрита система за водооттичане', en: 'Built-in gutters with concealed drainage' } },
    { x: 28.5, y: 17.7, label: { bg: 'Многослойни термопанели', en: 'Multi-layer insulated panels' } },
    { x: 50.4, y: 11.7, label: { bg: 'Възможност за цялостно периферно оформление със системи за вертикално остъкляване или интегриране на плътни панели', en: 'Sides can be fully closed with vertical glazing systems or solid panels' }, categoryId: 'glass-systems' },
    { x: 72.5, y: 11.5, label: { bg: 'Възможност за вградено LED осветление', en: 'Optional integrated LED lighting' } },
    { x: 92.6, y: 17.7, label: { bg: 'Прахово боядисана алуминиева конструкция', en: 'Powder-coated aluminium structure' } },
  ],
  'vertical-zip': [
    { x: 23.2, y: 21.8, label: { bg: 'Вграден корпус', en: 'Recessed cassette' } },
    { x: 19.9, y: 27.4, label: { bg: 'Напълно скрит механизъм (вграден монтаж)', en: 'Fully concealed mechanism (recessed installation)' } },
    { x: 14.3, y: 34.9, label: { bg: 'Вграден релсов профил', en: 'Recessed guide rail' } },
    { x: 47.2, y: 68.0, label: { bg: 'Външен корпус', en: 'Surface-mounted cassette' } },
    { x: 49.5, y: 73.8, label: { bg: 'Напълно скрит механизъм (външен монтаж)', en: 'Fully concealed mechanism (surface installation)' } },
    { x: 55.1, y: 81.1, label: { bg: 'Външен релсов профил', en: 'Surface-mounted guide rail' } },
  ],
};

/**
 * Hotspots for home/what-we-do.jpg (catalogue p. 3 sketch-to-render villa). The first four are the systems
 * annotated by hand in the catalogue (dots placed on the element each arrow touches); the last two are other
 * visible elements covered by OUTPLAY's glazing and façade work (catalogue p. 4–5).
 */
export const houseHotspots: Hotspot[] = [
  {
    x: 30.3,
    y: 9.9,
    label: { bg: 'Автоматична пергола с подвижен стъклен покрив', en: 'Automated pergola with a retractable glass roof' },
    productId: 'automatic-glass-roof',
    categoryId: 'bioclimatic-pergolas',
  },
  {
    x: 35.4,
    y: 32.8,
    label: {
      bg: 'Автоматична вертикално плъзгаща се стъклена система тип „гилотина“',
      en: 'Automated vertical sliding glass system (guillotine)',
    },
    productId: 'guillotine',
    categoryId: 'glass-systems',
  },
  {
    x: 17.7,
    y: 55.9,
    label: { bg: 'Автоматична алуминиева биоклиматична пергола', en: 'Automated aluminium bioclimatic pergola' },
    productId: 'balance',
    categoryId: 'bioclimatic-pergolas',
  },
  {
    x: 32.6,
    y: 71.0,
    label: {
      bg: 'Ръчни хоризонтално плъзгащи се стъклени панели със стъклопакети',
      en: 'Manual horizontal sliding glass panels with insulated glazing',
    },
    productId: 'sliding-glass',
    categoryId: 'glass-systems',
  },
  {
    x: 83.8,
    y: 55.5,
    label: { bg: 'Алуминиеви и стъклени парапети', en: 'Aluminium and glass balustrades' },
  },
  {
    x: 89.9,
    y: 71.0,
    label: { bg: 'PVC и алуминиева дограма за врати и прозорци', en: 'PVC and aluminium doors and windows' },
  },
];
