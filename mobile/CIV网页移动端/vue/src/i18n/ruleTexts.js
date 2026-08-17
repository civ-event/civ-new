/** Shared rule section labels + requirement highlight fragments */
const commonRulesEn = {
  eventDuration: 'Event Duration',
  eventRequirements: 'Event Requirements',
  eventRules: 'Event Rules',
  requirementsLevel: 'Level ≥ 5',
  requirementsLoggedIn: 'logged-in characters',
  requirementsDetail: 'Character {level}     Only {loggedIn} can participate in the event.',
};

const commonRulesDe = {
  eventDuration: 'Eventdauer',
  eventRequirements: 'Eventvoraussetzungen',
  eventRules: 'Ereignisregeln',
  requirementsLevel: 'Stufe ≥ 5',
  requirementsLoggedIn: 'eingeloggte Charaktere',
  requirementsDetail: 'Charakter {level}     Nur {loggedIn} können teilnehmen.',
};

const commonRulesFr = {
  eventDuration: "Durée de l'événement",
  eventRequirements: "Exigences de l'événement",
  eventRules: "Règles de l'événement",
  requirementsLevel: 'Niveau ≥ 5',
  requirementsLoggedIn: 'personnages connectés',
  requirementsDetail: 'Niveau du personnage {level}     Seuls les {loggedIn} peuvent participer à l\'événement.',
};

const commonRulesEs = {
  eventDuration: 'Duración del evento',
  eventRequirements: 'Requisitos del evento',
  eventRules: 'Reglas del evento',
  requirementsLevel: 'Nivel ≥ 5',
  requirementsLoggedIn: 'personajes que han iniciado sesión',
  requirementsDetail: 'Nivel de personaje {level}     Solo los {loggedIn} pueden participar en el evento.',
};

const commonRulesPt = {
  eventDuration: 'Duração do evento',
  eventRequirements: 'Requisitos do evento',
  eventRules: 'Regras do evento',
  requirementsLevel: 'Nível ≥ 5',
  requirementsLoggedIn: 'personagens logados',
  requirementsDetail: 'Nível do personagem {level}     Apenas {loggedIn} podem participar do evento.',
};

const checkinRulesEn = {
  title: 'Check-in Event Rules',
  durationPrefix: 'Sign-in Event:',
  body:
    '1. Chieftains can log in to the webpage daily during the event to claim a check-in reward and 3 Lucky Wheel draws.<br />    The event resets daily at 0:00 (UTC-5).<br />'
    + '2. Chieftains can use the acquired draws on the Lucky Wheel tab.<br />'
    + '3. Chieftains can claim an additional reward upon reaching a cumulative check-in of 7 and 10 days.<br />'
    + '4. Check-in rewards will be automatically sent to the chieftain\'s in-game mailbox. Please check your mail.<br />',
};

const checkinRulesDe = {
  title: 'Login-Belohnungsregeln',
  durationPrefix: 'Login-Event:',
  body:
    '1. Während des Events können sich Häuptlinge täglich auf der Webseite anmelden, um eine Login-Belohnung und 3 Drehungen für das Glücksrad zu erhalten.<br />    Das Event wird täglich um 0:00 Uhr (UTC-5) zurückgesetzt.<br />'
    + '2. Die erhaltenen Drehungen können im Tab Glücksrad verwendet werden.<br />'
    + '3. Bei insgesamt 7 bzw. 10 Anmeldetagen können Häuptlinge zusätzliche Belohnungen erhalten.<br />'
    + '4. Die Login-Belohnungen werden automatisch an die Ingame-Mail des Häuptlings gesendet. Bitte prüfe deinen Posteingang.<br />',
};

const checkinRulesFr = {
  title: "Règles de l'événement de connexion quotidienne",
  durationPrefix: 'Connexion quotidienne :',
  body:
    '1. Les Chefs peuvent se connecter à la page web quotidiennement pendant l\'événement pour réclamer une récompense de connexion et 3 tours de Roue de la chance.<br />    L\'événement se réinitialise chaque jour à 0h00 (UTC-5).<br />'
    + '2. Les Chefs peuvent utiliser les tours acquis dans Roue de la chance.<br />'
    + '3. Les Chefs peuvent réclamer une récompense supplémentaire après avoir atteint un total cumulé de connexion de 7 et 10 jours.<br />'
    + '4. Les récompenses de connexion seront automatiquement envoyées à la boîte aux lettres en jeu. Veuillez vérifier votre courrier.<br />',
};

