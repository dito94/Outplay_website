import type { InquiryFamily, InquiryFamilyDef, L, OptionGroup } from './types';

// Inquiry form definitions. Dimension min/max are INPUT ranges for approximate sizes the visitor
// types in (kept generous on purpose); they are not product limits. The catalogue publishes no
// size limits, so none are implied here.

// ---------------------------------------------------------------------------
// Shared option groups and labels
// ---------------------------------------------------------------------------

const propertyType: OptionGroup = {
  id: 'propertyType',
  label: { bg: 'Вид обект', en: 'Property type' },
  type: 'single',
  choices: [
    { id: 'home', label: { bg: 'Дом', en: 'Home' } },
    { id: 'business', label: { bg: 'Офис или търговски обект', en: 'Office or commercial' } },
    { id: 'horeca', label: { bg: 'Ресторант, кафене или хотел', en: 'Restaurant, café or hotel' } },
  ],
  default: 'home',
};

const placeType: OptionGroup = {
  id: 'placeType',
  label: { bg: 'Къде ще бъде монтажът', en: 'Where will it be installed' },
  type: 'single',
  choices: [
    { id: 'terrace', label: { bg: 'Тераса', en: 'Terrace' } },
    { id: 'garden', label: { bg: 'Двор или градина', en: 'Garden or courtyard' } },
    { id: 'rooftop', label: { bg: 'Покривна тераса', en: 'Roof terrace' } },
    { id: 'balcony', label: { bg: 'Балкон или лоджия', en: 'Balcony or loggia' } },
    { id: 'facade', label: { bg: 'Фасада, витрина или вход', en: 'Façade, shopfront or entrance' } },
    { id: 'parking', label: { bg: 'Паркинг място', en: 'Parking space' } },
    { id: 'other', label: { bg: 'Друго', en: 'Other' } },
  ],
  default: 'terrace',
};

const timeline: OptionGroup = {
  id: 'timeline',
  label: { bg: 'Кога планирате изпълнение', en: 'When are you planning to go ahead' },
  type: 'single',
  choices: [
    { id: 'within-1m', label: { bg: 'До 1 месец', en: 'Within 1 month' } },
    { id: '1-3m', label: { bg: '1–3 месеца', en: '1–3 months' } },
    { id: '3-6m', label: { bg: '3–6 месеца', en: '3–6 months' } },
    { id: 'researching', label: { bg: 'Проучвам', en: 'Just researching' } },
  ],
  default: '1-3m',
};

const contactChannel: OptionGroup = {
  id: 'contactChannel',
  label: { bg: 'Предпочитан начин за връзка', en: 'Preferred way to contact you' },
  type: 'single',
  choices: [
    { id: 'phone', label: { bg: 'Телефон', en: 'Phone' } },
    { id: 'viber', label: { bg: 'Viber', en: 'Viber' } },
    { id: 'email', label: { bg: 'Имейл', en: 'Email' } },
  ],
  default: 'phone',
};

/** A free-text field shown in the options step (not covered by OptionGroup). */
export interface InquiryTextField {
  id: string;
  label: L;
  placeholder?: L;
}

const colourField: InquiryTextField = {
  id: 'colour',
  label: { bg: 'Предпочитан цвят на конструкцията', en: 'Preferred frame colour' },
  placeholder: { bg: 'напр. антрацит, бяло или код по RAL', en: 'e.g. anthracite, white or a RAL code' },
};

