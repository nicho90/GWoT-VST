var app = angular.module("languages", [ "config" ]);

/**
 * Translate Provider
 */
app.config(function($translateProvider, config) {


    /**
     * German
     */
    $translateProvider.translations('de_DE', {

        WELCOME: 'Willkommen',
        HOME: 'Startseite',
        SENSORS: 'Sensoren',
        THRESHOLDS: 'Grenzwerte',
        LOGIN: 'Login',
        SIGN_UP: 'Registrieren',
        REGISTRATION: 'Registrierung',
        USERNAME: 'Nutzername',
        PASSWORD: 'Password',
        EMAIL_ADDRESS: 'Email-Adresse',
        FIRST_NAME: 'Vorname',
        LAST_NAME: 'Nachname',
        LANGUAGE: 'Sprache',
        ENGLISH: 'English',
        GERMAN: 'Deutsch',
        NONE: 'keine',
        CANCEL: 'Abbrechen',
        SUBMIT: 'Senden',
        CREATE: 'Erstellen',
        SETTINGS: 'Einstellungen',
        LOGOUT: 'Logout',

        DESCRIPTION: 'Beschreibung',
        GENERAL: 'Allgemein',
        TIMESERIES: 'Zeitreihe',
        REAL_TIME_DATA: 'Echtzeit-Daten',
        SUBSCRIPTIONS: 'Abonnements',
        DETAILS: 'Details',
        ONLINE: 'Online',
        ONLINE_: 'online',
        OFFLINE: 'Offline',
        OFFLINE_: 'offline',
        DEVICE_ID: 'Geräte ID',
        PRIVATE: 'Privat',
        PUBLIC: 'Öffentlich',
        COORDINATES: 'Koordinaten',
        MEASURED_FROM: 'gemessen von der',
        SENSOR_HEIGHT: 'Sensorhöhe',
        SENSOR_THRESHOLD_HEIGHT: 'Sensorschwellenwert',
        GAUGE_ZERO: 'Fluss-Null-Linie',
        CROSSING_HEIGHT: 'Überquerungshöhe',
        WARNING_THRESHOLD: 'Bedenklicher Schwellenwert',
        CRITICAL_THRESHOLD: 'Kritischer Schwellenwert',
        FLOODWAY: 'Floodway',
        OR: 'oder',
        BRIDGE: 'Brücke',
        MEASURE_FREQUENCY: 'Messinterval',
        DEFAULT: 'Standardeinstellung',
        DANGER: 'bei erhöhtem Pegelstand',
        LONGITUDE: 'Longitude',
        LATITUDE: 'Latitude',
        THRESHOLD: 'Schwellenwert',
        INCREASED_FREQUENCY: 'Gefahrinterval aktiv',
        CREATED: 'Erstellt am',
        UPDATED: 'Zuletzt geändert am',
        SHOW_ON_MAP: 'Auf der Karte anzeigen',
        DISTANCE: 'Distanz',

        CENTIMETER: 'Zentimeter',
        METER: 'Meter',
        KILOMETER: 'Kilometer',
        MILLISECOND: 'Millisekunde',
        MILLISECONDS: 'Millisekunden',
        SECOND: 'Sekunde',
        SECONDS: 'Sekunden',
        MINUTE: 'Minute',
        MINUTES: 'Minuten',
        HOUR: 'Stunde',
        HOURS: 'Stunden',
        DAY: 'Tag',
        DAYS: 'Tage',
        WEEK: 'Woche',
        WEEKS: 'Wochen',
        MONTH: 'Monat',
        MONTHS: 'Monate',
        YEAR: 'Jahr',
        YEARS: 'Jahre',

        WATER_BODY: 'Gewässersystem',
        WATER_BODIES: 'Gewässersysteme',
        RIVER: 'Fluss',
        CHANNEL: 'Kanal',
        LAKE: 'See',

        NEARBY_SENSORS: 'Sensoren in der Nähe',
        SAME_WATER_BODY: 'vom gleichen Gewässersystem',
        NEARBY_EMERGENCY_STATIONS: 'Notrufstationen in der Nähe',
        NEARBY_SERVICE_STATIONS: 'Autowerkstätten in der Nähe',
        GERMANY: 'Deutschland',

        PASSABLE: 'Passierbar',
        RISK: 'Risiko',
        HIGH_RISK: 'Hohes Risiko',
        N_A: 'Nicht verfügbar',
        EMERGENCY_STATION: 'Notrufstation',
        SERIVE_STATION: 'Autowerkstatt',

        WATER_LEVEL: 'Pegelstand',
        WATER_LEVELS: 'Pegelstände',
        LAST_WATER_LEVEL: 'Letzer Pegelstand',
        STATISTICS: 'Statistik',
        MEASURED: 'Gemessen um',
        MAXIMUM: 'Maximum',
        MINIMUM: 'Minimum',
        AVERAGE: 'Durchschnitt',
        STD: 'Standardabweichung',

        WEATHER_FORECAST: 'Wettervorhersage',
        SHOW_MEASUREMENTS: 'Show measurements',
        HIDE_MEASUREMENTS: 'Hide measurements',
        CURRENTLY: 'Aktuell',
        TODAY: 'Heute',
        TOMORROW: 'Morgen',
        Monday: 'Montag',
        Tuesday: 'Dienstag',
        Wednesday: 'Mittwoch',
        Thursday: 'Donnerstag',
        Friday: 'Freitag',
        Saturday: 'Samstag',
        Sunday: 'Sonntag',
        NEXT_HOURS: 'Die nächsten Stunden',
        NEXT_DAYS: 'Die nächsten Tage',

        SUBSCRIBED: 'Abonniert',
        SUBSCRIBE: 'Abonnieren',
        UNSUBSCRIBE: 'Abo beenden',

        WARNING_NOTIFICATION: 'Warnung',
        CRITICAL_NOTIFICATION: 'Gefahr',
        SENSOR_NOTIFICATION: 'Sensor',
        HEIGHT_NOTIFICATION: 'Höhe',
        DESCRIPTION_NOTIFICATION: 'Beschreibung',
        CATEGORY_NOTIFICATION: 'Kategorie',

        HELP: 'Hilfe',
        ABOUT: 'Über',
        DEVELOPERS: 'Entwickler',
        DOCUMENTATION: 'Dokumentation',
        REST_API: 'REST-API',

        ALL: 'Alle',

        // DIALOGS
        DIALOG_ATTENTION : 'Achtung',
        DIALOG_DELETE_SENSOR : 'Sind Sie sicher, dass Sie den Sensor ',
        DIALOG_DELETE_ALL_SENSORS : 'Sind Sie sicher, dass Sie alle Sensoren ',
        DIALOG_DELETE_THRESHOLD : 'Sind Sie sicher, dass Sie den Schwellenwert ',
        DIALOG_DELETE_ALL_THRESHOLDS : 'Sind Sie sicher, dass Sie alle Schwellenwerte ',
        DIALOG_DELETE_ALL_SUBSCRIPTION : 'Sind Sie sicher, dass Sie dieses Abo beenden möchten?',
        DIALOG_DELETE_ALL_SUBSCRIPTIONS : 'Sind Sie sicher, dass Sie alle Abos beenden möchten?',
        DIALOG_DELETE_END : ' löschen möchten?'

    });


    /**
     * English
     */
    $translateProvider.translations('en_US', {

        WELCOME: 'Welcome',
        HOME: 'Home',
        SENSORS: 'Sensors',
        THRESHOLDS: 'Thresholds',
        LOGIN: 'Login',
        SIGN_UP: 'Sign up',
        REGISTRATION: 'Registration',
        USERNAME: 'Username',
        PASSWORD: 'Password',
        EMAIL_ADDRESS: 'Email-address',
        FIRST_NAME: 'First name',
        LAST_NAME: 'Last name',
        LANGUAGE: 'Language',
        ENGLISH: 'English',
        GERMAN: 'German',
        NONE: 'none',
        CANCEL: 'Cancel',
        SUBMIT: 'Submit',
        CREATE: 'Create',
        SETTINGS: 'Settings',
        LOGOUT: 'Logout',

        DESCRIPTION: 'Description',
        GENERAL: 'General',
        TIMESERIES: 'Timeseries',
        REAL_TIME_DATA: 'Real-time-data',
        SUBSCRIPTIONS: 'Subscriptions',
        DETAILS: 'Details',
        ONLINE: 'Online',
        ONLINE_: 'online',
        OFFLINE: 'Offline',
        OFFLINE_: 'offline',
        DEVICE_ID: 'Device-ID',
        PRIVATE: 'Private',
        PUBLIC: 'Public',
        COORDINATES: 'Coordinates',
        MEASURED_FROM: 'measured from the',
        SENSOR_HEIGHT: 'Sensor height',
        SENSOR_THRESHOLD_HEIGHT: 'Sensor threshold height',
        GAUGE_ZERO: 'Gauge Zero',
        CROSSING_HEIGHT: 'Crossing height',
        WARNING_THRESHOLD: 'Warning threshold',
        CRITICAL_THRESHOLD: 'Critical threshold',
        FLOODWAY: 'Floodway',
        OR: 'or',
        BRIDGE: 'Bridge',
        MEASURE_FREQUENCY: 'Measuring interval',
        DEFAULT: 'default interval',
        DANGER: 'at increased water level',
        LONGITUDE: 'Longitude',
        LATITUDE: 'Latitude',
        THRESHOLD: 'Threshold',
        INCREASED_FREQUENCY: 'Frequency increased',
        CREATED: 'Created',
        UPDATED: 'Last updated',
        SHOW_ON_MAP: 'Show on map',
        DISTANCE: 'Distance',

        CENTIMETER: 'Centimeter',
        METER: 'Meter',
        KILOMETER: 'Kilometer',
        MILLISECOND: 'Millisecond',
        MILLISECONDS: 'Milliseconds',
        SECOND: 'Second',
        SECONDS: 'Seconds',
        MINUTE: 'Minute',
        MINUTES: 'Minutes',
        HOUR: 'Hour',
        HOURS: 'Hours',
        DAY: 'Day',
        DAYS: 'Days',
        WEEK: 'Week',
        WEEKS: 'Weeks',
        MONTH: 'Month',
        MONTHS: 'Months',
        YEAR: 'Year',
        YEARS: 'Years',

        WATER_BODY: 'Water body',
        WATER_BODIES: 'Water bodies',
        RIVER: 'River',
        CHANNEL: 'Channel',
        LAKE: 'Lake',

        NEARBY_SENSORS: 'Nearby Sensors',
        SAME_WATER_BODY: 'of the same Water Body',
        NEARBY_EMERGENCY_STATIONS: 'Nearby Emergency-Stations',
        NEARBY_SERVICE_STATIONS: 'Nearby Service-Stations',
        GERMANY: 'Germany',

        PASSABLE: 'Passable',
        RISK: 'Risk',
        HIGH_RISK: 'High risk',
        N_A: 'n/a',
        EMERGENCY_STATION: 'Emergency station',
        SERIVE_STATION: 'Service station',

        WATER_LEVEL: 'Water level',
        WATER_LEVELS: 'Water levels',
        LAST_WATER_LEVEL: 'Last water level',
        STATISTICS: 'Statistics',
        MEASURED: 'Measured',
        MAXIMUM: 'Maximum',
        MINIMUM: 'Minimum',
        AVERAGE: 'Average',
        STD: 'Standard deviation',

        WEATHER_FORECAST: 'Weather forecast',
        SHOW_MEASUREMENTS: 'Show measurements',
        HIDE_MEASUREMENTS: 'Hide measurements',
        CURRENTLY: 'Currently',
        TODAY: 'Today',
        TOMORROW: 'Tomorrow',
        Monday: 'Monday',
        Tuesday: 'Tuesday',
        Wednesday: 'Wednesday',
        Thursday: 'Thursday',
        Friday: 'Friday',
        Saturday: 'Saturday',
        Sunday: 'Sunday',
        NEXT_HOURS: 'Next hours',
        NEXT_DAYS: 'Next days',

        SUBSCRIBED: 'Subscribed',
        SUBSCRIBE: 'Subscribe',
        UNSUBSCRIBE: 'Unsubscribe',

        WARNING_NOTIFICATION: 'Warning',
        CRITICAL_NOTIFICATION: 'Danger',
        SENSOR_NOTIFICATION: 'Sensor',
        HEIGHT_NOTIFICATION: 'Height',
        DESCRIPTION_NOTIFICATION: 'Description',
        CATEGORY_NOTIFICATION: 'Category',

        HELP: 'Help',
        ABOUT: 'About',
        DEVELOPERS: 'Developers',
        DOCUMENTATION: 'Documentation',
        REST_API: 'REST-API',

        ALL: 'All',

        // DIALOGS
        DIALOG_ATTENTION : 'Attention',
        DIALOG_DELETE_SENSOR : 'Are you sure, that you want to the delete the Sensor ',
        DIALOG_DELETE_ALL_SENSORS : 'Are you sure, that you want to the delete all Sensors ',
        DIALOG_DELETE_THRESHOLD : 'Are you sure, that you want to the delete the Threshold',
        DIALOG_DELETE_ALL_THRESHOLDS : 'Are you sure, that you want to the delete all Thresholds ',
        DIALOG_DELETE_ALL_SUBSCRIPTION : 'Are you sure, that you want to the unsubscribe?',
        DIALOG_DELETE_ALL_SUBSCRIPTIONS : 'Are you sure, that you want to unsubscribe to all Sensors?',
        DIALOG_DELETE_END : ' ?'

    });


    // Set Default Language (English)
    $translateProvider.preferredLanguage(config.appLanguage);
});
