import { Station } from '../types/station';

export const stations: Station[] = [

  // --- LONDRES: LA SCENE ALTERNATIVE ---
  {
    id: 'nts-2',
    name: 'NTS Radio 2',
    url: 'https://stream-relay-geo.ntslive.net/stream2',
    genre: 'Experimental / Underground / Global',
    location: 'London, UK',
    timezone: 'Europe/London',
    cover: '/logos/nts.svg'
  },
  {
    id: 'bbc-6music',
    name: 'BBC 6 Music',
    url: 'https://as-hls-ww-live.akamaized.net/pool_81827798/live/ww/bbc_6music/bbc_6music.isml/bbc_6music-audio%3d96000.norewind.m3u8',
    genre: 'Alternative / Indie / Rock',
    location: 'London, UK',
    timezone: 'Europe/London',
    cover: '/logos/bbc6.svg'
  },
  {
    id: 'wfmu-fixed',
    name: 'WFMU',
    url: 'https://stream0.wfmu.org/freeform-128k.mp3',
    genre: 'Freeform / Eclectic / Cult',
    location: 'Jersey City, USA',
    timezone: 'America/New_York',
    cover: '/logos/wfmu.svg'
  },
  {
    id: 'kexp',
    name: 'KEXP',
    url: 'https://kexp.streamguys1.com/kexp160.aac',
    genre: 'Indie / Alternative / Listener-Powered',
    location: 'Seattle, USA',
    timezone: 'America/Los_Angeles',
    cover: '/logos/kexp.svg'
  },

  // --- EUROPA COMUNITARIA & EXPERIMENTAL ---
  {
    id: 'cashmere-radio',
    name: 'Cashmere Radio',
    url: 'https://cashmereradio.out.airtime.pro/cashmereradio_a',
    genre: 'Experimental / Community / Underground',
    location: 'Berlin, Germany',
    timezone: 'Europe/Berlin',
    cover: '/logos/cashmere.svg'
  },

  // --- RADIO France - LA CURATION PARISINA ---
  {
    id: 'fip',
    name: 'FIP',
    url: 'https://icecast.radiofrance.fr/fip-midfi.mp3',
    genre: 'Eclectic / Jazz / Electro / World',
    location: 'Paris, France',
    timezone: 'Europe/Paris',
    cover: '/logos/fip.svg'
  },
  {
    id: 'france-musique',
    name: 'France Musique',
    url: 'https://icecast.radiofrance.fr/francemusique-midfi.mp3',
    genre: 'Classical / Contemporary / Jazz',
    location: 'Paris, France',
    timezone: 'Europe/Paris',
    cover: '/logos/francemusique.svg'
  },

  // --- EUROPA BOUTIQUE ---
  {
    id: 'tsf-jazz',
    name: 'TSF Jazz',
    url: 'https://tsfjazz.ice.infomaniak.ch/tsfjazz-high.mp3',
    genre: 'Jazz / Rare Groove / Soul',
    location: 'Paris, France',
    timezone: 'Europe/Paris',
    cover: '/logos/tsfjazz.svg'
  },
  {
    id: 'radio-raheem',
    name: 'Radio Raheem',
    url: 'https://radioraheem.out.airtime.pro/radioraheem_a',
    genre: 'Electronic / Cosmic / Jazz',
    location: 'Milan, Italy',
    timezone: 'Europe/Rome',
    cover: ''
  },

  // --- CLÁSICA & NEOCLÁSICA ---
  {
    id: 'whisperings-piano',
    name: 'Whisperings Solo Piano',
    url: 'https://pianosolo.streamguys1.com/live',
    genre: 'Solo Piano / Neoclassical',
    location: 'Oregon, USA',
    timezone: 'America/Los_Angeles',
    cover: ''
  },

  // --- CURADURÍA GLOBAL ---
  {
    id: 'nts-radio',
    name: 'NTS Radio',
    url: 'https://stream-relay-geo.ntslive.net/stream',
    genre: 'Eclectic / Electronic / Jazz',
    location: 'London, UK',
    timezone: 'Europe/London',
    cover: '/logos/nts.svg'
  }
];
