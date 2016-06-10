/**
 * Error Messages
 */
module.exports = {
    schema: {
        error_1: {
            code: 400,
            message: 'Invalid schema'
        }
    },
    measurement: {
        error_1: {
            message: 'Invalid measurement distance'
        }
    },
    database: {
        error_1: {
            code: 500,
            message: 'Error fetching client from pool'
        },
        error_2: {
            code: 401,
            message: 'Error running query'
        },
        error_3: {
            code: 400,
            message: 'No valid query parameters'
        }
        error_4: {
          code: 404,
          message: 'Client not found'
        }
    },
    authentication: {
        error_1: {
            code: 401,
            message: 'Wrong password'
        },
        error_2: {
            code: 401,
            message: 'Failed to authenticate with this token'
        },
        error_3: {
            code: 401
        }
    },
    query: {
        error_1: {
            code: 404,
            message: 'User not found'
        },
        error_2: {
            code: 404,
            message: 'Sensor not found'
        },
        error_3: {
            code: 404,
            message: 'Measurement not found'
        },
        error_4: {
            code: 404,
            message: 'Threshold not found'
        },
        error_5: {
            code: 404,
            message: 'Subscription not found'
        },
        error_6: {
            code: 404,
            message: 'Timeserie not found'
        },
        error_7: {
            code: 404,
            message: 'Vehicle not found'
        },
        error_9: {
            code: 404,
            message: 'Latitude not found'
        },
        error_10: {
            code: 404,
            message: 'Longitude not found'
        },
        error_11: {
            code: 404,
            message: 'Language not found'
        }
    },
    development: {
        error_1: {
            code: 501,
            message: 'Not implemented'
        }
    }
};
