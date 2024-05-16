'use strict';

const mongo = require('../../db/mongo.js');

module.exports = {
  async getCityCursor() {
    try {
      return mongo.collection('cities').find({});
    } catch (error) {
      return { error };
    }
  },

  async getCityByGUID(guid) {
    try {
      const result = await mongo
        .collection('cities')
        .findOne({ guid: guid }, { _id: 0 });

      return { result };
    } catch (error) {
      return { error };
    }
  },

  async getCityByTag(query) {
    const { tag, isActive } = query;

    if (tag == undefined || tag.trim().length === 0) {
      return { error: 'Invalid or missing query parameter' };
    }
    try {
      var result = await mongo
        .collection('cities')
        .find({
          isActive: isActive,
          tags: {
            $in: [query.tag],
          },
        })
        .toArray();

      return { result };
    } catch (error) {
      return { result: [] };
    }
  },
};
