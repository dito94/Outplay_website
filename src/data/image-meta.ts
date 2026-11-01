import type { ImageMeta } from './types';

/**
 * Alt text (BG/EN) and optional focal point for every image under src/assets/img.
 * Key = path relative to src/assets/img. Generated alongside the image export (see docs/assets-report.md).
 */
export const imageMeta: Record<string, ImageMeta> = {
  // ---------------------------------------------------------------- home
  'home/hero.jpg': {
    alt: {
      bg: 'Пергола с ламели в цвят бордо и LED линии в покрива, двойка на диван под нея на фона на залез',
      en: 'Burgundy louvred pergola with LED lines in the roof, a couple on a sofa beneath it at sunset',
    },
    focal: '55% 60%',
  },
  'home/hero-alt-1.jpg': {
    alt: {
      bg: 'Антрацитна пергола с ламели над тераса с безкраен басейн в планината',
      en: 'Anthracite louvred pergola over a terrace with an infinity pool in the mountains',
    },
    focal: '45% 45%',
  },
  'home/hero-alt-2.jpg': {
    alt: {
      bg: 'Бяла пергола с ламели и LED осветление по периметъра над лаундж зона до басейн, привечер',
      en: 'White louvred pergola with perimeter LED lighting over a poolside lounge at dusk',
    },
    focal: '45% 55%',
  },
  'home/cover-pergola.png': {
    alt: {
      bg: 'Антрацитна пергола с жълто вълнообразно платнено покритие и LED светлини, светеща в тъмнината',
      en: 'Anthracite pergola with a yellow wave-pleated fabric roof and LED lights, glowing in the dark',
    },
  },
  'home/what-we-do.jpg': {
    alt: {
      bg: 'Модерна вила, преминаваща от архитектурна скица в завършена визуализация: пергола със стъклен покрив, остъкляване тип „гилотина“, биоклиматична пергола и плъзгащи се стъклени панели',
      en: 'Modern villa shifting from an architectural sketch into a finished render: glass-roof pergola, guillotine glazing, bioclimatic pergola and sliding glass panels',
    },
    focal: '60% 50%',
  },
  'home/about.jpg': {
    alt: {
      bg: 'Покривна тераса на хотел с антрацитна пергола и плъзгащи се стъклени стени, лаундж мебели',
      en: 'Hotel rooftop terrace with an anthracite pergola, sliding glass walls and lounge furniture',
    },
    focal: '50% 60%',
  },
  'home/tech-led.jpg': {
    alt: {
      bg: 'Профил на ламела с вградено RGB LED осветление в различни цветове',
      en: 'Louvre profile with integrated RGB LED lighting in several colours',
    },
  },
  'home/tech-gutter.jpg': {
    alt: {
      bg: 'Разрез на улук и колона: дъждовната вода се отвежда скрито през колоната',
      en: 'Cutaway of the gutter and post: rainwater drains away hidden inside the post',
    },
  },
  'home/tech-120.jpg': {
    alt: {
      bg: 'Алуминиева ламела, показана в няколко положения на завъртане до 120°',
      en: 'Aluminium louvre shown at several rotation angles up to 120°',
    },
  },
  'home/mood-01.jpg': {
    alt: {
      bg: 'Всекидневна на вила привечер, отворена с безрамкови стъклени панели към безкраен басейн и морето',
      en: 'Villa living room at dusk, opened with frameless glass panels onto an infinity pool and the sea',
    },
    focal: '60% 50%',
  },
  'home/mood-02.jpg': {
    alt: {
      bg: 'Покривен лаундж под пергола със стъклен покрив, жълт диван и медни лампи, градът и морето по залез',
      en: 'Rooftop lounge under a glass-roof pergola with a yellow sofa and copper lamps, city and sea at sunset',
    },
    focal: '50% 60%',
  },
  'home/mood-03.jpg': {
    alt: {
      bg: 'Крайбрежно кафене привечер с голяма бяла касетъчна тента и LED светлини в рамената',
      en: 'Seaside café at dusk with a large white cassette awning and LED lights in the arms',
    },
    focal: '45% 55%',
  },

  // ---------------------------------------------------------------- categories
  'categories/bioclimatic-pergolas.jpg': {
    alt: {
      bg: 'Двумодулна антрацитна пергола с ламели и стъклени стени в тропическа градина, лаундж с камина и трапезна маса',
      en: 'Two-bay anthracite louvred pergola with glass walls in a tropical garden, with a fireplace lounge and dining table',
    },
    focal: '50% 55%',
  },
  'categories/glass-systems.jpg': {
    alt: {
      bg: 'Изцяло остъклена пергола като стъклена стая с камина пред модерна къща в снежен зимен ден',
      en: 'Fully glazed pergola used as a glass room with a fireplace beside a modern house on a snowy winter day',
    },
    focal: '45% 60%',
  },
  'categories/sun-protection.jpg': {
    alt: {
      bg: 'Бяла модерна къща с жълти вертикални ZIP завеси на прозорците и зимна градина с покривна ZIP завеса',
      en: 'White modern house with yellow vertical ZIP screens on the windows and a glass winter garden with a roof ZIP screen',
    },
    focal: '50% 55%',
  },
  'categories/windbreaks.jpg': {
    alt: {
      bg: 'Улична тераса на ресторант вечер, оградена със стъклени ветрозащитни паравани',
      en: 'Restaurant street terrace in the evening, enclosed by glass windbreak screens',
    },
    focal: '50% 60%',
  },

  // ---------------------------------------------------------------- balance
  'products/balance/hero.jpg': {
    alt: {
      bg: 'Антрацитна пергола с ламели над тераса на ресторант до безкраен басейн, планински пейзаж',
      en: 'Anthracite louvred pergola over a restaurant terrace beside an infinity pool, mountain scenery',
    },
    focal: '45% 45%',
  },
  'products/balance/gallery-01.jpg': {
    alt: {
      bg: 'Свободностояща пергола с ламели в кремав цвят над лаундж до басейн, каменна стена и есенни дървета',
      en: 'Freestanding cream louvred pergola over a poolside lounge, with a dry-stone wall and autumn trees',
    },
  },
  'products/balance/gallery-02.jpg': {
    alt: {
      bg: 'Пергола с ламели над тераса на ресторант, гледана откъм безкрайния басейн',
      en: 'Louvred pergola over a restaurant terrace, seen from the infinity pool',
    },
  },
  'products/balance/gallery-03.jpg': {
    alt: {
      bg: 'Тераса на ресторант под пергола с отворени ламели и ивици светлина и сянка по пода',
      en: 'Restaurant terrace under a pergola with open louvres casting stripes of light and shade',
    },
  },
  'products/balance/gallery-04.jpg': {
    alt: {
      bg: 'Пергола с ламели в бронзов цвят и безрамкови плъзгащи се стъкла над градински лаундж',
      en: 'Bronze louvred pergola with frameless sliding glass over a garden lounge',
    },
  },
  'products/balance/diagram.jpg': {
    alt: {
      bg: 'Техническа визуализация на антрацитна пергола с ламели и LED осветление',
      en: 'Technical render of an anthracite louvred pergola with LED lighting',
    },
  },

  // ---------------------------------------------------------------- infinity
  'products/infinity/hero.jpg': {
    alt: {
      bg: 'Бяла пергола с ламели и синьо-бяло LED осветление над лаундж с маса с огнище до басейн, модерна вила привечер',
      en: 'White louvred pergola with blue-white LED lighting over a lounge with a fire table by the pool, modern villa at dusk',
    },
    focal: '45% 55%',
  },
  'products/infinity/gallery-01.jpg': {
    alt: {
      bg: 'Отблизо: бяла пергола с ламели и LED ленти над бели дивани и маса с огнище',
      en: 'Close-up of a white louvred pergola with LED strips over white sofas and a fire table',
    },
  },
  'products/infinity/gallery-02.jpg': {
    alt: {
      bg: 'Бяла пергола с ламели в двора на модерна вила с басейн и шезлонги',
      en: 'White louvred pergola in the courtyard of a modern villa with a pool and sun loungers',
    },
  },
  'products/infinity/gallery-03.jpg': {
    alt: {
      bg: 'Пергола с ламели в цвят бордо и LED линии в покрива по залез, двойка на диван',
      en: 'Burgundy louvred pergola with LED lines in the roof at sunset, a couple on a sofa',
    },
    focal: '55% 60%',
  },
  'products/infinity/gallery-04.jpg': {
    alt: {
      bg: 'Двумодулна пергола с ламели и стъклени стени в тропическа градина',
      en: 'Two-bay louvred pergola with glass walls in a tropical garden',
    },
  },
  'products/infinity/diagram.jpg': {
    alt: {
      bg: 'Техническа визуализация на антрацитна пергола с ламели и LED осветление',
      en: 'Technical render of an anthracite louvred pergola with LED lighting',
    },
  },

  // ---------------------------------------------------------------- flat
  'products/flat/hero.jpg': {
    alt: {
      bg: 'Поглед отгоре към покривен бар привечер под перголи с прибиращо се плоско поливинилно покритие',
      en: 'Aerial view of a rooftop bar at dusk under pergolas with retractable flat PVC roofs',
    },
  },
  'products/flat/gallery-01.jpg': {
    alt: {
      bg: 'Антрацитна пергола Flat, монтирана към фасада с обтегач, с бяло нагънато покритие и LED спотове',
      en: 'Anthracite Flat pergola fixed to the façade with a tension rod, white pleated roof and LED spots',
    },
    focal: '50% 40%',
  },
  'products/flat/gallery-02.jpg': {
    alt: {
      bg: 'Покривна тераса привечер с червени кленове и осветен бар под пергола с платнено покритие, градски силует',
      en: 'Rooftop terrace at dusk with red maples and a lit bar under a fabric-roof pergola, city skyline',
    },
  },
  'products/flat/gallery-03.jpg': {
    alt: {
      bg: 'Светещ бар от оникс под пергола с поливинилно покритие на покривна тераса',
      en: 'Glowing onyx bar under a PVC-roof pergola on a rooftop terrace',
    },
  },
  'products/flat/gallery-04.jpg': {
    alt: {
      bg: 'Светла пергола с кремаво платнено покритие над бетонен двор с два плетени люлеещи се стола и лавандула',
      en: 'Light pergola with a cream fabric roof over a concrete patio with two rope rocking chairs and lavender',
    },
  },
  'products/flat/gallery-05.jpg': {
    alt: {
      bg: 'Антрацитна пергола с кремаво покритие над подредена трапеза с изглед към лозя',
      en: 'Anthracite pergola with a cream fabric roof over a laid dining table overlooking vineyards',
    },
  },
  'products/flat/diagram.jpg': {
    alt: {
      bg: 'Техническа визуализация на пергола с поливинилно покритие, монтирана към стена, с частично прибрано платно',
      en: 'Technical render of a wall-mounted PVC-roof pergola with the fabric partly retracted',
    },
  },

  // ---------------------------------------------------------------- curved
  'products/curved/hero.jpg': {
    alt: {
      bg: 'Дълга покривна тераса под сводест прибиращ се покрив с LED спотове, инфрачервени нагреватели и плъзгащи се стъкла',
      en: 'Long rooftop terrace under an arched retractable roof with LED spots, infrared heaters and sliding glass sides',
    },
  },
  'products/curved/gallery-01.jpg': {
    alt: {
      bg: 'Антрацитна пергола Curved на бетонна фасада с частично прибрано бяло платно, морски бряг привечер',
      en: 'Anthracite Curved pergola on a concrete façade with the white fabric partly gathered, seaside at dusk',
    },
    focal: '40% 40%',
  },
  'products/curved/gallery-02.jpg': {
    alt: {
      bg: 'Сводест покрив, частично прибран, с открити арки на фона на облачно небе',
      en: 'Arched roof partly retracted, with the open arches against a cloudy sky',
    },
  },
  'products/curved/gallery-03.jpg': {
    alt: {
      bg: 'Отблизо: прибиращо се платно с LED спотове и открити извити греди срещу синьо небе',
      en: 'Close-up of the retractable fabric with LED spots and exposed curved beams against a blue sky',
    },
  },
  'products/curved/diagram.jpg': {
    alt: {
      bg: 'Техническа визуализация на пергола с поливинилно покритие, монтирана към стена, с частично прибрано платно',
      en: 'Technical render of a wall-mounted PVC-roof pergola with the fabric partly retracted',
    },
  },

  // ---------------------------------------------------------------- automatic glass roof
  'products/automatic-glass-roof/hero.jpg': {
    alt: {
      bg: 'Дълъг двор на ресторант между тухлени арки под частично отворен стъклен покрив, маслинови дървета',
      en: 'Long restaurant courtyard between brick arches under a partly open glass roof, with olive trees',
    },
  },
  'products/automatic-glass-roof/gallery-01.jpg': {
    alt: {
      bg: 'Скатен стъклен покрив над ресторант с дървен интериор, лампи с нажежаема жичка и висящи растения',
      en: 'Pitched glass roof over a timber-clad restaurant with filament bulbs and hanging plants',
    },
  },
  'products/automatic-glass-roof/gallery-02.jpg': {
    alt: {
      bg: 'Поглед отгоре през отворени стъклени панели към озеленена тераса на ресторант',
      en: 'View from above through open glass roof panels into a planted restaurant terrace',
    },
  },
  'products/automatic-glass-roof/diagram.jpg': {
    alt: {
      bg: 'Разрез на профилите и стъклата на автоматичен стъклен покрив',
      en: 'Cutaway of the profiles and glazing of an automatic glass roof',
    },
  },

  // ---------------------------------------------------------------- fixed glass roof
  'products/fixed-glass-roof/hero.jpg': {
    alt: {
      bg: 'Свободностояща пергола със стъклен покрив в градина привечер, ZIP завеса от едната страна и бели мебели',
      en: 'Freestanding glass-roof pergola in a garden at dusk, with a ZIP screen on one side and white furniture',
    },
  },
  'products/fixed-glass-roof/gallery-01.jpg': {
    alt: {
      bg: 'Покривен лаундж под тъмна пергола със стъклен покрив, жълт диван, градът и морето по залез',
      en: 'Rooftop lounge under a dark glass-roof pergola, yellow sofa, city and sea at sunset',
    },
    focal: '50% 60%',
  },
  'products/fixed-glass-roof/gallery-02.jpg': {
    alt: {
      bg: 'Пергола в бронзов цвят с прозрачен стъклен покрив над басейн във вътрешен двор между бели вили',
      en: 'Bronze pergola with a clear glass roof over a courtyard pool between white villas',
    },
  },
  'products/fixed-glass-roof/gallery-03.jpg': {
    alt: {
      bg: 'Черна пергола със стъклен покрив, прикрепена към модерна къща с дървена облицовка, морава',
      en: 'Black glass-roof pergola attached to a modern timber-clad house, with a lawn',
    },
  },
  'products/fixed-glass-roof/diagram.jpg': {
    alt: {
      bg: 'Техническа визуализация на черна свободностояща пергола с фиксиран стъклен покрив',
      en: 'Technical render of a black freestanding pergola with a fixed glass roof',
    },
  },

  // ---------------------------------------------------------------- thermo panel roof
  'products/thermo-panel-roof/hero.jpg': {
    alt: {
      bg: 'Навес с покрив от термопанели над сив автомобил, жена товари куфарче в багажника, тухлена къща',
      en: 'Carport with an insulated-panel roof over a grey car, a woman loading a briefcase into the boot, brick house',
    },
    focal: '55% 60%',
  },
  'products/thermo-panel-roof/gallery-01.jpg': {
    alt: {
      bg: 'Антрацитна пергола с покрив от термопанели като навес за автомобил, с LED осветление по периметъра',
      en: 'Anthracite insulated-panel-roof pergola used as a carport, with perimeter LED lighting',
    },
  },
  'products/thermo-panel-roof/gallery-02.jpg': {
    alt: {
      bg: 'Същата пергола с покрив от термопанели, затворена с плъзгащи се стъклени стени като стъклена стая',
      en: 'The same insulated-panel-roof pergola closed in with sliding glass walls as a glass room',
    },
  },
  'products/thermo-panel-roof/gallery-03.jpg': {
    alt: {
      bg: 'Открит антрацитен навес за два автомобила с черен джип и червена кола',
      en: 'Open anthracite double carport with a black SUV and a red car',
    },
  },
  'products/thermo-panel-roof/gallery-04.jpg': {
    alt: {
      bg: 'Навес за два автомобила, затворен с плътни странични панели и врата, с LED линии в тавана',
      en: 'Double carport closed in with solid side panels and a door, with LED lines in the ceiling',
    },
  },
  'products/thermo-panel-roof/gallery-05.jpg': {
    alt: {
      bg: 'Навес в цвят тауп с бял панелен таван над бял малък автомобил',
      en: 'Taupe carport with a white panel ceiling over a small white car',
    },
  },
  'products/thermo-panel-roof/diagram.jpg': {
    alt: {
      bg: 'Техническа визуализация на пергола с плътен покрив от термопанели',
      en: 'Technical render of a pergola with a solid insulated-panel roof',
    },
  },

  // ---------------------------------------------------------------- guillotine
  'products/guillotine/hero.jpg': {
    alt: {
      bg: 'Покривен ресторант под пергола с ламели, затворен с високи стъклени стени тип „гилотина“, градска панорама',
      en: 'Rooftop restaurant under a louvred pergola, enclosed by tall guillotine glass walls, city panorama',
    },
  },
  'products/guillotine/gallery-01.jpg': {
    alt: {
      bg: 'Изглед към езеро и планини през остъкляване тип „гилотина“, два плетени фотьойла',
      en: 'Lake and mountain view through guillotine glazing, with two woven armchairs',
    },
  },
  'products/guillotine/gallery-02.jpg': {
    alt: {
      bg: 'Стъклена фасада на гараж тип „гилотина“ с частично вдигнати панели и два автомобила',
      en: 'Guillotine glass garage front with panels partly raised and two cars inside',
    },
    focal: '60% 60%',
  },
  'products/guillotine/gallery-03.jpg': {
    alt: {
      bg: 'Покривен ресторант, изцяло затворен със стъклени стени тип „гилотина“ под стъклен покрив, сини дивани и небостъргачи',
      en: 'Rooftop restaurant fully enclosed by guillotine glass walls under a glass roof, blue sofas and skyscrapers',
    },
  },
  'products/guillotine/gallery-04.jpg': {
    alt: {
      bg: 'Дълъг остъклен покривен ресторант с редици маси и жив плет, гледан по дължина',
      en: 'Long glazed rooftop restaurant with rows of tables and hedges, seen end to end',
    },
  },
  'products/guillotine/gallery-05.jpg': {
    alt: {
      bg: 'Балконско остъкляване тип „гилотина“ с вътрешен панел, наклонен навътре за почистване, гора и планини',
      en: 'Guillotine balcony glazing with the inner panel tilted inwards for cleaning, forest and mountains beyond',
    },
  },

  // ---------------------------------------------------------------- dormakaba ES 200
  'products/dormakaba-es-200/hero.jpg': {
    alt: {
      bg: 'Тераса на кафене с тъмносива пергола, затворена с плъзгащи се стъкла и автоматична входна врата в левия модул',
      en: 'Café terrace with a dark grey pergola closed in with sliding glass and an automatic entrance door in the left bay',
    },
    focal: '35% 55%',
  },
  'products/dormakaba-es-200/gallery-01.jpg': {
    alt: {
      bg: 'Мъж с куфарче върви към автоматични плъзгащи се стъклени врати на офис сграда',
      en: 'Man with a briefcase walking towards automatic sliding glass doors in an office building',
    },
  },
  'products/dormakaba-es-200/gallery-02.jpg': {
    alt: {
      bg: 'Автоматични плъзгащи се входни врати с рамка от неръждаема стомана на търговска сграда',
      en: 'Automatic sliding entrance doors with a stainless-steel frame on a commercial building',
    },
  },
  'products/dormakaba-es-200/gallery-03.jpg': {
    alt: {
      bg: 'Ръка пред безконтактен радарен сензор за отваряне на врата, монтиран на стена',
      en: 'Hand in front of a wall-mounted touchless radar sensor for opening a door',
    },
  },

  // ---------------------------------------------------------------- sliding glass
  'products/sliding-glass/hero.jpg': {
    alt: {
      bg: 'Антрацитна пергола с ламели, затворена с плъзгащи се стъклени панели, LED осветление и маса с огнище по залез',
      en: 'Anthracite louvred pergola closed in with sliding glass panels, LED lighting and a fire table at sunset',
    },
  },
  'products/sliding-glass/gallery-01.jpg': {
    alt: {
      bg: 'Двумодулна сива пергола с плъзгащи се стъкла в горска градина, дървена настилка и розов диван',
      en: 'Two-bay grey pergola with sliding glass in a forest garden, timber deck and a pink sofa',
    },
  },
  'products/sliding-glass/gallery-02.jpg': {
    alt: {
      bg: 'Всекидневна на вила привечер с безрамкови плъзгащи се стъкла към безкраен басейн и морето',
      en: 'Villa living room at dusk with frameless sliding glass opening onto an infinity pool and the sea',
    },
    focal: '60% 50%',
  },
  'products/sliding-glass/gallery-03.jpg': {
    alt: {
      bg: 'Остъклена пергола пред модерна къща, гледана фронтално, с лаундж и маса с огнище',
      en: 'Glazed pergola in front of a modern house, seen head-on, with a lounge and fire table',
    },
  },
  'products/sliding-glass/gallery-04.jpg': {
    alt: {
      bg: 'Остъклена пергола до модерна къща, гледана под ъгъл, градски силует на залез',
      en: 'Glazed pergola beside a modern house, seen at an angle, city skyline at sunset',
    },
  },

  // ---------------------------------------------------------------- compact
  'products/compact/hero.jpg': {
    alt: {
      bg: 'Безрамкова стъклена стена с панели, прибрани в ъгъла, жълт фотьойл и изглед към морето и острови',
      en: 'Frameless glass wall with the panels parked in the corner, a yellow chair and a view of the sea and islands',
    },
    focal: '45% 60%',
  },
  'products/compact/gallery-01.jpg': {
    alt: {
      bg: 'Фоайе с безрамкови стъклени панели, прибрани по таванна релса с ъгъл, и изглед към градина в мъгла',
      en: 'Lobby with frameless glass panels stacked along a ceiling track that turns a corner, misty garden beyond',
    },
  },
  'products/compact/gallery-02.jpg': {
    alt: {
      bg: 'Безрамкови стъклени панели, прибрани в края на отвор към зелен вътрешен двор на модерна вила',
      en: 'Frameless glass panels stacked at the edge of an opening onto the green courtyard of a modern villa',
    },
  },

  // ---------------------------------------------------------------- accord
  'products/accord/hero.jpg': {
    alt: {
      bg: 'Крайбрежна тераса с бял навес и безрамково стъкло, частично сгънато на зигзаг, палми и плетени мебели',
      en: 'Seafront terrace with a white canopy and frameless glass partly folded in a zigzag, palms and wicker furniture',
    },
    focal: '45% 55%',
  },
  'products/accord/gallery-01.jpg': {
    alt: {
      bg: 'Винен бар със сгъваеми стъклени панели, частично отворени на входа, осветени рафтове и бар столове',
      en: 'Wine bar with folding glass panels partly open at the entrance, lit shelving and bar stools',
    },
  },
  'products/accord/gallery-02.jpg': {
    alt: {
      bg: 'Отблизо: сгънати на зигзаг стъклени панели с панти и изглед към морето от балкон',
      en: 'Close-up of zigzag-folded glass panels with hinges, sea view from a balcony',
    },
  },
  'products/accord/gallery-03.jpg': {
    alt: {
      bg: 'Сгъваеми безрамкови стъклени врати, отварящи модерна всекидневна към тераса с палма',
      en: 'Frameless folding glass doors opening a modern living room onto a terrace with a palm',
    },
  },

  // ---------------------------------------------------------------- harmonia
  'products/harmonia/hero.jpg': {
    alt: {
      bg: 'Тераса на вила над морето с дървен таван и безрамкови стъклени панели, завъртени под различен ъгъл',
      en: 'Clifftop villa terrace with a timber ceiling and frameless glass panels pivoted at different angles',
    },
    focal: '45% 55%',
  },
  'products/harmonia/gallery-01.jpg': {
    alt: {
      bg: 'Високи осеви стъклени врати с черна рамка, отворени от вътрешен двор към всекидневна с дървен таван',
      en: 'Tall black-framed pivot glass doors open from a courtyard into a living room with a timber ceiling',
    },
  },
  'products/harmonia/gallery-02.jpg': {
    alt: {
      bg: 'Отворени осеви стъклени врати от пода до тавана, изглед от всекидневна към двор с басейн',
      en: 'Floor-to-ceiling pivot glass doors open, looking from the living room towards a courtyard with a pool',
    },
  },

  // ---------------------------------------------------------------- vertical zip
  'products/vertical-zip/hero.jpg': {
    alt: {
      bg: 'Бяла пергола с ламели до басейн с две сиви ZIP завеси, наполовина спуснати, и изглед към морето',
      en: 'White louvred pergola by a pool with two grey ZIP screens half lowered and a sea view',
    },
  },
  'products/vertical-zip/gallery-01.jpg': {
    alt: {
      bg: 'Модерна къща с бежови ZIP завеси на прозорците и на фронта на пергола, тераса и басейн',
      en: 'Modern house with beige ZIP screens on the windows and across the front of a pergola, terrace and pool',
    },
  },
  'products/vertical-zip/gallery-02.jpg': {
    alt: {
      bg: 'Бяла кубична къща с жълти вертикални ZIP завеси на прозорците и на зимната градина',
      en: 'White cubic house with yellow vertical ZIP screens on the windows and the winter garden',
    },
    focal: '45% 55%',
  },
  'products/vertical-zip/gallery-03.jpg': {
    alt: {
      bg: 'Голяма жълта ZIP завеса пред широк прозорец на модерна къща, велосипед и басейн',
      en: 'Large yellow ZIP screen over a wide window of a modern house, with a bicycle and pool',
    },
  },
  'products/vertical-zip/diagram.jpg': {
    alt: {
      bg: 'Технически разрези на ZIP завеса за вграден и за външен монтаж в прозоречен отвор',
      en: 'Technical cutaways of a ZIP screen for recessed and for surface installation in a window opening',
    },
  },

  // ---------------------------------------------------------------- roof zip
  'products/roof-zip/hero.jpg': {
    alt: {
      bg: 'Поглед отгоре към черна зимна градина със стъклен покрив и лайм-зелена покривна ZIP завеса, морава',
      en: 'Aerial view of a black glass-roof winter garden with a lime-green roof ZIP screen, on a lawn',
    },
  },
  'products/roof-zip/gallery-01.jpg': {
    alt: {
      bg: 'Антрацитна пергола със стъклен покрив и сива ZIP завеса под стъклото пред бетонна къща привечер',
      en: 'Anthracite glass-roof pergola with a grey ZIP screen under the glass, in front of a concrete house at dusk',
    },
  },
  'products/roof-zip/gallery-02.jpg': {
    alt: {
      bg: 'Стъклен покрив на зимна градина с бели покривни ZIP завеси, гледан отгоре под ъгъл',
      en: 'Winter garden glass roof with white roof ZIP screens, seen from above at an angle',
    },
  },
  'products/roof-zip/gallery-03.jpg': {
    alt: {
      bg: 'Зимна градина с бяла ZIP завеса върху стъкления покрив и жълта вертикална ZIP завеса отстрани',
      en: 'Glass winter garden with a white ZIP screen over the glass roof and a yellow vertical ZIP screen on the side',
    },
  },

  // ---------------------------------------------------------------- shell awning
  'products/shell-awning/hero.jpg': {
    alt: {
      bg: 'Крайбрежно кафене привечер с голяма бяла касетъчна тента и LED светлини в рамената, старият град зад него',
      en: 'Seaside café at dusk with a large white cassette awning and LED lights in the arms, old town behind',
    },
    focal: '40% 50%',
  },
  'products/shell-awning/gallery-01.jpg': {
    alt: {
      bg: 'Жълта касетъчна тента над трапезна маса в градина на къща, цветя и морава',
      en: 'Yellow cassette awning over a dining table in a townhouse garden, with flowers and a lawn',
    },
    focal: '35% 50%',
  },
  'products/shell-awning/gallery-02.jpg': {
    alt: {
      bg: 'Отблизо: бежова касета с частично разпънато жълто платно на бяла стена с бръшлян',
      en: 'Close-up of a beige cassette with yellow fabric partly extended, on a white wall with ivy',
    },
  },
  'products/shell-awning/gallery-03.jpg': {
    alt: {
      bg: 'Средиземноморска къща в охра със зелена касетъчна тента над тераса с маси',
      en: 'Ochre Mediterranean house with a green cassette awning over a terrace with tables',
    },
  },

  // ---------------------------------------------------------------- telescopic windbreak
  'products/telescopic-windbreak/hero.jpg': {
    alt: {
      bg: 'Улична тераса на ресторант вечер с телескопични стъклени ветрозащитни паравани, чадъри и подредени маси',
      en: 'Restaurant street terrace in the evening with telescopic glass windbreaks, parasols and laid tables',
    },
    focal: '50% 60%',
  },
  'products/telescopic-windbreak/gallery-01.jpg': {
    alt: {
      bg: 'Крайбрежна тераса с дървени маси и вдигнати стъклени ветрозащитни паравани, морски хоризонт',
      en: 'Seaside terrace with timber tables and raised glass windbreaks, sea horizon',
    },
  },
  'products/telescopic-windbreak/gallery-02.jpg': {
    alt: {
      bg: 'Телескопични ветрозащитни паравани на различна височина с бежови, черни и сиви колони',
      en: 'Telescopic windbreak units at different heights with beige, black and grey posts',
    },
  },

  // ---------------------------------------------------------------- before / after
  'before-after/carport-before.jpg': {
    alt: {
      bg: 'Открит антрацитен навес за два автомобила с черен джип и червена кола',
      en: 'Open anthracite double carport with a black SUV and a red car',
    },
    focal: '62% 50%',
  },
  'before-after/carport-after.jpg': {
    alt: {
      bg: 'Същият навес, затворен с плътни странични панели и врата, с LED линии в тавана',
      en: 'The same carport closed in with solid side panels and a door, with LED lines in the ceiling',
    },
    focal: '62% 50%',
  },
  'before-after/glassroom-before.jpg': {
    alt: {
      bg: 'Антрацитна пергола с покрив от термопанели като навес за автомобил',
      en: 'Anthracite insulated-panel-roof pergola used as a carport',
    },
  },
  'before-after/glassroom-after.jpg': {
    alt: {
      bg: 'Същата пергола, затворена с плъзгащи се стъклени стени като стъклена стая с дивани',
      en: 'The same pergola closed in with sliding glass walls as a glass room with sofas',
    },
  },

  // ---------------------------------------------------------------- references (PDF 59)
  'references/new-land-district.jpg': {
    alt: {
      bg: 'Визуализация на модерни двуетажни къщи с големи остъклявания привечер – NEW LAND DISTRICT',
      en: 'Render of modern two-storey houses with large glazing at dusk – NEW LAND DISTRICT',
    },
  },
  'references/samelyon.jpg': {
    alt: {
      bg: 'Визуализация на модерни къщи със скатни покриви, семейство на моравата и планини – SamELYON',
      en: 'Render of modern gabled houses, a family on the lawn and mountains – SamELYON',
    },
  },
  'references/raffy.jpg': {
    alt: {
      bg: 'Остъклена пергола на заведение Raffy Bar & Gelato на пешеходна улица',
      en: 'Glazed pergola enclosure of Raffy Bar & Gelato on a pedestrian street',
    },
  },
  'references/fohar.jpg': {
    alt: {
      bg: 'Визуализация отгоре на жилищен комплекс от средноетажни сгради – FOHAR',
      en: 'Aerial render of a residential complex of mid-rise buildings – FOHAR',
    },
  },
  'references/shtastlivetsa.jpg': {
    alt: {
      bg: 'Фасада на ресторант „Щастливеца“ със зеленина, цветя и велосипед',
      en: 'Façade of Shtastlivetsa restaurant with greenery, flowers and a bicycle',
    },
  },
  'references/constantinoff.jpg': {
    alt: {
      bg: 'Остъклена тераса на Constantinoff RestoBar с декорация от сухи цветя и бели саксии във форма на глави',
      en: 'Glazed terrace of Constantinoff RestoBar with dried-flower decor and white head-shaped planters',
    },
  },

  // ---------------------------------------------------------------- brand
  'brand/logo.svg': { alt: { bg: 'OUTPLAY', en: 'OUTPLAY' } },
  'brand/logo-light.svg': { alt: { bg: 'OUTPLAY', en: 'OUTPLAY' } },
  'brand/logo-tagline.svg': {
    alt: {
      bg: 'OUTPLAY – comfortable outdoor and indoor living spaces',
      en: 'OUTPLAY – comfortable outdoor and indoor living spaces',
    },
  },
  'brand/logo-tagline-light.svg': {
    alt: {
      bg: 'OUTPLAY – comfortable outdoor and indoor living spaces',
      en: 'OUTPLAY – comfortable outdoor and indoor living spaces',
    },
  },
  'brand/favicon.svg': { alt: { bg: 'OUTPLAY', en: 'OUTPLAY' } },
  'brand/favicon-32.png': { alt: { bg: 'OUTPLAY', en: 'OUTPLAY' } },
  'brand/favicon.ico': { alt: { bg: 'OUTPLAY', en: 'OUTPLAY' } },
  'brand/apple-touch-icon.png': { alt: { bg: 'OUTPLAY', en: 'OUTPLAY' } },
};
