import type { L } from './types';

// Page copy (BG + EN). Company texts are adapted from the catalogue: "За компанията", "Нашата дейност",
// "Адаптивност в синхрон с природата" (p. 12–13) and the closing text "Благодарим Ви, че избрахте
// опита и естетиката!" (inside back cover).

interface Step {
  id: string;
  title: L;
  text: L;
}

/** Real project sequence, used by the home page and the process page */
const processSteps: Step[] = [
  {
    id: 'inquiry',
    title: { bg: 'Запитване с приблизителни размери', en: 'Request with approximate sizes' },
    text: {
      bg: 'Изберете продукт и ни изпратете приблизителните размери и желаните опции – през формата, по телефона или във Viber.',
      en: 'Choose a product and send us rough dimensions and the options you want, through the form, by phone or on Viber.',
    },
  },
  {
    id: 'indicative-offer',
    title: { bg: 'Ориентировъчна оферта', en: 'Indicative quote' },
    text: {
      bg: 'Въз основа на размерите Ви изпращаме ориентировъчна оферта и препоръка за подходяща система.',
      en: 'Based on your dimensions, we send an indicative quote and recommend the right system.',
    },
  },
  {
    id: 'site-visit',
    title: { bg: 'Оглед и замер', en: 'Site visit and measuring' },
    text: {
      bg: 'Наш специалист прави оглед и точен замер на място и уточнява с Вас детайлите по монтажа.',
      en: 'One of our specialists visits the site, takes exact measurements and goes through the installation details with you.',
    },
  },
  {
    id: 'design',
    title: { bg: 'Проектиране и визуализация', en: 'Design and visualisation' },
    text: {
      bg: 'Проектираме системата според обекта, представяме Ви решението и окончателната оферта.',
      en: 'We design the system for your site and present the solution together with the final quote.',
    },
  },
  {
    id: 'production',
    title: { bg: 'Производство', en: 'Manufacturing' },
    text: {
      bg: 'Конструкцията се изработва по мярка, в избрания цвят по RAL и с избраните опции.',
      en: 'The structure is made to measure, in your chosen RAL colour and with the options you selected.',
    },
  },
  {
    id: 'installation',
    title: { bg: 'Монтаж и инсталация', en: 'Installation and set-up' },
    text: {
      bg: 'Нашият екип монтира системата, настройва автоматизацията и Ви показва как да я използвате.',
      en: 'Our team installs the system, sets up the automation and shows you how to use it.',
    },
  },
];

const processIntro: L = {
  bg: 'Пълен цикъл на обслужване – от професионалната консултация и прецизното проектиране до финалния монтаж и инсталация.',
  en: 'A complete service, from expert advice and precise design to final installation and set-up.',
};

