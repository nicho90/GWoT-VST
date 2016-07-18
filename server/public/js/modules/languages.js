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
        SENSOR: 'Sensor',
        SENSORS: 'Sensoren',
        THRESHOLDS: 'Schwellenwerte',
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
        SEARCH: 'Suche',

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
        DEVICE_ID: 'Geräte-ID',
        PRIVACY: 'Datenschutzeinstellungen',
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
        CROSSING_TYPE: 'Überquerungsart',
        MEASURE_FREQUENCY: 'Messinterval',
        DEFAULT: 'Standardeinstellung',
        DEFAULT_: 'Standardeinstellung',
        DANGER: 'bei erhöhtem Pegelstand',
        LONGITUDE: 'Longitude',
        LATITUDE: 'Latitude',
        THRESHOLD: 'Schwellenwert',
        INCREASED_FREQUENCY: 'Gefahrinterval aktiv',
        CREATED: 'Erstellt am',
        UPDATED: 'Zuletzt geändert am',
        SHOW_ON_MAP: 'Auf der Karte anzeigen',
        DISTANCE: 'Distanz',
        SEASONAL_DEPENDENCY: 'Saisonbedingt',
        WET_SEASON: 'Regenzeit',
        DRY_SEASON: 'Trockenzeit',
        WET_SEASON_BEGIN: 'Beginn der Regenzeit',
        WET_SEASON_END: 'Ende der Regenzeit',
        DRY_SEASON_BEGIN: 'Beginn der Trockenzeit',
        DRY_SEASON_END: 'Ende der Trockenzeit',
        SELECT_A_MONTH: 'Monat auswählen',
        SELECT_A_WATER_BODY: 'Gewässersystem auswählen',
        LOCATION: 'Position',
        YES: 'Yes',
        NO: 'No',

        JANUARY: 'Januar',
        FEBRUARY: 'Februar',
        MARCH: 'März',
        APRIL: 'April',
        MAY: 'Mai',
        JUNE: 'Juni',
        JULY: 'Juli',
        AUGUST: 'August',
        SEPTEMBER: 'September',
        OCTOBER: 'Oktober',
        NOVEMBER: 'November',
        DECEMBER: 'Dezember',

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
        WATER_BODY_TYPE: 'Gewässertyp',
        RIVER: 'Fluss',
        CHANNEL: 'Kanal',
        LAKE: 'See',

        NEARBY_SENSORS: 'Sensoren in der Nähe',
        SAME_WATER_BODY: 'vom gleichen Gewässersystem',
        NEARBY_EMERGENCY_STATIONS: 'Notrufstationen in der Nähe',
        NEARBY_SERVICE_STATIONS: 'Autowerkstätten in der Nähe',
        GERMANY: 'Deutschland',
        AUSTRALIA: 'Australien',

        PASSABLE: 'Passierbar',
        RISK: 'Risiko',
        HIGH_RISK: 'Hohes Risiko',
        N_A: 'Nicht verfügbar',
        EMERGENCY_STATION: 'Notrufstation',
        EMERGENCY_STATIONS: 'Notrufstationen',
        SERVICE_STATION: 'Autowerkstatt',
        SERVICE_STATIONS: 'Autowerkstätte',

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
        CATEGORY: 'Kategorie',

        HELP: 'Hilfe',
        ABOUT: 'Über',
        DEVELOPERS: 'Entwickler',
        DOCUMENTATION: 'Dokumentation',
        REST_API: 'REST-API',

        ALL: 'Alle',
        CREATE_NEW_SENSOR: 'Neuen Sensor erstellen',
        CREATE_NEW_THRESHOLD: 'Neuen Schwellenwert erstellen',
        BRAND: 'Marke',
        NAME: 'Name',
        VEHICLE_SUGGESTIONS: 'Fahrzeugvorschläge',
        INSERT: 'Eintragen',
        TYPE: 'Typ',
        PEDESTRIAN: 'Fußgänger',
        BIKE: 'Fahrrad',
        WHEELCHAIR: 'Rollstuhl',
        SCOOTER: 'Roller',
        MOTORBIKE: 'Motorrad',
        CAR: 'Auto',
        BUS: 'Bus',
        TRUCK: 'LKW',
        OTHER: 'Sonstiger',

        // MAP-BASELAYERS
        MAP_TILES_STREETS: 'Straßenansicht',
        MAP_TILES_SATELLITE: 'Satellitenansicht',
        MAP_TILES_SATELLITE_2: 'Hybridansicht',
        MAP_TILES_DARK: 'Nachtansicht',
        MAP_TILES_LIGHT: 'Tagansicht',

        // DIALOGS
        DIALOG_ATTENTION : 'Achtung',
        DIALOG_DELETE_SENSOR : 'Sind Sie sicher, dass Sie den Sensor ',
        DIALOG_DELETE_ALL_SENSORS : 'Sind Sie sicher, dass Sie alle Sensoren ',
        DIALOG_DELETE_THRESHOLD : 'Sind Sie sicher, dass Sie den Schwellenwert ',
        DIALOG_DELETE_ALL_THRESHOLDS : 'Sind Sie sicher, dass Sie alle Schwellenwerte ',
        DIALOG_DELETE_SUBSCRIPTION : 'Sind Sie sicher, dass Sie dieses Abo beenden möchten?',
        DIALOG_DELETE_ALL_SUBSCRIPTIONS : 'Sind Sie sicher, dass Sie alle Abos beenden möchten?',
        DIALOG_DELETE_END : ' löschen möchten?'

    });


    /**
     * English
     */
    $translateProvider.translations('en_US', {

        WELCOME: 'Welcome',
        HOME: 'Home',
        SENSOR: 'Sensor',
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
        SEARCH: 'Search',

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
        PRIVACY: 'Privacy',
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
        CROSSING_TYPE: 'Crossing type',
        MEASURE_FREQUENCY: 'Measuring interval',
        DEFAULT: 'default interval',
        DEFAULT_: 'default',
        DANGER: 'at increased water level',
        LONGITUDE: 'Longitude',
        LATITUDE: 'Latitude',
        THRESHOLD: 'Threshold',
        INCREASED_FREQUENCY: 'Frequency increased',
        CREATED: 'Created',
        UPDATED: 'Last updated',
        SHOW_ON_MAP: 'Show on map',
        DISTANCE: 'Distance',
        SEASONAL_DEPENDENCY: 'Seasonal dependency',
        WET_SEASON: 'Wet season',
        DRY_SEASON: 'Dry season',
        WET_SEASON_BEGIN: 'Begin of the wet season',
        WET_SEASON_END: 'End of the wet season',
        DRY_SEASON_BEGIN: 'Begin of the dry season',
        DRY_SEASON_END: 'End of the dry season',
        SELECT_A_MONTH: 'Select a month',
        SELECT_A_WATER_BODY: 'Select a water body',
        LOCATION: 'Location',
        YES: 'Yes',
        NO: 'No',

        JANUARY: 'January',
        FEBRUARY: 'February',
        MARCH: 'March',
        APRIL: 'April',
        MAY: 'May',
        JUNE: 'June',
        JULY: 'July',
        AUGUST: 'August',
        SEPTEMBER: 'September',
        OCTOBER: 'October',
        NOVEMBER: 'November',
        DECEMBER: 'December',

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
        WATER_BODY_TYPE: 'Water body type',
        RIVER: 'River',
        CHANNEL: 'Channel',
        LAKE: 'Lake',

        NEARBY_SENSORS: 'Nearby Sensors',
        SAME_WATER_BODY: 'of the same Water Body',
        NEARBY_EMERGENCY_STATIONS: 'Nearby Emergency-Stations',
        NEARBY_SERVICE_STATIONS: 'Nearby Service-Stations',
        GERMANY: 'Germany',
        AUSTRALIA: 'Australia',

        PASSABLE: 'Passable',
        RISK: 'Risk',
        HIGH_RISK: 'High risk',
        N_A: 'n/a',
        EMERGENCY_STATION: 'Emergency station',
        EMERGENCY_STATIONS: 'Emergency stations',
        SERVICE_STATION: 'Service station',
        SERVICE_STATIONS: 'Service stations',

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
        CATEGORY: 'Category',

        HELP: 'Help',
        ABOUT: 'About',
        DEVELOPERS: 'Developers',
        DOCUMENTATION: 'Documentation',
        REST_API: 'REST-API',

        ALL: 'All',
        CREATE_NEW_SENSOR: 'Create new Sensor',
        CREATE_NEW_THRESHOLD: 'Create new Threshold',
        BRAND: 'Brand',
        NAME: 'Name',
        VEHICLE_SUGGESTIONS: 'Vehicle suggestions',
        INSERT: 'Insert',
        TYPE: 'Type',
        PEDESTRIAN: 'Pedestrian',
        BIKE: 'Bike',
        WHEELCHAIR: 'Wheelchair',
        SCOOTER: 'Scooter',
        MOTORBIKE: 'Motorbike',
        CAR: 'Car',
        BUS: 'Bus',
        TRUCK: 'Truck',
        OTHER: 'Other',

        // MAP-BASELAYERS
        MAP_TILES_STREETS: 'Streets',
        MAP_TILES_SATELLITE: 'Satellite',
        MAP_TILES_SATELLITE_2: 'Hybridview',
        MAP_TILES_DARK: 'Nightview',
        MAP_TILES_LIGHT: 'Dayview',

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
