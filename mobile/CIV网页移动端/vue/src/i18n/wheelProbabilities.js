/** @typedef {{ left: string[]; right: string[]; coupon: string }} WheelProbabilityCopy */

/** @type {Record<string, WheelProbabilityCopy>} */
export const wheelProbabilityByLocale = {
  en: {
    left: [
      'Rough Brush x30        15%',
      'Olive Branch x3        15%',
      'Basic Brush x10        10%',
      'Trade License x3        10%',
      'Contract x50        10%',
    ],
    right: [
      'Signet Ring x3        10%',
      'Random Resource Chest x30        20%',
      'Fine Clay x3        3%',
      'Tribute Plate x5        5%',
      'Diamond x300        1.67%',
    ],
    coupon: 'Top-Up Coupon (Valid for the $19.99 tier only) x1       0.33%',
  },
  de: {
    left: [
      'Grobe Bürste x30        15%',
      'Olivenzweig x3        15%',
      'Basis-Pinsel x10        10%',
      'Handelslizenz x3        10%',
      'Vertrag x50        10%',
    ],
    right: [
      'Siegelring x3        10%',
      'Zufällige Ressourcenkiste x30        20%',
      'Feiner Ton x3        3%',
      'Tributteller x5        5%',
      'Diamant x300        1.67%',
    ],
    coupon: 'Auflade-Gutschein (nur für die Preisstufe $19.99 gültig) x1       0.33%',
  },
  fr: {
    left: [
      'Brosse rugueuse x30        15%',
      "Branche d'Olivier x3        15%",
      'Pinceau basique x10        10%',
      'Licence commerciale x3        10%',
      'Contrat x50        10%',
    ],
    right: [
      'Chevalière x3        10%',
      'Coffre de ressources aléatoire x30        20%',
      'Argile fine x3        3%',
      'Plaque de tribut x5        5%',
      'Diamant x300        1.67%',
    ],
    coupon: 'Coupon de recharge (valable uniquement pour le palier à 19,99 $) x1        0.33%',
  },
  es: {
    left: [
      'Pincel áspero x30        15%',
      'Rama de olivo x3        15%',
      'Pincel básico x10        10%',
      'Licencia comercial x3        10%',
      'Contrato x50        10%',
    ],
    right: [
      'Anillo de sello x3        10%',
      'Cofre de recursos aleatorios x30        20%',
      'Arcilla fina x3        3%',
      'Plato de tributo x5        5%',
      'Diamante x300        1.67%',
    ],
    coupon: 'Cupón de recarga (solo válido para el rango de $19.99) x1      0.33%',
  },
  pt: {
    left: [
      'Pincel grosso x30        15%',
      'Ramo de oliveira x3        15%',
      'Pincel básico x10        10%',
      'Licença comercial x3        10%',
      'Contrato x50        10%',
    ],
    right: [
      'Anel de Sinete x3        10%',
      'Baú de recursos aleatórios x30        20%',
      'Argila fina x3        3%',
      'Placa de Tributo x5        5%',
      'Diamante x300        1.67%',
    ],
    coupon: 'Cupom de Recarga (Válido apenas para a classe de $19,99) x1      0.33%',
  },
};
