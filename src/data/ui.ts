// Interface strings. Every leaf is an L ({ bg, en }). Placeholders in braces ({min}, {max}, {query},
// {count}, {n}, {total}, {product}, {phone}) are filled with fmt() from src/lib/i18n.ts.

export const ui = {
  nav: {
    gallery: { bg: 'Галерия', en: 'Gallery' },
    about: { bg: 'За нас', en: 'About us' },
    inquiry: { bg: 'Запитване', en: 'Request a quote' },
  },

  actions: {
    requestQuote: { bg: 'Направете запитване', en: 'Request a quote' },
    exploreProducts: { bg: 'Разгледайте продуктите', en: 'Explore the products' },
    viewProduct: { bg: 'Вижте продукта', en: 'View product' },
    viber: { bg: 'Пишете ни във Viber', en: 'Message us on Viber' },
    copy: { bg: 'Копирай', en: 'Copy' },
    copied: { bg: 'Копирано', en: 'Copied' },
    close: { bg: 'Затвори', en: 'Close' },
    back: { bg: 'Назад', en: 'Back' },
    continue: { bg: 'Продължете', en: 'Continue' },
    submit: { bg: 'Изпратете запитване', en: 'Send request' },
    newInquiry: { bg: 'Ново запитване', en: 'New request' },
    edit: { bg: 'Редактирай', en: 'Edit' },
    openMap: { bg: 'Отворете в Google Maps', en: 'Open in Google Maps' },
    goHome: { bg: 'Към началната страница', en: 'Back to the home page' },
    clear: { bg: 'Изчисти', en: 'Clear' },
  },

  search: {
    label: { bg: 'Търсене в сайта', en: 'Search the site' },
    placeholder: { bg: 'Търсете продукт, напр. „ламели“ или „гилотина“', en: 'Search products, e.g. “louvres” or “guillotine”' },
    navigateHint: { bg: '↑ ↓ за избор, Enter за отваряне, Esc за затваряне', en: '↑ ↓ to move, Enter to open, Esc to close' },
    noResults: { bg: 'Няма резултати за „{query}“.', en: 'No results for “{query}”.' },
    noResultsHint: {
      bg: 'Опитайте с друга дума – например „пергола“, „стъкло“ или „ZIP“ – или ни се обадете.',
      en: 'Try another word, such as “pergola”, “glass” or “ZIP”, or give us a call.',
    },
    resultsCount: { bg: '{count} резултата', en: '{count} results' },
    resultOne: { bg: '1 резултат', en: '1 result' },
    resultsFor: { bg: 'Резултати за „{query}“', en: 'Results for “{query}”' },
    suggestions: { bg: 'Популярни търсения', en: 'Popular searches' },
    groups: {
      products: { bg: 'Продукти', en: 'Products' },
      categories: { bg: 'Категории', en: 'Categories' },
      pages: { bg: 'Страници', en: 'Pages' },
      faq: { bg: 'Въпроси', en: 'Questions' },
    },
  },

  form: {
    labels: {
      product: { bg: 'Продукт', en: 'Product' },
      name: { bg: 'Име', en: 'Name' },
      phone: { bg: 'Телефон', en: 'Phone' },
      email: { bg: 'Имейл', en: 'Email' },
      city: { bg: 'Населено място', en: 'Town or city' },
      message: { bg: 'Допълнителна информация', en: 'Anything else we should know' },
      photos: { bg: 'Снимки на мястото', en: 'Photos of the space' },
    },
    placeholders: {
      product: { bg: 'Изберете продукт', en: 'Choose a product' },
      name: { bg: 'Вашето име', en: 'Your name' },
      phone: { bg: '08X XXX XXXX', en: '+359 8X XXX XXXX' },
      email: { bg: 'name@example.com', en: 'name@example.com' },
      city: { bg: 'напр. София', en: 'e.g. Sofia' },
      message: {
        bg: 'Опишете мястото, достъпа, желани цветове или други изисквания',
        en: 'Describe the space, access, preferred colours or anything else',
      },
    },
    hints: {
      optional: { bg: 'по желание', en: 'optional' },
      required: { bg: 'задължително', en: 'required' },
      phone: { bg: 'Ще Ви се обадим или ще Ви пишем във Viber на този номер.', en: 'We will call or message you on Viber at this number.' },
      photos: { bg: 'До няколко снимки – помагат ни да предложим точно решение.', en: 'A few photos help us suggest the right solution.' },
    },
    errors: {
      required: { bg: 'Попълнете това поле.', en: 'Please fill in this field.' },
      product: { bg: 'Изберете продукт, за който се отнася запитването.', en: 'Choose the product this request is about.' },
      phone: {
        bg: 'Въведете валиден телефонен номер, напр. 087 981 12 59 или +359 87 981 1259.',
        en: 'Enter a valid phone number, e.g. +359 87 981 1259 or 087 981 12 59.',
      },
      email: { bg: 'Въведете валиден имейл адрес, напр. name@example.com.', en: 'Enter a valid email address, e.g. name@example.com.' },
      range: { bg: 'Въведете стойност между {min} и {max} м.', en: 'Enter a value between {min} and {max} m.' },
      rangePcs: { bg: 'Въведете число между {min} и {max}.', en: 'Enter a number between {min} and {max}.' },
      number: { bg: 'Въведете число, напр. 3,5.', en: 'Enter a number, e.g. 3.5.' },
      consent: { bg: 'Отбележете съгласието, за да изпратим запитването.', en: 'Please tick the consent box so we can send your request.' },
      fileType: { bg: 'Качете снимка във формат JPG, PNG или WEBP.', en: 'Upload a photo in JPG, PNG or WEBP format.' },
    },
  },

  inquiry: {
    stepOf: { bg: 'Стъпка {n} от {total}', en: 'Step {n} of {total}' },
    selectedProduct: { bg: 'Избран продукт', en: 'Selected product' },
    changeProduct: { bg: 'Сменете продукта', en: 'Change product' },
    options: { bg: 'Конфигурация и опции', en: 'Configuration and options' },
    project: { bg: 'За обекта', en: 'About the project' },
    preview: { bg: 'Схема', en: 'Sketch' },
    planView: { bg: 'Изглед отгоре', en: 'Plan view' },
    elevationView: { bg: 'Изглед отпред', en: 'Front view' },
    area: { bg: 'Площ', en: 'Area' },
    approx: { bg: 'прибл.', en: 'approx.' },
    noneSelected: { bg: 'Нищо не е избрано', en: 'Nothing selected' },
  },

  product: {
    highlights: { bg: 'Ключови предимства', en: 'Key facts' },
    features: { bg: 'Характеристики', en: 'Features' },
    specs: { bg: 'Технически параметри', en: 'Specifications' },
    configurations: { bg: 'Конфигурации', en: 'Configurations' },
    options: { bg: 'Опции', en: 'Options' },
    gallery: { bg: 'Галерия', en: 'Gallery' },
    video: { bg: 'Видео', en: 'Video' },
    related: { bg: 'Свързани продукти', en: 'Related products' },
    quoteTitle: { bg: 'Запитване за {product}', en: 'Request a quote for {product}' },
    quoteLead: {
      bg: 'Посочете приблизителни размери и ще Ви изпратим ориентировъчна оферта.',
      en: 'Give us approximate dimensions and we will send you an indicative quote.',
    },
    noPrices: {
      bg: 'Всяка система се изработва по мярка, затова цената се посочва в индивидуална оферта.',
      en: 'Every system is made to measure, so prices are given in an individual quote.',
    },
    specsNote: {
      bg: 'Параметрите се уточняват за всеки проект при огледа и проектирането.',
      en: 'The exact specification is confirmed for each project at the site visit and design stage.',
    },
  },

  category: {
    productsIn: { bg: 'Продукти в категорията', en: 'Products in this category' },
    productCount: { bg: '{count} продукта', en: '{count} products' },
    productOne: { bg: '1 продукт', en: '1 product' },
    otherCategories: { bg: 'Други категории', en: 'Other categories' },
  },

  gallery: {
    all: { bg: 'Всички', en: 'All' },
    filterBy: { bg: 'Филтрирай по категория', en: 'Filter by category' },
    empty: { bg: 'Няма снимки в тази категория.', en: 'No images in this category.' },
  },

  faq: {
    expandAll: { bg: 'Отвори всички', en: 'Expand all' },
    collapseAll: { bg: 'Затвори всички', en: 'Collapse all' },
  },

  contact: {
    address: { bg: 'Адрес', en: 'Address' },
    phones: { bg: 'Телефони', en: 'Phone' },
    email: { bg: 'Имейл', en: 'Email' },
    viber: { bg: 'Viber', en: 'Viber' },
    website: { bg: 'Уебсайт', en: 'Website' },
  },

  a11y: {
    closeSearch: { bg: 'Затвори търсенето', en: 'Close search' },
    newWindow: { bg: 'отваря се в нов прозорец', en: 'opens in a new window' },
    callLink: { bg: 'Обадете се на {phone}', en: 'Call {phone}' },
    viberLink: { bg: 'Отворете чат във Viber', en: 'Open a Viber chat' },
    emailLink: { bg: 'Изпратете имейл до OUTPLAY', en: 'Email OUTPLAY' },
    loading: { bg: 'Зареждане…', en: 'Loading…' },
  },

  units: {
    m: { bg: 'м', en: 'm' },
    m2: { bg: 'м²', en: 'm²' },
    pcs: { bg: 'бр.', en: 'pcs' },
  },

  misc: {
    demo: { bg: 'Демо', en: 'Demo' },
  },
};
