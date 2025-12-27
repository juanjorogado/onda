import { Station } from '../types/station';

export const stations: Station[] = [
  {
    id: 'kexp',
    name: 'KEXP',
    url: 'https://kexp.streamguys1.com/kexp128.mp3',
    genre: 'Alternative',
    location: 'Seattle',
    timezone: 'America/Los_Angeles',
    cover: 'https://cdn-profiles.tunein.com/s24996/images/logog.png?t=163001'
  },
  {
    id: 'wfmujazz',
    name: 'WFMU',
    url: 'https://wfmu.org/wfmu.pls',
    genre: 'Freeform / Eclectic',
    location: 'New Jersey',
    timezone: 'America/New_York',
    cover: 'https://wfmu.org/images/wfmu-logo.png'
  },
  {
    id: 'nprmusic',
    name: 'NPR Music',
    url: 'https://npr-ice.streamguys1.com/live.mp3',
    genre: 'Eclectic',
    location: 'Washington DC',
    timezone: 'America/New_York',
    cover: 'https://media.npr.org/assets/img/2018/08/03/nprmusic_sq-7b1be9c5e3b0c0e0e0e0e0e0e0e0e0e0.png'
  },
  {
    id: 'radiohead',
    name: 'Radio Paradise',
    url: 'https://stream.radioparadise.com/mp3-128',
    genre: 'Eclectic',
    location: 'California',
    timezone: 'America/Los_Angeles',
    cover: 'https://www.radioparadise.com/graphics/rp_logo.png'
  },
  {
    id: 'fip',
    name: 'FIP Radio',
    url: 'https://icecast.radiofrance.fr/fip-midfi.mp3',
    genre: 'Eclectic',
    location: 'Paris',
    timezone: 'Europe/Paris',
    cover: 'https://www.radiofrance.fr/sites/default/files/styles/visuel_principal/public/2021-06/FIP_logo_0.png'
  },
  // Soul & R&B Stations - Alternative sources
  {
    id: '181fm-soul',
    name: '181.fm - Soul',
    url: 'https://listen.181fm.com/181-soul_128k.mp3',
    genre: 'Soul / R&B',
    location: 'United States',
    timezone: 'America/New_York',
    cover: ''
  },
  {
    id: 'bootliquor',
    name: 'SomaFM: Boot Liquor',
    url: 'https://ice1.somafm.com/bootliquor-128-mp3',
    genre: 'Country / Americana',
    location: 'San Francisco',
    timezone: 'America/Los_Angeles',
    cover: 'https://somafm.com/img/bootliquor120.png'
  },
  {
    id: 'nts1',
    name: 'NTS Radio',
    url: 'https://stream-relay-geo.ntslive.net/stream',
    genre: 'Eclectic / Independent',
    location: 'London',
    timezone: 'Europe/London',
    cover: 'https://nts.live/static/img/nts-logo.png'
  },
  {
    id: 'franceinter',
    name: 'France Inter',
    url: 'https://icecast.radiofrance.fr/franceinter-hifi.aac',
    genre: 'Eclectic / Cultural',
    location: 'Paris',
    timezone: 'Europe/Paris',
    cover: 'https://www.radiofrance.fr/sites/default/files/styles/visuel_principal/public/2021-06/France-Inter_logo_0.png'
  },
  // Soul & R&B Stations from OpenTune
  {
    id: 'somafm-fluid',
    name: 'SomaFM: Fluid',
    url: 'https://ice1.somafm.com/fluid-128-mp3',
    genre: 'Soul / Future Soul / Hip Hop',
    location: 'San Francisco',
    timezone: 'America/Los_Angeles',
    cover: 'https://somafm.com/img/fluid120.png'
  },
  {
    id: 'jazzradio-soul',
    name: 'Jazz Radio Soul',
    url: 'https://jazz-wr09.ice.infomaniak.ch/jazz-wr09-128.mp3',
    genre: 'Soul / Jazz',
    location: 'Paris',
    timezone: 'Europe/Paris',
    cover: 'https://www.jazzradio.fr/img/logo-jazz-radio.png'
  },
  {
    id: '54-funk-soul',
    name: '54 Funk Soul Dance',
    url: 'https://stream.laut.fm/54-funk-soul-dance',
    genre: 'Funk / Soul / Dance',
    location: 'Germany',
    timezone: 'Europe/Berlin',
    cover: ''
  }
];