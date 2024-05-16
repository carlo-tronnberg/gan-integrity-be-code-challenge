const distanceTool = require('../../src/tools/distance');

describe('getDistanceFromLatLonInKm', () => {
  test('should return the distance between two GPS coordinates', () => {
    // Given 2 GPS coordinates
    const lat1 = -1.409358;
    const lon1 = -37.257104;
    const lat2 = -3.456789;
    const lon2 = -47.123456;
    // when calling getDistanceFromLatLonInKm
    const distance = distanceTool.getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
    // Then the distance is greater than 0
    expect(distance).toBe('1119.43');
  });
});
