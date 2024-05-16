'use strict';

const authenticateToken = (req, res, next) => {
  try {
    const authorizedToken = 'bearer dGhlc2VjcmV0dG9rZW4=';
    let token = req.headers.authorization;

    if (token === undefined || token != authorizedToken)
      throw new Error('Failed to authenticate!');
    next();
  } catch (e) {
    return res.status(401).send(e.message);
  }
};

module.exports = { authenticateToken };
