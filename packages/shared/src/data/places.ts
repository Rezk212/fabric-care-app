export interface City { id: string; name: { ar: string; en: string }; lat: number; lng: number }
export interface Country { code: string; name: { ar: string; en: string }; cities: City[] }

export const countries: Country[] = [
  {
    code: 'OM',
    name: { ar: 'سلطنة عُمان', en: 'Oman' },
    cities: [
      { id: 'muscat', name: { ar: 'مسقط', en: 'Muscat' }, lat: 23.588, lng: 58.3829 },
      { id: 'salalah', name: { ar: 'صلالة', en: 'Salalah' }, lat: 17.0151, lng: 54.0924 },
      { id: 'sohar', name: { ar: 'صحار', en: 'Sohar' }, lat: 24.3474, lng: 56.7094 },
      { id: 'nizwa', name: { ar: 'نزوى', en: 'Nizwa' }, lat: 22.9333, lng: 57.5333 },
      { id: 'sur', name: { ar: 'صور', en: 'Sur' }, lat: 22.5667, lng: 59.5289 },
      { id: 'buraimi', name: { ar: 'البريمي', en: 'Al Buraimi' }, lat: 24.2509, lng: 55.7933 },
    ],
  },
];
