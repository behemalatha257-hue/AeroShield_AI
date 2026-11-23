/**
 * AeroShield AI - Input Validation Middleware
 * Validates request bodies and parameters against logical bounds.
 */

const validateIAQSimulation = (req, res, next) => {
  const { baseOutdoorPM25, roomVolumeM3, windowStatus } = req.body || {};

  if (baseOutdoorPM25 !== undefined) {
    const val = Number(baseOutdoorPM25);
    if (isNaN(val) || val < 0 || val > 1500) {
      return res.status(400).json({
        status: 400,
        error: 'Validation Error',
        message: 'baseOutdoorPM25 must be a valid number between 0 and 1500 µg/m³.'
      });
    }
  }

  if (roomVolumeM3 !== undefined) {
    const val = Number(roomVolumeM3);
    if (isNaN(val) || val < 5 || val > 2000) {
      return res.status(400).json({
        status: 400,
        error: 'Validation Error',
        message: 'roomVolumeM3 must be a valid room volume between 5 and 2000 m³.'
      });
    }
  }

  if (windowStatus !== undefined) {
    const validStates = ['closed', 'cracked', 'open', 'scheduled'];
    if (!validStates.includes(windowStatus)) {
      return res.status(400).json({
        status: 400,
        error: 'Validation Error',
        message: `windowStatus must be one of: ${validStates.join(', ')}.`
      });
    }
  }

  next();
};

const validateRoutineRequest = (req, res, next) => {
  const { currentAQI, household } = req.body || {};

  if (currentAQI !== undefined) {
    const val = Number(currentAQI);
    if (isNaN(val) || val < 0 || val > 1000) {
      return res.status(400).json({
        status: 400,
        error: 'Validation Error',
        message: 'currentAQI must be a number between 0 and 1000.'
      });
    }
  }

  if (household !== undefined && !Array.isArray(household)) {
    return res.status(400).json({
      status: 400,
      error: 'Validation Error',
      message: 'household must be an array of member identifier strings.'
    });
  }

  next();
};

const validateImpactRequest = (req, res, next) => {
  const { timeframeDays, dailyCommuteKm } = req.body || {};

  if (timeframeDays !== undefined) {
    const val = Number(timeframeDays);
    if (isNaN(val) || val < 1 || val > 365) {
      return res.status(400).json({
        status: 400,
        error: 'Validation Error',
        message: 'timeframeDays must be between 1 and 365 days.'
      });
    }
  }

  if (dailyCommuteKm !== undefined) {
    const val = Number(dailyCommuteKm);
    if (isNaN(val) || val < 0 || val > 500) {
      return res.status(400).json({
        status: 400,
        error: 'Validation Error',
        message: 'dailyCommuteKm must be between 0 and 500 km.'
      });
    }
  }

  next();
};

const validateChatRequest = (req, res, next) => {
  const { message } = req.body || {};
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      status: 400,
      error: 'Validation Error',
      message: 'A non-empty string "message" is required in request body.'
    });
  }

  if (message.length > 2000) {
    return res.status(400).json({
      status: 400,
      error: 'Validation Error',
      message: 'Message is too long (maximum 2000 characters allowed).'
    });
  }

  next();
};

module.exports = {
  validateIAQSimulation,
  validateRoutineRequest,
  validateImpactRequest,
  validateChatRequest
};