export const pages = {
  home: {
    heroTitle: { bg: 'Пространства на открито за всеки сезон', en: 'Outdoor spaces for every season' },
    heroLead: {
      bg: 'Биоклиматични перголи, стъклени системи, ZIP завеси, тенти и ветрозащита. Проектираме, произвеждаме и монтираме с 20 години опит.',
      en: 'Bioclimatic pergolas, glass systems, ZIP screens, awnings and windbreaks, designed, made and installed with 20 years of experience.',
    },
    /** Alternative hero headlines for the client to choose from */
    heroTitleOptions: [
      { bg: 'Терасата, която следва времето', en: 'A terrace that follows the weather' },
      { bg: 'Покрив, светлина и стъкло по мярка', en: 'Roofs, light and glass, made to measure' },
      { bg: 'Комфортни пространства на открито и закрито', en: 'Comfortable outdoor and indoor living spaces' },
    ] as L[],
    heroMeta: { bg: 'София · 20 години опит', en: 'Sofia · 20 years of experience' },

    whatWeDo: {
      title: { bg: 'Какво правим', en: 'What we do' },
      intro: {
        bg: 'От скицата до готовата къща – всяка система на тази сграда е решение на OUTPLAY. Изберете точка, за да видите какво е и как работи.',
        en: 'From sketch to finished house, every system on this building is an OUTPLAY solution. Pick a point to see what it is and how it works.',
      },
      hint: { bg: 'Докоснете точките върху изображението', en: 'Tap the points on the image' },
    },

    categories: {
      title: { bg: 'Нашите системи', en: 'Our systems' },
      intro: {
        bg: 'Четири продуктови линии, които работят заедно – покрив, стъкло, сянка и защита от вятър.',
        en: 'Four product lines that work together: roof, glass, shade and shelter from the wind.',
      },
    },

    adaptive: {
      title: { bg: 'Адаптивност в синхрон с природата', en: 'In step with nature' },
      intro: {
        bg: 'Ламелите, покривите и остъкляването Ви позволяват да балансирате между слънчевата топлина и прохладната сянка и да използвате терасата през цялата година.',
        en: 'Louvres, roofs and glazing let you balance warm sun against cool shade, and use your terrace all year round.',
      },
      groups: [
        {
          id: 'sun-and-shade',
          title: { bg: 'Баланс между слънце и сянка', en: 'Balance between sun and shade' },
          text: { bg: 'Термален контрол и естествена вентилация.', en: 'Thermal control and natural ventilation.' },
          items: [
            {
              id: 'sun',
              label: { bg: 'Слънцезащита', en: 'Sun protection' },
              text: {
                bg: 'Затворените ламели или плътното Blackout платно спират преките лъчи, а ZIP завесите омекотяват светлината отстрани.',
                en: 'Closed louvres or Blackout fabric stop direct sun, and ZIP screens soften the light from the sides.',
              },
            },
            {
              id: 'ventilation',
              label: { bg: 'Вентилация', en: 'Ventilation' },
              text: {
                bg: 'Завъртете ламелите под ъгъл и въздухът циркулира свободно под покрива.',
                en: 'Angle the louvres and air flows freely beneath the roof.',
              },
            },
            {
              id: 'temperature',
              label: { bg: 'Регулиране на температурата', en: 'Temperature control' },
              text: {
                bg: 'Термоизолираните ламели и термопанелите задържат уютна температура, а с остъкляване терасата става зимна градина.',
                en: 'Insulated louvres and panels hold a comfortable temperature, and with glazing the terrace becomes a winter garden.',
              },
            },
          ],
        },
        {
          id: 'all-year',
          title: { bg: 'Целогодишен комфорт на открито', en: 'Year-round outdoor comfort' },
          text: { bg: 'Пълна защита от атмосферни влияния.', en: 'Full protection from the elements.' },
          items: [
            {
              id: 'rain',
              label: { bg: 'Защита от дъжд', en: 'Rain protection' },
              text: {
                bg: 'Затворен покрив, вградени улуци и колони, които служат като скрити водостоци.',
                en: 'A closed roof, built-in gutters and posts that double as concealed downpipes.',
              },
            },
            {
              id: 'wind',
              label: { bg: 'Ветроустойчивост', en: 'Wind resistance' },
              text: {
                bg: 'Поливинилните покриви Flat и Curved устояват на пориви на вятъра до 117 км/ч.',
                en: 'Flat and Curved PVC roofs withstand gusts of up to 117 km/h.',
              },
            },
            {
              id: 'snow',
              label: { bg: 'Защита от сняг', en: 'Snow protection' },
              text: {
                bg: 'Затворените ламели пазят от сняг, а стационарните покриви са проектирани за обилни снеговалежи.',
                en: 'Closed louvres keep snow out, and fixed roofs are designed for heavy snowfall.',
              },
            },
          ],
        },
      ],
    },

    options: {
      title: { bg: 'Комфорт и допълнителни опции', en: 'Comfort and options' },
      intro: {
        bg: 'Персонализирайте Вашата пергола, като изберете опции, интегрирани в структурата.',
        en: 'Make the pergola your own with options built into the structure.',
      },
      items: [
        { id: 'glazing', label: { bg: 'Вертикално остъкляване', en: 'Vertical glazing' } },
        { id: 'zip', label: { bg: 'Слънцезащитни ZIP завеси', en: 'ZIP sun screens' } },
        { id: 'led', label: { bg: 'Вградено LED осветление', en: 'Integrated LED lighting' } },
        { id: 'heating', label: { bg: 'Интегрирани отоплителни тела', en: 'Integrated heaters' } },
        { id: 'sound', label: { bg: 'Вградено озвучаване', en: 'Built-in sound system' } },
      ],
    },

    beforeAfter: {
      title: { bg: 'Преди и след', en: 'Before and after' },
      intro: {
        bg: 'Плъзнете линията, за да сравните мястото преди и след монтажа.',
        en: 'Drag the handle to compare the space before and after installation.',
      },
    },

    process: {
      title: { bg: 'Как работим', en: 'How we work' },
      intro: processIntro,
      steps: processSteps,
    },

    references: {
      title: { bg: 'Избрани проекти', en: 'Selected projects' },
      intro: {
        bg: 'Част от обектите, по които сме работили – жилищни комплекси, ресторанти и търговски пространства.',
        en: 'Some of the places we have worked on: residential developments, restaurants and commercial spaces.',
      },
    },

    partners: {
      title: { bg: 'Работим с водещи производители', en: 'We work with leading manufacturers' },
      intro: {
        bg: 'Партнираме си с утвърдени производители на профилни системи и технологии, за да вграждаме доказани решения във всеки обект.',
        en: 'We partner with established makers of profile systems and technology, so every project is built on proven components.',
      },
    },

    faq: {
      title: { bg: 'Често задавани въпроси', en: 'Frequently asked questions' },
      intro: {
        bg: 'Кратки отговори за избора, офертата, монтажа и поддръжката.',
        en: 'Quick answers on choosing a system, quotes, installation and care.',
      },
    },

    cta: {
      title: { bg: 'Изпратете ни размерите', en: 'Send us your dimensions' },
      intro: {
        bg: 'Посочете продукта и приблизителните размери – ще Ви изпратим ориентировъчна оферта и ще уговорим оглед.',
        en: 'Tell us the product and rough dimensions. We will send an indicative quote and arrange a site visit.',
      },
    },
  },

  about: {
    title: { bg: 'За OUTPLAY', en: 'About OUTPLAY' },
    intro: {
      bg: 'Двадесет години планираме, проектираме, произвеждаме и монтираме индивидуални архитектурни решения.',
      en: 'For twenty years we have planned, designed, manufactured and installed bespoke architectural solutions.',
    },
    story: [
      {
        bg: 'OUTPLAY е фирма с 20-годишен опит в планирането, проектирането, производството и монтажа на индивидуални и нестандартни архитектурни решения. Компанията е базирана в София и разполага с модерна производствена база и съвременно оборудване, които превръщат всяка концепция в реалност – естетична, функционална и дълготрайна.',
        en: 'OUTPLAY has 20 years of experience in planning, designing, manufacturing and installing bespoke and non-standard architectural solutions. Based in Sofia, the company has a modern production facility and advanced equipment that turn each concept into something real: good-looking, practical and built to last.',
      },
      {
        bg: 'В основата на работата ни стои екип от отговорни специалисти с дългогодишен опит и висока квалификация. Основният ни приоритет е краен продукт с безкомпромисно качество, отговарящ на строгите европейски стандарти.',
        en: 'Behind our work is a team of conscientious specialists with long experience and strong qualifications. Our first priority is a finished product of uncompromising quality that meets strict European standards.',
      },
      {
        bg: 'Партнираме си с утвърдени световни производители на профилни системи и технологии – REYNAERS, ALUMIL, ETEM, SCHÜCO, HILTI, WÜRTH, SIKA, DORMA, SOMFY, HÖRMANN, FUNDERMAX, ALUCOBOND и други. Следим технологичното развитие и внедряваме модерни материали и интелигентни системи, за да осигурим на клиентите си съвременен дизайн, функционалност и сигурност.',
        en: 'We partner with leading international makers of profile systems and technology, including REYNAERS, ALUMIL, ETEM, SCHÜCO, HILTI, WÜRTH, SIKA, DORMA, SOMFY, HÖRMANN, FUNDERMAX and ALUCOBOND. We keep up with new technology and bring in modern materials and smart systems to give our clients contemporary design, function and peace of mind.',
      },
    ] as L[],
    activitiesTitle: { bg: 'Нашата дейност', en: 'What we do' },
    activities: [
      {
        id: 'bioclimatic',
        title: { bg: 'Биоклиматични системи и интелигентна слънцезащита', en: 'Bioclimatic systems and smart sun protection' },
        text: {
          bg: 'Автоматизирани покривни структури и биоклиматични решения за зимни градини: алуминиеви и стъклени покриви, перголи с трислойно поливинилно покритие, плъзгащи системи, вертикални прегради тип „гилотина“, телескопични стъклени паравани и слънцезащитни завеси.',
          en: 'Automated roof structures and bioclimatic winter gardens: aluminium and glass roofs, pergolas with three-layer PVC roofs, sliding systems, guillotine glazing, telescopic glass windbreaks and sun screens.',
        },
      },
      {
        id: 'glazing',
        title: { bg: 'Прецизни стандарти за остъкляване', en: 'Windows, doors and glazing' },
        text: {
          bg: 'PVC и алуминиеви системи с и без термичен мост за врати, прозорци и фасади, с богат избор на стъклопакети и цветове. Специално внимание отделяме на плъзгащите системи – тип „хармоника“, с повдигане и плъзгане (HST), с паралелно плъзгане (VW) и други.',
          en: 'PVC and aluminium systems, thermally broken or not, for doors, windows and façades, with a wide choice of glazing units and colours. We pay special attention to sliding systems: folding, lift-and-slide (HST), parallel sliding (VW) and more.',
        },
      },
      {
        id: 'interior',
        title: { bg: 'Интериорни стъклени системи и офис решения', en: 'Interior glass and office solutions' },
        text: {
          bg: 'Стъклени врати, витрини и душ кабини, шумоизолиращи преградни стени, плъзгащи и фиксирани стъклени системи за гъвкаво разпределение на работната среда.',
          en: 'Glass doors, display cases and shower enclosures, acoustic partition walls, and sliding and fixed glass systems for flexible workplaces.',
        },
      },
      {
        id: 'facades',
        title: { bg: 'Фасадни концепции и екстериорно остъкляване', en: 'Façades and exterior glazing' },
        text: {
          bg: 'Окачени стъклени фасади и вентилируеми фасади от алуминий, HPL, цинк и керамика върху стоманени конструкции, както и алуминиеви и стъклени парапети.',
          en: 'Glass curtain walls and ventilated façades in aluminium, HPL, zinc and ceramic on steel structures, plus aluminium and glass balustrades.',
        },
      },
    ],
    mission: {
      title: { bg: 'Опит и естетика', en: 'Experience and aesthetics' },
      text: {
        bg: 'Вярваме, че всяко пространство има потенциал, който се разкрива чрез правилното съчетание между технология и дизайн. Изграждаме дългосрочни партньорства, основани на доверие и качество. Съчетаваме опита на водещи световни производители с нашата експертиза и превръщаме Вашата идея в трайна архитектурна реалност. От идейния проект до финалния монтаж фокусът ни остава върху сигурността и естетиката.',
        en: 'We believe every space has potential that the right mix of technology and design can bring out. We build long-term partnerships based on trust and quality, combining the know-how of leading manufacturers with our own expertise to turn your idea into lasting architecture. From the first concept to the final installation, we stay focused on reliability and aesthetics.',
      },
    },
    valuesTitle: { bg: 'Как работим', en: 'How we work' },
    values: [
      {
        id: 'individual',
        title: { bg: 'Индивидуален подход', en: 'Individual approach' },
        text: {
          bg: 'Подхождаме към всеки проект като към творческо предизвикателство и създаваме система, която отговаря точно на нуждите на обекта.',
          en: 'We treat every project as a creative challenge and build a system that fits the site exactly.',
        },
      },
      {
        id: 'full-cycle',
        title: { bg: 'Пълен цикъл', en: 'One team, start to finish' },
        text: {
          bg: 'Консултация, проектиране, производство и монтаж от един екип.',
          en: 'Consultation, design, manufacturing and installation by one team.',
        },
      },
      {
        id: 'precision',
        title: { bg: 'Прецизно изпълнение', en: 'Precise execution' },
        text: {
          bg: 'Дългогодишният опит и квалификацията на екипа стоят зад точното изпълнение на всеки детайл.',
          en: 'Years of experience and a highly qualified team stand behind every detail.',
        },
      },
      {
        id: 'proven',
        title: { bg: 'Доказани технологии', en: 'Proven technology' },
        text: {
          bg: 'Работим с профилни системи и компоненти на водещи производители и следим новостите в бранша.',
          en: 'We use profile systems and components from leading manufacturers and keep up with the industry.',
        },
      },
    ],
    partners: {
      title: { bg: 'Партньори', en: 'Partners' },
      intro: {
        bg: 'Решения от утвърдени производители на профилни системи и технологии.',
        en: 'Solutions from established makers of profile systems and technology.',
      },
    },
  },

  process: {
    title: { bg: 'Как работим', en: 'How we work' },
    intro: processIntro,
    steps: processSteps,
    note: {
      bg: 'Сроковете и окончателната цена се посочват в офертата след огледа.',
      en: 'Timing and the final price are confirmed in the quote after the site visit.',
    },
  },

  products: {
    title: { bg: 'Продукти', en: 'Products' },
    intro: {
      bg: 'Биоклиматични перголи, стъклени системи, слънцезащита и ветрозащита. Всяка система се проектира и изработва по мярка.',
      en: 'Bioclimatic pergolas, glass systems, sun protection and windbreaks. Every system is designed and made to measure.',
    },
  },

  gallery: {
    title: { bg: 'Проекти и галерия', en: 'Projects and gallery' },
    intro: {
      bg: 'Реализирани обекти и визуализации на нашите системи.',
      en: 'Completed projects and visualisations of our systems.',
    },
  },

  faq: {
    title: { bg: 'Често задавани въпроси', en: 'Frequently asked questions' },
    intro: {
      bg: 'Не намирате отговор? Обадете се или ни пишете във Viber.',
      en: 'Can’t find your answer? Call us or message us on Viber.',
    },
  },

  contact: {
    title: { bg: 'Контакти', en: 'Contact' },
    intro: {
      bg: 'Обадете се, пишете ни във Viber или изпратете запитване с приблизителни размери. Ще Ви отговорим с ориентировъчна оферта.',
      en: 'Call us, message us on Viber or send a request with approximate dimensions, and we will reply with an indicative quote.',
    },
    mapTitle: { bg: 'Как да ни намерите', en: 'Find us' },
    formTitle: { bg: 'Запитване за оферта', en: 'Request a quote' },
  },

  inquiry: {
    title: { bg: 'Запитване за оферта', en: 'Request a quote' },
    intro: {
      bg: 'Изберете продукт, посочете приблизителни размери и желани опции. Ще Ви изпратим ориентировъчна оферта, а след оглед и замер на място – окончателна.',
      en: 'Choose a product and enter approximate dimensions and options. We will send an indicative quote, and a final one after a site visit and measurement.',
    },
    success: {
      title: { bg: 'Благодарим Ви за запитването', en: 'Thank you for your request' },
      text: {
        bg: 'Ще прегледаме размерите и опциите и ще се свържем с Вас по избрания начин с ориентировъчна оферта.',
        en: 'We will review your dimensions and options and get back to you, the way you prefer, with an indicative quote.',
      },
      nextTitle: { bg: 'Какво следва', en: 'What happens next' },
      next: [
        { bg: 'Ориентировъчна оферта', en: 'Indicative quote' },
        { bg: 'Оглед и замер на място', en: 'Site visit and measurement' },
        { bg: 'Окончателна оферта', en: 'Final quote' },
      ] as L[],
    },
    demoNotice: {
      bg: 'Това е демо версия: запитването е запазено само в този браузър и не е изпратено. В реалния сайт то ще пристигне директно в OUTPLAY.',
      en: 'This is a demo: your request has been saved in this browser only and has not been sent. On the live site it will go straight to OUTPLAY.',
    },
    summaryTitle: { bg: 'Обобщение на запитването', en: 'Request summary' },
  },

  notFound: {
    title: { bg: 'Страницата не е намерена', en: 'Page not found' },
    intro: {
      bg: 'Възможно е адресът да е променен или да съдържа грешка. Разгледайте продуктите или потърсете това, което Ви трябва.',
      en: 'The address may have changed or contain a typo. Browse the products or search for what you need.',
    },
  },

  search: {
    title: { bg: 'Търсене', en: 'Search' },
    intro: {
      bg: 'Търсете по продукт, материал или нужда – например „ламели“, „гилотина“, „зимна градина“ или „ZIP“.',
      en: 'Search by product, material or need, such as “louvres”, “guillotine”, “winter garden” or “ZIP”.',
    },
    suggestions: [
      { bg: 'пергола', en: 'pergola' },
      { bg: 'зимна градина', en: 'winter garden' },
      { bg: 'гилотина', en: 'guillotine' },
      { bg: 'ZIP завеси', en: 'ZIP screens' },
      { bg: 'тента', en: 'awning' },
      { bg: 'ветрозащита', en: 'windbreak' },
    ] as L[],
  },

  admin: {
    title: { bg: 'Административен панел', en: 'Admin panel' },
    banner: {
      bg: 'Демо режим — промените се пазят само в този браузър',
      en: 'Demo mode: changes are saved in this browser only',
    },
    login: {
      title: { bg: 'Вход в администрацията', en: 'Admin sign-in' },
      username: { bg: 'Потребителско име', en: 'Username' },
      password: { bg: 'Парола', en: 'Password' },
      submit: { bg: 'Вход', en: 'Sign in' },
      hint: {
        bg: 'Демо достъп: потребител demo, парола demo. В реалния сайт достъпът е защитен.',
        en: 'Demo access: username demo, password demo. On the live site access is protected.',
      },
      error: { bg: 'Грешно потребителско име или парола.', en: 'Incorrect username or password.' },
    },
    nav: {
      dashboard: { bg: 'Табло', en: 'Dashboard' },
      products: { bg: 'Продукти', en: 'Products' },
      categories: { bg: 'Категории', en: 'Categories' },
      inquiries: { bg: 'Запитвания', en: 'Inquiries' },
      gallery: { bg: 'Галерия', en: 'Gallery' },
      pages: { bg: 'Текстове', en: 'Page copy' },
      faq: { bg: 'Въпроси', en: 'FAQ' },
      settings: { bg: 'Настройки', en: 'Settings' },
      logout: { bg: 'Изход', en: 'Sign out' },
      viewSite: { bg: 'Към сайта', en: 'View site' },
    },
    dashboard: {
      welcome: { bg: 'Добре дошли', en: 'Welcome' },
      newInquiries: { bg: 'Нови запитвания', en: 'New inquiries' },
      totalInquiries: { bg: 'Всички запитвания', en: 'All inquiries' },
      productsCount: { bg: 'Продукти', en: 'Products' },
      lastEdited: { bg: 'Последни промени', en: 'Recent changes' },
      quickActions: { bg: 'Бързи действия', en: 'Quick actions' },
      emptyInquiries: { bg: 'Все още няма запитвания.', en: 'No inquiries yet.' },
    },
    inquiryStatus: {
      new: { bg: 'Ново', en: 'New' },
      inProgress: { bg: 'В процес', en: 'In progress' },
      offerSent: { bg: 'Изпратена оферта', en: 'Quote sent' },
      closed: { bg: 'Приключено', en: 'Closed' },
    },
    actions: {
      add: { bg: 'Добави', en: 'Add' },
      addProduct: { bg: 'Добави продукт', en: 'Add product' },
      edit: { bg: 'Редактирай', en: 'Edit' },
      save: { bg: 'Запази', en: 'Save' },
      saved: { bg: 'Запазено', en: 'Saved' },
      cancel: { bg: 'Отказ', en: 'Cancel' },
      delete: { bg: 'Изтрий', en: 'Delete' },
      confirmDelete: { bg: 'Сигурни ли сте, че искате да изтриете този запис?', en: 'Are you sure you want to delete this item?' },
      preview: { bg: 'Преглед', en: 'Preview' },
      uploadImage: { bg: 'Качи снимка', en: 'Upload image' },
      addVideo: { bg: 'Добави видео (URL)', en: 'Add video (URL)' },
      exportJson: { bg: 'Експорт (JSON)', en: 'Export (JSON)' },
      resetDemo: { bg: 'Възстанови демо данните', en: 'Reset demo data' },
      resetConfirm: { bg: 'Всички промени в този браузър ще бъдат изтрити. Продължаване?', en: 'All changes in this browser will be deleted. Continue?' },
    },
    fields: {
      nameBg: { bg: 'Име (BG)', en: 'Name (BG)' },
      nameEn: { bg: 'Име (EN)', en: 'Name (EN)' },
      category: { bg: 'Категория', en: 'Category' },
      tagline: { bg: 'Подзаглавие', en: 'Tagline' },
      summary: { bg: 'Кратко описание', en: 'Summary' },
      description: { bg: 'Описание', en: 'Description' },
      images: { bg: 'Снимки', en: 'Images' },
      video: { bg: 'Видео', en: 'Video' },
      order: { bg: 'Подредба', en: 'Order' },
      visible: { bg: 'Видим на сайта', en: 'Visible on site' },
      date: { bg: 'Дата', en: 'Date' },
      status: { bg: 'Статус', en: 'Status' },
      customer: { bg: 'Клиент', en: 'Customer' },
    },
    searchPlaceholder: { bg: 'Търсене в админ панела', en: 'Search the admin panel' },
  },
};