const checkinRulesEs = {
  title: 'Reglas del evento de registro',
  durationPrefix: 'Evento de registro:',
  body:
    '1. Los líderes pueden iniciar sesión en la página web diariamente durante el evento para reclamar una recompensa de registro y 3 giros de la Rueda de la Suerte.<br />    El evento se reinicia diariamente a las 0:00 (UTC-5).<br />'
    + '2. Los líderes pueden usar los giros adquiridos en la pestaña de la Rueda de la Suerte.<br />'
    + '3. Los líderes pueden reclamar una recompensa adicional al alcanzar un registro acumulativo de 7 y 10 días.<br />'
    + '4. Las recompensas de registro se enviarán automáticamente al buzón del líder en el juego. Por favor, revisa tu correo.<br />',
};

const checkinRulesPt = {
  title: 'Regras do evento de check-in',
  durationPrefix: 'Evento de registro:',
  body:
    '1. Chefes podem fazer login na página diariamente durante o evento para resgatar uma recompensa de check-in e 3 sorteios da Roda da Sorte.<br />    O evento reinicia diariamente às 0:00 (UTC-5).<br />'
    + '2. Chefes podem usar os sorteios obtidos na aba da Roda da Sorte.<br />'
    + '3. Chefes podem resgatar uma recompensa adicional ao atingir 7 e 10 dias de check-in acumulado.<br />'
    + '4. As recompensas de check-in serão enviadas automaticamente para a caixa de correio do chefe no jogo. Por favor, verifique seu correio.<br />',
};

const topupRulesEn = {
  title: 'Event Rules',
  body:
    '1. Reach the target cumulative top-up amount at the Official Top-up Center to claim rewards! (In-game top-ups are not included)<br />'
    + '2. Each character and ID can only participate once.<br />'
    + '3. Gifted coupons do not count towards this cumulative top-up event.',
};

const topupRulesDe = {
  title: 'Ereignisregeln',
  body:
    '1. Erreiche im offiziellen Aufladezentrum den erforderlichen kumulierten Aufladebetrag, um Belohnungen zu erhalten! (Aufladungen im Spiel werden dabei nicht berücksichtigt)<br />'
    + '2. Pro Charakter und ID ist die Teilnahme nur einmal möglich.<br />'
    + '3. Verschenkte Gutscheine werden für dieses Event nicht auf den kumulierten Aufladebetrag angerechnet.',
};

const topupRulesFr = {
  title: "Règles de l'événement",
  body:
    '1. Atteignez le montant cumulé de recharge cible au Centre de recharge officiel pour réclamer des récompenses ! (Les recharges en jeu ne sont pas incluses)<br />'
    + '2. Chaque personnage et ID ne peut participer qu\'une seule fois.<br />'
    + '3. Les coupons offerts ne comptent pas pour cet événement de recharge cumulative.',
};

const topupRulesEs = {
  title: 'Reglas del evento',
  body:
    '1. ¡Alcanza la cantidad total de recarga acumulativa en el Centro de Recarga Oficial para reclamar recompensas! (Las recargas dentro del juego no están incluidas)<br />'
    + '2. Cada personaje e ID solo pueden participar una vez.<br />'
    + '3. Los cupones otorgados no cuentan para este evento de recarga acumulativa.',
};

const topupRulesPt = {
  title: 'Regras do evento',
  body:
    '1. Alcance o valor acumulado de recarga no Centro Oficial de Recarga para resgatar recompensas! (Recargas dentro do jogo não estão incluídas)<br />'
    + '2. Cada personagem e ID só pode participar uma vez.<br />'
    + '3. Cupons presenteados não contam para este evento de recarga acumulada.',
};

const wheelRulesEn = {
  title: 'Lucky Wheel Rules',
  durationWheelLabel: 'Lucky Wheel:',
  durationCouponLabel: 'Coupon Validity:',
  probabilitiesTitle: 'Reward Overview & Probabilities',
  body:
    '1. During the event, chieftains can use Lucky Tickets to draw prizes. Each draw guarantees a reward, which will be sent to your in-game mailbox.<br />'
    + '2. Remaining daily tickets can be accumulated and will not be removed by the system. They can be used anytime before the event ends.<br />'
    + '3. How to obtain tickets: Chieftains can get 3 free Lucky Tickets by signing in daily during the event. Additionally, logging into Pop Epoch once during the event period grants 3 free Lucky Tickets.<br />'
    + '4. The grand prize \'Top-up Coupon (Valid for the $19.99 tier only)\' can be obtained only once per character. Once won, the coupon will be automatically issued to the chieftain\'s account on the top-up page. This coupon is only valid at the official Pop Epoch Top-up Center. Please use it within its validity period.<br />'
    + '5. This discount coupon is exclusive to the official Pop Epoch Top-up Center and provides a 10% discount (This coupon can only be used for the $19.99 tier.). *Please refer to the actual display for the final discount details.<br />',
};

