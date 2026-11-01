import type { Configuration, L, Product } from './types';

// Product copy from the OUTPLAY catalogue 2026 (docs/catalogue-part-*.md), cleaned for the web.
// Highlights, specs and features use only facts stated in the catalogue. The catalogue has no
// dimension/load tables, so no sizes, loads or warranty figures appear here.

// ---------------------------------------------------------------------------
// Shared values
// ---------------------------------------------------------------------------

const anyRal: L = { bg: 'Всеки цвят по RAL', en: 'Any RAL colour' };
const ralHighlight = {
  value: 'RAL',
  label: { bg: 'всеки цвят от палитрата', en: 'any colour in the range' },
};
const noFloorGuides = {
  value: '0',
  label: { bg: 'подови водачи – крилата висят на горна релса', en: 'floor guides, the leaves hang from a top track' },
};

/** "ПРИМЕРНИ КОНФИГУРАЦИИ" for all louvred pergolas (catalogue p. 19) */
const lamellaConfigurations: Configuration[] = [
  {
    title: { bg: 'Без подпорни колони', en: 'No support posts' },
    text: { bg: 'Монтаж между две стени.', en: 'Fitted between two walls.' },
  },
  {
    title: { bg: 'С две подпорни колони', en: 'Two support posts' },
    text: { bg: 'Прикрепена към фасадата, с две колони отпред.', en: 'Fixed to the façade, with two posts at the front.' },
  },
  {
    title: { bg: 'Самостоятелна конструкция с четири колони', en: 'Freestanding on four posts' },
    text: { bg: 'Самостоятелно стоящ акцент в градината или до басейна.', en: 'A standalone feature in the garden or by the pool.' },
  },
  {
    title: { bg: 'Покриване на големи площи', en: 'Large areas' },
    text: { bg: 'Няколко модула, свързани в обща конструкция.', en: 'Several modules coupled into one structure.' },
  },
];

/** Options listed for automated pergolas ("Комфорт и допълнителни опции", catalogue p. 12–13) */
const automatedPergolaOptions: L[] = [
  { bg: 'Вертикално остъкляване', en: 'Vertical glazing' },
  { bg: 'Слънцезащитни ZIP завеси', en: 'ZIP sun screens' },
  { bg: 'Вградено LED осветление', en: 'Integrated LED lighting' },
  { bg: 'Интегрирани отоплителни тела', en: 'Integrated heaters' },
  { bg: 'Вградено озвучаване', en: 'Built-in sound system' },
];

/** Wall-mount configurations shared by Flat and Curved (catalogue p. 29 and 33) */
const pvcWallConfigurations: Configuration[] = [
  {
    title: { bg: 'Към фасадата с обтегачи', en: 'Façade-mounted with tension rods' },
    text: {
      bg: 'Конструкцията се захваща за фасадата посредством обтегачи. Подходящ модел за обществени и частни имоти, при които няма възможност да се поставят носещи колони.',
      en: 'The structure is fixed to the façade with tension rods. A good fit for public and private buildings where support posts are not possible.',
    },
  },
  {
    title: { bg: 'Към фасадата с две колони', en: 'Façade-mounted with two posts' },
    text: {
      bg: 'Конструкцията се монтира към фасадата, а опората се осъществява чрез две носещи колони в предната част. Подходяща за търговски обекти и за частни имоти с дворове или тераси.',
      en: 'The structure is fixed to the façade and supported by two posts at the front. Suits commercial premises as well as homes with gardens or terraces.',
    },
  },
];

const pvcCentralBeam: Configuration = {
  title: { bg: 'С централна носеща греда', en: 'Central supporting beam' },
  text: {
    bg: 'Самостоятелна конструкция с носеща греда и два мотора за двата независими подвижни покрива, които се прибират в центъра. Без допълнителни колони – за жилищни и обществени пространства с ограничена възможност за опори.',
    en: 'A freestanding structure with a supporting beam and two motors for two independent retractable roofs that gather in the centre. No extra posts, for residential and public spaces with limited room for supports.',
  },
};

