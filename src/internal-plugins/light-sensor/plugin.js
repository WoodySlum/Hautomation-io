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
            super(api, id, "LIGHT", configuration, api.exported.Icons.class.list()["sun-1"], 0);
            this.chartType = api.exported.Sensor.constants().CHART_TYPE_BAR;
            this.aggregationMode = api.exported.Sensor.constants().AGGREGATION_MODE_AVG;
            this.unit = api.translateAPI.t("light.unit.lux");
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