const wheelRulesDe = {
  title: 'Glücksrad-Regeln',
  durationWheelLabel: 'Glücksrad:',
  durationCouponLabel: 'Gültigkeit des Gutscheins:',
  probabilitiesTitle: 'Belohnungsübersicht & Gewinnchancen',
  body:
    '1. Während des Events können Häuptlinge mit Glückstickets Preise ziehen. Jede Ziehung garantiert eine Belohnung, die an deinen Posteingang im Spiel gesendet wird.<br />'
    + '2. Nicht verbrauchte Tickets verfallen nicht und bleiben bis zum Ende des Events erhalten. Sie können jederzeit vor Eventende verwendet werden.<br />'
    + '3. So erhältst du Tickets: Während des Events können Häuptlinge durch die tägliche Anmeldung 3 kostenlose Glückstickets erhalten. Zusätzlich gibt es 3 weitere kostenlose Glückstickets, wenn du dich im Eventzeitraum einmal in Pop Epoch einloggst.<br />'
    + '4. Der Hauptpreis "Aufladegutschein (Nur für die Preisstufe $19.99-Stufe gültig)" kann pro Charakter nur einmal gewonnen werden. Nach dem Gewinn wird der Gutschein automatisch dem Konto des Häuptlings auf der Aufladeseite gutgeschrieben. Dieser Gutschein ist nur im offiziellen Pop Epoch-Aufladezentrum gültig. Bitte nutze ihn innerhalb der Gültigkeitsdauer.<br />'
    + '5. Dieser Rabattgutschein gilt ausschließlich im offiziellen Pop Epoch-Aufladezentrum und gewährt 10 % Rabatt auf Pakete im Wert von $19,99. *Es gelten die tatsächlich angezeigten Rabattdetails.<br />',
};

const wheelRulesFr = {
  title: 'Règles de la Roue de la chance',
  durationWheelLabel: 'Roue de la chance :',
  durationCouponLabel: 'Validité du billet :',
  probabilitiesTitle: 'Aperçu des récompenses et probabilités',
  body:
    '1. Pendant l\'événement, les chefs peuvent utiliser des Billets chanceux pour tirer des récompenses. Chaque tirage garantit une récompense, qui sera envoyée à votre boîte aux lettres en jeu.<br />'
    + '2. Les billets quotidiens non utilisés peuvent être accumulés et ne seront pas supprimés par le système. Ils peuvent être utilisés à tout moment avant la fin de l\'événement.<br />'
    + '3. Comment obtenir des billets : Les chefs peuvent obtenir 3 Billets chanceux gratuits en se connectant quotidiennement pendant l\'événement. De plus, se connecter à Pop Epoch une fois pendant la période de l\'événement accorde 3 Billets chanceux gratuits.<br />'
    + '4. Le grand prix « Coupon de recharge (Valable uniquement pour le palier à 19,99 $) » ne peut être obtenu qu\'une seule fois par personnage. Une fois gagné, le coupon sera automatiquement attribué au compte du chef sur la page de recharge. Ce coupon n\'est valable qu\'au Centre de recharge officiel de Pop Epoch. Veuillez l\'utiliser dans sa période de validité.<br />'
    + '5. Ce coupon de réduction est exclusif au Centre de recharge officiel de Pop Epoch et offre une réduction de 10 % (Ce coupon est uniquement valable pour le palier à 19,99 $.) *Veuillez vous référer à l\'affichage réel pour les détails de réduction finaux.<br />',
};

const wheelRulesEs = {
  title: 'Reglas de la rueda de la suerte',
  durationWheelLabel: 'Rueda de la suerte:',
  durationCouponLabel: 'Validez del cupón:',
  probabilitiesTitle: 'Resumen de recompensas y probabilidades',
  body:
    '1. Durante el evento, los líderes pueden usar Boletos de la Suerte para sacar premios. Cada sorteo garantiza una recompensa, que se enviará a tu buzón del juego.<br />'
    + '2. Los boletos diarios restantes se pueden acumular y no se eliminarán por el sistema. Se pueden utilizar en cualquier momento antes de que termine el evento.<br />'
    + '3. Cómo obtener boletos: Los líderes pueden obtener 3 Boletos de la Suerte gratis registrando su asistencia diariamente durante el evento. Además, iniciar sesión en Pop Epoch una vez durante el período del evento otorga 3 Boletos de la Suerte gratis.<br />'
    + '4. El gran premio "Cupón de recarga (Solo válido para el rango de $19.99)" solo se puede obtener una vez por personaje. Una vez ganado, el cupón se emitirá automáticamente a la cuenta del líder en la página de recarga. Este cupón es válido únicamente en el Centro de Recarga oficial de Pop Epoch. Por favor, utilízalo dentro de su período de validez.<br />'
    + '5. Este cupón de descuento es exclusivo para el Centro de Recarga oficial de Pop Epoch y proporciona un descuento del 10% (Este cupón solo se puede usar para el rango de $19.99.). *Por favor, consulta la información en pantalla para ver los detalles finales del descuento.<br />',
};

