import type { Category } from './types';

// Category copy condensed from the section intros of the OUTPLAY catalogue 2026.
export const categories: Category[] = [
  {
    id: 'bioclimatic-pergolas',
    order: 1,
    name: { bg: 'Биоклиматични перголи', en: 'Bioclimatic pergolas' },
    title: { bg: 'Биоклиматични перголи и зимни градини', en: 'Bioclimatic pergolas and winter gardens' },
    tagline: { bg: 'Комфорт, дизайн и защита в съвършен баланс.', en: 'Comfort, design and protection in perfect balance.' },
    intro: [
      {
        bg: 'Откритите пространства са сърцето на всеки съвременен дом или бизнес. Нашите биоклиматични системи превръщат терасата или градината в зона на комфорт с панорамна гледка – място за почивка и срещи, независимо от сезона и прогнозата за времето.',
        en: 'Outdoor space is the heart of any modern home or business. Our bioclimatic systems turn a terrace or garden into a comfortable room with an open view, a place to relax and meet people whatever the season or the forecast.',
      },
      {
        bg: 'В основата им стои съчетанието между интелигентна покривна конструкция и гъвкаво вертикално остъкляване. Автоматизираните перголи имат подвижен покрив от алуминиеви ламели, трислойно поливинилно покритие или стъклени панели, а стационарните – стъклен покрив или плътен покрив от термопанели.',
        en: 'Each system pairs an intelligent roof with flexible vertical glazing. Automated pergolas have a moving roof of aluminium louvres, three-layer PVC fabric or glass panels; fixed pergolas have a glass roof or a solid roof of insulated panels.',
      },
      {
        bg: 'Конструкциите са проектирани да устояват на вятър, дъжд и сняг – както в малки частни дворове, така и на големи търговски площи. Изработват се от висок клас алуминий с прахово покритие във всеки цвят по RAL, а с добавяне на остъкляване се превръщат в зимна градина.',
        en: 'The structures are designed to stand up to wind, rain and snow, from a small private garden to a large commercial terrace. They are built from high-grade powder-coated aluminium in any RAL colour, and with added glazing they become a winter garden.',
      },
    ],
    subgroups: [
      {
        id: 'automated',
        name: { bg: 'Автоматизирани покривни перголи', en: 'Automated roof pergolas' },
        description: {
          bg: 'Подвижният покрив може да бъде от алуминиеви ламели, трислойно поливинилно Blackout покритие или стъклени панели. Автоматизацията от последно поколение осигурява плавна и безшумна трансформация на пространството.',
          en: 'The moving roof comes in aluminium louvres, three-layer Blackout PVC or glass panels. Latest-generation automation transforms the space smoothly and quietly.',
        },
        productIds: ['balance', 'infinity', 'flat', 'curved', 'automatic-glass-roof'],
      },
      {
        id: 'fixed',
        name: { bg: 'Стационарни перголи', en: 'Fixed-roof pergolas' },
        description: {
          bg: 'Прозрачен стъклен покрив или плътен покрив от термопанели върху обща алуминиева основа със скрито водоотвеждане. Без движещи се части – тихи и надеждни през десетилетията.',
          en: 'A clear glass roof or a solid insulated-panel roof on a shared aluminium frame with hidden drainage. With no moving parts, they stay silent and reliable for decades.',
        },
        productIds: ['fixed-glass-roof', 'thermo-panel-roof'],
      },
    ],
  },
  {
    id: 'glass-systems',
    order: 2,
    name: { bg: 'Стъклени системи', en: 'Glass systems' },
    title: { bg: 'Стъклени системи за вертикално остъкляване', en: 'Vertical glazing systems' },
    tagline: { bg: 'Прозрачна граница.', en: 'A transparent boundary.' },
    intro: [
      {
        bg: 'Плъзгащите системи за вертикално остъкляване превръщат двора и терасата в многосезонна градина, защитена от дъжд, вятър, сняг и студ. Те позволяват остъкляване на големи площи и спестяват място, тъй като нямат стандартни отваряеми крила.',
        en: 'Sliding vertical glazing turns a courtyard or terrace into a garden room you can use in every season, sheltered from rain, wind, snow and cold. It can glaze large areas and saves space, because there are no conventional opening sashes.',
      },
      {
        bg: 'Предлагаме два принципа на движение: хоризонтално плъзгащи се и сгъваеми панели с ръчно управление и автоматизирани решения – вертикалната система тип „гилотина“ и входните врати dormakaba ES 200.',
        en: 'We offer two principles of movement: manually operated sliding and folding panels, and automated solutions such as the vertical guillotine system and dormakaba ES 200 entrance doors.',
      },
      {
        bg: 'Всяка конструкция е от висококачествен екструдиран алуминий с прецизни механизми за дълга работа при минимална поддръжка. Закалените стъкла осигуряват висока безопасност, а тонираните покрития и цветовете на профилите в пълната гама RAL вписват остъкляването в архитектурата.',
        en: 'Every system is built from high-quality extruded aluminium with precise mechanisms for long service and minimal maintenance. Tempered glass provides a high level of safety, while tinted glass and profiles in the full RAL range help the glazing blend with the architecture.',
      },
    ],
    subgroups: [
      {
        id: 'automatic',
        name: { bg: 'Автоматизирани системи', en: 'Automated systems' },
        description: {
          bg: 'Моторизирана вертикално плъзгаща се система тип „гилотина“ и автоматични плъзгащи се входни врати dormakaba ES 200.',
          en: 'A motorised vertical-sliding guillotine system and dormakaba ES 200 automatic sliding entrance doors.',
        },
        productIds: ['guillotine', 'dormakaba-es-200'],
      },
      {
        id: 'manual',
        name: { bg: 'Ръчни системи', en: 'Manual systems' },
        description: {
          bg: 'Хоризонтално плъзгащи се панели върху 2, 3 или 4 релси и сгъваеми стъклени системи в три серии – Compact, Accord и Harmonia, които се движат по горна релса без подови водачи.',
          en: 'Horizontal sliding panels on 2, 3 or 4 tracks, and folding glass systems in three series (Compact, Accord and Harmonia) that run on a top track with no floor guides.',
        },
        productIds: ['sliding-glass', 'compact', 'accord', 'harmonia'],
      },
    ],
  },
  {
    id: 'sun-protection',
    order: 3,
    name: { bg: 'Слънцезащита', en: 'Sun protection' },
    title: { bg: 'Моторизирани слънцезащитни системи', en: 'Motorised sun protection' },
    tagline: { bg: 'Филтър за слънце, стандарт за комфорт.', en: 'Sun filtered, comfort controlled.' },
    intro: [
      {
        bg: 'Покривните и вертикалните моторизирани системи са съвременният наследник на традиционните завеси, тенти и алуминиеви щори. Проектирани са за външен монтаж и засенчват големи площи – тераси, прозорци, витрини и зимни градини – в частни домове и търговски обекти.',
        en: 'Motorised roof and vertical systems are the modern successor to traditional blinds, awnings and aluminium shutters. Designed for exterior use, they shade large areas such as terraces, windows, shopfronts and winter gardens, for homes and businesses alike.',
      },
      {
        bg: 'Могат да се монтират към съществуваща сграда или да се вградят в нова конструкция като алуминиева пергола или окачена фасада. Управляват се с бутон, дистанционно или чрез SMART автоматизация, а специален механизъм държи платното опънато по цялата му дължина, дори при силен вятър.',
        en: 'They can be added to an existing building or integrated into new structures such as aluminium pergolas and curtain-wall façades. Control is by switch, remote or SMART automation, and a dedicated mechanism keeps the fabric taut along its full length, even in strong wind.',
      },
      {
        bg: 'С датчици за вятър, слънце и дъжд системата реагира сама: прибира платното при опасни пориви и го разпъва при силно слънце, дори когато не сте у дома. Така пази конструкцията и предпазва помещенията от прегряване.',
        en: 'With wind, sun and rain sensors the system reacts on its own, retracting the fabric in dangerous gusts and extending it in strong sun, even when you are away. That protects the installation and keeps rooms from overheating.',
      },
    ],
  },
  {
    id: 'windbreaks',
    order: 4,
    name: { bg: 'Ветрозащита', en: 'Windbreaks' },
    title: { bg: 'Телескопични хидравлични ветрозащитни системи', en: 'Telescopic hydraulic windbreaks' },
    tagline: { bg: 'Елегантна защита в точния момент.', en: 'Shelter, exactly when you need it.' },
    intro: [
      {
        bg: 'Телескопичните ветрозащитни системи работят като подвижен стъклен парапет, чиято височина се регулира според времето. В прибрано положение те са дискретен парапет, а при вятър или нужда от уединение горният панел се изтегля нагоре и образува защитна стена.',
        en: 'Telescopic windbreaks work like a moving glass balustrade whose height you adjust to the weather. Lowered, they are a discreet parapet; when the wind rises or you want privacy, the upper panel lifts to form a protective screen.',
      },
      {
        bg: 'Хидравличните амортисьори правят повдигането и свалянето леко и плавно – с натиск на бутон и без електрическо захранване. Системите са подходящи за ресторанти, кафенета и частни тераси.',
        en: 'Hydraulic dampers make raising and lowering light and smooth, at the press of a button and with no electrical supply. They are made for restaurants, cafés and private terraces.',
      },
    ],
  },
];