export const inquiryCommon = {
  propertyType,
  placeType,
  timeline,
  contactChannel,
  /** Groups for the "about your project" step, in display order */
  projectGroups: [propertyType, placeType, timeline] as OptionGroup[],
  steps: [
    { id: 'product', label: { bg: 'Продукт', en: 'Product' } },
    { id: 'dimensions', label: { bg: 'Размери', en: 'Dimensions' } },
    { id: 'options', label: { bg: 'Опции', en: 'Options' } },
    { id: 'contact', label: { bg: 'Контакти', en: 'Contact details' } },
  ],
  dimensionsTitle: { bg: 'Приблизителни размери', en: 'Approximate dimensions' },
  dimensionsNote: {
    bg: 'Приблизителните размери са достатъчни за ориентировъчна оферта. Точният замер правим при огледа на място.',
    en: 'Approximate sizes are enough for an indicative quote. We take exact measurements during the site visit.',
  },
  optionsTitle: { bg: 'Конфигурация и опции', en: 'Configuration and options' },
  projectTitle: { bg: 'За обекта', en: 'About the project' },
  contactTitle: { bg: 'Данни за контакт', en: 'Your contact details' },
  /** Shown on the preview drawing */
  previewLabels: {
    plan: { bg: 'Изглед отгоре', en: 'Plan view' },
    elevation: { bg: 'Изглед отпред', en: 'Front view' },
    area: { bg: 'Площ', en: 'Area' },
    approx: { bg: 'приблизително', en: 'approx.' },
  },
};

// ---------------------------------------------------------------------------
// Reusable choices
// ---------------------------------------------------------------------------

const notSure = { id: 'advise', label: { bg: 'Посъветвайте ме', en: 'Please advise' } };

// ---------------------------------------------------------------------------
// Families
// ---------------------------------------------------------------------------

