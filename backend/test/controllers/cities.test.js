describe('getDistanceFromLatLonInKm', () => {
  // getCityCursor returns an error object when mongo.collection throws an error
  it('should return an error object when mongo.collection throws an error', async () => {
    const error = new Error('Mongo error');
    const mockCollection = {
      find: jest.fn().mockImplementation(() => {
        throw error;
      }),
    };

    const mockMongo = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    jest.mock('../../db/mongo.js', () => mockMongo);

    const { getCityCursor } = require('../../src/controllers/cities.js');
    const result = await getCityCursor();

    expect(result).toEqual({ error });
    expect(mockMongo.collection).toHaveBeenCalledWith('cities');
    expect(mockCollection.find).toHaveBeenCalledWith({});
  });

  // getCityByGUID returns an error object when mongo.findOne throws an error
  it('should return an error object when mongo.findOne throws an error', async () => {
    const error = new Error('Mongo findOne error');
    const mockCollection = { findOne: jest.fn().mockRejectedValue(error) };
    const mockMongo = { collection: jest.fn().mockReturnValue(mockCollection) };
    jest.mock('../../db/mongo.js', () => mockMongo);

    const { getCityByGUID } = require('../../src/controllers/cities.js');
    const result = await getCityByGUID('guid');

    expect(result).toEqual({ error });
    expect(mockMongo.collection).toHaveBeenCalledWith('cities');
    expect(mockCollection.findOne).toHaveBeenCalledWith(
      { guid: 'guid' },
      { _id: 0 },
    );
  });

  // Should handle invalid or missing query parameter
  it('should handle invalid or missing query parameter when query parameter is missing', async () => {
    // Mock the mongo.collection('cities').find().toArray() method
    const mockFind = jest
      .fn()
      .mockReturnValue(
        Promise.resolve([{ city: 'City A' }, { city: 'City B' }]),
      );
    const mockCollection = jest.fn().mockReturnValue({ find: mockFind });
    const mockMongo = { collection: mockCollection };
    jest.mock('../../db/mongo.js', () => mockMongo);

    // Import the method
    const { getCityByTag } = require('../../src/controllers/cities.js');

    // Set up the query parameters
    const query = {};

    // Call the method
    const result = await getCityByTag(query);

    // Assertions
    expect(mockCollection).not.toHaveBeenCalled();
    expect(mockFind).not.toHaveBeenCalled();
    expect(result).toEqual({ error: 'Invalid or missing query parameter' });
  });

  // Should handle invalid or missing tag parameter
  it('should handle invalid or missing tag parameter when query has whitespace tag parameter', async () => {
    // Import the method
    const { getCityByTag } = require('../../src/controllers/cities.js');

    // Set up the query parameters
    const query = {
      isActive: true,
      tag: '   ',
    };

    // Call the method
    const result = await getCityByTag(query);

    // Assertions
    expect(result).toEqual({ error: 'Invalid or missing query parameter' });
  });

  it('should return an empty array when no cities match the given tag and isActive status', async () => {
    // Mock the mongo.collection('cities').find().toArray() method
    const mockFind = jest.fn().mockReturnValue(Promise.resolve([]));
    const mockCollection = jest.fn().mockReturnValue({ find: mockFind });
    const mockMongo = { collection: mockCollection };
    jest.mock('../../db/mongo.js', () => mockMongo);

    // Import the method
    const { getCityByTag } = require('../../src/controllers/cities.js');

    // Set up the query parameters
    const query = {
      isActive: true,
      tag: 'tagA',
    };

    // Call the method
    const result = await getCityByTag(query);

    // Assertions
    expect(mockCollection).toHaveBeenCalledWith('cities');
    expect(mockFind).toHaveBeenCalledWith({
      isActive: true,
      tags: { $in: ['tagA'] },
    });
    expect(result).toEqual({ result: [] });
  });

  // getCityByTag returns all cities with the given tag and isActive status
  it('should return all cities with the given tag and isActive status', async () => {
    // Given
    const query = {
      tag: 'testTag',
      isActive: true,
    };

    const expectedCities = [
      { name: 'City1', isActive: true, tags: ['testTag'] },
      { name: 'City2', isActive: true, tags: ['testTag'] },
      { name: 'City3', isActive: true, tags: ['testTag'] },
    ];

    const mockCollection = {
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue(expectedCities),
    };

    const mockMongo = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    jest.mock('../../db/mongo.js', () => mockMongo);

    const { getCityByTag } = require('../../src/controllers/cities');

    // When
    const result = await getCityByTag(query);

    // Then
    expect(mockMongo.collection).toHaveBeenCalledWith('cities');
    expect(mockCollection.find).toHaveBeenCalledWith({
      isActive: true,
      tags: { $in: ['testTag'] },
    });
    //expect(mockCollection.toArray).toHaveBeenCalled();
    expect(result).toEqual({ result: expectedCities });
  });

  // getCityByGUID returns the city with the given GUID
  it('should return the city with the given GUID', async () => {
    const guid = 'testGUID';
    const expectedCity = { name: 'Test City', guid: 'testGUID' };

    const mockCollection = {
      findOne: jest.fn().mockResolvedValue(expectedCity),
    };

    const mockMongo = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    jest.mock('../../db/mongo.js', () => mockMongo);

    const { getCityByGUID } = require('../../src/controllers/cities');

    const result = await getCityByGUID(guid);

    expect(mockMongo.collection).toHaveBeenCalledWith('cities');
    expect(mockCollection.findOne).toHaveBeenCalledWith(
      { guid: guid },
      { _id: 0 },
    );
    expect(result).toEqual({ result: expectedCity });
  });

  // getCityCursor returns a cursor with all cities
  it('should return a cursor with all cities', async () => {
    const expectedCursor = {};

    const mockCollection = {
      find: jest.fn().mockReturnValue(expectedCursor),
    };

    const mockMongo = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    jest.mock('../../db/mongo.js', () => mockMongo);

    const { getCityCursor } = require('../../src/controllers/cities');

    const result = await getCityCursor();

    expect(mockMongo.collection).toHaveBeenCalledWith('cities');
    expect(mockCollection.find).toHaveBeenCalledWith({});
    expect(result).toEqual(expectedCursor);
  });
});
