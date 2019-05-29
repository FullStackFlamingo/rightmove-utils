const { getDistance } = require('geolib');
const stationLongLat = require('../data/station_long_lat.json');

module.exports = (originStationCrs, { maxDistance = 8, useMiles = true } = {}) => {
  const ONE_MILE_KM = 1.60934;
  const start = stationLongLat.stations.find(station => station.crs === originStationCrs);

  return stationLongLat.stations
    .filter((station) => {
      const meters = getDistance(
        {
          latitude: start.lat,
          longitude: start.lon,
        },
        {
          latitude: station.lat,
          longitude: station.lon,
        },
      );
      const distance = useMiles ? meters / 1000 / ONE_MILE_KM : meters / 1000;
      return distance < maxDistance;
    })
    .sort((a, b) => {
      const metersA = getDistance(
        {
          latitude: start.lat,
          longitude: start.lon,
        },
        {
          latitude: a.lat,
          longitude: a.lon,
        },
      );
      const metersB = getDistance(
        {
          latitude: start.lat,
          longitude: start.lon,
        },
        {
          latitude: b.lat,
          longitude: b.lon,
        },
      );
      if (metersB > metersA) return -1;
      return 1;
    });
};
