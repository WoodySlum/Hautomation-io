"use strict";
const PrivateProperties = require("./../PrivateProperties");
const DbHelper = require("./../../dbmanager/DbHelper");
const DbSchemaConverter = require("./../../dbmanager/DbSchemaConverter");

/**
 * Public API for database
 *
 * @class
 */
class DatabaseAPI {
    /* eslint-disable */
    // /**
    //  * Constructor
    //  *
    //  * @param  {DbManager} dbManager The database manager instance
    //  * @param  {string} previousVersion The previous plugin version
    //  * @returns {DatabaseAPI}             The instance
    //  */
    constructor(dbManager, previousVersion) {
        PrivateProperties.createPrivateState(this);
        PrivateProperties.oprivate(this).dbManager = dbManager;
        PrivateProperties.oprivate(this).previousVersion = previousVersion;
        this.registeredSchema = null;
        PrivateProperties.oprivate(this).optimizations = {};

    }
    /* eslint-enable */

    /**
     * Add index optimizations. Should be called before register call.
     *
     * @param  {DbObject} dbObjectClass A class extending DbObject
     * @param  {string} name    An index name
     * @param  {...string} fields     A list of fields to optimize
     */
    addOptimization(dbObjectClass, name, ...fields) {
        const table = DbSchemaConverter.class.tableName(dbObjectClass);
        if (!PrivateProperties.oprivate(this).optimizations[table]) {
            PrivateProperties.oprivate(this).optimizations[table] = {};
        }

        PrivateProperties.oprivate(this).optimizations[table][name] = [];

        fields.forEach((field) => {
            PrivateProperties.oprivate(this).optimizations[table][name].push(field);
        });
    }

    /**
     * Register database object and create associated schema (annotations)
     *
     * @param  {DbObject} dbObjectClass A class extending DbObject
     * @param  {Function} [cb=null] A callback with an error in parameter : `(err) => {}`
     */
    register(dbObjectClass, cb = null) {
        this.registeredSchema = DbSchemaConverter.class.toSchema(dbObjectClass);
        PrivateProperties.oprivate(this).dbManager.initSchema(this.registeredSchema, PrivateProperties.oprivate(this).previousVersion, cb, PrivateProperties.oprivate(this).optimizations);

    }

    /**
     * Creates a new DbHelper object.
     * Call the `schema(...)` method before calling this one.
     * The DbHelper object allows you to create, update, delete or execute queries on the database
     *
     * @param {DbObject} dbObjectClass A database object extended class with annotations. Please read documentation
     * @returns {DbHelper}             A DbHelper object
     */
    dbHelper(dbObjectClass) {
        if (this.registeredSchema) {
            return new DbHelper.class(PrivateProperties.oprivate(this).dbManager, this.registeredSchema, DbSchemaConverter.class.tableName(dbObjectClass), dbObjectClass);
        } else {
            throw Error("Call register() method first");
        }
    }
}

module.exports = {class:DatabaseAPI};
