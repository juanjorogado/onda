import { Station } from '../types/station';

export const stations: Station[] = [
  // --- JAPÓN: LA EXQUISITEZ ---
  {
    id: 'ottava',
    name: 'OTTAVA',
    url: 'https://ottava.stream.ne.jp/live/ottava.mp3',
    genre: 'Classical / Contemporary / Zen',
    location: 'Tokyo, Japan',
    timezone: 'Asia/Tokyo',
    cover: 'https://ottava.jp/assets/img/logo.png'
  },
  {
    id: 'jazz-sakura',
    name: 'Jazz Sakura',
    url: 'https://music.vdfm.ru:8000/sakura',
    genre: 'Japanese Jazz / Piano / Chill',
    location: 'Kyoto, Japan',
    timezone: 'Asia/Tokyo',
    cover: 'https://cdn.webradiocontrol.com/stations/jazz-sakura/logo.png'
  },

  // --- MADRID VANGUARDIA ---
  {
    id: 'radio-relativa',
    name: 'Radio Relativa',
    url: 'https://stream.radiorelativa.eu/relativa.mp3',
    genre: 'Experimental / Community / Eclectic',
    location: 'Madrid, Spain',
    timezone: 'Europe/Madrid',
    cover: 'https://radiorelativa.eu/wp-content/uploads/2020/05/cropped-logo-relativa-192x192.png'
  },

  // --- EL TRIDENTE FREEFORM (Estilo WFMU) ---
  {
    id: 'wfmu-fixed',
    name: 'WFMU',
    url: 'https://ichibanrock.com/wfmu-high.mp3',
    genre: 'Freeform / Eclectic / Cult',
    location: 'Jersey City, USA',
    timezone: 'America/New_York',
    cover: 'https://wfmu.org/images/wfmu-logo.png'
  },
  {
    id: 'dublab',
    name: 'Dublab',
    url: 'https://dublab.out.airtime.pro/dublab_a',
    genre: 'Freeform / Future Roots',
    location: 'Los Angeles, USA',
    timezone: 'America/Los_Angeles',
    cover: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Dublab_logo.png'
  },

  // --- EUROPA BOUTIQUE ---
  {
    id: 'radio-nova',
    name: 'Radio Nova',
    url: 'https://icecast.radiofrance.fr/nova-midfi.mp3',
    genre: 'The Grand Mix / Eclectic',
    location: 'Paris, France',
    timezone: 'Europe/Paris',
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Radio_Nova_logo.svg/1200px-Radio_Nova_logo.svg.png'
  },
  {
    id: 'radio-raheem',
    name: 'Radio Raheem',
    url: 'https://sprock.io/radio/8010/radio.mp3',
    genre: 'Electronic / Cosmic / Jazz',
    location: 'Milan, Italy',
    timezone: 'Europe/Rome',
    cover: 'https://www.radioraheem.it/wp-content/uploads/2017/03/RR_logo_black.png'
  },
  {
    id: 'tsf-jazz',
    name: 'TSF Jazz',
    url: 'http://tsfjazz.ice.infomaniak.ch/tsfjazz-high.mp3',
    genre: 'Jazz / Rare Groove / Soul',
    location: 'Paris, France',
    timezone: 'Europe/Paris',
    cover: 'https://www.tsfjazz.com/wp-content/themes/tsfjazz/img/logo.png'
  },

  // --- CLÁSICA & NEOCLÁSICA ---
  {
    id: 'calm-neoclassical',
    name: 'Calm Radio Neoclassical',
    url: 'https://streams.calmradio.com:443/api/366/128/stream',
    genre: 'Neoclassical / Minimalist',
    location: 'Toronto, Canada',
    timezone: 'America/Toronto',
    cover: 'https://calmradio.com/img/neoclassical.jpg'
  },

  // --- CURADURÍA GLOBAL ---
  {
    id: 'worldwide-fm',
    name: 'Worldwide FM',
    url: 'https://worldwidefm.out.airtime.pro/worldwidefm_a',
    genre: 'Global Jazz / Beats',
    location: 'London, UK',
    timezone: 'Europe/London',
    cover: 'https://m.media-amazon.com/images/I/41-l3D4p3pL.png'
  }
];