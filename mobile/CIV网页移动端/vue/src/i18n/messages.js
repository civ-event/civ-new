import { buildLocalizedMessages } from './ruleTexts';
import { mergeUiTexts, uiTextsByLocale } from './uiTexts';
import { wheelProbabilityByLocale } from './wheelProbabilities';

export const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
];

const LOCALE_STORAGE_KEY = 'civ_event_locale';

/** @returns {string} */
export function readPersistedLocale() {
  const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (saved && LANGUAGE_OPTIONS.some((item) => item.code === saved)) {
    return saved;
  }
  return 'en';
}

/** @param {string} locale */
export function persistLocale(locale) {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

const baseMessages = {
  en: {
    home: {
      slogan: 'Travel through time and dominate your era!',
    },
    nav: {
      login: 'Login',
      download: 'Download',
      checkinEvent: 'Check-in Event',
      topupRewards: 'Top-up Rewards',
      luckyWheel: 'Lucky Wheel',
      backToTop: 'Back to Top',
    },
    event: {
      duration: 'Event Duration: {range} (Specific time TBD)',
    },
    checkin: {
      currentTime: 'Current Time (UTC-5): {time}',
      rewardHistory: 'Reward History',
      dailyCheckinRewards: 'Daily Check-in Rewards',
      tenDayCheckin: '10-Day Check-in',
      checkedDays: 'You have checked in for {days} days',
    },
    wheel: {
      ticketHistory: 'TICKET HISTORY',
      winningRecords: 'WINNING RECORDS',
      tickets: 'Tickets:',
    },
    topup: {
      totalTopup: 'TOTAL TOP-UP :',
      visitCenter: 'CLICK TO VISIT THE OFFICIAL TOP-UP CENTER',
    },
    footer: {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      copyright: '©2025 NexWave Tech Limited. All rights reserved',
    },
  },
  de: {
    home: {
      slogan: 'Reise durch die Zeit und präge deine Ära!',
    },
    nav: {
      login: 'Anmelden',
      download: 'Herunterladen',
      checkinEvent: 'Login-Belohnungen',
      topupRewards: 'Aufladungsbelohnungen',
      luckyWheel: 'Glücksrad',
      backToTop: 'Zurück nach oben',
    },
    event: {
      duration: 'Eventdauer: {range} (Genauer Zeitpunkt folgt)',
    },
    checkin: {
      currentTime: 'Aktuelle Zeit (UTC-5): {time}',
      rewardHistory: 'Belohnungsverlauf',
      dailyCheckinRewards: 'Tägliche Login-Belohnungen',
      tenDayCheckin: '10-Tage-Anmeldung',
      checkedDays: '{days} Tage angemeldet',
    },
    wheel: {
      ticketHistory: 'TICKETVERLAUF',
      winningRecords: 'GEWINNVERLAUF',
      tickets: 'Tickets:',
    },
    topup: {
      totalTopup: 'GESAMTAUFLADUNG :',
      visitCenter: 'ZUM OFFIZIELLEN AUFLADEZENTRUM',
    },
    footer: {
      privacy: 'Datenschutzrichtlinie',
      terms: 'Nutzungsbedingungen',
      copyright: '©2025 NexWave Tech Limited. Alle Rechte vorbehalten',
    },
  },
  fr: {
    home: {
      slogan: 'Voyagez à travers le temps et dominez votre ère !',
    },
    nav: {
      login: 'Connexion',
      download: 'Télécharger',
      checkinEvent: 'Connexion quotidienne',
      topupRewards: 'Récompenses de recharge cumulative',
      luckyWheel: 'Roue de la chance',
      backToTop: 'Retour en haut',
    },
    event: {
      duration: "Durée de l'événement : {range} (heure spécifique à déterminer)",
    },
    checkin: {
      currentTime: 'Heure actuelle (UTC-5) : {time}',
      rewardHistory: 'Historique des récompenses',
      dailyCheckinRewards: 'Récompenses de connexion quotidienne',
      tenDayCheckin: 'Connexion de 10 jours',
      checkedDays: 'Votre série de connexion : {days} jours',
    },
    wheel: {
      ticketHistory: 'HISTORIQUE DES TICKETS',
      winningRecords: 'HISTORIQUE DES GAINS',
      tickets: 'Tickets :',
    },
    topup: {
      totalTopup: 'TOTAL DE RECHARGE :',
      visitCenter: 'CLIQUEZ POUR VISITER LE CENTRE DE RECHARGE OFFICIEL',
    },
    footer: {
      privacy: 'Politique de confidentialité',
      terms: "Conditions d'utilisation",
      copyright: '©2025 NexWave Tech Limited. Tous droits réservés',
    },
  },
  es: {
    home: {
      slogan: '¡Viaja a través del tiempo y domina tu era!',
    },
    nav: {
      login: 'Iniciar sesión',
      download: 'Descargar',
      checkinEvent: 'Evento de registro',
      topupRewards: 'Recompensas de recarga',
      luckyWheel: 'Rueda de la suerte',
      backToTop: 'Volver arriba',
    },
    event: {
      duration: 'Duración del evento: {range} (horario a confirmar)',
    },
    checkin: {
      currentTime: 'Hora actual (UTC-5): {time}',
      rewardHistory: 'Historial de recompensas',
      dailyCheckinRewards: 'Recompensas diarias de check-in',
      tenDayCheckin: 'Registro de 10 Días',
      checkedDays: 'Llevas {days} días de registro',
    },
    wheel: {
      ticketHistory: 'HISTORIAL DE TICKETS',
      winningRecords: 'REGISTRO DE PREMIOS',
      tickets: 'Tickets:',
    },
    topup: {
      totalTopup: 'RECARGA TOTAL :',
      visitCenter: 'HAZ CLIC PARA VISITAR EL CENTRO DE RECARGA OFICIAL',
    },
    footer: {
      privacy: 'Política de privacidad',
      terms: 'Términos de servicio',
      copyright: '©2025 NexWave Tech Limited. Todos los derechos reservados',
    },
  },
  pt: {
    home: {
      slogan: 'Viaje no tempo e domine sua era!',
    },
    nav: {
      login: 'Login',
      download: 'Baixar',
      checkinEvent: 'Evento de check-in',
      topupRewards: 'Recompensas de recarga',
      luckyWheel: 'Roda da sorte',
      backToTop: 'Voltar ao topo',
    },
    event: {
      duration: 'Duração do evento: {range} (Horário específico a ser definido)',
    },
    checkin: {
      currentTime: 'Hora atual (UTC-5): {time}',
      rewardHistory: 'Histórico de recompensas',
      dailyCheckinRewards: 'Recompensas diárias de check-in',
      tenDayCheckin: 'Check-in de 10 dias',
      checkedDays: 'Você fez o check-in por {days} dias',
    },
    wheel: {
      ticketHistory: 'HISTÓRICO DE TICKETS',
      winningRecords: 'REGISTRO DE PRÊMIOS',
      tickets: 'Tickets:',
    },
    topup: {
      totalTopup: 'RECARGA TOTAL :',
      visitCenter: 'CLIQUE PARA VISITAR A CENTRAL OFICIAL DE RECARGA',
    },
    footer: {
      privacy: 'Política de Privacidade',
      terms: 'Termos de Serviço',
      copyright: '©2025 NexWave Tech Limited. Todos os direitos reservados',
    },
  },
};

export const messages = buildLocalizedMessages(
  mergeUiTexts(baseMessages, uiTextsByLocale),
  wheelProbabilityByLocale,
);
