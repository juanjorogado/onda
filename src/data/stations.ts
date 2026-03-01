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
    cover: 'https://www.nts.live/assets/logos/nts-logo-black.png'
  },
  {
    id: 'resonance-fm',
    name: 'Resonance FM',
    url: 'https://stream.resonance.fm:8000/resonance',
    genre: 'Experimental / Sound Art / Community',
    location: 'London, UK',
    timezone: 'Europe/London',
    cover: 'https://www.resonancefm.com/images/logo.png'
  },
  {
    id: 'bbc-6music',
    name: 'BBC 6 Music',
    url: 'http://as-hls-ww-live.akamaized.net/pool_81827798/live/ww/bbc_6music/bbc_6music.isml/bbc_6music-audio%3d96000.norewind.m3u8',
    genre: 'Alternative / Indie / Rock',
    location: 'London, UK',
    timezone: 'Europe/London',
    cover: 'https://ichef.bbci.co.uk/images/ic/192x192/p0bq9rzs.jpg'
  },
  {
    id: 'wfmu-fixed',
    name: 'WFMU',
    url: 'https://stream0.wfmu.org/freeform-128k.mp3',
    genre: 'Freeform / Eclectic / Cult',
    location: 'Jersey City, USA',
    timezone: 'America/New_York',
    cover: 'https://wfmu.org/images/wfmu-logo.png'
  },
  {
    id: 'kexp',
    name: 'KEXP',
    url: 'https://kexp.streamguys1.com/kexp160.aac',
    genre: 'Indie / Alternative / Listener-Powered',
    location: 'Seattle, USA',
    timezone: 'America/Los_Angeles',
    cover: 'https://www.kexp.org/assets/images/kexp-logo.png'
  },

  // --- EUROPA COMUNITARIA & EXPERIMENTAL ---
  {
    id: 'cashmere-radio',
    name: 'Cashmere Radio',
    url: 'https://cashmereradio.out.airtime.pro/cashmereradio_a',
    genre: 'Experimental / Community / Underground',
    location: 'Berlin, Germany',
    timezone: 'Europe/Berlin',
    cover: 'https://cashmereradio.com/wp-content/uploads/2020/06/cashmere-logo.png'
  },

  // --- RADIO FRANCE - LA CURATION PARISINA ---
  {
    id: 'fip',
    name: 'FIP',
    url: 'http://icecast.radiofrance.fr/fip-midfi.mp3',
    genre: 'Eclectic / Jazz / Electro / World',
    location: 'Paris, France',
    timezone: 'Europe/Paris',
    cover: 'https://www.radiofrance.fr/fip/themes/custom/radio_france/images/logo-fip.svg'
  },
  {
    id: 'france-musique',
    name: 'France Musique',
    url: 'http://icecast.radiofrance.fr/francemusique-midfi.mp3',
    genre: 'Classical / Contemporary / Jazz',
    location: 'Paris, France',
    timezone: 'Europe/Paris',
    cover: 'https://www.radiofrance.fr/francemusique/sites/default/files/2021-11/logo-france-musique.svg'
  },

  // --- EUROPA BOUTIQUE ---
  {
    id: 'tsf-jazz',
    name: 'TSF Jazz',
    url: 'http://tsfjazz.ice.infomaniak.ch/tsfjazz-high.mp3',
    genre: 'Jazz / Rare Groove / Soul',
    location: 'Paris, France',
    timezone: 'Europe/Paris',
    cover: 'https://www.tsfjazz.com/wp-content/themes/tsfjazz/img/logo.png'
  },
  {
    id: 'radio-raheem',
    name: 'Radio Raheem',
    url: 'https://radioraheem.out.airtime.pro/radioraheem_a',
    genre: 'Electronic / Cosmic / Jazz',
    location: 'Milan, Italy',
    timezone: 'Europe/Rome',
    cover: 'https://www.radioraheem.it/wp-content/uploads/2017/03/RR_logo_black.png'
  },
  {
    id: 'radio-paradise',
    name: 'Radio Paradise',
    url: 'https://stream.radioparadise.com/mp3-192',
    genre: 'Eclectic / Rock / World',
    location: 'California, USA',
    timezone: 'America/Los_Angeles',
    cover: 'https://www.radioparadise.com/images/logo.png'
  },

  // --- CLÁSICA & NEOCLÁSICA ---
  {
    id: 'whisperings-piano',
    name: 'Whisperings Solo Piano',
    url: 'http://pianosolo.streamguys1.com/live',
    genre: 'Solo Piano / Neoclassical',
    location: 'Oregon, USA',
    timezone: 'America/Los_Angeles',
    cover: 'https://www.solopianoradio.com/images/whisperings-logo.png'
  },

  // --- CURADURÍA GLOBAL ---
  {
    id: 'nts-radio',
    name: 'NTS Radio',
    url: 'https://stream-relay-geo.ntslive.net/stream',
    genre: 'Eclectic / Electronic / Jazz',
    location: 'London, UK',
    timezone: 'Europe/London',
    cover: 'https://www.nts.live/static/images/nts-logo.png'
  }
];