const wheelRulesPt = {
  title: 'Regras da roda da sorte',
  durationWheelLabel: 'Roda da sorte:',
  durationCouponLabel: 'Validade do cupom:',
  probabilitiesTitle: 'Visão Geral de recompensas e probabilidades',
  body:
    '1. Durante o evento, chefes podem usar Bilhetes da Sorte para sorteios de prêmios. Cada sorteio garante uma recompensa, que será enviada para sua caixa de correio no jogo.<br />'
    + '2. Os bilhetes diários restantes podem ser acumulados e não serão removidos pelo sistema. Eles podem ser usados a qualquer momento antes do término do evento.<br />'
    + '3. Como obter bilhetes: Chefes podem ganhar 3 Bilhetes da Sorte gratuitos ao fazer login diariamente durante o evento. Além disso, fazer login no Pop Epoch uma vez durante o período do evento concede 3 Bilhetes da Sorte gratuitos.<br />'
    + '4. O grande prêmio \'Cupom de Recarga (Válido apenas para a classe de $19,99)\' pode ser obtido apenas uma vez por personagem. Uma vez ganho, o cupom será automaticamente emitido para a conta do chefe na página de recarga. Este cupom é válido apenas no Centro Oficial de Recarga do Pop Epoch. Por favor, utilize-o dentro do período de validade.<br />'
    + '5. Este cupom de desconto é exclusivo para o Centro Oficial de Recarga do Pop Epoch e oferece um desconto de 10% (Este cupom só pode ser usado para a classe de $19,99.). *Por favor, consulte as informações exibidas no jogo para os detalhes finais do desconto.<br />',
};

/**
 * @param {object} localeMessages
 * @param {object} commonRules
 * @param {object} checkinRules
 * @param {object} topupRules
 * @param {object} wheelRules
 * @param {import('./wheelProbabilities.js').WheelProbabilityCopy} wheelProbability
 */
function withRuleTexts(
  localeMessages,
  commonRules,
  checkinRules,
  topupRules,
  wheelRules,
  wheelProbability,
) {
  return {
    ...localeMessages,
    common: {
      rules: commonRules,
    },
    checkin: {
      ...localeMessages.checkin,
      rules: checkinRules,
    },
    topup: {
      ...localeMessages.topup,
      rules: topupRules,
    },
    wheel: {
      ...localeMessages.wheel,
      rules: wheelRules,
      probabilityLeft: wheelProbability.left,
      probabilityRight: wheelProbability.right,
      probabilityCoupon: wheelProbability.coupon,
    },
  };
}

/** @param {typeof import('./wheelProbabilities.js').wheelProbabilityByLocale} wheelProbabilityByLocale */
export function buildLocalizedMessages(baseMessages, wheelProbabilityByLocale) {
  return {
    en: withRuleTexts(
      baseMessages.en,
      commonRulesEn,
      checkinRulesEn,
      topupRulesEn,
      wheelRulesEn,
      wheelProbabilityByLocale.en,
    ),
    de: withRuleTexts(
      baseMessages.de,
      commonRulesDe,
      checkinRulesDe,
      topupRulesDe,
      wheelRulesDe,
      wheelProbabilityByLocale.de,
    ),
    fr: withRuleTexts(
      baseMessages.fr,
      commonRulesFr,
      checkinRulesFr,
      topupRulesFr,
      wheelRulesFr,
      wheelProbabilityByLocale.fr,
    ),
    es: withRuleTexts(
      baseMessages.es,
      commonRulesEs,
      checkinRulesEs,
      topupRulesEs,
      wheelRulesEs,
      wheelProbabilityByLocale.es,
    ),
    pt: withRuleTexts(
      baseMessages.pt,
      commonRulesPt,
      checkinRulesPt,
      topupRulesPt,
      wheelRulesPt,
      wheelProbabilityByLocale.pt,
    ),
  };
}
