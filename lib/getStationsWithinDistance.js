const { getDistance } = require('geolib');
const stationLongLat = require('../data/station_long_lat.json');

module.exports = (originStationCrs, { maxDistance = 8, useMiles = true } = {}) => {
  const ONE_MILE_KM = 1.60934;
  const origin = stationLongLat.stations.find(station => station.crs === originStationCrs);
  const originLatLon = {
    latitude: origin.lat,
    longitude: origin.lon,
  };
  return stationLongLat.stations
    .filter((station) => {
      const meters = getDistance(originLatLon, {
        latitude: station.lat,
        longitude: station.lon,
      });
      const distance = useMiles ? meters / 1000 / ONE_MILE_KM : meters / 1000;
      return distance < maxDistance;
    })
    .map((station) => {
      const meters = getDistance(originLatLon, {
        latitude: station.lat,
        longitude: station.lon,
      });
      const distance = useMiles ? meters / 1000 / ONE_MILE_KM : meters / 1000;
      return {
        ...station,
        distanceFrom: {
          crs: originStationCrs,
          distance,
          unit: useMiles ? 'miles' : 'kilometers',
        },
      };
    })
    .sort((a, b) => {
      const metersA = getDistance(originLatLon, {
        latitude: a.lat,
        longitude: a.lon,
      });
      const metersB = getDistance(originLatLon, {
        latitude: b.lat,
        longitude: b.lon,
      });
      if (metersB > metersA) return -1;
      return 1;
    });
};
