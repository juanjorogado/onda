import { Station } from '../types/station';

export const stations: Station[] = [

  // --- LONDRES: LA SCENE ALTERNATIVE ---
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
  {
    id: 'radio-raheem',
    name: 'Radio Raheem',
    url: 'https://radioraheem.out.airtime.pro/radioraheem_a',
    genre: 'Electronic / Cosmic / Jazz',
    location: 'Milan, Italy',
    timezone: 'Europe/Rome',
    cover: ''
  },

  // --- CURADURÍA GLOBAL ---
  {
    id: 'chilltraxx',
    name: 'ChillTraxx',
    url: 'https://streamssleu.chilltrax.com/stream',
    genre: 'Downtempo / Chillout',
    location: 'Oakland, USA',
    timezone: 'America/Los_Angeles',
    cover: ''
  },
  {
    id: 'jazz24',
    name: 'Jazz24',
    url: 'https://stream.jazz24.de/jazz24-128.mp3',
    genre: 'Jazz / Eclectic',
    location: 'Germany',
    timezone: 'Europe/Berlin',
    cover: ''
  },
  {
    id: 'stereoscenic',
    name: 'Stereoscenic',
    url: 'http://radio.stereoscenic.com/ama-h',
    genre: 'Ambient / Freeform',
    location: 'Online',
    timezone: 'UTC',
    cover: ''
  },
  {
    id: 'ambient-fm',
    name: 'Ambient.FM',
    url: 'https://phoebe.streamerr.co:4140/ambient.mp3',
    genre: 'Ambient / Electronica',
    location: 'Online',
    timezone: 'UTC',
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
];