const foldingGlassOptions: L[] = [
  { bg: 'Тонирано стъкло в различни нюанси', en: 'Tinted glass in several shades' },
  { bg: 'Закалено или ламинирано стъкло', en: 'Tempered or laminated glass' },
  { bg: 'Многоточково заключване', en: 'Multi-point locking' },
];

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export const products: Product[] = [
  // ───────────────────────── Bioclimatic pergolas · automated ─────────────────────────
  {
    id: 'balance',
    category: 'bioclimatic-pergolas',
    subgroup: 'automated',
    family: 'pergola',
    order: 1,
    name: { bg: 'Balance', en: 'Balance' },
    fullName: {
      bg: 'Биоклиматична пергола с алуминиеви ламели, серия Balance',
      en: 'Balance louvred bioclimatic pergola',
    },
    tagline: { bg: 'Геометрия на светлината.', en: 'The geometry of light.' },
    summary: {
      bg: 'Едномоторна биоклиматична пергола с алуминиеви ламели, които се завъртат от 0° до 120°. Светлина, сянка и проветрение с едно натискане на дистанционното.',
      en: 'A single-motor bioclimatic pergola with aluminium louvres that rotate from 0° to 120°. Light, shade and airflow at the press of a remote.',
    },
    sections: [
      {
        heading: { bg: 'Геометрия на светлината', en: 'The geometry of light' },
        paragraphs: [
          {
            bg: 'Едномоторната система Balance дава пълен контрол над светлината. Благодарение на прецизната ротация на ламелите управлявате слънчевия поток с лекота.',
            en: 'Balance is the single-motor system that gives you full control over the light. Precise louvre rotation puts the flow of sunlight in your hands.',
          },
          {
            bg: 'Настройте ъгъла така, че да се наслаждавате на естествена вентилация и нежна игра на светлини и сенки, докато оставате защитени от преките лъчи. Идеалното решение за прохладен и балансиран кът за почивка.',
            en: 'Set the angle for a gentle breeze and a soft play of light and shade while staying out of direct sun. It is the natural choice for a cool, balanced place to unwind.',
          },
          {
            bg: 'Ламелите на Balance се завъртат, без да се прибират. Ако искате покривът да се отваря изцяло към небето, разгледайте двумоторната серия Infinity.',
            en: 'Balance louvres rotate but do not retract. If you want the roof to open fully to the sky, see the twin-motor Infinity series.',
          },
        ],
      },
      {
        heading: { bg: 'Ламели от 0° до 120° с едно натискане', en: 'Louvres from 0° to 120° at the touch of a button' },
        paragraphs: [
          {
            bg: 'Представете си пространство, което се адаптира към деня, вместо Вие към него. Алуминиевите перголи с автоматичен покрив от ламели превръщат терасата, градината или търговския обект в комфортна зона за почивка и срещи през всички сезони.',
            en: 'Imagine a space that adapts to the day instead of the other way round. Aluminium pergolas with a motorised louvred roof turn a terrace, garden or commercial space into a comfortable place to relax and meet, in every season.',
          },
          {
            bg: 'Ламелите се завъртат плавно от 0° до 120°, така че с едно натискане на дистанционното намирате баланса между естествена светлина, сянка и проветрение. Всяка ламела е с допълнителна термо- и звукоизолация, а в напълно затворено положение покривът пази от слънце, дъжд и сняг.',
            en: 'The louvres rotate smoothly from 0° to 120°, so one press of the remote finds the right balance of daylight, shade and airflow. Each louvre carries extra thermal and acoustic insulation, and when fully closed the roof keeps out sun, rain and snow.',
          },
        ],
      },
      {
        heading: { bg: 'Технология, скрита в детайла', en: 'Technology in the details' },
        paragraphs: [
          {
            bg: 'Перголата може да бъде самостоятелна конструкция в градината или да се прикрепи към сградата, като се вписва естествено в екстериора на дома или търговския обект. Изработва се във всеки цвят от палитрата RAL, а в профилите може да се вгради RGB осветление с възможност за димиране.',
            en: 'The pergola can stand on its own in the garden or attach to the building, blending naturally with the exterior of a home or business. It is made in any RAL colour, and dimmable RGB lighting can be built into the profiles.',
          },
          {
            bg: 'По целия периметър има вградени алуминиеви улуци, а опорните колони служат като скрити водостоци за ефективно отводняване. В зависимост от площта перголата може да има различен брой колони и зони на задвижване.',
            en: 'Aluminium gutters run around the whole perimeter, and the support posts double as concealed downpipes. Depending on the area, the pergola can have more posts and several drive zones.',
          },
          {
            bg: 'С добавяне на вертикално остъкляване перголата се превръща в зимна градина – място за сутрешно кафе, вечеря с приятели или уютна клиентска зона, независимо от сезона.',
            en: 'Add vertical glazing and the pergola becomes a winter garden: a place for morning coffee, dinner with friends or a welcoming guest area, whatever the season.',
          },
        ],
      },
    ],
    highlights: [
      { value: '0–120°', label: { bg: 'ротация на ламелите', en: 'louvre rotation' } },
      {
        value: '1',
        unit: { bg: 'мотор', en: 'motor' },
        label: { bg: 'за прецизна ротация на ламелите', en: 'for precise louvre rotation' },
      },
      ralHighlight,
    ],
    features: [
      { bg: 'Висококачествена прахово боядисана алуминиева конструкция', en: 'High-grade powder-coated aluminium structure' },
      { bg: 'Автоматизирана ротация на ламелите от 0° до 120°', en: 'Motorised louvre rotation from 0° to 120°' },
      { bg: 'Ламели с допълнителна термо- и звукоизолация', en: 'Louvres with added thermal and acoustic insulation' },
      { bg: 'Интегрирани улуци по целия периметър', en: 'Integrated gutters around the whole perimeter' },
      { bg: 'Скрита система за водооттичане през колоните', en: 'Hidden drainage through the posts' },
      { bg: 'LED осветление от всички страни, RGB с димиране', en: 'LED lighting on all sides, dimmable RGB' },
      { bg: 'Защита от слънце, дъжд и сняг в затворено положение', en: 'Protection from sun, rain and snow when closed' },
      { bg: 'Самостоятелна или прикрепена към сградата', en: 'Freestanding or attached to the building' },
    ],
    specs: [
      { label: { bg: 'Конструкция', en: 'Structure' }, value: { bg: 'Висококачествен алуминий с прахово покритие', en: 'High-grade powder-coated aluminium' } },
      { label: { bg: 'Покрив', en: 'Roof' }, value: { bg: 'Въртящи се алуминиеви ламели с термо- и звукоизолация', en: 'Rotating aluminium louvres with thermal and acoustic insulation' } },
      { label: { bg: 'Ротация на ламелите', en: 'Louvre rotation' }, value: { bg: '0°–120°', en: '0°–120°' } },
      { label: { bg: 'Задвижване', en: 'Drive' }, value: { bg: '1 мотор – въртене на ламелите', en: 'Single motor, louvre rotation' } },
      { label: { bg: 'Управление', en: 'Control' }, value: { bg: 'Дистанционно', en: 'Remote control' } },
      { label: { bg: 'Отводняване', en: 'Drainage' }, value: { bg: 'Вградени улуци, колоните служат като скрити водостоци', en: 'Built-in gutters, posts act as concealed downpipes' } },
      { label: { bg: 'Монтаж', en: 'Mounting' }, value: { bg: 'Самостоятелна или към сграда; без колони, с две или с четири колони', en: 'Freestanding or wall-mounted; no posts, two posts or four posts' } },
      { label: { bg: 'Цвят', en: 'Colour' }, value: anyRal },
    ],
    configurations: lamellaConfigurations,
    options: [{ bg: 'RGB осветление с димиране', en: 'Dimmable RGB lighting' }, ...automatedPergolaOptions],
    related: ['infinity', 'guillotine', 'vertical-zip'],
    video: {
      url: 'https://outplay.bg/video/',
      title: { bg: 'Вижте автоматизираните перголи в движение', en: 'See the automated pergolas in motion' },
    },
    keywords: [
      'пергола', 'перголи', 'биоклиматична пергола', 'биоклиматични перголи', 'ламели', 'ламелна пергола',
      'алуминиева пергола', 'алуминиеви ламели', 'въртящи се ламели', 'зимна градина', 'навес', 'сенник', 'тераса',
      'pergola', 'pergolas', 'bioclimatic', 'bioklimatichna pergola', 'pergoli', 'lameli', 'louvre', 'louvred',
      'louvered', 'louver', 'aluminium pergola', 'aluminum pergola', 'winter garden', 'zimna gradina', 'balance',
    ],
  },
  {
    id: 'infinity',
    category: 'bioclimatic-pergolas',
    subgroup: 'automated',
    family: 'pergola',
    order: 2,
    name: { bg: 'Infinity', en: 'Infinity' },
    fullName: {
      bg: 'Биоклиматична пергола с алуминиеви ламели, серия Infinity',
      en: 'Infinity louvred bioclimatic pergola',
    },
    tagline: { bg: 'Свобода без граници.', en: 'Freedom without limits.' },
    summary: {
      bg: 'Двумоторна биоклиматична пергола, чиито ламели се завъртат от 0° до 120° и се прибират напълно в единия край. С едно натискане покривът се отваря към небето.',
      en: 'A twin-motor bioclimatic pergola whose louvres rotate from 0° to 120° and retract fully to one end. One press opens the roof to the sky.',
    },
    sections: [
      {
        heading: { bg: 'Свобода без граници', en: 'Freedom without limits' },
        paragraphs: [
          {
            bg: 'За тези, които не приемат компромиси, двумоторната серия Infinity предлага пълното преживяване. Ламелите се завъртат и освен това се прибират напълно в единия край на конструкцията.',
            en: 'For those who want it all, the twin-motor Infinity series goes further. The louvres rotate, and they also retract completely to one end of the structure.',
          },
          {
            bg: 'С едно натискане на бутона покривът изчезва и разкрива цялото небе през деня или звездите през нощта. Infinity превръща терасата от защитена зона в напълно открито пространство за секунди.',
            en: 'One press of a button and the roof disappears, opening the view to a clear sky by day or the stars at night. Infinity turns a sheltered terrace into a fully open space in seconds.',
          },
        ],
      },
      {
        heading: { bg: 'Покрив, който изчезва за секунди', en: 'A roof that disappears in seconds' },
        paragraphs: [
          {
            bg: 'Алуминиевите перголи с автоматичен покрив от ламели превръщат терасата, градината или търговския обект в комфортна зона през всички сезони. Изработени от висококачествен алуминий, те Ви дават пълна власт над климата под покрива.',
            en: 'Aluminium pergolas with a motorised louvred roof make a terrace, garden or commercial space comfortable in every season. Built from high-grade aluminium, they give you full control of the climate beneath.',
          },
          {
            bg: 'Ламелите се завъртат плавно от 0° до 120° и могат да се съберат в единия край на конструкцията. Всяка ламела е с допълнителна термо- и звукоизолация, а в затворено положение покривът пази от слънце, дъжд и сняг.',
            en: 'The louvres rotate smoothly from 0° to 120° and can gather at one end of the structure. Each louvre carries extra thermal and acoustic insulation, and when closed the roof keeps out sun, rain and snow.',
          },
        ],
      },
      {
        heading: { bg: 'Технология, скрита в детайла', en: 'Technology in the details' },
        paragraphs: [
          {
            bg: 'OUTPLAY предлага две основни серии: едномоторната Balance за прецизна ротация на ламелите и двумоторната Infinity, при която покривните елементи се завъртат и се прибират напълно.',
            en: 'OUTPLAY offers two main series: the single-motor Balance for precise louvre rotation, and the twin-motor Infinity, whose roof elements both rotate and fully retract.',
          },
          {
            bg: 'Конструкцията може да бъде самостоятелна или прикрепена към сградата и се изработва във всеки цвят по RAL. Вградените улуци по периметъра и колоните, които служат като скрити водостоци, отвеждат водата, а в профилите може да се вгради RGB осветление с димиране.',
            en: 'The structure can stand alone or attach to the building and is made in any RAL colour. Built-in perimeter gutters and posts that double as concealed downpipes carry rainwater away, and dimmable RGB lighting can be integrated into the profiles.',
          },
          {
            bg: 'С вертикално остъкляване Infinity се превръща в зимна градина, която в топлите дни може да се отвори изцяло към небето.',
            en: 'With vertical glazing, Infinity becomes a winter garden that can open completely to the sky on warm days.',
          },
        ],
      },
    ],
    highlights: [
      { value: '0–120°', label: { bg: 'ротация на ламелите', en: 'louvre rotation' } },
      {
        value: '2',
        unit: { bg: 'мотора', en: 'motors' },
        label: { bg: 'ротация и пълно прибиране на ламелите', en: 'rotation and full retraction' },
      },
      ralHighlight,
    ],
    features: [
      { bg: 'Ламелите се завъртат и се прибират напълно в единия край', en: 'Louvres rotate and retract fully to one end' },
      { bg: 'Автоматизирана ротация от 0° до 120°', en: 'Motorised rotation from 0° to 120°' },
      { bg: 'Ламели с допълнителна термо- и звукоизолация', en: 'Louvres with added thermal and acoustic insulation' },
      { bg: 'Висококачествена прахово боядисана алуминиева конструкция', en: 'High-grade powder-coated aluminium structure' },
      { bg: 'Интегрирани улуци и скрита система за водооттичане', en: 'Integrated gutters and hidden drainage' },
      { bg: 'LED осветление от всички страни, RGB с димиране', en: 'LED lighting on all sides, dimmable RGB' },
      { bg: 'Управление с дистанционно', en: 'Remote control' },
    ],
    specs: [
      { label: { bg: 'Конструкция', en: 'Structure' }, value: { bg: 'Висококачествен алуминий с прахово покритие', en: 'High-grade powder-coated aluminium' } },
      { label: { bg: 'Покрив', en: 'Roof' }, value: { bg: 'Въртящи се и прибиращи се алуминиеви ламели', en: 'Rotating, retractable aluminium louvres' } },
      { label: { bg: 'Ротация на ламелите', en: 'Louvre rotation' }, value: { bg: '0°–120°', en: '0°–120°' } },
      { label: { bg: 'Задвижване', en: 'Drive' }, value: { bg: '2 мотора – въртене и прибиране', en: 'Two motors, rotation and retraction' } },
      { label: { bg: 'Управление', en: 'Control' }, value: { bg: 'Дистанционно', en: 'Remote control' } },
      { label: { bg: 'Отводняване', en: 'Drainage' }, value: { bg: 'Вградени улуци, колоните служат като скрити водостоци', en: 'Built-in gutters, posts act as concealed downpipes' } },
      { label: { bg: 'Монтаж', en: 'Mounting' }, value: { bg: 'Самостоятелна или към сграда; без колони, с две или с четири колони', en: 'Freestanding or wall-mounted; no posts, two posts or four posts' } },
      { label: { bg: 'Цвят', en: 'Colour' }, value: anyRal },
    ],
    configurations: lamellaConfigurations,
    options: [{ bg: 'RGB осветление с димиране', en: 'Dimmable RGB lighting' }, ...automatedPergolaOptions],
    related: ['balance', 'sliding-glass', 'vertical-zip'],
    video: {
      url: 'https://outplay.bg/video/',
      title: { bg: 'Вижте автоматизираните перголи в движение', en: 'See the automated pergolas in motion' },
    },
    keywords: [
      'пергола', 'перголи', 'биоклиматична пергола', 'ламели', 'прибиращи се ламели', 'отваряем покрив',
      'подвижен покрив', 'алуминиева пергола', 'зимна градина', 'навес', 'тераса',
      'pergola', 'bioclimatic', 'bioklimatichna pergola', 'lameli', 'louvre', 'louvred', 'louvered',
      'retractable louvres', 'retractable roof', 'opening roof', 'winter garden', 'infinity', 'infiniti',
    ],
  },
  {
    id: 'flat',
    category: 'bioclimatic-pergolas',
    subgroup: 'automated',
    family: 'pergola',
    order: 3,
    name: { bg: 'Flat', en: 'Flat' },
    fullName: {
      bg: 'Биоклиматична пергола с подвижно поливинилно покритие, серия Flat',
      en: 'Flat series bioclimatic pergola with retractable PVC roof',
    },
    tagline: { bg: 'Изчистен дизайн, безкомпромисна устойчивост.', en: 'Clean lines, uncompromising strength.' },
    summary: {
      bg: 'Пергола с плосък, леко наклонен подвижен покрив от трислойно Blackout платно. Устоява на вятър до 117 км/ч, спира до 89% от UV лъчите и е 100% водоустойчива.',
      en: 'A pergola with a flat, gently sloped retractable roof in three-layer Blackout PVC. Withstands winds up to 117 km/h, blocks up to 89% of UV and is 100% waterproof.',
    },
    sections: [
      {
        heading: { bg: 'Изчистен дизайн, безкомпромисна устойчивост', en: 'Clean lines, uncompromising strength' },
        paragraphs: [
          {
            bg: 'Серията Flat е въплъщение на модерния минимализъм: плоска, фино наклонена покривна конструкция, проектирана за бързо отводняване. Системата запазва стабилност дори при пориви на вятъра до 117 км/ч.',
            en: 'Flat is modern minimalism in pergola form: a flat, gently sloped roof designed to shed water fast. The system stays stable even in gusts of up to 117 km/h.',
          },
          {
            bg: 'Покритието блокира до 89% от вредните UV лъчи и създава прохладна и здравословна среда, а 100-процентовата му водоустойчивост осигурява суха повърхност дори при интензивни валежи.',
            en: 'The fabric blocks up to 89% of harmful UV rays for a cooler, healthier space beneath, and because it is 100% waterproof the area stays dry even in heavy rain.',
          },
          {
            bg: 'Системата се развива заедно с изискванията Ви и позволява лесно интегриране на вградено LED осветление, слънцезащита, ветрозащита и пълно остъкляване.',
            en: 'The system grows with your needs, readily taking integrated LED lighting, sun and wind protection and full glazing.',
          },
        ],
      },
      {
        heading: { bg: 'Традиция в подхода, новаторство в технологиите', en: 'Traditional in spirit, modern in engineering' },
        paragraphs: [
          {
            bg: 'Автоматизираните системи с поливинилно покритие са модерна интерпретация на традиционната слънцезащита. В сърцето на алуминиевата конструкция стои специално разработена трислойна поливинилна материя с интегрирана Blackout технология – напълно водонепромокаема и трудно горима. Тя спира слънчевите лъчи и служи като надежден щит срещу атмосферните влияния.',
            en: 'Motorised PVC-roof systems are a modern take on traditional sun protection. At the heart of the aluminium frame is a purpose-made three-layer PVC membrane with integrated Blackout technology, fully waterproof and fire-retardant. It blocks the sun and shields the space from the weather.',
          },
          {
            bg: 'Всяка конфигурация може да бъде самостоятелна структура или прикрепена към фасадата. Профилите се изработват в богата палитра от цветове по RAL, а интелигентната автоматизация и допълнителните опции правят системата дългосрочна инвестиция в качеството на живот.',
            en: 'Every configuration can be freestanding or fixed to the façade. Profiles come in a wide range of RAL colours, and smart automation and optional extras make the system a long-term investment in everyday comfort.',
          },
        ],
      },
      {
        heading: { bg: 'Две изпълнения на покрива', en: 'Two roof options' },
        paragraphs: [
          {
            bg: 'Моделът с покритие, вградено във водачите, е за тези, които търсят функционалност през цялата година. Той осигурява отлична хидроизолация и безупречно отвеждане на дъждовната вода, а плътното прилягане на елементите задържа топлината ефективно. С вертикално остъкляване пространството остава уютно и през най-студените месеци.',
            en: 'The built-in version, with the fabric running inside the guide rails, is made for year-round use. It gives excellent waterproofing and clean rainwater run-off, and the tight fit of the components holds in heat well. Add vertical glazing and the space stays cosy even in the coldest months.',
          },
          {
            bg: 'Моделът с висящо под водачите покритие е насочен към ефирната слънцезащита и класическото излъчване. Създава прохладна сянка през лятото и придава средиземноморски вид на терасата или градината. Макар да е проектиран основно за защита от слънце, позволява остъкляване срещу вятър и дъжд.',
            en: 'The hanging version, with the fabric draped beneath the guide rails, is about light, airy shade and a classic look. It creates cool shade in summer and gives a terrace or garden a Mediterranean feel. Although designed mainly for sun protection, it can be combined with glazing to keep out wind and rain.',
          },
        ],
      },
    ],
    highlights: [
      {
        value: '117',
        unit: { bg: 'км/ч', en: 'km/h' },
        label: { bg: 'максимална устойчивост на пориви на вятъра', en: 'maximum wind gust resistance' },
      },
      { value: '89%', label: { bg: 'максимално блокиране на UV лъчите', en: 'maximum UV blocking' } },
      { value: '100%', label: { bg: 'водоустойчивост на покритието', en: 'waterproof fabric' } },
    ],
    features: [
      { bg: 'Плосък, леко наклонен покрив за бързо отводняване', en: 'Flat, gently sloped roof for fast drainage' },
      { bg: 'Трислойно поливинилно покритие с Blackout технология', en: 'Three-layer PVC fabric with Blackout technology' },
      { bg: 'Водонепромокаемо, ветроустойчиво и трудно горимо платно', en: 'Waterproof, wind-resistant, fire-retardant fabric' },
      { bg: 'Висококачествена прахово боядисана алуминиева конструкция', en: 'High-grade powder-coated aluminium structure' },
      { bg: 'Интегрирани улуци и скрита система за водооттичане', en: 'Integrated gutters and hidden drainage' },
      { bg: 'Вградено LED осветление', en: 'Integrated LED lighting' },
      { bg: 'Покритие, вградено във водачите или висящо под тях', en: 'Fabric built into the guide rails or hanging beneath them' },
    ],
    specs: [
      { label: { bg: 'Конструкция', en: 'Structure' }, value: { bg: 'Алуминий с прахово покритие', en: 'Powder-coated aluminium' } },
      { label: { bg: 'Покритие', en: 'Roof fabric' }, value: { bg: 'Трислойна поливинилна материя с Blackout технология, водонепромокаема и трудно горима', en: 'Three-layer PVC membrane with Blackout technology, waterproof and fire-retardant' } },
      { label: { bg: 'Изпълнение на покрива', en: 'Roof version' }, value: { bg: 'Вградено във водачите или висящо под тях', en: 'Built into the guide rails or hanging beneath them' } },
      { label: { bg: 'Устойчивост на вятър', en: 'Wind resistance' }, value: { bg: 'Пориви до 117 км/ч', en: 'Gusts up to 117 km/h' } },
      { label: { bg: 'UV защита', en: 'UV protection' }, value: { bg: 'До 89%', en: 'Up to 89%' } },
      { label: { bg: 'Водоустойчивост', en: 'Waterproofing' }, value: { bg: '100%', en: '100%' } },
      { label: { bg: 'Монтаж', en: 'Mounting' }, value: { bg: 'Към фасадата с обтегачи или колони, самостоятелна, с централна носеща греда', en: 'Façade-mounted with tension rods or posts, freestanding, or on a central beam' } },
      { label: { bg: 'Цвят', en: 'Colour' }, value: anyRal },
    ],
    configurations: [
      ...pvcWallConfigurations,
      {
        title: { bg: 'Самостоятелна с четири колони', en: 'Freestanding on four posts' },
        text: {
          bg: 'Изгражда се като самостоятелна конструкция, но може да се прилепи и до фасадата. Напълно автоматизирана, с два мотора и две самостоятелни покривни системи, които се събират в центъра.',
          en: 'Always built as a freestanding structure, though it can sit against a façade. Fully motorised, with two motors and two independent roof sections that gather in the centre.',
        },
      },
      pvcCentralBeam,
    ],
    options: [...automatedPergolaOptions, { bg: 'Ветрозащита', en: 'Windbreaks' }],
    related: ['curved', 'vertical-zip', 'sliding-glass'],
    video: {
      url: 'https://outplay.bg/video/',
      title: { bg: 'Вижте автоматизираните перголи в движение', en: 'See the automated pergolas in motion' },
    },
    keywords: [
      'пергола', 'перголи', 'поливинилно покритие', 'поливинил', 'pvc', 'пвц', 'платно', 'текстилен покрив',
      'подвижен покрив', 'тента', 'сенник', 'blackout', 'блекаут', 'плоска пергола', 'флат', 'зимна градина',
      'pergola', 'fabric roof', 'retractable roof', 'retractable pergola', 'canopy', 'awning pergola', 'flat',
      'polivinil', 'tenta', 'sennik', 'winter garden',
    ],
  },
  {
    id: 'curved',
    category: 'bioclimatic-pergolas',
    subgroup: 'automated',
    family: 'pergola',
    order: 4,
    name: { bg: 'Curved', en: 'Curved' },
    fullName: {
      bg: 'Биоклиматична пергола с подвижно поливинилно покритие, серия Curved',
      en: 'Curved series bioclimatic pergola with retractable PVC roof',
    },
    tagline: { bg: 'Извит покрив с мек силует.', en: 'An arched roof with a soft silhouette.' },
    summary: {
      bg: 'Пергола с извит покрив тип „арка“ от трислойно Blackout платно. Устоява на вятър до 117 км/ч, неутрализира до 89% от UV лъчението и е 100% водоустойчива.',
      en: 'A pergola with an arched retractable roof in three-layer Blackout PVC. Withstands winds up to 117 km/h, filters up to 89% of UV and is 100% waterproof.',
    },
    sections: [
      {
        heading: { bg: 'Арка, която отвежда водата', en: 'An arch that sheds the rain' },
        paragraphs: [
          {
            bg: 'Моделът Curved внася артистичност и визуален обем във всяко външно пространство със своята извита конструкция тип „арка“. Динамичният силует придава уникален архитектурен характер и оптимизира отвеждането на водата по плавните линии на свода.',
            en: 'Curved brings a sculptural, generous presence to any outdoor space with its arched roof. The flowing silhouette gives a project real architectural character, and the curve of the vault helps rainwater run off.',
          },
          {
            bg: 'Системата устоява на пориви на вятъра до 117 км/ч и неутрализира до 89% от вредното UV лъчение. Със своята 100-процентова водоустойчивост сводестият покрив осигурява комфорт, независимо от капризите на времето.',
            en: 'It withstands gusts of up to 117 km/h and filters out up to 89% of harmful UV radiation. With a 100% waterproof canopy, the vaulted roof keeps you comfortable whatever the weather does.',
          },
          {
            bg: 'Арката се вписва естествено в класически и модерни екстериори, а вграденото LED осветление подчертава извивките на конструкцията вечер. Системата е напълно съвместима с решения за ветрозащита и остъкляване.',
            en: 'The arch suits both classic and contemporary exteriors, and integrated LED lighting picks out its curves at night. It is fully compatible with windbreaks and glazing.',
          },
        ],
      },
      {
        heading: { bg: 'Традиция в подхода, новаторство в технологиите', en: 'Traditional in spirit, modern in engineering' },
        paragraphs: [
          {
            bg: 'В сърцето на алуминиевата конструкция стои трислойна поливинилна материя с интегрирана Blackout технология – напълно водонепромокаема и трудно горима. Тя спира слънчевите лъчи и служи като щит срещу атмосферните влияния, като съчетава класическата естетика на слънцезащитата със съвременна автоматизация.',
            en: 'At the heart of the aluminium frame is a three-layer PVC membrane with integrated Blackout technology, fully waterproof and fire-retardant. It stops the sun and shields against the weather, pairing the classic look of an awning with modern automation.',
          },
          {
            bg: 'Изборът е между динамичните извивки на Curved и строгата елегантност на Flat. И двете серии могат да бъдат самостоятелни или прикрепени към фасадата, с профили в богата палитра от цветове по RAL.',
            en: 'The choice is between the flowing curves of Curved and the crisp elegance of Flat. Both series can be freestanding or fixed to the façade, with profiles in a wide range of RAL colours.',
          },
        ],
      },
      {
        heading: { bg: 'Висящо или вградено покритие', en: 'Hanging or built-in fabric' },
        paragraphs: [
          {
            bg: 'Покритието, висящо под водачите, създава ефирен, средиземноморски ефект и прохладна сянка през лятото. Макар да е проектирано основно за защита от слънце, позволява интегриране на остъкляване срещу вятър и дъжд.',
            en: 'Fabric hanging beneath the guide rails creates a light, Mediterranean effect and cool summer shade. Although designed mainly for sun protection, it can be combined with glazing against wind and rain.',
          },
          {
            bg: 'Покритието, вградено във водачите, дава монолитна визия и висока изолация. Плътното прилягане на елементите отвежда безупречно дъждовната вода и задържа топлината – перфектна основа за зимна градина с вертикално остъкляване.',
            en: 'Fabric built into the guide rails gives a monolithic look and better insulation. The tight fit of the components handles rainwater cleanly and holds in heat, making it the ideal basis for a winter garden with vertical glazing.',
          },
        ],
      },
    ],
    highlights: [
      {
        value: '117',
        unit: { bg: 'км/ч', en: 'km/h' },
        label: { bg: 'максимална устойчивост на пориви на вятъра', en: 'maximum wind gust resistance' },
      },
      { value: '89%', label: { bg: 'максимално неутрализиране на UV лъчението', en: 'maximum UV filtering' } },
      { value: '100%', label: { bg: 'водоустойчивост на покритието', en: 'waterproof fabric' } },
    ],
    features: [
      { bg: 'Извита покривна конструкция тип „арка“', en: 'Arched roof structure' },
      { bg: 'Трислойно поливинилно покритие с Blackout технология', en: 'Three-layer PVC fabric with Blackout technology' },
      { bg: 'Водонепромокаемо, ветроустойчиво и трудно горимо платно', en: 'Waterproof, wind-resistant, fire-retardant fabric' },
      { bg: 'Висококачествена прахово боядисана алуминиева конструкция', en: 'High-grade powder-coated aluminium structure' },
      { bg: 'Интегрирани улуци и скрита система за водооттичане', en: 'Integrated gutters and hidden drainage' },
      { bg: 'Вградено LED осветление, което подчертава арката', en: 'Integrated LED lighting that traces the arch' },
      { bg: 'Покритие, висящо под водачите или вградено в тях', en: 'Fabric hanging beneath the guide rails or built into them' },
    ],
    specs: [
      { label: { bg: 'Конструкция', en: 'Structure' }, value: { bg: 'Алуминий с прахово покритие', en: 'Powder-coated aluminium' } },
      { label: { bg: 'Форма на покрива', en: 'Roof shape' }, value: { bg: 'Извит свод тип „арка“', en: 'Arched vault' } },
      { label: { bg: 'Покритие', en: 'Roof fabric' }, value: { bg: 'Трислойна поливинилна материя с Blackout технология, водонепромокаема и трудно горима', en: 'Three-layer PVC membrane with Blackout technology, waterproof and fire-retardant' } },
      { label: { bg: 'Изпълнение на покрива', en: 'Roof version' }, value: { bg: 'Висящо под водачите или вградено в тях', en: 'Hanging beneath the guide rails or built into them' } },
      { label: { bg: 'Устойчивост на вятър', en: 'Wind resistance' }, value: { bg: 'Пориви до 117 км/ч', en: 'Gusts up to 117 km/h' } },
      { label: { bg: 'UV защита', en: 'UV protection' }, value: { bg: 'До 89%', en: 'Up to 89%' } },
      { label: { bg: 'Водоустойчивост', en: 'Waterproofing' }, value: { bg: '100%', en: '100%' } },
      { label: { bg: 'Цвят', en: 'Colour' }, value: anyRal },
    ],
    configurations: [
      ...pvcWallConfigurations,
      {
        title: { bg: 'Самостоятелна, напълно самоносеща', en: 'Freestanding and fully self-supporting' },
        text: {
          bg: 'Системата може да е с два мотора и две самостоятелни покривни конструкции, които се събират в центъра, или едномоторна – само с четири колони, като покривът се прибира в единия край.',
          en: 'Either two motors with two independent roof sections that gather in the centre, or a single motor on just four posts with the roof retracting to one end.',
        },
      },
      pvcCentralBeam,
    ],
    options: [...automatedPergolaOptions, { bg: 'Ветрозащита', en: 'Windbreaks' }],
    related: ['flat', 'telescopic-windbreak', 'sliding-glass'],
    video: {
      url: 'https://outplay.bg/video/',
      title: { bg: 'Вижте автоматизираните перголи в движение', en: 'See the automated pergolas in motion' },
    },
    keywords: [
      'пергола', 'перголи', 'извита пергола', 'арка', 'сводест покрив', 'поливинилно покритие', 'поливинил', 'pvc',
      'платно', 'подвижен покрив', 'тента', 'сенник', 'blackout', 'кървд', 'зимна градина', 'покривна тераса',
      'pergola', 'curved pergola', 'arched roof', 'fabric roof', 'retractable roof', 'canopy', 'curved',
      'polivinil', 'tenta', 'sennik', 'winter garden',
    ],
  },
  {
    id: 'automatic-glass-roof',
    category: 'bioclimatic-pergolas',
    subgroup: 'automated',
    family: 'pergola',
    order: 5,
    name: { bg: 'Автоматичен стъклен покрив', en: 'Retractable glass roof' },
    nameInline: { bg: 'автоматичен стъклен покрив', en: 'a retractable glass roof' },
    fullName: {
      bg: 'Биоклиматична алуминиева пергола с автоматичен стъклен покрив',
      en: 'Bioclimatic aluminium pergola with motorised retractable glass roof',
    },
    tagline: { bg: 'Светлина без граници, защита без компромиси.', en: 'Boundless light, complete protection.' },
    summary: {
      bg: 'Алуминиева пергола с хоризонтално прибиращи се стъклени панели от ламинирано и закалено STOP RAY стъкло, монтирана под наклон от 15% за мигновено отводняване.',
      en: 'An aluminium pergola with horizontally retracting panels of laminated and tempered STOP RAY glass, installed at a 15% slope so rain drains away instantly.',
    },
    sections: [
      {
        heading: { bg: 'Светлина без граници, защита без компромиси', en: 'Boundless light, complete protection' },
        paragraphs: [
          {
            bg: 'Автоматизираните системи с подвижни стъклени панели образуват прозрачна преграда, която Ви държи свързани с околния свят, без компромис с комфорта. Хоризонтално прибиращите се панели пропускат изобилие от естествена светлина и създават усещане за простор и архитектурна лекота.',
            en: 'Motorised systems with moving glass panels form a transparent shelter that keeps you connected to your surroundings without giving up comfort. The horizontally retracting panels let in abundant daylight and create a sense of space and lightness.',
          },
          {
            bg: 'Терасата или градината се превръща в открито и модерно кътче, където границата между интериора и природата изчезва, а стъклото добавя нотка на лукс към всеки проект.',
            en: 'A terrace or garden becomes an open, contemporary space where the line between inside and outside disappears, and the glass adds a touch of luxury to any project.',
          },
          {
            bg: 'Системата съчетава ламинирано и закалено стъкло „STOP RAY“ в конфигурация, която осигурява висока здравина и енергийна ефективност. Нюансираните стъклопакети по избор позволяват да постигнете точно търсената естетика.',
            en: 'The system combines laminated glass with tempered STOP RAY glass for strength and energy efficiency. Optional tinted glazing units let you fine-tune the look.',
          },
        ],
      },
      {
        heading: { bg: 'Технологично съвършенство и целогодишен комфорт', en: 'Precise engineering, year-round comfort' },
        paragraphs: [
          {
            bg: 'Висок клас уплътнения осигуряват безупречна хидроизолация, а монтажът под наклон от 15% гарантира правилното и мигновено отводняване при дъжд.',
            en: 'High-grade seals keep the roof watertight, and installation at a 15% slope makes sure rain drains away immediately.',
          },
          {
            bg: 'Подвижните панели могат да се съчетаят с фиксирани стъклени зони според пространството. С вертикално остъкляване перголата става пълноценно разширение на дома или търговския обект, което се използва и в сърцето на зимата.',
            en: 'Moving panels can be combined with fixed glass sections to suit the space. With vertical glazing, the pergola becomes a true extension of a home or business that you can use even in midwinter.',
          },
        ],
      },
      {
        heading: { bg: 'Висококачествени материали и персонализация', en: 'Quality materials, personal finish' },
        paragraphs: [
          {
            bg: 'В основата на конструкцията стои висок клас алуминий, който гарантира десетилетия експлоатация без следи от корозия, дори при силни атмосферни влияния.',
            en: 'The frame is made from high-grade aluminium for decades of corrosion-free use, even in harsh weather.',
          },
          {
            bg: 'Елементите се обработват със специално прахово покритие в богата палитра от цветове по RAL – от класически мат и гланц до текстури и топли дървесни декори.',
            en: 'Components are powder-coated in a wide range of RAL colours, from classic matt and gloss to textured finishes and warm wood-effect décors.',
          },
        ],
      },
    ],
    highlights: [
      { value: '15%', label: { bg: 'наклон на покрива за мигновено отводняване', en: 'roof slope for instant drainage' } },
      { value: 'STOP RAY', label: { bg: 'закалено горно стъкло', en: 'tempered upper glass' } },
      { value: 'RAL', label: { bg: 'мат, гланц, текстури и дървесни декори', en: 'matt, gloss, textures and wood décors' } },
    ],
    features: [
      { bg: 'Хоризонтално прибиращи се стъклени панели', en: 'Horizontally retracting glass panels' },
      { bg: 'Горно закалено стъкло „STOP RAY“ и долно ламинирано стъкло', en: 'Tempered STOP RAY upper glass and laminated lower glass' },
      { bg: 'Подвижни панели с висококачествени уплътнения за пълна водонепропускливост', en: 'Moving panels with high-grade seals for complete watertightness' },
      { bg: 'Монтаж под наклон от 15% за бързо отводняване', en: 'Installed at a 15% slope for fast drainage' },
      { bg: 'Интегрирани улуци', en: 'Integrated gutters' },
      { bg: 'Комбиниране с фиксирани стъклени зони', en: 'Can be combined with fixed glass sections' },
      { bg: 'Прахово боядисана алуминиева конструкция', en: 'Powder-coated aluminium structure' },
    ],
    specs: [
      { label: { bg: 'Конструкция', en: 'Structure' }, value: { bg: 'Висок клас алуминий с прахово покритие', en: 'High-grade powder-coated aluminium' } },
      { label: { bg: 'Покрив', en: 'Roof' }, value: { bg: 'Хоризонтално прибиращи се стъклени панели, комбинируеми с фиксирани зони', en: 'Horizontally retracting glass panels, combinable with fixed sections' } },
      { label: { bg: 'Стъкло', en: 'Glass' }, value: { bg: 'Горно закалено „STOP RAY“, долно ламинирано; нюансирани стъклопакети по избор', en: 'Tempered STOP RAY upper pane, laminated lower pane; tinted units optional' } },
      { label: { bg: 'Уплътнения', en: 'Seals' }, value: { bg: 'Висок клас, за пълна водонепропускливост', en: 'High-grade, fully watertight' } },
      { label: { bg: 'Наклон', en: 'Slope' }, value: { bg: '15%', en: '15%' } },
      { label: { bg: 'Задвижване', en: 'Drive' }, value: { bg: 'Автоматизирано, с дистанционно управление', en: 'Motorised, remote-controlled' } },
      { label: { bg: 'Монтаж', en: 'Mounting' }, value: { bg: 'Самостоятелна единична или двойна, или прикачена към фасада', en: 'Freestanding single or double, or attached to a façade' } },
      { label: { bg: 'Цвят', en: 'Colour' }, value: { bg: 'Всеки цвят по RAL – мат, гланц, текстури, дървесни декори', en: 'Any RAL colour: matt, gloss, textured or wood décor' } },
    ],
    configurations: [
      {
        title: { bg: 'Самостоятелна единична пергола', en: 'Freestanding single pergola' },
        text: { bg: 'Самостоятелна конструкция с подвижен стъклен покрив.', en: 'A freestanding structure with a retractable glass roof.' },
      },
      {
        title: { bg: 'Прикачена към фасада', en: 'Attached to a façade' },
        text: { bg: 'Перголата се прикрепя към сградата и продължава интериора навън.', en: 'Fixed to the building, extending the interior outdoors.' },
      },
      {
        title: { bg: 'Самостоятелна двойна пергола', en: 'Freestanding double pergola' },
        text: { bg: 'Два модула, в които подвижните панели се комбинират с фиксиран панел.', en: 'Two modules combining moving panels with a fixed panel.' },
      },
    ],
    options: [
      { bg: 'Нюансирани стъклопакети', en: 'Tinted glazing units' },
      { bg: 'Фиксирани стъклени зони', en: 'Fixed glass sections' },
      { bg: 'ZIP завеси за стъклени покриви', en: 'Roof ZIP screens' },
      ...automatedPergolaOptions,
    ],
    related: ['fixed-glass-roof', 'roof-zip', 'guillotine'],
    video: {
      url: 'https://outplay.bg/video/',
      title: { bg: 'Вижте автоматизираните перголи в движение', en: 'See the automated pergolas in motion' },
    },
    keywords: [
      'стъклен покрив', 'подвижен стъклен покрив', 'автоматичен покрив', 'плъзгащ покрив', 'стъклена пергола',
      'пергола', 'зимна градина', 'веранда', 'остъкляване', 'stop ray', 'стоп рей', 'ресторант', 'заведение',
      'glass roof', 'retractable glass roof', 'sliding glass roof', 'motorised roof', 'motorized roof', 'glass pergola',
      'conservatory', 'winter garden', 'steklen pokriv', 'pergola',
    ],
  },

  // ───────────────────────── Bioclimatic pergolas · fixed ─────────────────────────
  {
    id: 'fixed-glass-roof',
    category: 'bioclimatic-pergolas',
    subgroup: 'fixed',
    family: 'pergola',
    order: 6,
    name: { bg: 'Стационарен стъклен покрив', en: 'Fixed glass roof' },
    nameInline: { bg: 'стационарен стъклен покрив', en: 'a fixed glass roof' },
    fullName: {
      bg: 'Биоклиматична алуминиева пергола със стационарен стъклен покрив',
      en: 'Bioclimatic aluminium pergola with fixed glass roof',
    },
    tagline: { bg: 'Инженерна гъвкавост и структурен финес.', en: 'Flexible engineering, refined structure.' },
    summary: {
      bg: 'Алуминиева пергола с фиксиран стъклен покрив в наклонен или плосък вариант. Дневна светлина през цялата година и защита от сняг и вятър, без движещи се части.',
      en: 'An aluminium pergola with a fixed glass roof, sloped or flat. Daylight all year round and shelter from snow and wind, with no moving parts.',
    },
    sections: [
      {
        heading: { bg: 'Инженерна гъвкавост и структурен финес', en: 'Flexible engineering, refined structure' },
        paragraphs: [
          {
            bg: 'Алуминиевите перголи със стационарен стъклен покрив превръщат откритите пространства в обитаеми през цялата година зони с неограничен достъп на дневна светлина.',
            en: 'Aluminium pergolas with a fixed glass roof turn outdoor areas into year-round living spaces filled with daylight.',
          },
          {
            bg: 'Системата съчетава здравината на прецизно проектираната алуминиева конструкция с ефирността на стъклото. Проектирана е да издържа на големи натоварвания от сняг и силни ветрове, без да затваря визуално пространството. Подходяща е за зимни градини, веранди и търговски площи, където е нужно „невидимо“ покритие, което не нарушава архитектурния силует.',
            en: 'The system combines a precisely engineered aluminium frame with the lightness of glass. It is designed to carry heavy snow loads and resist strong winds without closing in the view, which makes it ideal for winter gardens, verandas and commercial spaces that need an almost invisible roof.',
          },
        ],
      },
      {
        heading: { bg: 'Лукс и защита под всякакъв ъгъл', en: 'Protection from every angle' },
        paragraphs: [
          {
            bg: 'Покривът се изпълнява в два варианта. Наклоненият е класическо решение с естествено оттичане на водата и динамична линия, а ненаклоненият – с интегриран скрит наклон на стъклото в рамката – предлага строго геометрична, плоска визия за модерни минималистични проекти.',
            en: 'The roof comes in two versions. The sloped version is the classic choice, with natural run-off and a dynamic line; the flat version hides the glass slope inside the frame for a strictly geometric look suited to minimalist architecture.',
          },
          {
            bg: 'И в двата случая водоотвеждането е вградено в носещите профили, без видими улуци и тръби, което прави конструкцията едновременно функционална и визуално лека.',
            en: 'In both cases drainage is built into the load-bearing profiles, with no visible gutters or pipes, so the structure stays practical and visually light.',
          },
          {
            bg: 'Алуминиевата структура може да бъде прахово боядисана във всеки цвят по RAL, а стъклото – прозрачно, тонирано или огледално, за контрол на слънчевата топлина и отблясъците. Системата се комбинира с моторизирани покривни ZIP завеси и плъзгащо вертикално остъкляване.',
            en: 'The aluminium frame can be powder-coated in any RAL colour, and the glass can be clear, tinted or mirrored to control solar heat and glare. The system can be combined with motorised roof ZIP screens and sliding vertical glazing.',
          },
        ],
      },
      {
        heading: { bg: 'Статична мощ в два силуета', en: 'Static strength in two forms' },
        paragraphs: [
          {
            bg: 'Стационарните перголи се предлагат в две посоки – с прозрачен стъклен покрив за максимум светлина или с термопанели за климатичен контрол и плътна защита. И двете споделят обща алуминиева основа със скрито водоотвеждане и устойчивост на обилни снеговалежи и бурни ветрове.',
            en: 'Fixed-roof pergolas come in two forms: a clear glass roof for maximum light, or insulated panels for climate control and solid shelter. Both share an aluminium frame with hidden drainage, built to handle heavy snowfall and strong winds.',
          },
          {
            bg: 'Липсата на движещи се части означава тишина и надеждност през десетилетията.',
            en: 'With no moving parts, they stay silent and reliable for decades.',
          },
        ],
      },
    ],
    highlights: [
      { value: '2', unit: { bg: 'варианта', en: 'versions' }, label: { bg: 'наклонен или плосък покрив', en: 'sloped or flat roof' } },
      { value: '0', label: { bg: 'движещи се части', en: 'moving parts' } },
      { value: '3', unit: { bg: 'вида стъкло', en: 'glass types' }, label: { bg: 'прозрачно, тонирано или огледално', en: 'clear, tinted or mirrored' } },
      ralHighlight,
    ],
    features: [
      { bg: 'Фиксирани стъклени панели с висококачествени уплътнения за пълна водонепропускливост', en: 'Fixed glass panels with high-grade seals for complete watertightness' },
      { bg: 'Наклонен или плосък вариант на изпълнение', en: 'Sloped or flat version' },
      { bg: 'Интегрирани улуци и скрита система за водооттичане', en: 'Integrated gutters and hidden drainage' },
      { bg: 'Без видими улуци и тръби', en: 'No visible gutters or pipes' },
      { bg: 'Проектирана за натоварване от сняг и силен вятър', en: 'Designed for snow loads and strong winds' },
      { bg: 'Прахово боядисана алуминиева конструкция', en: 'Powder-coated aluminium structure' },
      { bg: 'Без движещи се части', en: 'No moving parts' },
    ],
    specs: [
      { label: { bg: 'Конструкция', en: 'Structure' }, value: { bg: 'Алуминий с прахово покритие', en: 'Powder-coated aluminium' } },
      { label: { bg: 'Покрив', en: 'Roof' }, value: { bg: 'Фиксирани стъклени панели с висококачествени уплътнения', en: 'Fixed glass panels with high-grade seals' } },
      { label: { bg: 'Изпълнение', en: 'Version' }, value: { bg: 'Наклонено или плоско (скрит наклон на стъклото в рамката)', en: 'Sloped or flat (glass slope concealed in the frame)' } },
      { label: { bg: 'Стъкло', en: 'Glass' }, value: { bg: 'Прозрачно, тонирано или огледално', en: 'Clear, tinted or mirrored' } },
      { label: { bg: 'Отводняване', en: 'Drainage' }, value: { bg: 'Вградено в носещите профили', en: 'Built into the load-bearing profiles' } },
      { label: { bg: 'Натоварване', en: 'Loads' }, value: { bg: 'Проектирана за сняг и силен вятър', en: 'Designed for snow and strong wind' } },
      { label: { bg: 'Цвят', en: 'Colour' }, value: anyRal },
      { label: { bg: 'Съвместимост', en: 'Combines with' }, value: { bg: 'Покривни ZIP завеси, плъзгащо вертикално остъкляване', en: 'Roof ZIP screens, sliding vertical glazing' } },
    ],
    configurations: [
      {
        title: { bg: 'Наклонен вариант', en: 'Sloped version' },
        text: { bg: 'Класическо решение с естествено оттичане на водата и динамична линия.', en: 'The classic choice, with natural run-off and a dynamic line.' },
      },
      {
        title: { bg: 'Плосък вариант', en: 'Flat version' },
        text: { bg: 'Строго геометрична визия; наклонът на стъклото е скрит в рамката.', en: 'A strictly geometric look, with the glass slope concealed in the frame.' },
      },
    ],
    options: [
      { bg: 'Тонирано или огледално стъкло', en: 'Tinted or mirrored glass' },
      { bg: 'Моторизирани покривни ZIP завеси', en: 'Motorised roof ZIP screens' },
      { bg: 'Плъзгащо вертикално остъкляване', en: 'Sliding vertical glazing' },
      { bg: 'Вградено LED осветление', en: 'Integrated LED lighting' },
    ],
    related: ['automatic-glass-roof', 'roof-zip', 'sliding-glass'],
    keywords: [
      'стъклен покрив', 'фиксиран стъклен покрив', 'стационарен покрив', 'стъклена пергола', 'пергола', 'веранда',
      'зимна градина', 'остъкляване', 'навес', 'стъклен навес', 'козирка',
      'glass roof', 'fixed glass roof', 'glass canopy', 'glass pergola', 'veranda', 'conservatory', 'winter garden',
      'steklen pokriv', 'pergola',
    ],
  },
  {
    id: 'thermo-panel-roof',
    category: 'bioclimatic-pergolas',
    subgroup: 'fixed',
    family: 'pergola',
    order: 7,
    name: { bg: 'Покрив от термопанели', en: 'Insulated panel roof' },
    nameInline: { bg: 'покрив от термопанели', en: 'an insulated panel roof' },
    fullName: {
      bg: 'Биоклиматична алуминиева пергола със стационарен плътен покрив от термопанели',
      en: 'Bioclimatic aluminium pergola with fixed insulated-panel roof',
    },
    tagline: { bg: 'Една конструкция – тераса или навес за кола.', en: 'One structure for a terrace or a carport.' },
    summary: {
      bg: 'Алуминиева пергола с плътен покрив от многослойни термопанели, която пази от прегряване през лятото и задържа топлината през зимата. За тераси, навеси за коли и зимни градини.',
      en: 'An aluminium pergola with a solid multi-layer insulated roof that keeps heat out in summer and in during winter. For terraces, carports and winter gardens.',
    },
    sections: [
      {
        heading: { bg: 'Една конструкция, много приложения', en: 'One structure, many uses' },
        paragraphs: [
          {
            bg: 'Перголите със стационарен покрив от термопанели съчетават визията на алуминиевите конструкции с изолационните предимства на масивното строителство. Многослойните панели блокират преноса на топлина – предотвратяват прегряването през лятото и задържат уютна температура през студените месеци.',
            en: 'Pergolas with a fixed insulated-panel roof combine the look of an aluminium structure with the insulation of a solid building. The multi-layer panels block heat transfer, keeping the space from overheating in summer and holding a comfortable temperature in the colder months.',
          },
          {
            bg: 'Конструкцията е идеална за тераси с южно изложение, както и като интелигентна алтернатива на традиционните навеси за паркиране и масивни гаражи. Тя пази автомобила от градушка, навявания, корозия и пряко слънце.',
            en: 'It is ideal for south-facing terraces and as a smart alternative to a conventional carport or solid garage, protecting your car from hail, drifting snow, corrosion and direct sun.',
          },
        ],
      },
      {
        heading: { bg: 'Скрито водоотвеждане, без движещи се части', en: 'Hidden drainage, no moving parts' },
        paragraphs: [
          {
            bg: 'Водоотвеждането е вградено в носещите профили, затова не са нужни външни улуци и дизайнът остава изчистен. Здравата алуминиева конструкция и устойчивите покривни модули работят безпроблемно и при най-тежките климатични условия, включително обилни снеговалежи и бурни ветрове.',
            en: 'Drainage is built into the load-bearing profiles, so there are no external gutters to spoil the clean lines. The strong aluminium frame and robust roof modules perform reliably in the harshest conditions, including heavy snowfall and strong winds.',
          },
          {
            bg: 'Тъй като системата е стационарна, тя не изисква поддръжка на движещи се части и предлага дълговечност и архитектурна стабилност.',
            en: 'Because the system is fixed, there are no moving parts to maintain, which means a long service life and lasting structural stability.',
          },
        ],
      },
      {
        heading: { bg: 'Индивидуално оформление', en: 'Made to fit' },
        paragraphs: [
          {
            bg: 'Конструкцията се боядисва прахово в пълната палитра RAL. Вътрешната страна на покрива е с изчистен силует, в който лесно се вграждат LED осветление, озвучителни системи или лъчисто отопление.',
            en: 'The frame is powder-coated in the full RAL range. The underside of the roof has a clean finish that makes it easy to integrate LED lighting, sound systems or radiant heating.',
          },
          {
            bg: 'Периметърът може да се оформи изцяло със системи за вертикално остъкляване или с плътни панели. Така пространството получава удобството на закрито помещение, съчетано с лекотата на съвременните алуминиеви конструкции.',
            en: 'The sides can be fully enclosed with vertical glazing or solid panels, giving you the comfort of an indoor room with the lightness of a modern aluminium structure.',
          },
        ],
      },
      {
        heading: { bg: 'Статична мощ в два силуета', en: 'Static strength in two forms' },
        paragraphs: [
          {
            bg: 'Стационарните перголи залагат на две прецизни инженерни посоки – ефирността на стъклените покриви и енергийната ефективност на термоизолираните панели. Вариантите с термопанели предлагат климатичен контрол и плътна защита, характерни за масивното строителство, с приложение от зимни градини и веранди до навеси за автомобили и складови площи.',
            en: 'Fixed-roof pergolas follow two engineering directions: the lightness of glass and the energy efficiency of insulated panels. The insulated-panel versions offer the climate control and solid shelter of a masonry building, with uses ranging from winter gardens and verandas to carports and storage areas.',
          },
        ],
      },
    ],
    highlights: [
      { value: '0', label: { bg: 'движещи се части за поддръжка', en: 'moving parts to maintain' } },
      { value: 'LED', label: { bg: 'осветление, озвучаване или лъчисто отопление в тавана', en: 'lighting, sound or radiant heating in the ceiling' } },
      ralHighlight,
    ],
    features: [
      { bg: 'Многослойни термопанели', en: 'Multi-layer insulated panels' },
      { bg: 'Вградени улуци със скрита система за водооттичане', en: 'Built-in gutters with hidden drainage' },
      { bg: 'Защита от градушка, навявания, корозия и пряко слънце', en: 'Protection from hail, drifting snow, corrosion and direct sun' },
      { bg: 'Без движещи се части', en: 'No moving parts' },
      { bg: 'Изчистен таван, готов за LED, озвучаване или лъчисто отопление', en: 'Clean ceiling ready for LED, sound or radiant heating' },
      { bg: 'Периметър с вертикално остъкляване или плътни панели', en: 'Sides closed with vertical glazing or solid panels' },
      { bg: 'Прахово боядисана алуминиева конструкция', en: 'Powder-coated aluminium structure' },
    ],
    specs: [
      { label: { bg: 'Конструкция', en: 'Structure' }, value: { bg: 'Алуминий с прахово покритие', en: 'Powder-coated aluminium' } },
      { label: { bg: 'Покрив', en: 'Roof' }, value: { bg: 'Стационарен, от многослойни термопанели', en: 'Fixed, multi-layer insulated panels' } },
      { label: { bg: 'Отводняване', en: 'Drainage' }, value: { bg: 'Вградено в носещите профили, без външни улуци', en: 'Built into the load-bearing profiles, no external gutters' } },
      { label: { bg: 'Движещи се части', en: 'Moving parts' }, value: { bg: 'Няма', en: 'None' } },
      { label: { bg: 'Таван', en: 'Ceiling' }, value: { bg: 'Готов за LED, озвучаване или лъчисто отопление', en: 'Ready for LED, sound or radiant heating' } },
      { label: { bg: 'Странично затваряне', en: 'Side enclosure' }, value: { bg: 'Вертикално остъкляване или плътни панели', en: 'Vertical glazing or solid panels' } },
      { label: { bg: 'Приложение', en: 'Uses' }, value: { bg: 'Тераси, навеси за автомобили, зимни градини, веранди, складови площи', en: 'Terraces, carports, winter gardens, verandas, storage areas' } },
      { label: { bg: 'Цвят', en: 'Colour' }, value: anyRal },
    ],
    configurations: [
      {
        title: { bg: 'Открит навес за автомобили', en: 'Open carport' },
        text: { bg: 'Защита от градушка, сняг и слънце без масивен гараж.', en: 'Shelter from hail, snow and sun without a solid garage.' },
      },
      {
        title: { bg: 'Затворен с плътни панели', en: 'Enclosed with solid panels' },
        text: { bg: 'Плътни странични панели превръщат навеса в гараж или склад.', en: 'Solid side panels turn the carport into a garage or store.' },
      },
      {
        title: { bg: 'Остъклено помещение', en: 'Glazed room' },
        text: { bg: 'С вертикално остъкляване по периметъра – зона за отдих или зимна градина.', en: 'With vertical glazing all round, a lounge or winter garden.' },
      },
    ],
    options: [
      { bg: 'Вградено LED осветление', en: 'Integrated LED lighting' },
      { bg: 'Озвучителни системи', en: 'Sound systems' },
      { bg: 'Лъчисто отопление', en: 'Radiant heating' },
      { bg: 'Вертикално остъкляване по периметъра', en: 'Vertical glazing around the perimeter' },
      { bg: 'Плътни странични панели', en: 'Solid side panels' },
    ],
    related: ['fixed-glass-roof', 'sliding-glass', 'guillotine'],
    keywords: [
      'термопанели', 'термо панели', 'сандвич панели', 'плътен покрив', 'навес', 'навес за кола', 'навес за автомобил',
      'паркинг', 'гараж', 'карпорт', 'пергола', 'веранда', 'зимна градина', 'склад',
      'carport', 'car port', 'garage', 'insulated roof', 'insulated panels', 'sandwich panels', 'thermo panel',
      'solid roof', 'termopaneli', 'naves', 'pergola',
    ],
  },

  // ───────────────────────── Glass systems · automated ─────────────────────────
  {
    id: 'guillotine',
    category: 'glass-systems',
    subgroup: 'automatic',
    family: 'glass',
    order: 8,
    name: { bg: 'Гилотина', en: 'Guillotine' },
    nameInline: { bg: 'гилотина', en: 'a guillotine system' },
    fullName: {
      bg: 'Автоматична вертикално плъзгаща се стъклена система тип „гилотина“',
      en: 'Motorised vertical-sliding guillotine glass system',
    },
    tagline: { bg: 'От сигурна бариера до свободен хоризонт.', en: 'From secure barrier to open horizon.' },
    summary: {
      bg: 'Моторизирани стъклени панели, които се плъзгат вертикално и спират във всяко положение. Конфигурации с 2, 3 или 4 панела и патентован механизъм за лесно почистване.',
      en: 'Motorised glass panels that slide vertically and stop at any height. Two-, three- or four-panel configurations and a patented mechanism for easy cleaning.',
    },
    sections: [
      {
        heading: { bg: 'Стъклена стена, която се движи с бутон', en: 'A glass wall that moves at the touch of a button' },
        paragraphs: [
          {
            bg: 'Системите за вертикално отваряне тип „гилотина“ трансформират пространството визуално и практически, като съчетават привлекателна визия, енергийна ефективност и удобство. Благодарение на интелигентния си механизъм те са предпочитано решение за обекти с различен мащаб и предназначение.',
            en: 'Vertical-opening guillotine systems transform a space both visually and practically, combining striking looks, energy efficiency and everyday convenience. Their intelligent mechanism makes them a favourite for projects of every scale and purpose.',
          },
          {
            bg: 'Конструкцията е напълно съвместима с цялата гама биоклиматични перголи и заедно с тях създава енергийно ефективна зона с отлични топлоизолационни характеристики. Това улеснява климатизацията и отоплението и запазва уюта през всеки сезон.',
            en: 'The system is fully compatible with the entire bioclimatic pergola range, and together they create an energy-efficient enclosure with excellent thermal insulation, easier to heat or cool and comfortable in every season.',
          },
        ],
      },
      {
        heading: { bg: 'От сигурна бариера до свободен хоризонт', en: 'From secure barrier to open horizon' },
        paragraphs: [
          {
            bg: 'Системата е подходяща за открити заведения, веранди и покривни тераси, където стъклените панели могат да заменят стандартните перила и да служат като балюстрада по целия периметър. Можете да избирате между конфигурации с два, три или четири панела, които се прибират плавно зад най-долния или най-горния сегмент – за панорамен парапет или напълно свободен проход.',
            en: 'The system suits open-air restaurants, verandas and roof terraces, where the glass panels can replace conventional railings and act as a balustrade around the whole perimeter. Choose two, three or four panels that slide smoothly behind the lowest or highest segment, giving you either a panoramic parapet or a completely open passage.',
          },
          {
            bg: 'Движението се управлява дистанционно чрез мощен двигател и устойчива верижна предавка, а панелите могат да се застопорят във всяко положение. Използват се единични закалени стъкла или висок клас стъклопакети, а алуминиевите профили се боядисват във всеки цвят по RAL.',
            en: 'Movement is remote-controlled through a powerful motor and durable chain drive, and the panels can stop at any position. Glazing is single tempered glass or high-grade insulated units, and the aluminium profiles can be finished in any RAL colour.',
          },
        ],
      },
      {
        heading: { bg: 'Еволюция в достъпа', en: 'Opening upwards' },
        paragraphs: [
          {
            bg: 'Когато панелите се движат нагоре, отпада нуждата от фиксиран долен парапет и достъпът навън е напълно свободен. Стъклените модули се прибират в горната част на конструкцията, а подът остава без архитектурни бариери.',
            en: 'When the panels travel upwards, there is no need for a fixed lower parapet and the way outside is completely clear. The glass modules retract into the top of the structure, leaving the floor free of any barrier.',
          },
          {
            bg: 'Този тип отваряне е особено ефективен за обекти с голям човекопоток и за тераси, при които се търси максимален светъл отвор. Панелите горе осигуряват и естествена вентилация, без да намаляват полезния обем и без да закриват гледката.',
            en: 'This works especially well for busy venues and for terraces that need the widest possible opening. With the panels raised, fresh air flows in naturally without taking up usable space or blocking the view.',
          },
        ],
      },
      {
        heading: { bg: 'Интелигентен дизайн за лесна поддръжка', en: 'Designed for easy cleaning' },
        paragraphs: [
          {
            bg: 'Патентованият механизъм позволява на най-вътрешния и средните стъклени панели да се отварят плавно навътре, за да достигнете безопасно външната им страна. Така почиствате стъклата сами, бързо и без специализирана алпийска техника или външна помощ.',
            en: 'A patented mechanism lets the innermost and middle glass panels tilt smoothly inwards, so you can reach their outer face safely. You can clean the glass yourself, quickly, without rope-access specialists or outside help.',
          },
        ],
      },
    ],
    highlights: [
      { value: '2–4', unit: { bg: 'панела', en: 'panels' }, label: { bg: 'в конфигурация', en: 'per configuration' } },
      { value: '2', unit: { bg: 'варианта', en: 'layouts' }, label: { bg: 'фиксиран долен или горен панел', en: 'fixed bottom or top panel' } },
      ralHighlight,
    ],
    features: [
      { bg: 'Конфигурации с 2, 3 или 4 панела', en: 'Two-, three- or four-panel configurations' },
      { bg: 'Фиксиран долен или фиксиран горен панел', en: 'Fixed bottom or fixed top panel' },
      { bg: 'Мощен двигател и устойчива верижна предавка', en: 'Powerful motor and durable chain drive' },
      { bg: 'Дистанционно управление и застопоряване във всяко положение', en: 'Remote control, stops at any position' },
      { bg: 'Единични закалени стъкла или стъклопакети', en: 'Single tempered glass or insulated units' },
      { bg: 'Патентован механизъм за почистване – панелите се отварят навътре', en: 'Patented tilt-in mechanism for cleaning' },
      { bg: 'Отваряне нагоре без фиксиран долен парапет', en: 'Upward opening with no fixed lower parapet' },
      { bg: 'Пълна съвместимост с цялата гама биоклиматични перголи', en: 'Fully compatible with the entire bioclimatic pergola range' },
    ],
    specs: [
      { label: { bg: 'Тип', en: 'Type' }, value: { bg: 'Вертикално плъзгащи се стъклени панели', en: 'Vertically sliding glass panels' } },
      { label: { bg: 'Брой панели', en: 'Panels' }, value: { bg: '2, 3 или 4', en: '2, 3 or 4' } },
      { label: { bg: 'Задвижване', en: 'Drive' }, value: { bg: 'Мощен двигател с верижна предавка', en: 'Powerful motor with chain drive' } },
      { label: { bg: 'Управление', en: 'Control' }, value: { bg: 'Дистанционно, застопоряване във всяко положение', en: 'Remote control, stops at any position' } },
      { label: { bg: 'Стъкло', en: 'Glass' }, value: { bg: 'Единично закалено или висок клас стъклопакет', en: 'Single tempered glass or high-grade insulated unit' } },
      { label: { bg: 'Почистване', en: 'Cleaning' }, value: { bg: 'Патентован механизъм – вътрешният и средните панели се отварят навътре', en: 'Patented mechanism, inner and middle panels tilt inwards' } },
      { label: { bg: 'Цвят на профилите', en: 'Profile colour' }, value: anyRal },
      { label: { bg: 'Съвместимост', en: 'Compatibility' }, value: { bg: 'Цялата гама биоклиматични перголи', en: 'The entire bioclimatic pergola range' } },
    ],
    configurations: [
      {
        title: { bg: 'Фиксиран долен панел', en: 'Fixed bottom panel' },
        text: {
          bg: 'Подвижните панели се прибират зад най-долния сегмент и образуват панорамен стъклен парапет.',
          en: 'The moving panels slide down behind the lowest segment, forming a panoramic glass parapet.',
        },
      },
      {
        title: { bg: 'Фиксиран горен панел', en: 'Fixed top panel' },
        text: {
          bg: 'Панелите се прибират нагоре зад най-горния сегмент и освобождават напълно прохода, без долен парапет.',
          en: 'The panels rise behind the highest segment, leaving a completely open passage with no lower parapet.',
        },
      },
    ],
    options: [
      { bg: 'Стъклопакети вместо единично стъкло', en: 'Insulated glazing instead of single glass' },
      { bg: 'Тонирано стъкло', en: 'Tinted glass' },
      { bg: 'Комбиниране с биоклиматична пергола', en: 'Combined with a bioclimatic pergola' },
    ],
    related: ['balance', 'sliding-glass', 'automatic-glass-roof'],
    keywords: [
      'гилотина', 'гилотинна система', 'гилотинни прозорци', 'вертикално плъзгащи', 'вертикално остъкляване',
      'остъкляване', 'остъкляване на тераса', 'остъкляване на заведение', 'стъклена стена', 'стъклен парапет',
      'балкон', 'ресторант', 'заведение', 'моторизирано остъкляване',
      'guillotine', 'guillotine glass', 'guillotine window', 'vertical sliding', 'vertical sliding glass', 'glass wall',
      'gilotina', 'ostaklyavane', 'glazing',
    ],
  },
  {
    id: 'dormakaba-es-200',
    category: 'glass-systems',
    subgroup: 'automatic',
    family: 'door',
    order: 9,
    name: { bg: 'dormakaba ES 200', en: 'dormakaba ES 200' },
    fullName: {
      bg: 'Автоматични хоризонтално плъзгащи се стъклени входни врати dormakaba ES 200',
      en: 'dormakaba ES 200 automatic sliding glass entrance doors',
    },
    tagline: { bg: 'Динамика в движението, съвършенство в детайла.', en: 'Smooth in motion, precise in detail.' },
    summary: {
      bg: 'Автоматични плъзгащи се стъклени врати със задвижване ES 200: плавно и безшумно движение, стандартни или телескопични крила и безконтактно отваряне.',
      en: 'Automatic sliding glass doors with the ES 200 drive: smooth, quiet movement, standard or telescopic leaves and touchless opening.',
    },
    sections: [
      {
        heading: { bg: 'Динамика в движението, съвършенство в детайла', en: 'Smooth in motion, precise in detail' },
        paragraphs: [
          {
            bg: 'Автоматичните хоризонтално плъзгащи се стъклени врати dormakaba, задвижвани от механизма ES 200, са съвременен стандарт за входни пространства. Модулната система осигурява плавно и безшумно движение и превръща всеки вход в приветлив портал с модерна визия.',
            en: 'dormakaba automatic horizontal sliding glass doors, powered by the ES 200 drive, set the standard for contemporary entrances. The modular system moves smoothly and quietly, turning any entrance into a welcoming, modern threshold.',
          },
          {
            bg: 'Благодарение на гъвкавостта и елегантния си дизайн системата се вписва в търговски центрове, бизнес сгради и представителни обществени пространства, където първото впечатление е от решаващо значение.',
            en: 'Flexible and elegant, the system suits shopping centres, office buildings and prestigious public spaces, wherever first impressions count.',
          },
        ],
      },
      {
        heading: { bg: 'Техническа прецизност и естетическа гъвкавост', en: 'Technical precision, design flexibility' },
        paragraphs: [
          {
            bg: 'Сигурността и надеждността са заложени в самата архитектура на ES 200, съобразена с най-строгите европейски стандарти за безопасност. Модулният принцип позволява адаптиране към всеки проект – от стандартни плъзгащи се крила до телескопични варианти, които увеличават светлия отвор при ограничено пространство.',
            en: 'Safety and reliability are built into the ES 200, designed around the strictest European safety standards. Its modular design adapts to each project, from standard sliding leaves to telescopic versions that widen the clear opening where space is tight.',
          },
          {
            bg: 'Здравата алуминиева конструкция и висококачествените ролкови механизми осигуряват десетилетия интензивна експлоатация с минимална поддръжка. Крилата се изпълняват от закалено или ламинирано стъкло, а алуминиевите компоненти – с прахово боядисване по RAL или елоксация, за да продължат естествено фасадата.',
            en: 'A sturdy aluminium frame and high-quality roller mechanisms deliver decades of heavy use with minimal maintenance. Leaves are glazed with tempered or laminated glass, and aluminium parts are powder-coated in any RAL colour or anodised to continue the lines of the façade.',
          },
        ],
      },
      {
        heading: { bg: 'Интелигентно управление за безкомпромисна хигиена', en: 'Touchless control for better hygiene' },
        paragraphs: [
          {
            bg: 'Освен стандартната автоматизация предлагаме решения за безконтактно управление. Сензорът Magic Switch, базиран на радарна технология, отваря вратата с леко движение на ръката пред устройството, без физически допир. За среди, изискващи максимална стерилност, или когато хората минават с пълни ръце може да се интегрира и дискретен крачен бутон.',
            en: 'Beyond standard automation, we offer touchless control. The Magic Switch sensor uses radar technology to open the door with a simple wave of the hand, with no physical contact. Where sterility matters most, or where people pass with their hands full, a discreet foot button can be added.',
          },
          {
            bg: 'Сензорите имат минималистичен дизайн и позволяват скрит монтаж, който се слива с всяка повърхност. Те са ефективни и при автоматизиране на нискоенергийни врати, което прави системите на dormakaba подходящи за медицински заведения, лаборатории, обекти от хранително-вкусовия сектор и обществени сгради.',
            en: 'The sensors have a minimal design and can be mounted flush with any surface. They also work well for automating low-energy doors, which makes dormakaba systems a strong choice for medical facilities, laboratories, food businesses and public buildings.',
          },
        ],
      },
    ],
    highlights: [
      { value: 'ES 200', label: { bg: 'задвижване dormakaba', en: 'dormakaba drive' } },
      { value: '2', unit: { bg: 'вида крила', en: 'leaf types' }, label: { bg: 'стандартни или телескопични', en: 'standard or telescopic' } },
      { value: 'RAL', label: { bg: 'или елоксация на профилите', en: 'or anodised profiles' } },
    ],
    features: [
      { bg: 'Задвижване dormakaba ES 200 с плавно и безшумно движение', en: 'dormakaba ES 200 drive, smooth and quiet' },
      { bg: 'Модулна система – стандартни или телескопични крила', en: 'Modular system, standard or telescopic leaves' },
      { bg: 'Закалено или ламинирано стъкло', en: 'Tempered or laminated glass' },
      { bg: 'Здрава алуминиева конструкция и висококачествени ролкови механизми', en: 'Sturdy aluminium frame and high-quality roller mechanisms' },
      { bg: 'Прахово боядисване по RAL или елоксация', en: 'Powder-coated to RAL or anodised' },
      { bg: 'Безконтактен радарен сензор Magic Switch', en: 'Magic Switch touchless radar sensor' },
      { bg: 'Дискретен крачен бутон по избор', en: 'Optional discreet foot button' },
      { bg: 'Сензори със скрит монтаж', en: 'Flush-mounted sensors' },
    ],
    specs: [
      { label: { bg: 'Задвижване', en: 'Drive' }, value: { bg: 'dormakaba ES 200', en: 'dormakaba ES 200' } },
      { label: { bg: 'Тип', en: 'Type' }, value: { bg: 'Автоматични хоризонтално плъзгащи се врати', en: 'Automatic horizontal sliding doors' } },
      { label: { bg: 'Крила', en: 'Leaves' }, value: { bg: 'Стандартни плъзгащи или телескопични', en: 'Standard sliding or telescopic' } },
      { label: { bg: 'Стъкло', en: 'Glass' }, value: { bg: 'Закалено или ламинирано', en: 'Tempered or laminated' } },
      { label: { bg: 'Профили', en: 'Profiles' }, value: { bg: 'Алуминий, прахово боядисване по RAL или елоксация', en: 'Aluminium, powder-coated to RAL or anodised' } },
      { label: { bg: 'Безконтактно отваряне', en: 'Touchless opening' }, value: { bg: 'Сензор Magic Switch (радар), крачен бутон', en: 'Magic Switch radar sensor, foot button' } },
      { label: { bg: 'Приложение', en: 'Uses' }, value: { bg: 'Търговски и офис сгради, медицински заведения, лаборатории, хранителен сектор, обществени сгради', en: 'Retail and office buildings, healthcare, laboratories, food sector, public buildings' } },
    ],
    configurations: [
      {
        title: { bg: 'Стандартни плъзгащи крила', en: 'Standard sliding leaves' },
        text: { bg: 'Класическо решение за входове с достатъчно място встрани.', en: 'The classic choice for entrances with room at the sides.' },
      },
      {
        title: { bg: 'Телескопични крила', en: 'Telescopic leaves' },
        text: { bg: 'Увеличават ширината на светлия отвор при ограничено пространство.', en: 'Widen the clear opening where space is limited.' },
      },
    ],
    options: [
      { bg: 'Безконтактен сензор Magic Switch', en: 'Magic Switch touchless sensor' },
      { bg: 'Крачен бутон', en: 'Foot button' },
      { bg: 'Ламинирано стъкло', en: 'Laminated glass' },
      { bg: 'Елоксация на профилите', en: 'Anodised profiles' },
    ],
    related: ['sliding-glass', 'guillotine', 'harmonia'],
    keywords: [
      'автоматична врата', 'автоматични врати', 'плъзгаща врата', 'плъзгащи врати', 'входна врата', 'стъклена врата',
      'дорма', 'дормакаба', 'сензор', 'безконтактна врата', 'фотоклетка', 'телескопична врата', 'магазин', 'офис',
      'dorma', 'dormakaba', 'es200', 'es 200', 'automatic door', 'sliding door', 'entrance door', 'magic switch',
      'touchless', 'avtomatichna vrata', 'vrata',
    ],
  },

  // ───────────────────────── Glass systems · manual ─────────────────────────
  {
    id: 'sliding-glass',
    category: 'glass-systems',
    subgroup: 'manual',
    family: 'glass',
    order: 10,
    name: { bg: 'Плъзгащи стъклени системи', en: 'Sliding glass walls' },
    nameInline: { bg: 'плъзгащи стъклени системи', en: 'sliding glass walls' },
    fullName: {
      bg: 'Ръчни хоризонтално плъзгащи се стъклени системи',
      en: 'Manual horizontal sliding glass systems',
    },
    tagline: { bg: 'Минималистичен силует за визуална свобода.', en: 'A minimal frame for an open view.' },
    summary: {
      bg: 'Ръчни хоризонтално плъзгащи се стъклени панели върху основа с 2, 3 или 4 релси. Всички панели се прибират от едната страна, а нископрофилната каса е без праг.',
      en: 'Manual horizontal sliding glass panels on two, three or four tracks. All panels stack to one side, and the low-profile frame has no threshold.',
    },
    sections: [
      {
        heading: { bg: 'Минималистичен силует за визуална свобода', en: 'A minimal frame for an open view' },
        paragraphs: [
          {
            bg: 'Хоризонтално плъзгащите се стъклени панели дефинират съвременния минимализъм и осигуряват постоянна връзка с външната среда. Системата позволява мащабни преградни стени, при които алуминиевите рамки са дискретно интегрирани и фокусът остава върху панорамата.',
            en: 'Horizontal sliding glass panels define contemporary minimalism and keep you connected to the outdoors. The system allows large glass walls in which the aluminium frames stay discreet and the view takes centre stage.',
          },
          {
            bg: 'Панелите могат да бъдат с или без вертикално обкантване, с единични закалени стъкла за ефирност или със стъклопакети за максимална изолация. Нископрофилната каса прави прехода между интериора и екстериора плавен, без прагови елементи.',
            en: 'Panels can be made with or without vertical edge profiles, in single tempered glass for lightness or insulated units for maximum insulation. A low-profile frame lets you step from inside to outside in one smooth movement, with no threshold.',
          },
        ],
      },
      {
        heading: { bg: 'Интуитивен ритъм, прозрачна функционалност', en: 'Intuitive movement, transparent function' },
        paragraphs: [
          {
            bg: 'Конструкцията се изгражда върху основа с две, три или четири релси, което позволява покриване на големи участъци с минимално присъствие на профили. Всички панели могат да се приберат от една и съща страна и да освободят изцяло отвора.',
            en: 'The system runs on a base of two, three or four tracks, so large openings can be glazed with very little visible frame. All panels can stack to the same side, clearing the opening completely.',
          },
          {
            bg: 'Панелите се плъзгат прецизно и безшумно. При затваряне първият панел увлича останалите, а системата се фиксира и заключва автоматично в крайната точка. Степента на отваряне регулирате свободно – от частична вентилация до пълно разкриване на пространството.',
            en: 'The panels glide precisely and silently. When closing, the first panel draws the others along, and the system latches and locks automatically at the end of its travel. You decide how far to open, from a gap for ventilation to a fully open side.',
          },
        ],
      },
      {
        heading: { bg: 'От защитен уют към безкраен хоризонт', en: 'From sheltered comfort to open horizon' },
        paragraphs: [
          {
            bg: 'Въпреки ефирната си визия системата е проектирана с фокус върху сигурността. В затворено положение панелите се фиксират с висококачествени заключващи механизми, а прецизното напасване и здравите алуминиеви профили пазят интериора от неблагоприятни климатични влияния и шум.',
            en: 'For all its lightness, the system is designed with security in mind. When closed, the panels are held by high-quality locking mechanisms, and the precise fit and strong aluminium profiles protect the interior from bad weather and noise.',
          },
          {
            bg: 'Плъзгащите системи превръщат двора и терасата в многосезонна градина, защитена от дъжд, вятър, сняг и студ. Профилите се изработват във всеки цвят по RAL, а системата е напълно съвместима с цялата гама биоклиматични перголи.',
            en: 'Sliding systems turn a courtyard or terrace into a garden room for every season, sheltered from rain, wind, snow and cold. Profiles come in any RAL colour, and the system is fully compatible with the entire bioclimatic pergola range.',
          },
        ],
      },
    ],
    highlights: [
      { value: '2–4', unit: { bg: 'релси', en: 'tracks' }, label: { bg: 'за големи остъклени участъци', en: 'for large glazed openings' } },
      ralHighlight,
    ],
    features: [
      { bg: 'Основа с 2, 3 или 4 релси', en: 'Base with two, three or four tracks' },
      { bg: 'Всички панели се прибират от една и съща страна', en: 'All panels stack to the same side' },
      { bg: 'Първият панел увлича останалите при затваряне', en: 'The first panel draws the others when closing' },
      { bg: 'Автоматично фиксиране и заключване в крайна точка', en: 'Latches and locks automatically at the end of travel' },
      { bg: 'Панели с или без вертикално обкантване', en: 'Panels with or without vertical edge profiles' },
      { bg: 'Единично закалено стъкло или стъклопакет', en: 'Single tempered glass or insulated unit' },
      { bg: 'Нископрофилна каса без праг', en: 'Low-profile frame with no threshold' },
      { bg: 'Пълна съвместимост с цялата гама биоклиматични перголи', en: 'Fully compatible with the entire bioclimatic pergola range' },
    ],
    specs: [
      { label: { bg: 'Задвижване', en: 'Operation' }, value: { bg: 'Ръчно', en: 'Manual' } },
      { label: { bg: 'Релси', en: 'Tracks' }, value: { bg: '2, 3 или 4', en: '2, 3 or 4' } },
      { label: { bg: 'Стъкло', en: 'Glass' }, value: { bg: 'Единично закалено или стъклопакет', en: 'Single tempered or insulated unit' } },
      { label: { bg: 'Панели', en: 'Panels' }, value: { bg: 'С или без вертикално обкантване', en: 'With or without vertical edge profiles' } },
      { label: { bg: 'Каса', en: 'Frame' }, value: { bg: 'Нископрофилна, без прагови елементи', en: 'Low-profile, no threshold' } },
      { label: { bg: 'Заключване', en: 'Locking' }, value: { bg: 'Висококачествени заключващи механизми, автоматично фиксиране', en: 'High-quality locks, automatic latching' } },
      { label: { bg: 'Цвят на профилите', en: 'Profile colour' }, value: anyRal },
      { label: { bg: 'Съвместимост', en: 'Compatibility' }, value: { bg: 'Цялата гама биоклиматични перголи', en: 'The entire bioclimatic pergola range' } },
    ],
    configurations: [
      {
        title: { bg: 'Две релси', en: 'Two tracks' },
        text: { bg: 'Два панела за по-малки отвори.', en: 'Two panels for smaller openings.' },
      },
      {
        title: { bg: 'Три релси', en: 'Three tracks' },
        text: { bg: 'Три панела, които се прибират един зад друг.', en: 'Three panels that stack behind one another.' },
      },
      {
        title: { bg: 'Четири релси', en: 'Four tracks' },
        text: { bg: 'Четири панела за широки отвори с минимум профили.', en: 'Four panels for wide openings with minimal framing.' },
      },
      {
        title: { bg: 'Отваряне от центъра', en: 'Centre opening' },
        text: { bg: 'Осем панела в два огледални комплекта, които се прибират към двете страни.', en: 'Eight panels in two mirrored sets that stack to either side.' },
      },
    ],
    options: [
      { bg: 'Стъклопакети за по-добра изолация', en: 'Insulated glazing for better insulation' },
      { bg: 'Тонирано стъкло', en: 'Tinted glass' },
      { bg: 'Панели без вертикално обкантване', en: 'Panels without vertical edge profiles' },
    ],
    related: ['balance', 'compact', 'guillotine'],
    keywords: [
      'плъзгащи врати', 'плъзгащи панели', 'плъзгаща стъклена стена', 'стъклени панели', 'плъзгащо остъкляване',
      'остъкляване на тераса', 'остъкляване на пергола', 'зимна градина', 'безрамково остъкляване', 'стъклена стена',
      'sliding glass', 'sliding doors', 'sliding glass wall', 'sliding panels', 'frameless glazing', 'patio doors',
      'plazgashti vrati', 'ostaklyavane', 'winter garden',
    ],
  },
  {
    id: 'compact',
    category: 'glass-systems',
    subgroup: 'manual',
    family: 'glass',
    order: 11,
    name: { bg: 'Compact', en: 'Compact' },
    fullName: { bg: 'Сгъваема стъклена система, серия Compact', en: 'Compact series folding glass system' },
    tagline: { bg: 'Видимо изящество, невидими прегради.', en: 'Visible elegance, invisible barriers.' },
    summary: {
      bg: 'Независими стъклени панели, които се насочват към паркинг зона, следват завои и могат да се скрият в ниша или зад колона. Първият панел работи и като врата.',
      en: 'Independent glass panels that move to a parking zone, follow curves and can hide in a niche or behind a column. The first panel doubles as a door.',
    },
    sections: [
      {
        heading: { bg: 'Видимо изящество, невидими прегради', en: 'Visible elegance, invisible barriers' },
        paragraphs: [
          {
            bg: 'Compact е система за пространства, в които пълното освобождаване на отвора е от първостепенно значение. Всеки стъклен панел е напълно независим: крилата се насочват едно по едно по релсата към предварително обособена паркинг зона.',
            en: 'Compact is designed for spaces where clearing the entire opening matters most. Every glass panel is fully independent: each leaf is guided individually along the track to a dedicated parking zone.',
          },
          {
            bg: 'Панелите могат да се приберат скрито в ниша или зад колона, така че стъклената стена буквално изчезва за секунди и затворената площ се превръща в напълно отворено пространство.',
            en: 'The panels can be stored out of sight in a niche or behind a column, so the glass wall all but disappears in seconds and an enclosed room becomes completely open.',
          },
        ],
      },
      {
        heading: { bg: 'Свобода за нестандартна архитектура', en: 'Freedom for unusual layouts' },
        paragraphs: [
          {
            bg: 'Геометрията на Compact позволява на панелите да следват сложни траектории и да преминават през завои – идеален избор за обекти с нестандартна архитектура и предизвикателни разпределения. Първият панел може да работи като стандартна отваряема врата за бърз достъп, без да раздвижвате цялата конфигурация.',
            en: 'Compact’s geometry lets panels follow complex paths and turn corners, ideal for buildings with unusual floor plans. The first panel can work as a standard hinged door for quick access without moving the whole wall.',
          },
          {
            bg: 'Дори при големи размери на крилата ролковите механизми запазват движението леко, интуитивно и безшумно. В затворено положение системата образува стабилна и защитена преграда.',
            en: 'Even with large leaves, the roller mechanisms keep movement light, intuitive and silent. Closed, the system forms a stable, secure barrier.',
          },
        ],
      },
      {
        heading: { bg: 'Пълна трансформация, инженерен перфекционизъм', en: 'Complete transformation, precise engineering' },
        paragraphs: [
          {
            bg: 'Сгъваемите стъклени системи изолират вътрешното пространство от външната среда, без да прекъсват визуалния контакт с околния свят. Крилата се плъзгат плавно по горна релса без подови водачи, което запазва настилката и осигурява свободен преход.',
            en: 'Folding glass systems separate inside from outside without breaking the connection to the view. The leaves glide along a top track with no floor guides, leaving the floor finish intact and the threshold clear.',
          },
          {
            bg: 'Заключващите механизми и компонентите са с висока устойчивост на корозия, а закаленото или ламинираното стъкло и многоточковото заключване осигуряват стабилност и защита. Предлагат се тонирани стъкла в различни нюанси и профили във всеки цвят по RAL.',
            en: 'Locks and hardware are highly corrosion-resistant, and tempered or laminated glass with multi-point locking provides stability and security. Tinted glass is available in several shades, with profiles in any RAL colour.',
          },
        ],
      },
    ],
    highlights: [noFloorGuides, ralHighlight],
    features: [
      { bg: 'Напълно независими стъклени панели', en: 'Fully independent glass panels' },
      { bg: 'Прибиране в паркинг зона, ниша или зад колона', en: 'Panels park in a dedicated zone, niche or behind a column' },
      { bg: 'Панелите следват завои и сложни траектории', en: 'Panels follow corners and complex paths' },
      { bg: 'Първият панел работи като отваряема врата', en: 'The first panel works as a hinged door' },
      { bg: 'Горна релса без подови водачи', en: 'Top track, no floor guides' },
      { bg: 'Леко и безшумно движение дори при големи крила', en: 'Light, silent movement even with large leaves' },
      { bg: 'Многоточково заключване', en: 'Multi-point locking' },
    ],
    specs: [
      { label: { bg: 'Задвижване', en: 'Operation' }, value: { bg: 'Ръчно', en: 'Manual' } },
      { label: { bg: 'Принцип', en: 'Principle' }, value: { bg: 'Независими панели, прибиращи се в паркинг зона', en: 'Independent panels that park in a dedicated zone' } },
      { label: { bg: 'Окачване', en: 'Suspension' }, value: { bg: 'Горна релса, без подови водачи', en: 'Top track, no floor guides' } },
      { label: { bg: 'Траектория', en: 'Track layout' }, value: { bg: 'Права, ъглова или извита', en: 'Straight, cornered or curved' } },
      { label: { bg: 'Достъп', en: 'Access' }, value: { bg: 'Първият панел работи като врата', en: 'First panel works as a door' } },
      { label: { bg: 'Стъкло', en: 'Glass' }, value: { bg: 'Закалено или ламинирано, по избор тонирано', en: 'Tempered or laminated, tinted on request' } },
      { label: { bg: 'Заключване', en: 'Locking' }, value: { bg: 'Многоточково', en: 'Multi-point' } },
      { label: { bg: 'Цвят на профилите', en: 'Profile colour' }, value: anyRal },
    ],
    configurations: [
      {
        title: { bg: 'Паркиране в ниша', en: 'Parking in a niche' },
        text: { bg: 'Панелите се подреждат в ниша в стената – перпендикулярно или успоредно на остъкляването.', en: 'Panels stack in a wall niche, perpendicular or parallel to the glazing.' },
      },
      {
        title: { bg: 'Паркиране под ъгъл', en: 'Angled parking' },
        text: { bg: 'Пакетът панели се събира под ъгъл спрямо линията на остъкляването.', en: 'The panel stack gathers at an angle to the glazing line.' },
      },
      {
        title: { bg: 'Зад колона или покрай стена', en: 'Behind a column or along a wall' },
        text: { bg: 'Панелите се скриват зад колона или се подреждат покрай стената.', en: 'Panels hide behind a column or line up along the wall.' },
      },
      {
        title: { bg: 'Ъглово изпълнение', en: 'Corner run' },
        text: { bg: 'Релсата завива и остъкляването обхожда ъгъла на помещението.', en: 'The track turns so the glazing wraps around a corner.' },
      },
      {
        title: { bg: 'Извита релса', en: 'Curved track' },
        text: { bg: 'Панелите следват дъгова траектория.', en: 'Panels follow an arc.' },
      },
    ],
    options: foldingGlassOptions,
    related: ['accord', 'harmonia', 'sliding-glass'],
    keywords: [
      'сгъваеми врати', 'сгъваема стъклена стена', 'сгъваемо остъкляване', 'хармоника', 'стъклена стена',
      'безрамково остъкляване', 'плъзгащи панели', 'паркинг панели', 'остъкляване на заведение', 'витрина',
      'folding glass', 'folding doors', 'bifold', 'bi-fold', 'slide and stack', 'frameless glass', 'glass wall',
      'compact', 'kompakt', 'sgavaemi vrati',
    ],
  },
  {
    id: 'accord',
    category: 'glass-systems',
    subgroup: 'manual',
    family: 'glass',
    order: 12,
    name: { bg: 'Accord', en: 'Accord' },
    fullName: { bg: 'Сгъваема стъклена система, серия Accord', en: 'Accord series folding glass system' },
    tagline: { bg: 'Сгъваема стъклена стена, която се отваря за секунди.', en: 'A folding glass wall that opens in seconds.' },
    summary: {
      bg: 'Сгъваема стъклена стена тип „хармоника“: панелите са свързани с панти и се събират компактно в края на релсата, а първото крило работи като врата.',
      en: 'A concertina-style folding glass wall: hinged panels gather neatly at the end of the track, and the first leaf works as a door.',
    },
    sections: [
      {
        heading: { bg: 'Панели, свързани с панти', en: 'Panels linked by hinges' },
        paragraphs: [
          {
            bg: 'Серията Accord е създадена за пространства, които изискват бърза адаптивност и максимално лесна употреба. Панелите са свързани помежду си чрез специални панти в горните и долните профили, така че стъклената стена се разгръща и прибира линейно по носещата релса.',
            en: 'Accord is made for spaces that need to change quickly and easily. The panels are linked by special hinges in the top and bottom profiles, so the glass wall folds open and closed along the track in one smooth line.',
          },
          {
            bg: 'Конструкцията разпределя тежестта балансирано и свежда усилието при отваряне и затваряне до минимум. Първото крило работи като активна врата за бърз достъп, а в отворено положение крилата се подреждат компактно в края на релсата и не отнемат от използваемата площ.',
            en: 'The design spreads the weight evenly, so opening and closing takes minimal effort. The first leaf acts as an active door for quick access, and when open the leaves stack neatly at the end of the track without eating into usable floor space.',
          },
          {
            bg: 'Системата е подходяща за широки фронтове в търговски центрове, заведения и частни домове, където бързото отваряне и икономията на място са от ключово значение.',
            en: 'It is a natural fit for wide frontages in shopping centres, restaurants and private homes, where fast opening and saving space matter.',
          },
        ],
      },
      {
        heading: { bg: 'Интуитивна динамика, пространствен контрол', en: 'Intuitive movement, flexible space' },
        paragraphs: [
          {
            bg: 'Цветен индикатор върху основното крило показва състоянието на заключващите механизми. Двойна система от четкови уплътнения в горните и долните профили намалява въздушните течения и подобрява шумоизолацията.',
            en: 'A colour indicator on the main leaf shows at a glance whether it is locked. Double brush seals in the top and bottom profiles cut draughts and improve sound insulation.',
          },
          {
            bg: 'Броят на панелите се комбинира гъвкаво, а в отворено положение те се подреждат плътно един до друг. Така Accord се превръща в дискретен инструмент за зониране, който съчетава сигурност с визуална лекота.',
            en: 'The number of panels is flexible, and when open they stack tightly side by side. That makes Accord a discreet tool for zoning a space, combining security with visual lightness.',
          },
        ],
      },
      {
        heading: { bg: 'Поглед в перспектива', en: 'A wider perspective' },
        paragraphs: [
          {
            bg: 'Сгъваемите стъклени системи съчетават мащабно остъкляване с функционална гъвкавост. Линейният дизайн на профилите свежда видимите елементи до минимум и превръща стената в прозрачно платно. Крилата се движат по горна релса без подови водачи.',
            en: 'Folding glass systems combine large-scale glazing with real flexibility. Slim, linear profiles keep visible framing to a minimum and turn the wall into a transparent plane. The leaves run on a top track with no floor guides.',
          },
          {
            bg: 'Предлагат се тонирани стъкла в различни нюанси, закалено или ламинирано стъкло с многоточково заключване и профили във всеки цвят по RAL.',
            en: 'Options include tinted glass in several shades, tempered or laminated glass with multi-point locking, and profiles in any RAL colour.',
          },
        ],
      },
    ],
    highlights: [noFloorGuides, ralHighlight],
    features: [
      { bg: 'Панели, свързани с панти в горните и долните профили', en: 'Panels linked by hinges in the top and bottom profiles' },
      { bg: 'Линейно сгъване по носещата релса', en: 'Folds in a line along the track' },
      { bg: 'Балансирано разпределение на тежестта и минимално усилие', en: 'Balanced weight distribution, minimal effort' },
      { bg: 'Първото крило работи като активна врата', en: 'First leaf works as an active door' },
      { bg: 'Компактно подреждане в края на релсата', en: 'Compact stack at the end of the track' },
      { bg: 'Цветен индикатор за заключване', en: 'Colour lock indicator' },
      { bg: 'Двойни четкови уплътнения горе и долу', en: 'Double brush seals top and bottom' },
      { bg: 'Гъвкав брой панели', en: 'Flexible number of panels' },
    ],
    specs: [
      { label: { bg: 'Задвижване', en: 'Operation' }, value: { bg: 'Ръчно', en: 'Manual' } },
      { label: { bg: 'Принцип', en: 'Principle' }, value: { bg: 'Сгъване тип „хармоника“, панели с панти', en: 'Concertina folding, hinged panels' } },
      { label: { bg: 'Окачване', en: 'Suspension' }, value: { bg: 'Горна релса, без подови водачи', en: 'Top track, no floor guides' } },
      { label: { bg: 'Достъп', en: 'Access' }, value: { bg: 'Първото крило работи като врата', en: 'First leaf works as a door' } },
      { label: { bg: 'Уплътнения', en: 'Seals' }, value: { bg: 'Двойни четкови уплътнения в горните и долните профили', en: 'Double brush seals in top and bottom profiles' } },
      { label: { bg: 'Заключване', en: 'Locking' }, value: { bg: 'Многоточково, с цветен индикатор', en: 'Multi-point, with colour indicator' } },
      { label: { bg: 'Стъкло', en: 'Glass' }, value: { bg: 'Закалено или ламинирано, по избор тонирано', en: 'Tempered or laminated, tinted on request' } },
      { label: { bg: 'Цвят на профилите', en: 'Profile colour' }, value: anyRal },
    ],
    options: foldingGlassOptions,
    related: ['compact', 'harmonia', 'sliding-glass'],
    keywords: [
      'сгъваеми врати', 'хармоника', 'врата хармоника', 'сгъваема стъклена стена', 'сгъваемо остъкляване',
      'стъклена стена', 'остъкляване на заведение', 'витрина', 'фронт',
      'folding glass', 'folding doors', 'bifold', 'bi-fold', 'concertina', 'accordion doors', 'glass wall', 'accord',
      'akord', 'harmonika', 'sgavaemi vrati',
    ],
  },
  {
    id: 'harmonia',
    category: 'glass-systems',
    subgroup: 'manual',
    family: 'glass',
    order: 13,
    name: { bg: 'Harmonia', en: 'Harmonia' },
    fullName: { bg: 'Сгъваема стъклена система, серия Harmonia', en: 'Harmonia series folding glass system' },
    tagline: { bg: 'Модулна свобода и интелигентно зониране.', en: 'Modular freedom, flexible zoning.' },
    summary: {
      bg: 'Централно окачени стъклени панели, които се въртят на 360° и се движат независимо по релсата. Работят като подвижна стена или като серия осеви врати.',
      en: 'Centrally hung glass panels that rotate through 360° and move independently along the track, working as a movable wall or a series of pivot doors.',
    },
    sections: [
      {
        heading: { bg: 'Модулна свобода и интелигентно зониране', en: 'Modular freedom, flexible zoning' },
        paragraphs: [
          {
            bg: 'Harmonia въвежда различна логика на движение: носещият механизъм е разположен централно спрямо стъкления панел. Всяко крило е окачено в средата си, затова панелите могат да се въртят свободно на 360° и да се движат линейно по релсата с отличен баланс.',
            en: 'Harmonia moves in a different way: the carrier is mounted at the centre of each glass panel. Hung at its midpoint, every leaf can rotate freely through 360° and travel along the track in perfect balance.',
          },
          {
            bg: 'Централното окачване разпределя тежестта на стъклото равномерно и осигурява плавно плъзгане без усилие. Конфигурацията е идеална за динамични преградни стени в офиси, ресторанти и търговски зони.',
            en: 'Central suspension spreads the weight of the glass evenly for smooth, effortless sliding. It is ideal for flexible partition walls in offices, restaurants and retail spaces.',
          },
        ],
      },
      {
        heading: { bg: 'Подвижна стена и осеви врати', en: 'Movable wall and pivot doors' },
        paragraphs: [
          {
            bg: 'Harmonia работи едновременно като подвижна стена и като серия от индивидуални осеви врати. Панелите се движат независимо един от друг и без подови водачи, затова могат да се групират в различни зони на обекта и да освободят напълно пространството за преминаване.',
            en: 'Harmonia works both as a movable wall and as a series of individual pivot doors. The panels move independently and need no floor guides, so they can be grouped in different parts of the room to clear the way completely.',
          },
          {
            bg: 'Технологията позволява много високи и широки стъклени фасади, които в отворено положение се прибират компактно. Специализирани механизми фиксират всеки панел в затворено положение, а прецизното напасване и уплътненията осигуряват отлична изолация срещу прах и шум.',
            en: 'The technology allows very tall, wide glass walls that fold away compactly when open. Dedicated mechanisms lock each panel when closed, and the precise fit and seals keep out dust and noise.',
          },
        ],
      },
      {
        heading: { bg: 'Пълна трансформация, инженерен перфекционизъм', en: 'Complete transformation, precise engineering' },
        paragraphs: [
          {
            bg: 'Сгъваемите системи позволяват максимално освобождаване на светлия отвор, при което границата на помещението практически изчезва. Висококачествените ролкови системи осигуряват безшумна и лека експлоатация дори при панели с големи размери и тегло.',
            en: 'Folding systems free up the opening almost entirely, so the edge of the room practically disappears. High-quality roller systems keep operation light and silent even with large, heavy panels.',
          },
          {
            bg: 'Стъклото е закалено или ламинирано, предлага се и тонирано в различни нюанси, а алуминиевите профили се изпълняват във всеки цвят по RAL.',
            en: 'Glass is tempered or laminated, tinted options come in several shades, and the aluminium profiles can be made in any RAL colour.',
          },
        ],
      },
    ],
    highlights: [
      { value: '360°', label: { bg: 'свободно въртене на всеки панел', en: 'free rotation of every panel' } },
      noFloorGuides,
      ralHighlight,
    ],
    features: [
      { bg: 'Централно окачени панели', en: 'Centrally hung panels' },
      { bg: 'Свободно въртене на 360°', en: 'Free 360° rotation' },
      { bg: 'Независимо движение на всеки панел', en: 'Each panel moves independently' },
      { bg: 'Подвижна стена и индивидуални осеви врати', en: 'Movable wall and individual pivot doors' },
      { bg: 'Без подови водачи', en: 'No floor guides' },
      { bg: 'Групиране на панелите в различни зони', en: 'Panels can be grouped in different zones' },
      { bg: 'Фиксиране на всеки панел в затворено положение', en: 'Each panel locks when closed' },
      { bg: 'Уплътнения срещу прах и шум', en: 'Seals against dust and noise' },
    ],
    specs: [
      { label: { bg: 'Задвижване', en: 'Operation' }, value: { bg: 'Ръчно', en: 'Manual' } },
      { label: { bg: 'Принцип', en: 'Principle' }, value: { bg: 'Централно окачени панели, въртене на 360°', en: 'Centrally hung panels, 360° rotation' } },
      { label: { bg: 'Окачване', en: 'Suspension' }, value: { bg: 'Горна релса, без подови водачи', en: 'Top track, no floor guides' } },
      { label: { bg: 'Функция', en: 'Function' }, value: { bg: 'Подвижна стена или осеви врати', en: 'Movable wall or pivot doors' } },
      { label: { bg: 'Изолация', en: 'Insulation' }, value: { bg: 'Уплътнения срещу прах и шум', en: 'Seals against dust and noise' } },
      { label: { bg: 'Стъкло', en: 'Glass' }, value: { bg: 'Закалено или ламинирано, по избор тонирано', en: 'Tempered or laminated, tinted on request' } },
      { label: { bg: 'Цвят на профилите', en: 'Profile colour' }, value: anyRal },
    ],
    options: foldingGlassOptions,
    related: ['compact', 'accord', 'dormakaba-es-200'],
    keywords: [
      'сгъваеми врати', 'осеви врати', 'въртящи се панели', 'подвижна стена', 'преградна стена', 'стъклена преграда',
      'стъклена стена', 'офис преграда', 'сгъваемо остъкляване',
      'pivot doors', 'pivoting glass', 'movable wall', 'glass partition', 'folding glass', 'folding doors', 'harmonia',
      'harmoniya', 'sgavaemi vrati',
    ],
  },

  // ───────────────────────── Sun protection ─────────────────────────
  {
    id: 'vertical-zip',
    category: 'sun-protection',
    family: 'zip',
    order: 14,
    name: { bg: 'Вертикални ZIP завеси', en: 'Vertical ZIP screens' },
    nameInline: { bg: 'вертикални ZIP завеси', en: 'vertical ZIP screens' },
    fullName: { bg: 'Вертикални слънцезащитни ZIP завеси', en: 'Vertical ZIP sun screens' },
    tagline: { bg: 'Сянка, която пропуска въздух и гледка.', en: 'Shade that lets the air and the view through.' },
    summary: {
      bg: 'Моторизирани ZIP завеси с микроперфорирана материя, която разсейва слънцето и пропуска въздух, или с Blackout плат за пълна тъмнина. Вграден или външен монтаж.',
      en: 'Motorised ZIP screens in micro-perforated fabric that diffuses sunlight and lets air through, or blackout fabric for total darkness. Recessed or surface-mounted.',
    },
    sections: [
      {
        heading: { bg: 'Микроперфорирано платно', en: 'Micro-perforated fabric' },
        paragraphs: [
          {
            bg: 'Вертикалните ZIP завеси са дългосрочен партньор за дома, офиса или заведението. Специалната микроперфорирана материя омекотява и разсейва пряката слънчева светлина, създава визуален комфорт и значително понижава температурата в помещенията, като пропуска свеж въздух.',
            en: 'Vertical ZIP screens are a long-term partner for homes, offices and restaurants. The special micro-perforated fabric softens and diffuses direct sunlight, improving visual comfort and noticeably lowering indoor temperatures while letting fresh air through.',
          },
          {
            bg: 'Дори в напълно затворено положение системата осигурява естествена вентилация и служи като бариера срещу вятър, насекоми и дъждовни пръски.',
            en: 'Even fully closed, the screen lets the space breathe and acts as a barrier against wind, insects and splashing rain.',
          },
        ],
      },
      {
        heading: { bg: 'Видимост отвътре, уединение отвън', en: 'A clear view out, privacy in' },
        paragraphs: [
          {
            bg: 'Структурата на плата осигурява видимост отвътре навън и запазва връзката с околната среда, докато отвън блокира погледите на минувачите. За специфични нужди има материи с различна степен на прозрачност – до пълна Blackout технология за абсолютна тъмнина.',
            en: 'The weave lets you see out clearly while screening you from passers-by. For specific needs, fabrics come in different levels of openness, up to full Blackout for complete darkness.',
          },
          {
            bg: 'Външният или вътрешният монтаж и изборът между вграден и външен корпус правят ZIP завесите универсално решение за всяка архитектура. Цветовете на конструкцията и текстила се подбират според фасадата или интериора.',
            en: 'With internal or external installation and a recessed or surface-mounted cassette, ZIP screens adapt to any architecture. Frame and fabric colours are chosen to match the façade or interior.',
          },
        ],
      },
      {
        heading: { bg: 'Моторизирано управление и автоматизация', en: 'Motorised control and automation' },
        paragraphs: [
          {
            bg: 'Прецизното моторизирано задвижване се управлява с бутон, дистанционно или чрез SMART автоматизация. Специален механизъм фиксира плата по цялата му дължина и го държи опънат дори при силни пориви на вятъра.',
            en: 'The precise motor drive is operated by switch, remote or SMART home automation. A dedicated mechanism holds the fabric along its full length, keeping it taut even in strong gusts.',
          },
          {
            bg: 'С датчици за вятър, слънце и дъжд завесата реагира сама – прибира се при опасен вятър или се спуска при силно слънце, дори когато не сте у дома. ZIP завесите са напълно съвместими с цялата гама биоклиматични перголи.',
            en: 'With wind, sun and rain sensors, the screen reacts on its own, retracting in dangerous wind or lowering in strong sun, even when you are away. ZIP screens are fully compatible with the entire bioclimatic pergola range.',
          },
        ],
      },
    ],
    highlights: [
      { value: '2', unit: { bg: 'вида монтаж', en: 'mounting types' }, label: { bg: 'вграден или външен корпус', en: 'recessed or surface-mounted cassette' } },
      { value: '3', unit: { bg: 'вида датчици', en: 'sensor types' }, label: { bg: 'вятър, слънце и дъжд, по избор', en: 'wind, sun and rain, optional' } },
    ],
    features: [
      { bg: 'Микроперфорирана материя, която разсейва светлината и пропуска въздух', en: 'Micro-perforated fabric that diffuses light and lets air through' },
      { bg: 'Видимост отвътре навън, защита от погледи отвън', en: 'See out, without being seen' },
      { bg: 'Бариера срещу вятър, насекоми и дъждовни пръски', en: 'Barrier against wind, insects and splashing rain' },
      { bg: 'Материи с различна прозрачност до пълен Blackout', en: 'Fabrics from open weaves to full Blackout' },
      { bg: 'Вграден или външен корпус, напълно скрит механизъм', en: 'Recessed or surface cassette, fully concealed mechanism' },
      { bg: 'Платното е фиксирано по цялата дължина', en: 'Fabric held along its full length' },
      { bg: 'Управление с бутон, дистанционно или SMART', en: 'Switch, remote or SMART control' },
      { bg: 'Пълна съвместимост с цялата гама биоклиматични перголи', en: 'Fully compatible with the entire bioclimatic pergola range' },
    ],
    specs: [
      { label: { bg: 'Задвижване', en: 'Drive' }, value: { bg: 'Моторизирано', en: 'Motorised' } },
      { label: { bg: 'Управление', en: 'Control' }, value: { bg: 'Бутон, дистанционно или SMART автоматизация', en: 'Switch, remote or SMART automation' } },
      { label: { bg: 'Материя', en: 'Fabric' }, value: { bg: 'Микроперфорирана, с различна прозрачност, или Blackout', en: 'Micro-perforated in various openness levels, or blackout' } },
      { label: { bg: 'Корпус', en: 'Cassette' }, value: { bg: 'Вграден или външен, с напълно скрит механизъм', en: 'Recessed or surface-mounted, fully concealed mechanism' } },
      { label: { bg: 'Монтаж', en: 'Installation' }, value: { bg: 'Външен или вътрешен', en: 'External or internal' } },
      { label: { bg: 'Датчици', en: 'Sensors' }, value: { bg: 'Вятър, слънце и дъжд (по избор)', en: 'Wind, sun and rain (optional)' } },
      { label: { bg: 'Цветове', en: 'Colours' }, value: { bg: 'Широк избор за конструкцията и текстила', en: 'Wide choice for frame and fabric' } },
      { label: { bg: 'Съвместимост', en: 'Compatibility' }, value: { bg: 'Цялата гама биоклиматични перголи', en: 'The entire bioclimatic pergola range' } },
    ],
    configurations: [
      {
        title: { bg: 'Вграден монтаж', en: 'Recessed installation' },
        text: { bg: 'Вграден корпус и релсов профил – механизмът е напълно скрит в отвора.', en: 'Recessed cassette and side rails, with the mechanism fully hidden in the opening.' },
      },
      {
        title: { bg: 'Външен монтаж', en: 'Surface installation' },
        text: { bg: 'Външен корпус и релсов профил за съществуващи сгради.', en: 'Surface-mounted cassette and side rails for existing buildings.' },
      },
      {
        title: { bg: 'В пергола', en: 'In a pergola' },
        text: { bg: 'Затваряне на страните на биоклиматична пергола.', en: 'Closing the sides of a bioclimatic pergola.' },
      },
    ],
    options: [
      { bg: 'Blackout материя', en: 'Blackout fabric' },
      { bg: 'Датчици за вятър, слънце и дъжд', en: 'Wind, sun and rain sensors' },
      { bg: 'SMART автоматизация', en: 'SMART home automation' },
      { bg: 'Вграден корпус', en: 'Recessed cassette' },
    ],
    related: ['balance', 'roof-zip', 'shell-awning'],
    keywords: [
      'zip', 'зип', 'зип щори', 'зип завеси', 'ZIP щори', 'щори', 'външни щори', 'ролетни щори', 'вертикални щори',
      'сенници', 'завеси', 'слънцезащита', 'затъмняване', 'blackout', 'блекаут', 'комарник', 'щори за пергола',
      'zip screen', 'zip blinds', 'screen', 'roller blinds', 'external blinds', 'sun screen', 'solar screen',
      'shtori', 'vanshni shtori', 'zip shtori',
    ],
  },
  {
    id: 'roof-zip',
    category: 'sun-protection',
    family: 'zip',
    order: 15,
    name: { bg: 'ZIP завеси за стъклени покриви', en: 'Roof ZIP screens' },
    nameInline: { bg: 'ZIP завеси за стъклени покриви', en: 'roof ZIP screens' },
    fullName: {
      bg: 'ZIP завеси за външен монтаж върху или под стъклени покриви',
      en: 'ZIP screens for mounting above or below glass roofs',
    },
    tagline: { bg: 'Контрол в синхрон с времето.', en: 'Control in step with the weather.' },
    summary: {
      bg: 'Хоризонтални моторизирани ZIP завеси за стъклени покриви, зимни градини, капандури и перголи. Спират слънчевата топлина, преди тя да достигне стъклото.',
      en: 'Horizontal motorised ZIP screens for glass roofs, winter gardens, skylights and pergolas. They stop solar heat before it reaches the glass.',
    },
    sections: [
      {
        heading: { bg: 'Контрол в синхрон с времето', en: 'Control in step with the weather' },
        paragraphs: [
          {
            bg: 'Моторизираните покривни ZIP завеси са едно от най-ефективните решения за управление на микроклимата под голямо покривно остъкляване. Проектирани са за хоризонтален външен монтаж – на зимни градини, стъклени покриви на тераси, капандури и перголи.',
            en: 'Motorised roof ZIP screens are one of the most effective ways to manage the climate beneath large areas of overhead glazing. They are designed for horizontal external installation on winter gardens, glass terrace roofs, skylights and pergolas.',
          },
          {
            bg: 'Основното им предимство е, че спират слънчевата радиация, преди тя да достигне стъклото. Така предотвратяват парниковия ефект и прегряването на интериора, повишават енергийната ефективност на сградата и намаляват разходите за охлаждане през лятото.',
            en: 'Their key advantage is stopping solar radiation before it reaches the glass. That prevents the greenhouse effect and overheating, improves the building’s energy efficiency and cuts cooling costs in summer.',
          },
        ],
      },
      {
        heading: { bg: 'Интуитивна реакция към средата', en: 'Responding to the weather' },
        paragraphs: [
          {
            bg: 'Завесите се управляват с дистанционни предаватели или се включват в мрежата на умния дом. С метеорологична станция конструкцията реагира сама на времето и се прибира или разпъва според силата на вятъра и слънцегреенето.',
            en: 'The screens are operated by remote control or connected to your smart-home system. With a weather station, they respond to conditions on their own, retracting or extending according to wind strength and sunshine.',
          },
          {
            bg: 'Изборът на текстил определя атмосферата: фината перфорация на стандартните платна филтрира заслепяващите лъчи, без да спира притока на въздух, а специализираните непроницаеми материи осигуряват 100% затъмняване.',
            en: 'The fabric sets the mood: the fine perforation of standard fabrics filters glare without stopping airflow, while specialist blackout fabrics give 100% darkness.',
          },
        ],
      },
      {
        heading: { bg: 'Цветове и текстури', en: 'Colours and textures' },
        paragraphs: [
          {
            bg: 'Алуминиевите профили се оцветяват в пълния спектър на палитрата RAL и съвпадат с дограмата или фасадата. Текстилът се предлага в широка гама от текстури и цветове и става органична част от архитектурния проект.',
            en: 'Aluminium profiles can be finished in the full RAL range to match window frames or the façade, and the fabrics come in a wide choice of textures and colours that become part of the architecture.',
          },
        ],
      },
    ],
    highlights: [
      { value: '100%', label: { bg: 'затъмняване с непроницаема материя', en: 'blackout with opaque fabric' } },
      { value: 'RAL', label: { bg: 'всеки цвят за профилите', en: 'any colour for the profiles' } },
    ],
    features: [
      { bg: 'Хоризонтален външен монтаж върху или под стъклен покрив', en: 'Horizontal external mounting above or below a glass roof' },
      { bg: 'Спира слънчевата радиация преди стъклото', en: 'Stops solar radiation before it reaches the glass' },
      { bg: 'Предотвратява парниковия ефект и прегряването', en: 'Prevents the greenhouse effect and overheating' },
      { bg: 'Управление с дистанционно или от умния дом', en: 'Remote or smart-home control' },
      { bg: 'Автоматизация с метеорологична станция', en: 'Weather-station automation' },
      { bg: 'Перфорирани или непроницаеми материи', en: 'Perforated or blackout fabrics' },
      { bg: 'Профили във всеки цвят по RAL', en: 'Profiles in any RAL colour' },
    ],
    specs: [
      { label: { bg: 'Монтаж', en: 'Mounting' }, value: { bg: 'Хоризонтален, външен, върху или под стъклен покрив', en: 'Horizontal, external, above or below a glass roof' } },
      { label: { bg: 'Приложение', en: 'Uses' }, value: { bg: 'Зимни градини, стъклени покриви, капандури, перголи', en: 'Winter gardens, glass roofs, skylights, pergolas' } },
      { label: { bg: 'Задвижване', en: 'Drive' }, value: { bg: 'Моторизирано', en: 'Motorised' } },
      { label: { bg: 'Управление', en: 'Control' }, value: { bg: 'Дистанционно или умен дом', en: 'Remote or smart home' } },
      { label: { bg: 'Автоматизация', en: 'Automation' }, value: { bg: 'Метеорологична станция – вятър и слънце', en: 'Weather station, wind and sun' } },
      { label: { bg: 'Материя', en: 'Fabric' }, value: { bg: 'Фино перфорирана или непроницаема (100% затъмняване)', en: 'Finely perforated or opaque (100% blackout)' } },
      { label: { bg: 'Цвят на профилите', en: 'Profile colour' }, value: anyRal },
    ],
    configurations: [
      {
        title: { bg: 'Върху стъкления покрив', en: 'Above the glass roof' },
        text: { bg: 'Платното спира слънцето, преди то да нагрее стъклото.', en: 'The fabric stops the sun before it heats the glass.' },
      },
      {
        title: { bg: 'Под стъкления покрив', en: 'Below the glass roof' },
        text: { bg: 'Платното е опънато под стъклените панели на перголата или зимната градина.', en: 'The fabric is tensioned beneath the glass panels of the pergola or winter garden.' },
      },
    ],
    options: [
      { bg: 'Метеорологична станция', en: 'Weather station' },
      { bg: 'Интеграция с умен дом', en: 'Smart-home integration' },
      { bg: 'Непроницаема материя за пълно затъмняване', en: 'Opaque fabric for full blackout' },
    ],
    related: ['automatic-glass-roof', 'fixed-glass-roof', 'vertical-zip'],
    keywords: [
      'zip', 'зип', 'покривна щора', 'покривни щори', 'хоризонтални щори', 'щори за стъклен покрив', 'капандура',
      'зимна градина', 'стъклен покрив', 'засенчване', 'сенник', 'затъмняване', 'зип щори',
      'roof blind', 'roof screen', 'skylight blind', 'conservatory blind', 'glass roof shade', 'zip screen', 'awning',
      'shtori', 'kapandura',
    ],
  },
  {
    id: 'shell-awning',
    category: 'sun-protection',
    family: 'awning',
    order: 16,
    name: { bg: 'Тента Shell', en: 'Shell awning' },
    nameInline: { bg: 'тента Shell', en: 'the Shell awning' },
    fullName: { bg: 'Автоматизирани касетъчни тенти Shell', en: 'Shell motorised cassette awnings' },
    tagline: { bg: 'Надеждна сянка за всяка фасада.', en: 'Reliable shade for any façade.' },
    summary: {
      bg: 'Моторизирана касетъчна тента с напълно затворена алуминиева касета, подсилени рамена и акрилно платно. Метеорологични датчици я прибират или разпъват автоматично.',
      en: 'A motorised cassette awning with a fully enclosed aluminium cassette, reinforced arms and acrylic fabric. Weather sensors retract or extend it automatically.',
    },
    sections: [
      {
        heading: { bg: 'Надеждна сянка за всяка фасада', en: 'Reliable shade for any façade' },
        paragraphs: [
          {
            bg: 'Моделът Shell е изцяло автоматизирано решение за външно засенчване. Моторизираното задвижване от последно поколение осигурява плавно движение и перфектно опъване на платното при всяко отваряне.',
            en: 'Shell is a fully automated awning. Its latest-generation motor drive gives smooth movement and perfect fabric tension every time it opens.',
          },
          {
            bg: 'С метеорологични датчици тентата реагира сама на промените във времето – прибира се автоматично при влошаване и се разпъва при силно слънце. Така пази и себе си, без нужда от човешка намеса.',
            en: 'With weather sensors, the awning reacts to changing conditions by itself, retracting automatically when the weather turns and extending in strong sun, protecting itself without anyone lifting a finger.',
          },
        ],
      },
      {
        heading: { bg: 'Затворена касета, подсилени рамена', en: 'Enclosed cassette, reinforced arms' },
        paragraphs: [
          {
            bg: 'Задвижването е поместено в напълно затворена алуминиева касета, която изолира механизмите и платното от всички страни. В прибрано положение профилът ги пази от влага, прах и агресивни атмосферни влияния и удължава живота на системата.',
            en: 'The drive sits inside a fully enclosed aluminium cassette that protects the mechanism and fabric on all sides. When retracted, the cassette seals them off from moisture, dust and harsh weather, extending the life of the system.',
          },
          {
            bg: 'Подсилените алуминиеви рамена и висококачествените акрилни платна запазват своята цялост и наситеност на цветовете дори при интензивна употреба. Тентата се монтира на стена или на таван.',
            en: 'Reinforced aluminium arms and high-quality acrylic fabrics keep their shape and colour even with heavy use. The awning can be mounted on a wall or a ceiling.',
          },
        ],
      },
      {
        heading: { bg: 'Дигитална интеграция и визуална персонализация', en: 'Smart control, personal style' },
        paragraphs: [
          {
            bg: 'Shell се синхронизира със SMART системите за управление на дома и се командва с дистанционни предаватели или мобилни устройства. Можете да настроите светлинния поток прецизно и да създадете свои сценарии за комфорт, а механизмите работят безшумно и са износоустойчиви.',
            en: 'Shell connects to SMART home systems and can be controlled from a remote or a mobile device, so you can fine-tune the light and set up your own comfort scenes. The mechanisms are quiet and hard-wearing.',
          },
          {
            bg: 'Касетата и рамената се боядисват прахово във всеки нюанс от каталога RAL, а платната се предлагат в широка палитра от цветове и текстури с висока водоотблъскваща способност и UV защита.',
            en: 'The cassette and arms are powder-coated in any RAL shade, and the fabrics come in a wide range of colours and textures with strong water repellency and UV protection.',
          },
        ],
      },
    ],
    highlights: [
      { value: '360°', label: { bg: 'затворена касета пази механизма и платното', en: 'enclosed cassette protects motor and fabric' } },
      { value: 'RAL', label: { bg: 'всеки цвят за касетата и рамената', en: 'any colour for cassette and arms' } },
    ],
    features: [
      { bg: 'Напълно затворена алуминиева касета', en: 'Fully enclosed aluminium cassette' },
      { bg: 'Подсилени алуминиеви рамена', en: 'Reinforced aluminium arms' },
      { bg: 'Акрилни платна с водоотблъскващи и UV-защитни свойства', en: 'Acrylic fabrics, water-repellent and UV-protective' },
      { bg: 'Моторизирано задвижване с перфектно опъване', en: 'Motor drive with perfect fabric tension' },
      { bg: 'Метеорологични датчици за автоматично прибиране и разпъване', en: 'Weather sensors for automatic retraction and extension' },
      { bg: 'Дистанционно, мобилно устройство или SMART дом', en: 'Remote, mobile device or SMART home control' },
      { bg: 'Безшумна работа', en: 'Quiet operation' },
      { bg: 'Монтаж на стена или таван', en: 'Wall or ceiling mounting' },
    ],
    specs: [
      { label: { bg: 'Касета', en: 'Cassette' }, value: { bg: 'Напълно затворена, алуминиева', en: 'Fully enclosed aluminium' } },
      { label: { bg: 'Рамена', en: 'Arms' }, value: { bg: 'Подсилени, алуминиеви', en: 'Reinforced aluminium' } },
      { label: { bg: 'Платно', en: 'Fabric' }, value: { bg: 'Акрилно, водоотблъскващо, с UV защита', en: 'Acrylic, water-repellent, UV-protective' } },
      { label: { bg: 'Задвижване', en: 'Drive' }, value: { bg: 'Моторизирано', en: 'Motorised' } },
      { label: { bg: 'Управление', en: 'Control' }, value: { bg: 'Дистанционно, мобилно устройство, SMART дом', en: 'Remote, mobile device, SMART home' } },
      { label: { bg: 'Автоматизация', en: 'Automation' }, value: { bg: 'Метеорологични датчици', en: 'Weather sensors' } },
      { label: { bg: 'Монтаж', en: 'Mounting' }, value: { bg: 'На стена или на таван', en: 'Wall or ceiling' } },
      { label: { bg: 'Цвят', en: 'Colour' }, value: { bg: 'Касета и рамена – всеки цвят по RAL', en: 'Cassette and arms in any RAL colour' } },
    ],
    configurations: [
      {
        title: { bg: 'Монтаж на стена', en: 'Wall mounting' },
        text: { bg: 'Класическо решение над тераса, витрина или прозорец.', en: 'The classic choice above a terrace, shopfront or window.' },
      },
      {
        title: { bg: 'Монтаж на таван', en: 'Ceiling mounting' },
        text: { bg: 'Под козирка, балкон или таван на лоджия.', en: 'Under a canopy, balcony or loggia ceiling.' },
      },
    ],
    options: [
      { bg: 'Метеорологични датчици', en: 'Weather sensors' },
      { bg: 'Управление от мобилно устройство', en: 'Mobile device control' },
      { bg: 'Интеграция със SMART дом', en: 'SMART home integration' },
    ],
    related: ['vertical-zip', 'telescopic-windbreak', 'flat'],
    keywords: [
      'тента', 'тенти', 'касетъчна тента', 'сенник', 'сенници', 'моторизирана тента', 'автоматична тента',
      'тента за тераса', 'тента за балкон', 'тента за заведение', 'шел', 'сянка', 'слънцезащита',
      'awning', 'awnings', 'cassette awning', 'retractable awning', 'motorised awning', 'motorized awning', 'shell',
      'tenta', 'tenti', 'sennik',
    ],
  },

  // ───────────────────────── Windbreaks ─────────────────────────
  {
    id: 'telescopic-windbreak',
    category: 'windbreaks',
    family: 'windbreak',
    order: 17,
    name: { bg: 'Телескопична ветрозащита', en: 'Telescopic windbreak' },
    nameInline: { bg: 'телескопична ветрозащита', en: 'a telescopic windbreak' },
    fullName: { bg: 'Телескопични хидравлични ветрозащитни системи', en: 'Telescopic hydraulic glass windbreaks' },
    tagline: { bg: 'Елегантна защита в точния момент.', en: 'Shelter, exactly when you need it.' },
    summary: {
      bg: 'Стъклен парапет, чийто горен панел се повдига с лек натиск на бутон благодарение на хидравлични амортисьори. Не изисква електрическо захранване.',
      en: 'A glass balustrade whose upper panel rises at the light press of a button, thanks to hydraulic dampers. No electrical supply needed.',
    },
    sections: [
      {
        heading: { bg: 'Елегантна защита в точния момент', en: 'Shelter, exactly when you need it' },
        paragraphs: [
          {
            bg: 'Телескопичните ветрозащитни системи използват прецизна хидравлична технология и работят като подвижен стъклен парапет, чиято височина се регулира според времето.',
            en: 'Telescopic windbreaks use precise hydraulics and work like a moving glass balustrade whose height you adjust to the weather.',
          },
          {
            bg: 'В прибрано положение структурата е елегантен и дискретен парапет, който запазва визуалната връзка с околната среда. При вятър или нужда от уединение горният панел се изтегля плавно нагоре и се превръща в стабилна защитна стена. Решението е незаменимо за ресторанти, кафенета и частни тераси.',
            en: 'Lowered, it is an elegant, discreet parapet that keeps the view open. When the wind picks up or you want more privacy, the upper panel rises smoothly to form a solid protective screen. It is ideal for restaurants, cafés and private terraces.',
          },
        ],
      },
      {
        heading: { bg: 'Ергономичност и минимализъм', en: 'Effortless and minimal' },
        paragraphs: [
          {
            bg: 'Основното предимство са интегрираните хидравлични амортисьори. Лек натиск върху бутона активира плавното и контролирано повдигане или сваляне на панела, без физическо усилие. Хидравликата пази стъклото от резки движения и удължава живота на компонентите.',
            en: 'The key is the integrated hydraulic dampers. A light press of the button raises or lowers the panel smoothly and under control, with no heavy lifting. The hydraulics also protect the glass from sudden movement, extending the life of the components.',
          },
          {
            bg: 'Системата не изисква електрическо захранване, което я прави икономично, екологично и надеждно решение за всяка външна зона, изложена на променливо време.',
            en: 'No electrical supply is needed, making it an economical, environmentally friendly and dependable solution for any outdoor area exposed to changeable weather.',
          },
        ],
      },
      {
        heading: { bg: 'Цвят и стъкло', en: 'Finish and glass' },
        paragraphs: [
          {
            bg: 'Алуминиевата основа, в която е хидравличният механизъм, осигурява стабилност и може да бъде във всеки цвят по каталога RAL. Панелите от високоякостно закалено стъкло дават чиста панорама без хоризонтални профили и могат да бъдат прозрачни, тонирани или матови.',
            en: 'The aluminium base that houses the hydraulics provides stability and can be finished in any RAL colour. Panels of high-strength tempered glass give a clean view with no horizontal profiles and can be clear, tinted or frosted.',
          },
          {
            bg: 'Системата съчетава сигурността на стационарния парапет с удобството на подвижната преграда.',
            en: 'It combines the security of a fixed balustrade with the flexibility of a movable screen.',
          },
        ],
      },
    ],
    highlights: [
      { value: '1', unit: { bg: 'бутон', en: 'button' }, label: { bg: 'хидравлично повдигане без електрозахранване', en: 'hydraulic lift, no power supply needed' } },
      { value: '3', unit: { bg: 'вида стъкло', en: 'glass types' }, label: { bg: 'прозрачно, тонирано или матово', en: 'clear, tinted or frosted' } },
      { value: 'RAL', label: { bg: 'всеки цвят за алуминиевата основа', en: 'any colour for the aluminium base' } },
    ],
    features: [
      { bg: 'Телескопичен горен панел, който се изтегля нагоре', en: 'Telescopic upper panel that rises' },
      { bg: 'Интегрирани хидравлични амортисьори', en: 'Integrated hydraulic dampers' },
      { bg: 'Повдигане и сваляне с лек натиск на бутон', en: 'Raised and lowered at the light press of a button' },
      { bg: 'Не изисква електрическо захранване', en: 'No electrical supply needed' },
      { bg: 'Високоякостно закалено стъкло без хоризонтални профили', en: 'High-strength tempered glass, no horizontal profiles' },
      { bg: 'Прозрачно, тонирано или матово стъкло', en: 'Clear, tinted or frosted glass' },
      { bg: 'Алуминиева основа във всеки цвят по RAL', en: 'Aluminium base in any RAL colour' },
    ],
    specs: [
      { label: { bg: 'Принцип', en: 'Principle' }, value: { bg: 'Телескопичен стъклен парапет', en: 'Telescopic glass balustrade' } },
      { label: { bg: 'Задвижване', en: 'Operation' }, value: { bg: 'Хидравлични амортисьори, с бутон', en: 'Hydraulic dampers, push-button' } },
      { label: { bg: 'Захранване', en: 'Power' }, value: { bg: 'Не е необходимо', en: 'Not required' } },
      { label: { bg: 'Основа', en: 'Base' }, value: { bg: 'Алуминий, всеки цвят по RAL', en: 'Aluminium, any RAL colour' } },
      { label: { bg: 'Стъкло', en: 'Glass' }, value: { bg: 'Високоякостно закалено – прозрачно, тонирано или матово', en: 'High-strength tempered: clear, tinted or frosted' } },
      { label: { bg: 'Профили', en: 'Profiles' }, value: { bg: 'Без хоризонтални профили', en: 'No horizontal profiles' } },
      { label: { bg: 'Приложение', en: 'Uses' }, value: { bg: 'Ресторанти, кафенета, частни тераси', en: 'Restaurants, cafés, private terraces' } },
    ],
    configurations: [
      {
        title: { bg: 'Прибрано положение', en: 'Lowered' },
        text: { bg: 'Дискретен стъклен парапет, който запазва гледката.', en: 'A discreet glass balustrade that keeps the view open.' },
      },
      {
        title: { bg: 'Повдигнато положение', en: 'Raised' },
        text: { bg: 'Горният панел се изтегля нагоре и образува защитна стена срещу вятъра.', en: 'The upper panel rises to form a protective wall against the wind.' },
      },
    ],
    options: [
      { bg: 'Тонирано стъкло', en: 'Tinted glass' },
      { bg: 'Матово стъкло', en: 'Frosted glass' },
    ],
    related: ['shell-awning', 'curved', 'guillotine'],
    keywords: [
      'ветрозащита', 'ветрозащитна система', 'ветробран', 'ветрозащитно стъкло', 'стъклен параван', 'параван',
      'паравани', 'стъклена преграда', 'стъклен парапет', 'преграда за заведение', 'ресторант', 'кафене', 'тераса',
      'windbreak', 'windscreen', 'wind screen', 'wind barrier', 'glass screen', 'glass barrier', 'telescopic',
      'vetrozashtita', 'paravan',
    ],
  },
];
