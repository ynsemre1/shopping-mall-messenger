import malls from '../data/malls.json';

const EARTH_RADIUS_KM = 6371;

const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (value: number) => value * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c * 1000; // metre
};

export const getCurrentMall = (userLat: number, userLng: number) => {
  for (const mall of malls) {
    const distance = getDistanceInMeters(userLat, userLng, mall.center.lat, mall.center.lng);
    if (distance <= mall.radius) {
      return mall;
    }
  }
  return null;
};