export const inquiryFamilies: Record<InquiryFamily, InquiryFamilyDef> = {
  pergola: {
    family: 'pergola',
    preview: 'plan',
    dimensions: [
      {
        id: 'width',
        label: { bg: 'Ширина', en: 'Width' },
        hint: { bg: 'По протежение на фасадата или по-дългата страна', en: 'Along the façade or the longer side' },
        unit: 'm',
        min: 1,
        max: 30,
        step: 0.1,
        default: 4,
      },
      {
        id: 'depth',
        label: { bg: 'Дълбочина', en: 'Depth' },
        hint: { bg: 'Колко навътре от фасадата или от предния ръб', en: 'How far it projects from the façade or front edge' },
        unit: 'm',
        min: 1,
        max: 20,
        step: 0.1,
        default: 3.5,
      },
      {
        id: 'height',
        label: { bg: 'Височина', en: 'Height' },
        hint: { bg: 'Желана светла височина под конструкцията', en: 'Preferred clear height under the structure' },
        unit: 'm',
        min: 1.8,
        max: 6,
        step: 0.05,
        default: 2.6,
      },
    ],
    optionGroups: [
      {
        id: 'roofType',
        label: { bg: 'Вид покрив', en: 'Roof type' },
        type: 'single',
        choices: [
          { id: 'lamellas', label: { bg: 'Алуминиеви ламели', en: 'Aluminium louvres' } },
          { id: 'pvc', label: { bg: 'Поливинилно платно', en: 'PVC fabric' } },
          { id: 'glass', label: { bg: 'Стъклен покрив', en: 'Glass roof' } },
          { id: 'thermo', label: { bg: 'Термопанели', en: 'Insulated panels' } },
          notSure,
        ],
        default: 'lamellas',
      },
      {
        id: 'mounting',
        label: { bg: 'Монтаж', en: 'Mounting' },
        type: 'single',
        choices: [
          { id: 'freestanding', label: { bg: 'Самостоятелна, на колони', en: 'Freestanding, on posts' } },
          { id: 'wall', label: { bg: 'Прикрепена към сграда', en: 'Attached to the building' } },
          { id: 'between-walls', label: { bg: 'Между стени, без колони', en: 'Between walls, no posts' } },
          notSure,
        ],
        default: 'wall',
      },
      {
        id: 'extras',
        label: { bg: 'Допълнителни опции', en: 'Extras' },
        type: 'multi',
        choices: [
          { id: 'led', label: { bg: 'LED / RGB осветление', en: 'LED / RGB lighting' } },
          { id: 'heaters', label: { bg: 'Отоплителни тела', en: 'Heaters' } },
          { id: 'sound', label: { bg: 'Озвучаване', en: 'Sound system' } },
          { id: 'zip', label: { bg: 'ZIP завеси', en: 'ZIP screens' } },
          { id: 'glazing', label: { bg: 'Вертикално остъкляване', en: 'Vertical glazing' } },
        ],
        default: [],
      },
    ],
  },

  glass: {
    family: 'glass',
    preview: 'elevation',
    dimensions: [
      {
        id: 'width',
        label: { bg: 'Ширина на отвора', en: 'Opening width' },
        hint: { bg: 'Общата дължина за остъкляване', en: 'Total length to be glazed' },
        unit: 'm',
        min: 0.8,
        max: 40,
        step: 0.1,
        default: 4,
      },
      {
        id: 'height',
        label: { bg: 'Височина на отвора', en: 'Opening height' },
        unit: 'm',
        min: 0.8,
        max: 6,
        step: 0.05,
        default: 2.5,
      },
    ],
    optionGroups: [
      {
        id: 'systemType',
        label: { bg: 'Вид система', en: 'System type' },
        type: 'single',
        choices: [
          { id: 'guillotine', label: { bg: 'Гилотина – вертикално плъзгане', en: 'Guillotine, vertical sliding' } },
          { id: 'sliding', label: { bg: 'Хоризонтално плъзгащи се панели', en: 'Horizontal sliding panels' } },
          { id: 'folding', label: { bg: 'Сгъваема система (Compact, Accord, Harmonia)', en: 'Folding system (Compact, Accord, Harmonia)' } },
          notSure,
        ],
        default: 'sliding',
      },
      {
        id: 'panels',
        label: { bg: 'Брой панели', en: 'Number of panels' },
        type: 'single',
        choices: [
          { id: '2', label: { bg: '2', en: '2' } },
          { id: '3', label: { bg: '3', en: '3' } },
          { id: '4', label: { bg: '4', en: '4' } },
          { id: 'more', label: { bg: 'Повече', en: 'More' } },
          notSure,
        ],
        default: 'advise',
      },
      {
        id: 'glass',
        label: { bg: 'Стъкло', en: 'Glass' },
        type: 'single',
        choices: [
          { id: 'tempered', label: { bg: 'Единично закалено', en: 'Single tempered' } },
          { id: 'insulated', label: { bg: 'Стъклопакет', en: 'Insulated unit' } },
          notSure,
        ],
        default: 'tempered',
      },
      {
        id: 'tint',
        label: { bg: 'Вид стъкло', en: 'Glass finish' },
        type: 'single',
        choices: [
          { id: 'clear', label: { bg: 'Прозрачно', en: 'Clear' } },
          { id: 'tinted', label: { bg: 'Тонирано', en: 'Tinted' } },
        ],
        default: 'clear',
      },
      {
        id: 'context',
        label: { bg: 'Какво ще остъкляваме', en: 'What are we glazing' },
        type: 'single',
        choices: [
          { id: 'new-pergola', label: { bg: 'Нова пергола OUTPLAY', en: 'A new OUTPLAY pergola' } },
          { id: 'existing-structure', label: { bg: 'Съществуваща пергола или навес', en: 'An existing pergola or canopy' } },
          { id: 'opening', label: { bg: 'Отвор на тераса, балкон или фасада', en: 'A terrace, balcony or façade opening' } },
        ],
        default: 'opening',
      },
    ],
  },

  door: {
    family: 'door',
    preview: 'elevation',
    dimensions: [
      {
        id: 'width',
        label: { bg: 'Ширина на отвора', en: 'Opening width' },
        unit: 'm',
        min: 0.8,
        max: 8,
        step: 0.05,
        default: 2,
      },
      {
        id: 'height',
        label: { bg: 'Височина на отвора', en: 'Opening height' },
        unit: 'm',
        min: 1.8,
        max: 4,
        step: 0.05,
        default: 2.2,
      },
    ],
    optionGroups: [
      {
        id: 'leafType',
        label: { bg: 'Вид крила', en: 'Leaf type' },
        type: 'single',
        choices: [
          { id: 'standard', label: { bg: 'Стандартни плъзгащи', en: 'Standard sliding' } },
          { id: 'telescopic', label: { bg: 'Телескопични', en: 'Telescopic' } },
          notSure,
        ],
        default: 'standard',
      },
      {
        id: 'glass',
        label: { bg: 'Стъкло', en: 'Glass' },
        type: 'single',
        choices: [
          { id: 'tempered', label: { bg: 'Закалено', en: 'Tempered' } },
          { id: 'laminated', label: { bg: 'Ламинирано', en: 'Laminated' } },
          notSure,
        ],
        default: 'tempered',
      },
      {
        id: 'finish',
        label: { bg: 'Покритие на профилите', en: 'Profile finish' },
        type: 'single',
        choices: [
          { id: 'ral', label: { bg: 'Прахово боядисване по RAL', en: 'Powder-coated to RAL' } },
          { id: 'anodised', label: { bg: 'Елоксация', en: 'Anodised' } },
        ],
        default: 'ral',
      },
      {
        id: 'activation',
        label: { bg: 'Безконтактно отваряне', en: 'Touchless opening' },
        type: 'multi',
        choices: [
          { id: 'magic-switch', label: { bg: 'Сензор Magic Switch', en: 'Magic Switch sensor' } },
          { id: 'foot-button', label: { bg: 'Крачен бутон', en: 'Foot button' } },
        ],
        default: [],
      },
    ],
  },

  zip: {
    family: 'zip',
    preview: 'elevation',
    dimensions: [
      {
        id: 'width',
        label: { bg: 'Ширина', en: 'Width' },
        hint: { bg: 'Ширина на отвора или на една завеса', en: 'Width of the opening or of one screen' },
        unit: 'm',
        min: 0.5,
        max: 12,
        step: 0.05,
        default: 3,
      },
      {
        id: 'height',
        label: { bg: 'Височина / дължина', en: 'Height / length' },
        hint: { bg: 'За покривни завеси – дължината по покрива', en: 'For roof screens, the length along the roof' },
        unit: 'm',
        min: 0.5,
        max: 8,
        step: 0.05,
        default: 2.5,
      },
      {
        id: 'units',
        label: { bg: 'Брой завеси', en: 'Number of screens' },
        unit: 'pcs',
        min: 1,
        max: 40,
        step: 1,
        default: 1,
      },
    ],
    optionGroups: [
      {
        id: 'zipType',
        label: { bg: 'Вид завеса', en: 'Screen type' },
        type: 'single',
        choices: [
          { id: 'vertical', label: { bg: 'Вертикална – прозорец, пергола, фасада', en: 'Vertical: window, pergola, façade' } },
          { id: 'roof', label: { bg: 'Покривна – върху или под стъклен покрив', en: 'Roof: above or below a glass roof' } },
        ],
        default: 'vertical',
      },
      {
        id: 'fabric',
        label: { bg: 'Материя', en: 'Fabric' },
        type: 'single',
        choices: [
          { id: 'perforated', label: { bg: 'Микроперфорирана – пропуска въздух и гледка', en: 'Micro-perforated: lets air and view through' } },
          { id: 'blackout', label: { bg: 'Blackout – пълно затъмняване', en: 'Blackout: complete darkness' } },
          notSure,
        ],
        default: 'perforated',
      },
      {
        id: 'mounting',
        label: { bg: 'Корпус', en: 'Cassette' },
        type: 'single',
        choices: [
          { id: 'built-in', label: { bg: 'Вграден', en: 'Recessed' } },
          { id: 'surface', label: { bg: 'Външен', en: 'Surface-mounted' } },
          notSure,
        ],
        default: 'surface',
      },
      {
        id: 'automation',
        label: { bg: 'Автоматизация', en: 'Automation' },
        type: 'multi',
        choices: [
          { id: 'sensors', label: { bg: 'Датчици за вятър, слънце и дъжд', en: 'Wind, sun and rain sensors' } },
          { id: 'smart', label: { bg: 'SMART управление / умен дом', en: 'SMART control / smart home' } },
        ],
        default: [],
      },
    ],
  },

  awning: {
    family: 'awning',
    preview: 'plan',
    dimensions: [
      {
        id: 'width',
        label: { bg: 'Ширина', en: 'Width' },
        hint: { bg: 'Дължина на касетата по фасадата', en: 'Cassette length along the façade' },
        unit: 'm',
        min: 1,
        max: 14,
        step: 0.1,
        default: 4,
      },
      {
        id: 'depth',
        label: { bg: 'Излаз', en: 'Projection' },
        hint: { bg: 'Колко навън да се разпъва тентата', en: 'How far the awning extends' },
        unit: 'm',
        min: 0.5,
        max: 6,
        step: 0.1,
        default: 2.5,
      },
    ],
    optionGroups: [
      {
        id: 'mounting',
        label: { bg: 'Монтаж', en: 'Mounting' },
        type: 'single',
        choices: [
          { id: 'wall', label: { bg: 'На стена', en: 'Wall' } },
          { id: 'ceiling', label: { bg: 'На таван', en: 'Ceiling' } },
          notSure,
        ],
        default: 'wall',
      },
      {
        id: 'automation',
        label: { bg: 'Автоматизация', en: 'Automation' },
        type: 'multi',
        choices: [
          { id: 'sensors', label: { bg: 'Метеорологични датчици', en: 'Weather sensors' } },
          { id: 'smart', label: { bg: 'Управление от телефон / SMART дом', en: 'Phone / SMART home control' } },
        ],
        default: [],
      },
    ],
  },

  windbreak: {
    family: 'windbreak',
    preview: 'elevation',
    dimensions: [
      {
        id: 'length',
        label: { bg: 'Обща дължина', en: 'Total length' },
        hint: { bg: 'Сумата от всички страни, които искате да защитите', en: 'All the sides you want to shelter, added together' },
        unit: 'm',
        min: 1,
        max: 60,
        step: 0.1,
        default: 6,
      },
      {
        id: 'height',
        label: { bg: 'Желана височина', en: 'Preferred height' },
        hint: { bg: 'Височина в повдигнато положение', en: 'Height when raised' },
        unit: 'm',
        min: 0.6,
        max: 3,
        step: 0.05,
        default: 1.6,
      },
    ],
    optionGroups: [
      {
        id: 'glass',
        label: { bg: 'Стъкло', en: 'Glass' },
        type: 'single',
        choices: [
          { id: 'clear', label: { bg: 'Прозрачно', en: 'Clear' } },
          { id: 'tinted', label: { bg: 'Тонирано', en: 'Tinted' } },
          { id: 'frosted', label: { bg: 'Матово', en: 'Frosted' } },
        ],
        default: 'clear',
      },
    ],
  },
};

