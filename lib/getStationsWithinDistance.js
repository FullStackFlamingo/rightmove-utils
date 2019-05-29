const { getDistance } = require('geolib');
const stationLongLat = require('../data/station_long_lat.json');

module.exports = (originStationCrs, maxDistance = 8) => {
  const ONE_MILE_KM = 1.60934;
  const start = stationLongLat.stations.find(station => station.crs === originStationCrs);

  return stationLongLat.stations.filter((station) => {
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
    const distanceInMiles = (meters / 1000) / ONE_MILE_KM;
    return distanceInMiles < maxDistance;
  });
};
