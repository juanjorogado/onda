export interface Station {
  id: string;
  name: string;
  url: string;
  genre: string;
  location: string;
  timezone: string;
  cover: string;
}

export const stations: Station[] = [
  {
    id: 'groovesalad',
    name: 'SomaFM: Groove Salad',
    url: 'https://ice1.somafm.com/groovesalad-128-mp3',
    genre: 'Ambient / Chill',
    location: 'San Francisco',
    timezone: 'America/Los_Angeles',
    cover: 'https://somafm.com/img/groovesalad120.png'
  },
  {
    id: 'defcon',
    name: 'SomaFM: DefCon',
    url: 'https://ice1.somafm.com/defcon-128-mp3',
    genre: 'Techno / Hacking',
    location: 'San Francisco',
    timezone: 'America/Los_Angeles',
    cover: 'https://somafm.com/img/defcon120.png'
  },
  {
    id: 'jazz',
    name: 'Jazz24',
    url: 'https://live.wostreaming.net/direct/ppm-jazz24aac-ibc1',
    genre: 'Jazz',
    location: 'Seattle',
    timezone: 'America/Los_Angeles',
    cover: 'https://www.jazz24.org/wp-content/uploads/2023/10/Jazz24_logo_2023_Color-1.png'
  },
  {
    id: 'classic',
    name: 'Venice Classic Radio',
    url: 'https://uk2.internet-radio.com/proxy/veniceclassic?mp=/stream',
    genre: 'Classical',
    location: 'Venice',
    timezone: 'Europe/Rome',
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/1200px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg'
  },
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
    id: 'ibizaglobal',
    name: 'Ibiza Global Radio',
    url: 'https://ibizaglobalradio.streaming-pro.com:8024/ibizaglobalradio.mp3',
    genre: 'Electronic',
    location: 'Ibiza',
    timezone: 'Europe/Madrid',
    cover: 'https://ibizaglobalradio.com/wp-content/uploads/2022/01/LOGO-IGR-NEGRO.png'
  },
  {
    id: 'dubstep',
    name: 'SomaFM: Dub Step Beyond',
    url: 'https://ice1.somafm.com/dubstep-128-mp3',
    genre: 'Dubstep',
    location: 'San Francisco',
    timezone: 'America/Los_Angeles',
    cover: 'https://somafm.com/img/dubstep120.png'
  }
];
