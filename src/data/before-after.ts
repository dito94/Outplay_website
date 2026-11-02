import type { BeforeAfterPair } from './types';

/**
 * Genuine same-viewpoint pairs from the 2026 catalogue (both images share size and alignment).
 * - carport: PDF 28 (p. 55) — the enclosed render was registered onto the open one (similarity transform).
 * - glassroom: PDF 29 (p. 56–57) — two renders from the same camera, offset corrected by 7 px.
 */
export const beforeAfter: BeforeAfterPair[] = [
  {
    id: 'glassroom',
    before: 'before-after/glassroom-before.jpg',
    after: 'before-after/glassroom-after.jpg',
    beforeLabel: { bg: 'Навес', en: 'Carport' },
    afterLabel: { bg: 'Стъклена стая', en: 'Glass room' },
    title: { bg: 'Една конструкция, две приложения', en: 'One structure, two uses' },
    caption: {
      bg: 'Пергола с покрив от термопанели: открита като навес за автомобил или затворена с плъзгащи се стъклени стени като уютно помещение.',
      en: 'An insulated-panel-roof pergola: left open as a carport, or closed in with sliding glass walls as a comfortable room.',
    },
  },
  {
    id: 'carport',
    before: 'before-after/carport-before.jpg',
    after: 'before-after/carport-after.jpg',
    beforeLabel: { bg: 'Открит навес', en: 'Open carport' },
    afterLabel: { bg: 'Със странични панели', en: 'With side panels' },
    title: { bg: 'Навес за два автомобила', en: 'Double carport' },
    caption: {
      bg: 'Същият навес с покрив от термопанели, затворен с плътни странични панели и врата, с вградено LED осветление в тавана.',
      en: 'The same insulated-panel-roof carport, closed in with solid side panels and a door, with LED lighting built into the ceiling.',
    },
  },
];
