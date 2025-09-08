export const GENDER_LIST = [
  {
    id: 1,
    name: 'Male',
  },
  {
    id: 2,
    name: 'Female',
  },
];
export const CAMPAIGN_INTERESTS = [
  { id: 1, name: 'Nature & Environment' },
  { id: 2, name: 'Health & Wellness' },
  { id: 3, name: 'Education & Learning' },
  { id: 4, name: 'Technology & Innovation' },
  { id: 5, name: 'Sports & Fitness' },
  { id: 6, name: 'Travel & Adventure' },
  { id: 7, name: 'Food & Nutrition' },
  { id: 8, name: 'Arts & Culture' },
  { id: 9, name: 'Business & Finance' },
  { id: 10, name: 'Fashion & Lifestyle' },
  { id: 11, name: 'Science & Research' },
  { id: 12, name: 'Music & Entertainment' },
  { id: 13, name: 'Politics & Social Issues' },
  { id: 14, name: 'Community & Volunteering' },
  { id: 15, name: 'Animals & Wildlife' },
  { id: 16, name: 'Gaming & Esports' },
  { id: 17, name: 'Parenting & Family' },
  { id: 18, name: 'Automotive & Transport' },
  { id: 19, name: 'Home & Interior Design' },
  { id: 20, name: 'Spirituality & Mindfulness' },
];
export const GET_COUNTRY_INFO = 'https://geoapi-hoskes.onrender.com/json.gp';
//get Address
export const GET_ADDRESS = (lat, long) =>
  `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}&zoom=18&addressdetails=1`;

//get Address List
export const GET_ADDRESS_LIST = (query, countryCode) =>
  `https://nominatim.openstreetmap.org/search?countrycodes=${countryCode}&addressdetails=1&q=${query}&format=jsonv2&polygon_geojson=1`;

export const MIN_AGE = 18;
export const MAX_AGE = 65;
