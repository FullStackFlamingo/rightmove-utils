const getRightmoveQuery = require('../../lib/getRightmoveQuery');
const getStationPolyLine = require('../../lib/getStationPolyLine');

const stationPolyLineKWG = 'cfeyH~sv@????????';

describe('rightmove utils', () => {
  it('generates a polyLine encode from a stationId compatible with gmaps', async () => {
    const result = await getStationPolyLine('KWG');
    expect(result).toBe(stationPolyLineKWG);
  });
  it('generates a rightmove query string and adds a valid locationIdentifier from a stationId', async () => {
    const result = await getRightmoveQuery({ stationId: 'KWG' });
    expect(result.indexOf('&locationIdentifier=USERDEFINEDAREA^{"polylines":') !== -1).toBe(true);
  });
});
