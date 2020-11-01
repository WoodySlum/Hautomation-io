"use strict";
/**
 * Loaded function
 *
 * @param  {PluginAPI} api The api
 */
function loaded(api) {
    api.init();

    /**
     * This class is extended by throughput sensors
     * @class
     */
    class LightSensorForm extends api.exported.SensorForm {
        /**
         * Convert JSON data to object
         *
         * @param  {Object} data Some data
         * @returns {LightSensorForm}      An instance
         */
        json(data) {
            return new LightSensorForm(data.id, data.plugin, data.name, data.dashboard, data.statistics, data.dashboardColor, data.statisticsColor);
        }
    }

    api.sensorAPI.registerForm(LightSensorForm);

    /**
     * This class is overloaded by sensors
     * @class
     */
    class LightSensor extends api.exported.Sensor {
        /**
         * Light sensor class (should be extended)
         *
         * @param  {PluginAPI} api                                                           A plugin api
         * @param  {number} [id=null]                                                        An id
         * @param  {Object} [configuration=null]                                             The configuration for sensor
         * @returns {LightSensor}                                                       The instance
         */
        constructor(api, id, configuration) {
            // Credits : Eucalyp / https://www.flaticon.com/free-icon/resistor_2861482
            const svg = "<svg id=\"Layer_5\" enable-background=\"new 0 0 64 64\" height=\"512\" viewBox=\"0 0 64 64\" width=\"512\" xmlns=\"http://www.w3.org/2000/svg\"><g><path d=\"m40 1h-16c-7.168 0-13 5.832-13 13v2 2 4c0 5.004 2.846 9.349 7 11.521v26.479c0 1.654 1.346 3 3 3s3-1.346 3-3v-25h16v25c0 1.654 1.346 3 3 3s3-1.346 3-3v-26.479c4.154-2.172 7-6.517 7-11.521v-4-2-2c0-7.168-5.832-13-13-13zm-27 13c0-6.065 4.935-11 11-11h1v4h11c.552 0 1 .449 1 1s-.448 1-1 1h-11v6h11c.552 0 1 .449 1 1s-.448 1-1 1h-11v6h11c.552 0 1 .449 1 1s-.448 1-1 1h-11v4h-1c-6.065 0-11-4.935-11-11v-2zm9 46c0 .552-.448 1-1 1s-1-.448-1-1v-25.636c.645.209 1.315.359 2 .466zm22 0c0 .552-.448 1-1 1s-1-.448-1-1v-25.17c.685-.107 1.355-.257 2-.466zm-4-27h-16c-4.664 0-8.648-2.922-10.246-7.027 2.381 3.053 6.083 5.027 10.246 5.027h16c4.163 0 7.865-1.974 10.246-5.027-1.598 4.105-5.582 7.027-10.246 7.027zm11-15c0 6.065-4.935 11-11 11h-13v-2h9c1.654 0 3-1.346 3-3s-1.346-3-3-3h-9v-2h9c1.654 0 3-1.346 3-3s-1.346-3-3-3h-9v-2h9c1.654 0 3-1.346 3-3s-1.346-3-3-3h-9v-2h13c6.065 0 11 4.935 11 11v2z\"/><path d=\"m20 19c1.654 0 3-1.346 3-3s-1.346-3-3-3-3 1.346-3 3 1.346 3 3 3zm0-4c.552 0 1 .449 1 1s-.448 1-1 1-1-.449-1-1 .448-1 1-1z\"/><path d=\"m44 13c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3zm0 4c-.552 0-1-.449-1-1s.448-1 1-1 1 .449 1 1-.448 1-1 1z\"/></g></svg>";
            super(api, id, "LIGHT", configuration, svg, 0);
            this.chartType = api.exported.Sensor.constants().CHART_TYPE_BAR;
            this.aggregationMode = api.exported.Sensor.constants().AGGREGATION_MODE_AVG;
            this.unit = api.translateAPI.t("light.unit.lux");
            this.addClassifier(null, 100, 100);
            this.addClassifier(101, 500, 500);
            this.addClassifier(501, 1000, 1000);
            this.addClassifier(1001, 3000, 3000);
            this.addClassifier(3001, null, 5000);
        }
    }

    api.sensorAPI.registerClass(LightSensor);
}

module.exports.attributes = {
    loadedCallback: loaded,
    name: "light-sensor",
    version: "0.0.0",
    category: "sensor-base",
    description: "Light Sensor base plugin",
    dependencies:["sensor"]
};
