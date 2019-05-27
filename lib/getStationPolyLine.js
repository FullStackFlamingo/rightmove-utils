const polyline = require('@mapbox/polyline');
const stationLongLat = require('../data/station_long_lat.json');

module.exports = (stationId) => {
  const station = stationLongLat.stations.find(
    item => item.crs.toLowerCase() === stationId.toLowerCase(),
  );
  if (!station) throw new Error(`cant find station from stationId '${stationId}'`);
  const dupes = [];
  // generate 5 points from station lat/lon to satisfy Rightmove map locationIdentifier
  for (let i = 0; i < 5; i += 1) {
    dupes.push([station.lat, station.lon]);
  }
  // encode into gmaps polyline format
  return polyline.encode(dupes);
};
