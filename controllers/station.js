'use strict';

const logger = require('../utils/logger');
const stationStore = require('../models/station-store.js');
const uuid = require('uuid');
const stationAnalytics = require('../utils/station-analytics');
const metricConversion = require('../utils/metric-conversion');

const station = {
  index(request, response) {
    const stationId = request.params.id;
    logger.debug('Station id = ' + stationId);
    const station = stationStore.getStation(stationId);
    if (station.readings.length > 0) {
      stationAnalytics.updateWeather(station);
    }
    const viewData = {
      title: 'Station',
      station: station,
    };
    response.render('station', viewData);
  },

  addReading(request, response) {
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId);
    const newReading = {
      id: uuid.v1(),
      code: request.body.code,
      temp: request.body.temp,
      windSpeed: request.body.windSpeed,
      windDir: request.body.windDir,
      pressure: request.body.pressure,
      date: metricConversion.formatDate(new Date()),
    }
    stationStore.addReading(stationId, newReading);
    response.redirect('/station/' + stationId);
  },

  deleteReading(request, response) {
    const stationId = request.params.id;
    const readingId = request.params.readingid;
    logger.debug('Deleting reading ${readingId} from Playlist ${playlistId}');
    stationStore.removeReading(stationId, readingId);
    response.redirect('/station/' + stationId);
  },
};

module.exports = station;