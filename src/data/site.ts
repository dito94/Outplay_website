// Company and contact data. Source: OUTPLAY catalogue 2026 (cover, p. 2–3 "За компанията", back cover).
// No working hours or social links are published in the catalogue, so none are listed here.

export const site = {
  name: 'OUTPLAY',
  /** Logo tagline */
  tagline: {
    bg: 'Комфортни пространства на открито и закрито',
    en: 'Comfortable outdoor and indoor living spaces',
  },
  /** Default meta description */
  description: {
    bg: 'OUTPLAY проектира, произвежда и монтира биоклиматични перголи, стъклени системи, ZIP завеси, тенти и ветрозащитни системи. 20 години опит, София.',
    en: 'OUTPLAY designs, manufactures and installs bioclimatic pergolas, glass systems, ZIP screens, awnings and windbreaks. 20 years of experience, Sofia.',
  },
  experienceYears: 20,
  experience: { bg: '20 години опит', en: '20 years of experience' },
  /** Second line printed next to the company text in the catalogue */
  scope: {
    bg: 'Проучване, проектиране и изпълнение на индивидуални строителни решения и конструкции за жилищни и обществени сгради',
    en: 'Research, design and construction of bespoke building solutions and structures for residential and public buildings',
  },
  city: { bg: 'София', en: 'Sofia' },
  address: {
    bg: 'бул. „Никола Мушанов“ 151, 1330 София',
    en: '151 Nikola Mushanov Blvd, 1330 Sofia, Bulgaria',
  },
  /** Structured address for schema.org PostalAddress */
  postalAddress: {
    street: { bg: 'бул. „Никола Мушанов“ 151', en: '151 Nikola Mushanov Blvd' },
    postalCode: '1330',
    locality: { bg: 'София', en: 'Sofia' },
    country: 'BG',
  },
  phones: [
    { display: '087 981 12 59', e164: '+359879811259' },
    { display: '088 998 69 69', e164: '+359889986969' },
  ],
  /** Viber number (E.164), the first phone */
  viber: '+359879811259',
  /** Ready-made Viber deep link for the number above */
  viberUrl: 'viber://chat?number=%2B359879811259',
  email: 'office@outplay.bg',
  website: 'www.outplay.bg',
  websiteUrl: 'https://www.outplay.bg',
  /** Google Maps search for the Bulgarian address (resolves more reliably than the transliteration) */
  mapsQuery: 'бул. Никола Мушанов 151, 1330 София, България',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=%D0%B1%D1%83%D0%BB.%20%D0%9D%D0%B8%D0%BA%D0%BE%D0%BB%D0%B0%20%D0%9C%D1%83%D1%88%D0%B0%D0%BD%D0%BE%D0%B2%20151%2C%201330%20%D0%A1%D0%BE%D1%84%D0%B8%D1%8F%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F',
  /** Manufacturers named in the catalogue ("… и др.") */
  partners: [
    'REYNAERS',
    'ALUMIL',
    'ETEM',
    'SCHÜCO',
    'HILTI',
    'WÜRTH',
    'SIKA',
    'DORMA',
    'SOMFY',
    'HÖRMANN',
    'FUNDERMAX',
    'ALUCOBOND',
  ],
  partnersMore: { bg: 'и други', en: 'and others' },
} as const;
