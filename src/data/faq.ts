import type { FaqGroup } from './types';

// FAQ modelled on Mirador's topics (installation, lead time, foundation, drainage, weather, permits,
// warranty, materials, model differences), adapted to OUTPLAY and Bulgaria. Facts come from the catalogue;
// where the catalogue states nothing (lead times, warranty terms, permits) the answers give no numbers.
export const faq: FaqGroup[] = [
  {
    id: 'choosing',
    title: { bg: 'Избор и проектиране', en: 'Choosing and planning' },
    items: [
      {
        q: {
          bg: 'Каква е разликата между сериите Balance и Infinity?',
          en: 'What is the difference between Balance and Infinity?',
        },
        a: {
          bg: 'И двете са биоклиматични перголи с алуминиеви ламели, които се завъртат от 0° до 120°. Balance е едномоторна система – ламелите само се завъртат. Infinity е двумоторна – ламелите се завъртат и се прибират напълно в единия край, така че покривът се отваря изцяло към небето.',
          en: 'Both are bioclimatic pergolas with aluminium louvres that rotate from 0° to 120°. Balance uses one motor and the louvres rotate only. Infinity uses two motors, so the louvres both rotate and retract fully to one end, opening the roof completely to the sky.',
        },
      },
      {
        q: {
          bg: 'Какъв покрив да избера – ламели, поливинилно платно, стъкло или термопанели?',
          en: 'Which roof should I choose: louvres, PVC fabric, glass or insulated panels?',
        },
        a: {
          bg: 'Ламелите дават най-фин контрол над светлината и проветрението. Трислойното поливинилно Blackout покритие (серии Flat и Curved) е 100% водоустойчиво, блокира до 89% от UV лъчите и устоява на пориви до 117 км/ч. Стъкленият покрив – автоматичен или стационарен – пропуска максимум дневна светлина. Термопанелите изолират най-добре и са подходящи и за навеси за автомобили. Ще Ви помогнем да изберете при консултацията.',
          en: 'Louvres give the finest control over light and airflow. Three-layer Blackout PVC (Flat and Curved series) is 100% waterproof, blocks up to 89% of UV and withstands gusts of up to 117 km/h. A glass roof, retractable or fixed, lets in the most daylight. Insulated panels insulate best and also work well as carports. We will help you choose during the consultation.',
        },
      },
      {
        q: {
          bg: 'Може ли перголата да се затвори като зимна градина?',
          en: 'Can a pergola be enclosed as a winter garden?',
        },
        a: {
          bg: 'Да. С вертикално остъкляване – плъзгащи се панели, система тип „гилотина“ или сгъваеми стъклени системи – перголата се превръща в зимна градина, която се използва и през студените месеци. Плъзгащите системи и гилотината са напълно съвместими с цялата гама биоклиматични перголи. При поливинилните покриви за зимна градина е най-подходящ моделът с покритие, вградено във водачите.',
          en: 'Yes. With vertical glazing (sliding panels, a guillotine system or folding glass) a pergola becomes a winter garden you can use in the colder months too. Sliding systems and the guillotine are fully compatible with the entire bioclimatic pergola range. For PVC roofs, the version with the fabric built into the guide rails is the best basis for a winter garden.',
        },
      },
      {
        q: {
          bg: 'Може ли перголата да се прикрепи към сградата?',
          en: 'Can the pergola be attached to the building?',
        },
        a: {
          bg: 'Да. Перголите могат да бъдат самостоятелни конструкции или прикрепени към фасадата – с две предни колони, без колони между две стени или, при сериите Flat и Curved, захванати за фасадата с обтегачи. За големи площи няколко модула се свързват в обща конструкция.',
          en: 'Yes. Pergolas can be freestanding or fixed to the façade, with two front posts, with no posts between two walls, or, for the Flat and Curved series, hung from the façade on tension rods. For large areas, several modules are coupled into one structure.',
        },
      },
      {
        q: { bg: 'В какви цветове се изработват конструкциите?', en: 'What colours are available?' },
        a: {
          bg: 'Алуминиевите конструкции се боядисват прахово във всеки цвят от палитрата RAL. При автоматичния стъклен покрив се предлагат мат, гланц, текстури и дървесни декори, а при вратите dormakaba – и елоксация. Платната за ZIP завеси и тенти се предлагат в широка гама цветове и текстури.',
          en: 'Aluminium structures are powder-coated in any RAL colour. The retractable glass roof is also available in matt, gloss, textured and wood-effect finishes, and dormakaba doors can be anodised. Fabrics for ZIP screens and awnings come in a wide range of colours and textures.',
        },
      },
      {
        q: { bg: 'Какви допълнителни опции може да има перголата?', en: 'What extras can a pergola have?' },
        a: {
          bg: 'В структурата могат да се интегрират LED осветление (при ламелните перголи – и RGB с димиране), отоплителни тела, озвучаване, слънцезащитни ZIP завеси и вертикално остъкляване. При покрива от термопанели в тавана лесно се вграждат LED осветление, озвучаване или лъчисто отопление.',
          en: 'LED lighting (dimmable RGB on louvred pergolas), heaters, a sound system, ZIP sun screens and vertical glazing can all be integrated into the structure. On the insulated-panel roof, LED lighting, sound or radiant heating fit neatly into the ceiling.',
        },
      },
    ],
  },
  {
    id: 'quote',
    title: { bg: 'Оферта и оглед', en: 'Quotes and site visits' },
    items: [
      {
        q: {
          bg: 'Как работи запитването с приблизителни размери?',
          en: 'How does a quote request with approximate sizes work?',
        },
        a: {
          bg: 'Изберете продукт, посочете приблизителните размери и желаните опции и изпратете запитването. Ние Ви изпращаме ориентировъчна оферта. Ако решите да продължите, уговаряме оглед и замер на място, след което получавате окончателна оферта с точните параметри.',
          en: 'Choose a product, enter approximate dimensions and the options you want, and send the request. We reply with an indicative quote. If you decide to go ahead, we arrange a site visit and measurement, and then send a final quote with the exact specification.',
        },
      },
      {
        q: { bg: 'Защо на сайта няма цени?', en: 'Why are there no prices on the site?' },
        a: {
          bg: 'Всяка система се проектира и изработва по мярка. Цената зависи от размерите, конфигурацията, вида на покрива и стъклото, автоматизацията и допълнителните опции. Затова изготвяме индивидуална оферта – първо ориентировъчна по Вашите размери, а след огледа – окончателна.',
          en: 'Every system is designed and made to measure. The price depends on size, configuration, roof and glass type, automation and extras. That is why we prepare an individual quote: first an indicative one based on your dimensions, then a final one after the site visit.',
        },
      },
      {
        q: { bg: 'Трябва ли да знам точните размери?', en: 'Do I need exact measurements?' },
        a: {
          bg: 'Не. За ориентировъчната оферта са достатъчни приблизителни размери – например ширина и дълбочина на терасата. Точният замер се прави от наш специалист при огледа на място. Ако имате снимки на мястото, те също ни помагат.',
          en: 'No. Approximate sizes, such as the width and depth of your terrace, are enough for an indicative quote. One of our specialists takes exact measurements during the site visit. Photos of the space help too.',
        },
      },
      {
        q: {
          bg: 'Работите ли с ресторанти, хотели и търговски обекти?',
          en: 'Do you work with restaurants, hotels and commercial premises?',
        },
        a: {
          bg: 'Да. Освен за частни домове изпълняваме решения за заведения, хотели, офиси и обществени сгради – от остъкляване на покривни тераси и градини на ресторанти до автоматични входни врати dormakaba. Предлагаме пълен цикъл на обслужване: консултация, проектиране, производство, монтаж и инсталация.',
          en: 'Yes. Alongside private homes, we work on restaurants, hotels, offices and public buildings, from glazing roof terraces and restaurant gardens to dormakaba automatic entrance doors. We offer a complete service: consultation, design, manufacturing, installation and set-up.',
        },
      },
    ],
  },
  {
    id: 'installation',
    title: { bg: 'Монтаж и разрешителни', en: 'Installation and permits' },
    items: [
      {
        q: {
          bg: 'Колко време отнемат изработката и монтажът?',
          en: 'How long do manufacturing and installation take?',
        },
        a: {
          bg: 'Срокът зависи от системата, размерите и обема на проекта и се посочва в офертата. Конструкциите се изработват по мярка, а монтажът и настройката на автоматизацията се извършват от нашия екип.',
          en: 'It depends on the system, the size and the scope of the project, and the timing is stated in the quote. Structures are made to measure, and installation and set-up of the automation are carried out by our own team.',
        },
      },
      {
        q: { bg: 'Нужен ли е фундамент?', en: 'Do I need a foundation?' },
        a: {
          bg: 'Зависи от конструкцията и от основата на място – бетонна плоча, настилка, тераса или покрив. Начинът на закрепване и евентуалната нужда от фундамент се определят при огледа и проектирането.',
          en: 'It depends on the structure and on what is there now: a concrete slab, paving, a terrace or a roof. How the system is anchored, and whether a foundation is needed, is decided during the site visit and design.',
        },
      },
      {
        q: { bg: 'Необходимо ли е разрешение за монтаж?', en: 'Do I need a permit?' },
        a: {
          bg: 'Зависи от вида и размера на конструкцията и от обекта. За някои съоръжения, особено прикрепени към сграда или в етажна собственост, може да е необходимо съгласуване с общината или съгласие на етажната собственост. Ще Ви консултираме при огледа, а конкретните изисквания е добре да проверите и в съответната община.',
          en: 'It depends on the type and size of the structure and on the property. For some installations, especially those attached to a building or in a block of flats, approval from the municipality or consent from the other owners may be needed. We will advise you during the site visit, and it is worth confirming the requirements with your local municipality.',
        },
      },
    ],
  },
  {
    id: 'technology',
    title: { bg: 'Технологии и експлоатация', en: 'Technology and everyday use' },
    items: [
      {
        q: {
          bg: 'Какво се случва с ламелите при дъжд?',
          en: 'What happens to the louvres when it rains?',
        },
        a: {
          bg: 'Когато ламелите са затворени, покривът пази от дъжд и сняг. Водата се събира във вградените улуци по периметъра и се отвежда през колоните, които служат като скрити водостоци. Всяка ламела е с допълнителна термо- и звукоизолация.',
          en: 'With the louvres closed, the roof keeps out rain and snow. Water collects in the built-in gutters around the perimeter and runs down through the posts, which double as concealed downpipes. Each louvre also has added thermal and acoustic insulation.',
        },
      },
      {
        q: {
          bg: 'Колко вятър и сняг издържат конструкциите?',
          en: 'How much wind and snow can the structures take?',
        },
        a: {
          bg: 'Перголите с поливинилно покритие Flat и Curved устояват на пориви на вятъра до 117 км/ч. Биоклиматичните системи са проектирани да устояват на вятър, дъжд и сняг, а стационарните покриви от стъкло и термопанели – на обилни снеговалежи и бурни ветрове. Конкретните натоварвания зависят от размера и мястото и се отчитат при проектирането.',
          en: 'The Flat and Curved PVC-roof pergolas withstand gusts of up to 117 km/h. Our bioclimatic systems are designed to stand up to wind, rain and snow, and the fixed glass and insulated-panel roofs to heavy snowfall and strong winds. Actual loads depend on the size and location and are taken into account at the design stage.',
        },
      },
      {
        q: {
          bg: 'Може ли управлението да бъде автоматично?',
          en: 'Can the systems work automatically?',
        },
        a: {
          bg: 'Автоматизираните перголи се управляват с дистанционно. Слънцезащитните системи могат да имат датчици за вятър, слънце и дъжд, които прибират платното при силен вятър или го разпъват при силно слънце, и да се включат в SMART система за умен дом. Тентите Shell се управляват и от мобилно устройство.',
          en: 'Automated pergolas are operated by remote control. Sun protection systems can be fitted with wind, sun and rain sensors that retract the fabric in strong wind or extend it in strong sun, and can be connected to a SMART home system. Shell awnings can also be controlled from a mobile device.',
        },
      },
      {
        q: {
          bg: 'Каква е разликата между перфорирана и Blackout материя при ZIP завесите?',
          en: 'Perforated or blackout ZIP fabric: what is the difference?',
        },
        a: {
          bg: 'Микроперфорираната материя разсейва слънцето, пропуска въздух и запазва видимостта отвътре навън, докато отвън пази от погледи. Blackout материите са непроницаеми и осигуряват пълно затъмняване – подходящи са, когато е нужна абсолютна тъмнина.',
          en: 'Micro-perforated fabric diffuses sunlight, lets air through and keeps the view out while blocking the view in. Blackout fabrics are opaque and give complete darkness, for rooms where you need it.',
        },
      },
      {
        q: {
          bg: 'Как работи ветрозащитата без електричество?',
          en: 'How does the windbreak work without electricity?',
        },
        a: {
          bg: 'Телескопичните ветрозащитни системи имат интегрирани хидравлични амортисьори. С лек натиск на бутона горният стъклен панел се повдига или сваля плавно, без усилие и без електрическо захранване.',
          en: 'Telescopic windbreaks have integrated hydraulic dampers. A light press of the button raises or lowers the upper glass panel smoothly and effortlessly, with no electrical supply.',
        },
      },
      {
        q: {
          bg: 'Какво е безконтактното отваряне Magic Switch?',
          en: 'What is Magic Switch touchless opening?',
        },
        a: {
          bg: 'Magic Switch е радарен сензор за автоматичните врати dormakaba ES 200 – вратата се отваря с леко движение на ръката пред устройството, без докосване. Може да се добави и дискретен крачен бутон. Решението е подходящо за медицински заведения, лаборатории, хранителни обекти и обществени сгради.',
          en: 'Magic Switch is a radar sensor for dormakaba ES 200 automatic doors: the door opens with a light wave of the hand in front of the sensor, with no contact. A discreet foot button can be added too. It suits medical facilities, laboratories, food businesses and public buildings.',
        },
      },
    ],
  },
  {
    id: 'care',
    title: { bg: 'Поддръжка и гаранция', en: 'Care and warranty' },
    items: [
      {
        q: {
          bg: 'Каква поддръжка изискват системите?',
          en: 'How much maintenance do the systems need?',
        },
        a: {
          bg: 'Конструкциите са от висок клас алуминий с прахово покритие, устойчив на корозия и атмосферни влияния, и не изискват сложна поддръжка. Стационарните покриви нямат движещи се части. Препоръки за грижа според конкретната система ще получите при монтажа.',
          en: 'The structures are made of high-grade powder-coated aluminium that resists corrosion and weather, and they need no complicated maintenance. Fixed roofs have no moving parts at all. You will receive care recommendations for your specific system at installation.',
        },
      },
      {
        q: {
          bg: 'Как се почистват стъклата на гилотината?',
          en: 'How do you clean guillotine glazing?',
        },
        a: {
          bg: 'Системата има патентован механизъм, който позволява на най-вътрешния и средните панели да се отварят навътре. Така достигате безопасно външната страна на стъклото и я почиствате сами, без специализирана алпийска техника или външна помощ.',
          en: 'The system has a patented mechanism that lets the innermost and middle panels tilt inwards. You can safely reach the outer face of the glass and clean it yourself, without rope-access specialists or outside help.',
        },
      },
      {
        q: { bg: 'Каква гаранция предлагате?', en: 'What warranty do you offer?' },
        a: {
          bg: 'Гаранционните условия зависят от системата и компонентите и се посочват в офертата и договора. Работим с профилни системи и компоненти на утвърдени производители.',
          en: 'Warranty terms depend on the system and its components and are set out in the quote and contract. We work with profile systems and components from established manufacturers.',
        },
      },
      {
        q: {
          bg: 'Мога ли да добавя остъкляване или ZIP завеси по-късно?',
          en: 'Can I add glazing or ZIP screens later?',
        },
        a: {
          bg: 'В много случаи – да. Перголите са проектирани за интегриране на допълнителни елементи като осветление, слънцезащита и остъкляване, а слънцезащитните системи могат да се монтират и към съществуващи конструкции. Най-добре е да ги предвидим още при проектирането, за да бъдат вградени изцяло.',
          en: 'In many cases, yes. The pergolas are designed to take extra elements such as lighting, sun protection and glazing, and sun protection systems can also be fitted to existing structures. It is best to plan them at the design stage so they can be fully integrated.',
        },
      },
    ],
  },
];