/** Free-text fields per family, shown after the option groups */
export const inquiryTextFields: Record<InquiryFamily, InquiryTextField[]> = {
  pergola: [colourField],
  glass: [colourField],
  door: [colourField],
  zip: [
    colourField,
    {
      id: 'fabricColour',
      label: { bg: 'Предпочитан цвят на платното', en: 'Preferred fabric colour' },
      placeholder: { bg: 'напр. сиво, бежово, антрацит', en: 'e.g. grey, beige, anthracite' },
    },
  ],
  awning: [
    colourField,
    {
      id: 'fabricColour',
      label: { bg: 'Предпочитан цвят на платното', en: 'Preferred fabric colour' },
      placeholder: { bg: 'напр. бежово, сиво, жълто или райе', en: 'e.g. beige, grey, yellow or striped' },
    },
  ],
  windbreak: [colourField],
};

/**
 * Option presets when the form is opened from a product page, so the matching
 * choice is already selected (keys are option-group ids of the product's family).
 */
export const productOptionDefaults: Record<string, Record<string, string | string[]>> = {
  balance: { roofType: 'lamellas' },
  infinity: { roofType: 'lamellas' },
  flat: { roofType: 'pvc' },
  curved: { roofType: 'pvc' },
  'automatic-glass-roof': { roofType: 'glass' },
  'fixed-glass-roof': { roofType: 'glass' },
  'thermo-panel-roof': { roofType: 'thermo' },
  guillotine: { systemType: 'guillotine' },
  'sliding-glass': { systemType: 'sliding' },
  compact: { systemType: 'folding' },
  accord: { systemType: 'folding' },
  harmonia: { systemType: 'folding' },
  'vertical-zip': { zipType: 'vertical' },
  'roof-zip': { zipType: 'roof' },
};
