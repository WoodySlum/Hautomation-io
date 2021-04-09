"use strict";

const request = require("request");
const ROBONECT_REGISTER_KEY = "robonect-all";

/**
 * Loaded function
 *
 * @param  {PluginAPI} api The api
 */
function loaded(api) {
    api.init();

    /**
     * This class manage robonect form
     *
     * @class
     */
    class RobonectForm extends api.exported.FormObject.class {
        /**
         * Constructor
         *
         * @param  {number} id The identifier
         * @param  {string} ip Ip
         * @param  {string} username Username
         * @param  {string} password Password
         * @returns {RobonectForm}        The instance
         */
        constructor(id, ip, username, password) {
            super(id);

            /**
             * @Property("ip");
             * @Type("string");
             * @Title("robonect.ip");
             */
            this.ip = ip;

            /**
             * @Property("username");
             * @Type("string");
             * @Title("robonect.username");
             */
            this.username = username;

            /**
             * @Property("password");
             * @Type("string");
             * @Title("robonect.password");
             * @Display("password");
             */
            this.password = password;
        }


        /**
         * Rsync form
         *
         * @param  {object} data Some data
         * @returns {RobonectForm}      An instance
         */
        json(data) {
            return new RobonectForm(data.id, data.ip, data.username, data.password);
        }
    }

    api.configurationAPI.register(RobonectForm);

    /**
     * This class manage Robonect actions
     *
     * @class
     */
    class Robonect {
        /**
         * Constructor
         *
         * @param  {PluginAPI} api The core APIs
         * @returns {Robonect}        The instance
         */
        constructor(api) {
            this.api = api;
            this.api.webAPI.register(this, this.api.webAPI.constants().POST, ":/" + ROBONECT_REGISTER_KEY + "/[set*]/[action*]/", api.webAPI.Authentication().AUTH_USAGE_LEVEL);
            this.hours = null;
            this.blades = null;

            this.api.configurationAPI.setUpdateCb(() => {
                this.refresh();
            });

            this.api.timeEventAPI.register(() => {
                this.refresh();
            }, this, this.api.timeEventAPI.constants().EVERY_FIVE_MINUTES);
            this.refresh();
        }

        /**
         * Refresh data
         */
        refresh() {
            this.getVersion((err, res) => {
                setTimeout((self) => {
                    self.getStatus((err2, res2) => {
                        if (!err && !err2) {
                            if (res2.blades != null && res2.blades != "undefined") {
                                self.blades = res2.blades.quality;
                            }
                            if (res2.status != null && res2.status != "undefined") {
                                self.hours = res2.status.hours;
                            }
                            self.registerTile(Object.assign(res, res2));
                        } else if (err || err2) {
                            api.exported.Logger.err(err);
                            api.exported.Logger.err(err2);
                        }

                    });
                }, 1000, this);
            });
        }

        /**
         * Get mower status
         *
         * @param  {object} res            The get status result
         */
        registerTile(res) {
            const miniTiles = [];
            const iconBlades = "<svg height=\"500pt\" viewBox=\"0 -37 500.688 500\" width=\"500pt\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m250.34375 240.34375c-17.648438 0-32 14.351562-32 32s14.351562 32 32 32 32-14.351562 32-32-14.351562-32-32-32zm0 48c-8.824219 0-16-7.175781-16-16s7.175781-16 16-16 16 7.175781 16 16-7.175781 16-16 16zm0 0\"/><path d=\"m242.34375 32.34375h16v48h-16zm0 0\"/><path d=\"m35.609375 383.828125 42.160156-23.703125 7.847657 13.957031-42.164063 23.699219zm0 0\"/><path d=\"m415.082031 374.082031 7.847657-13.957031 42.160156 23.707031-7.84375 13.953125zm0 0\"/><path d=\"m362.65625 271.246094-49.503906-11.039063c-2.777344-14.390625-10.390625-27.0625-21.082032-36.285156l14.503907-47.128906-33.605469-176.449219h-45.242188l-33.605468 176.457031 14.503906 47.128907c-10.6875 9.222656-18.304688 21.886718-21.082031 36.285156l-49.503907 11.042968-138.039062 115.949219 23 38.800781 171.800781-58.3125 33.664063-35.289062c6.839844 2.503906 14.183594 3.9375 21.878906 3.9375s15.039062-1.433594 21.878906-3.9375l33.664063 35.289062 171.800781 58.3125 23-38.800781zm-152.082031-95.359375 30.394531-159.542969h18.757812l30.394532 159.542969-11.96875 38.898437c-6.128906-2.976562-12.785156-5.007812-19.800782-5.890625v-80.550781h-16v80.550781c-7.023437.882813-13.671874 2.914063-19.800781 5.890625zm-24.644531 177.921875-155.785157 52.871094-9.457031-15.953126 124.640625-104.710937 41.238281-9.207031c.480469 6.886718 2.019532 13.488281 4.511719 19.605468l-71.140625 39.992188 7.839844 13.953125 71.191406-40.015625c4.109375 5.535156 9.0625 10.410156 14.710938 14.375zm16.414062-81.464844c0-26.472656 21.527344-48 48-48s48 21.527344 48 48-21.527344 48-48 48-48-21.527344-48-48zm268.199219 134.335938-155.78125-52.871094-27.753907-29.089844c5.648438-3.964844 10.601563-8.832031 14.710938-14.375l71.191406 40.015625 7.84375-13.953125-71.144531-39.992188c2.496094-6.117187 4.03125-12.71875 4.511719-19.605468l41.238281 9.207031 124.640625 104.710937zm0 0\"/></svg>";
            const iconGlass = "<svg version=\"1.1\" id=\"Capa_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"  viewBox=\"0 0 512 512\" style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\"><g> <g>  <path d=\"M310,190c-5.52,0-10,4.48-10,10s4.48,10,10,10c5.52,0,10-4.48,10-10S315.52,190,310,190z\"/> </g></g><g> <g>  <path d=\"M500.281,443.719l-133.48-133.48C388.546,277.485,400,239.555,400,200C400,89.72,310.28,0,200,0S0,89.72,0,200   s89.72,200,200,200c39.556,0,77.486-11.455,110.239-33.198l36.895,36.895c0.005,0.005,0.01,0.01,0.016,0.016l96.568,96.568   C451.276,507.838,461.319,512,472,512c10.681,0,20.724-4.162,28.278-11.716C507.837,492.731,512,482.687,512,472   S507.837,451.269,500.281,443.719z M305.536,345.727c0,0.001-0.001,0.001-0.002,0.002C274.667,368.149,238.175,380,200,380   c-99.252,0-180-80.748-180-180S100.748,20,200,20s180,80.748,180,180c0,38.175-11.851,74.667-34.272,105.535   C334.511,320.988,320.989,334.511,305.536,345.727z M326.516,354.793c10.35-8.467,19.811-17.928,28.277-28.277l28.371,28.371   c-8.628,10.183-18.094,19.65-28.277,28.277L326.516,354.793z M486.139,486.139c-3.78,3.78-8.801,5.861-14.139,5.861   s-10.359-2.081-14.139-5.861l-88.795-88.795c10.127-8.691,19.587-18.15,28.277-28.277l88.798,88.798   C489.919,461.639,492,466.658,492,472C492,477.342,489.919,482.361,486.139,486.139z\"/> </g></g><g> <g>  <path d=\"M200,40c-88.225,0-160,71.775-160,160s71.775,160,160,160s160-71.775,160-160S288.225,40,200,40z M200,340   c-77.196,0-140-62.804-140-140S122.804,60,200,60s140,62.804,140,140S277.196,340,200,340z\"/> </g></g><g> <g>  <path d=\"M312.065,157.073c-8.611-22.412-23.604-41.574-43.36-55.413C248.479,87.49,224.721,80,200,80c-5.522,0-10,4.478-10,10   c0,5.522,4.478,10,10,10c41.099,0,78.631,25.818,93.396,64.247c1.528,3.976,5.317,6.416,9.337,6.416   c1.192,0,2.405-0.215,3.584-0.668C311.472,168.014,314.046,162.229,312.065,157.073z\"/> </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>";
            const iconMower = "<svg id=\"Layer_1_1_\" enable-background=\"new 0 0 64 64\" height=\"512\" viewBox=\"0 0 64 64\" width=\"512\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m47 54c5.514 0 10-4.486 10-10s-4.486-10-10-10-10 4.486-10 10 4.486 10 10 10zm-7.931-11c.183-1.458.759-2.792 1.619-3.898l1.362 1.363 1.414-1.414-1.362-1.362c1.106-.86 2.44-1.436 3.898-1.619v1.93h2v-1.931c1.458.183 2.792.759 3.898 1.619l-1.362 1.362 1.414 1.414 1.362-1.363c.86 1.106 1.436 2.44 1.619 3.898h-1.931v2h1.931c-.183 1.458-.759 2.792-1.619 3.898l-1.362-1.363-1.414 1.414 1.362 1.362c-1.106.86-2.44 1.436-3.898 1.619v-1.929h-2v1.931c-1.458-.183-2.792-.759-3.898-1.619l1.362-1.362-1.414-1.414-1.362 1.363c-.86-1.106-1.436-2.44-1.619-3.898h1.931v-2h-1.931z\"/><path d=\"m57 21h-24.98c-1.511 0-2.984.426-4.262 1.229l-22.021 13.866c-2.34 1.473-3.737 4.005-3.737 6.769v6.136c0 .553.448 1 1 1h33.088c.341 0 .658-.174.842-.46.184-.287.209-.647.067-.957-.75-1.635-1.08-3.387-.979-5.208.309-5.591 4.936-10.145 10.535-10.366 3.028-.116 5.892.967 8.069 3.06 2.178 2.093 3.378 4.91 3.378 7.931 0 .553.448 1 1 1h3c.552 0 1-.447 1-1v-17c0-3.309-2.691-6-6-6zm-28.177 2.923c.959-.604 2.064-.923 3.197-.923h10.37l-8.391 5.035v-.035h-11.651zm-22.02 13.864 12.368-7.787h11.552l-18.233 10.94c-1.157.694-2.48 1.06-3.827 1.06h-4.596c.248-1.728 1.229-3.263 2.736-4.213zm54.197 5.213h-1.038c-.239-3.188-1.623-6.132-3.955-8.374-2.573-2.473-5.963-3.75-9.534-3.615-6.19.245-11.374 4.97-12.317 10.989h-17.156v2h17.013c.002 1.361.202 2.715.615 4h-30.628v-4h4.663c1.709 0 3.389-.465 4.856-1.345l32.758-19.655h10.723c2.206 0 4 1.794 4 4z\"/><path d=\"m47 48c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2z\"/><path d=\"m6.651 15.635c-1.757 2.125-1.458 5.282.667 7.04l4.624 3.823c.187.154.412.229.637.229.288 0 .573-.124.771-.362 1.757-2.125 1.458-5.282-.667-7.04l-4.624-3.823c-.426-.352-1.056-.292-1.408.133zm5.662 8.576-3.721-3.077c-1.004-.831-1.329-2.185-.905-3.345l3.721 3.077c1.005.831 1.329 2.185.905 3.345z\"/><path d=\"m21.445 9.229-4.624 3.823c-2.125 1.758-2.424 4.916-.667 7.04.198.239.483.362.771.362.225 0 .45-.075.637-.229l4.624-3.823c2.125-1.757 2.424-4.915.667-7.04-.352-.424-.983-.484-1.408-.133zm-.533 5.632-3.722 3.078c-.152-.415-.211-.863-.168-1.316.076-.798.458-1.519 1.075-2.029l3.721-3.077c.423 1.16.099 2.513-.906 3.344z\"/></svg>";
            const iconAuto = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" id=\"Capa_1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 512 512\" style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\" width=\"512\" height=\"512\"><path d=\"M464.866,415.6H47.134C21.378,415.6,0,394.796,0,368.467V143.533C0,117.733,20.848,96.4,47.134,96.4h417.732  c25.756,0,47.134,20.804,47.134,47.133v224.934C512,394.267,491.152,415.6,464.866,415.6z M47.134,126.4  c-9.46,0-17.134,7.657-17.134,17.133v224.934c0,9.48,7.676,17.133,17.134,17.133h417.732c9.46,0,17.134-7.657,17.134-17.133V143.533  c0-9.48-7.676-17.133-17.134-17.133H47.134z\"/><g>	<path d=\"M95.317,188.783c-26.017,0-47.117,21.05-47.117,47.117v68.3c0,8.284,6.716,15,15,15s15-6.716,15-15v-17.134h34.267V304.2   c0,8.284,6.716,15,15,15s15-6.716,15-15v-68.283C142.467,209.928,121.322,188.783,95.317,188.783z M78.2,257.066V235.9   c0-9.443,7.633-17.117,17.133-17.117c9.447,0,17.134,7.687,17.134,17.134v21.149H78.2z\"/>	<path d=\"M239.934,192.8c-8.284,0-15,6.716-15,15v68.283c0,9.447-7.687,17.134-17.149,17.134c-9.435,0-17.117-7.631-17.117-17.117   v-68.3c0-8.284-6.716-15-15-15s-15,6.716-15,15v68.3c0,26.027,21.054,47.117,47.133,47.117c25.989,0,47.134-21.145,47.134-47.134   V207.8C254.934,199.516,248.218,192.8,239.934,192.8z\"/>	<path d=\"M416.667,188.783h-0.017c-26.016,0-47.117,21.051-47.117,47.117V276.1c0,26.027,21.055,47.117,47.134,47.117   c25.801,0,47.133-20.847,47.133-47.134v-40.166C463.8,209.996,442.846,188.783,416.667,188.783z M433.8,276.083   c0,9.378-7.575,17.134-17.149,17.134c-9.436,0-17.117-7.632-17.117-17.117V235.9c0-9.473,7.67-17.117,17.117-17.117h0.017   c9.44,0,17.133,7.638,17.133,17.134V276.083z\"/>	<path d=\"M344.366,192.8H280.1c-8.284,0-15,6.716-15,15s6.716,15,15,15h17.134v81.4c0,8.284,6.716,15,15,15s15-6.716,15-15v-81.4   h17.133c8.284,0,15-6.716,15-15S352.65,192.8,344.366,192.8z\"/></g></svg>";
            const iconMan = "<svg id=\"Capa_1\" enable-background=\"new 0 0 512 512\" height=\"512\" viewBox=\"0 0 512 512\" width=\"512\" xmlns=\"http://www.w3.org/2000/svg\"><g><path d=\"m392.635 421.185v-60.815h-89.875v-176.419c30.458-16.622 51.167-48.949 51.167-86.024.001-53.997-43.929-97.927-97.927-97.927s-97.928 43.93-97.928 97.928c0 37.074 20.71 69.401 51.167 86.024v176.418h-89.875v60.815h-52.874v90.815h379.02v-90.815zm-204.563-323.257c0-37.456 30.472-67.928 67.928-67.928s67.928 30.472 67.928 67.928-30.472 67.927-67.928 67.927-67.928-30.472-67.928-67.927zm51.168 96.487c5.448.944 11.047 1.441 16.76 1.441s11.312-.497 16.76-1.441v165.954h-33.52zm-89.875 195.954h213.27v30.815h-213.27zm266.145 91.631h-319.02v-30.815h319.02z\"/></g></svg>";
            const iconHome2 = "<svg id=\"Capa_1\" enable-background=\"new 0 0 512 512\" height=\"512\" viewBox=\"0 0 512 512\" width=\"512\" xmlns=\"http://www.w3.org/2000/svg\"><g><path d=\"m206 121h-50c-19.299 0-35 15.701-35 35v200c0 19.299 15.701 35 35 35h50c19.299 0 35-15.701 35-35v-200c0-19.299-15.701-35-35-35zm5 235c0 2.757-2.243 5-5 5h-50c-2.757 0-5-2.243-5-5v-200c0-2.757 2.243-5 5-5h50c2.757 0 5 2.243 5 5z\"/><path d=\"m356 121h-50c-19.299 0-35 15.701-35 35v200c0 19.299 15.701 35 35 35h50c19.299 0 35-15.701 35-35v-200c0-19.299-15.701-35-35-35zm5 235c0 2.757-2.243 5-5 5h-50c-2.757 0-5-2.243-5-5v-200c0-2.757 2.243-5 5-5h50c2.757 0 5 2.243 5 5z\"/><path d=\"m337 0h-162c-96.495 0-175 78.505-175 175v162c0 96.495 78.505 175 175 175h162c96.495 0 175-78.505 175-175v-162c0-96.495-78.505-175-175-175zm145 337c0 79.953-65.047 145-145 145h-162c-79.953 0-145-65.047-145-145v-162c0-79.953 65.047-145 145-145h162c79.953 0 145 65.047 145 145z\"/></g></svg>";
            const iconEod = "<svg id=\"Capa_1\" enable-background=\"new 0 0 512 512\" height=\"512\" viewBox=\"0 0 512 512\" width=\"512\" xmlns=\"http://www.w3.org/2000/svg\"><g><path d=\"m241 109.651h30v111h-30z\"/><path d=\"m412.28 392.649c-7.578-79.559-74.77-141.998-156.28-141.998s-148.702 62.439-156.279 141.998h-99.721v30h512v-30zm-156.28-111.998c64.955 0 118.675 49.013 126.119 111.999h-252.238c7.444-62.986 61.165-111.999 126.119-111.999z\"/><path d=\"m63.667 452.649h384.666v30h-384.666z\"/><path d=\"m33.794 294.987h30v69.001h-30z\" transform=\"matrix(.353 -.936 .936 .353 -276.716 258.874)\"/><path d=\"m155.591 168.808h30v69.001h-30z\" transform=\"matrix(.923 -.386 .386 .923 -65.198 81.492)\"/><path d=\"m306.908 188.309h69.001v29.999h-69.001z\" transform=\"matrix(.386 -.923 .923 .386 22.179 439.924)\"/><path d=\"m428.705 314.488h69.001v30h-69.001z\" transform=\"matrix(.936 -.353 .353 .936 -86.472 184.654)\"/><path d=\"m69.528 180.677h30v111h-30z\" transform=\"matrix(.707 -.707 .707 .707 -142.245 128.945)\"/><path d=\"m371.973 221.177h111v30h-111z\" transform=\"matrix(.707 -.707 .707 .707 -41.798 371.443)\"/><path d=\"m464.477 148.701 45.989-45.988-21.213-21.213-20.383 20.382v-72.531h-30v72.531l-20.698-20.698-21.213 21.213 46.305 46.304z\"/></g></svg>";

            if (res.name != null && res.name != "undefined") {
                miniTiles.push({icon: iconMower, text: (res.mower && res.mower.msw && res.mower.msw.title) ? res.mower.msw.title : "", colorDefault: api.themeAPI.constants().DARK_COLOR_KEY});
            }

            if (res.status && res.status.status != null && res.status.status != "undefined") {
                // 0=DETECTING_STATUS
                let text = "mower.detecting.status";
                let color = api.themeAPI.constants().SECONDARY_COLOR_KEY;
                let icon = "<svg version=\"1.1\" id=\"Capa_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"  width=\"47.582px\" height=\"47.582px\" viewBox=\"0 0 47.582 47.582\" style=\"enable-background:new 0 0 47.582 47.582;\"  xml:space=\"preserve\"><g> <g>  <path d=\"M0,18.791v10h47.582v-10H0z M45.582,26.791H2v-6h43.582V26.791z\"/>  <rect x=\"3.581\" y=\"21.988\" width=\"29.417\" height=\"3.605\"/> </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>";
                if (res.status.status == 1) {
                    // 1=PARKING
                    text = "mower.parking";
                    icon = "<svg version=\"1.1\" id=\"Capa_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"  viewBox=\"0 0 512 512\" style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\"><g> <g>  <path d=\"M429.447,0H82.553C37.033,0,0,37.033,0,82.553v346.894C0,474.967,37.033,512,82.553,512h346.894   c45.52,0,82.553-37.033,82.553-82.553V82.553C512,37.033,474.967,0,429.447,0z M481.764,429.447   c0,28.847-23.469,52.317-52.317,52.317H82.553c-28.847,0-52.317-23.469-52.317-52.317V82.553   c0-28.847,23.469-52.317,52.317-52.317h346.894c28.847,0,52.317,23.469,52.317,52.317V429.447z\"/> </g></g><g> <g>  <g>   <path d=\"M266.583,84.165h-72.311c-27.787,0-50.394,22.607-50.394,50.394v278.159c0,8.349,6.769,15.118,15.118,15.118h70.551    c8.349,0,15.118-6.769,15.118-15.117v-85.159h21.917c67.104,0,121.697-54.594,121.697-121.698    C388.279,138.758,333.687,84.165,266.583,84.165z M266.583,297.323h-37.035c-8.349,0-15.118,6.769-15.118,15.118v85.158h-40.315    V134.558c0-11.115,9.043-20.157,20.157-20.157h72.311c50.431,0,91.461,41.029,91.461,91.461S317.014,297.323,266.583,297.323z\"/>   <path d=\"M266.583,154.716h-37.035c-8.349,0-15.118,6.769-15.118,15.118v72.056c0,8.349,6.769,15.118,15.118,15.118h37.035    c28.201,0,51.146-22.944,51.146-51.146C317.728,177.66,294.784,154.716,266.583,154.716z M266.583,226.772h-21.917v-41.82h21.917    c11.529,0,20.909,9.38,20.909,20.91C287.492,217.391,278.112,226.772,266.583,226.772z\"/>  </g> </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>";
                } else if (res.status.status == 2) {
                    // 2=MOWING
                    text = "mower.mowing";
                    color = api.themeAPI.constants().ON_COLOR_KEY;
                    icon = iconBlades;
                } else if (res.status.status == 3) {
                    // 3=SEARCH_CHARGING_STATION
                    text = "mower.search.charging.station";
                    icon = iconGlass;
                } else if (res.status.status == 4) {
                    // 4=CHARGING
                    text = "mower.charging";
                    icon = api.exported.Icons.class.list()["battery-charging"];
                } else if (res.status.status == 5) {
                    // 5=SEARCHING
                    text = "mower.searching";
                    icon = iconGlass;
                } else if (res.status.status == 7) {
                    // 7=ERROR_STATUS
                    text = "mower.error.status";
                    color = api.themeAPI.constants().OFF_COLOR_KEY;
                    icon = "<svg version=\"1.1\" id=\"Capa_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 512 512\" style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\"><g><g><path d=\"M256,0C114.508,0,0,114.497,0,256c0,141.493,114.497,256,256,256c141.492,0,256-114.497,256-256C512,114.507,397.503,0,256,0z M256,472c-119.384,0-216-96.607-216-216c0-119.385,96.607-216,216-216c119.384,0,216,96.607,216,216C472,375.385,375.393,472,256,472z\"/></g></g><g><g><path d=\"M343.586,315.302L284.284,256l59.302-59.302c7.81-7.81,7.811-20.473,0.001-28.284c-7.812-7.811-20.475-7.81-28.284,0L256,227.716l-59.303-59.302c-7.809-7.811-20.474-7.811-28.284,0c-7.81,7.811-7.81,20.474,0.001,28.284L227.716,256l-59.302,59.302c-7.811,7.811-7.812,20.474-0.001,28.284c7.813,7.812,20.476,7.809,28.284,0L256,284.284l59.303,59.302c7.808,7.81,20.473,7.811,28.284,0C351.398,335.775,351.397,323.112,343.586,315.302z\"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>";
                } else if (res.status.status == 8) {
                    // 8=LOST_SIGNAL
                    text = "mower.lost.signal";
                    color = api.themeAPI.constants().OFF_COLOR_KEY;
                    icon = "<svg version=\"1.1\" id=\"Capa_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"  viewBox=\"0 0 491.312 491.312\" style=\"enable-background:new 0 0 491.312 491.312;\" xml:space=\"preserve\"><g> <g>  <path d=\"M273.944,401.368c-15.636-15.591-40.94-15.591-56.576,0c-15.619,15.623-15.616,40.95,0.007,56.569   c15.623,15.619,40.95,15.616,56.569-0.007C289.56,442.309,289.56,416.988,273.944,401.368z M262.632,446.632   c-9.376,9.37-24.572,9.365-33.941-0.011c-9.37-9.376-9.365-24.572,0.011-33.941c9.371-9.365,24.559-9.365,33.93,0   C271.985,422.065,271.985,437.247,262.632,446.632z\"/> </g></g><g> <g>  <path d=\"M491.312,11.312L480,0l-84.912,84.912C262.86,28.159,109.885,51.313,0.376,144.656l10.448,12.12   C113.933,68.865,257.48,45.838,382.912,97.088l-75.856,75.856c-20.119-4.771-40.724-7.187-61.4-7.2   c-70.043-0.222-137.264,27.592-186.672,77.24l11.312,11.312c58.468-58.415,142.198-83.855,223.28-67.84l-100.952,100.92   c-20.45,7.53-39.026,19.403-54.448,34.8L148,332L0,480l11.312,11.312l190.064-190.064c49.13-16.977,103.64-4.464,140.448,32.24   l11.312-11.312c-34.128-34.067-82.419-49.881-130.088-42.6l88.8-88.8c41.291,11.326,78.917,33.219,109.168,63.52l11.312-11.312   c-30.007-30.123-66.891-52.494-107.472-65.184l73.856-73.856c29.581,13.767,57.118,31.554,81.832,52.856l10.448-12.12   c-24.376-20.977-51.382-38.686-80.336-52.68L491.312,11.312z\"/> </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>";
                } else if (res.status.status == 16) {
                    // 16=OFF
                    text = "mower.off";
                    color = api.themeAPI.constants().OFF_COLOR_KEY;
                    icon = "<svg id=\"bold\" height=\"512\" viewBox=\"0 0 24 24\" width=\"512\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m11.75 10.5h1.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-1.5c-.965 0-1.75.785-1.75 1.75v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-1.25h1.75c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-1.75v-.75c0-.138.112-.25.25-.25z\"/><path d=\"m17.75 10.5h1.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-1.5c-.965 0-1.75.785-1.75 1.75v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-1.25h1.75c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-1.75v-.75c0-.138.112-.25.25-.25z\"/><path d=\"m6.25 9h-.5c-.965 0-1.75.785-1.75 1.75v2.5c0 .965.785 1.75 1.75 1.75h.5c.965 0 1.75-.785 1.75-1.75v-2.5c0-.965-.785-1.75-1.75-1.75zm.25 4.25c0 .138-.112.25-.25.25h-.5c-.138 0-.25-.112-.25-.25v-2.5c0-.138.112-.25.25-.25h.5c.138 0 .25.112.25.25z\"/><path d=\"m12 24c-6.617 0-12-5.383-12-12s5.383-12 12-12 12 5.383 12 12-5.383 12-12 12zm0-22c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10z\"/></svg>";
                } else if (res.status.status == 17) {
                    // 17=SLEEPING
                    text = "mower.sleeping";
                    icon = "<svg version= \"1.1 \" id= \"Capa_1 \" xmlns= \"http://www.w3.org/2000/svg \" xmlns:xlink= \"http://www.w3.org/1999/xlink \" x= \"0px \" y= \"0px \"  viewBox= \"0 0 383.189 383.189 \" style= \"enable-background:new 0 0 383.189 383.189; \" xml:space= \"preserve \"><g> <g>  <path d= \"M226.384,123.658c-1.74-1.39-3.939-2.075-6.16-1.92h-33.6l31.6-35.28l2.96-3.28l1.52-1.92   c0.528-0.742,0.958-1.549,1.28-2.4c0.363-0.917,0.552-1.894,0.56-2.88c0.223-2.333-0.933-4.583-2.96-5.76   c-2.629-1.206-5.512-1.756-8.4-1.6h-39.28c-2.096-0.143-4.172,0.483-5.84,1.76c-1.378,1.173-2.145,2.911-2.08,4.72   c0,2.72,0.907,4.373,2.72,4.96c2.6,0.739,5.299,1.063,8,0.96h25.6c-1.067,1.493-2.453,3.253-4.16,5.28l-6.56,7.36l-8.88,9.6   l-10.32,11.44c-3.573,4-5.92,6.667-7.04,8c-2.54,3.085-2.224,7.618,0.72,10.32c2.11,1.59,4.726,2.357,7.36,2.16h46.72   c2.235,0.175,4.457-0.48,6.24-1.84c1.359-1.187,2.121-2.916,2.08-4.72C228.533,126.739,227.772,124.925,226.384,123.658z \"/> </g></g><g> <g>  <path d= \"M297.184,164.538c-1.4-1.12-3.173-1.663-4.96-1.52h-26.88l25.2-28.16l2.4-2.64l1.52-1.84   c0.429-0.592,0.778-1.237,1.04-1.92c0.303-0.737,0.466-1.523,0.48-2.32c0.201-1.867-0.706-3.68-2.32-4.64   c-2.103-0.966-4.409-1.406-6.72-1.28h-31.68c-1.669-0.093-3.317,0.418-4.64,1.44c-1.106,0.93-1.725,2.316-1.68,3.76   c0,2.133,0.72,3.467,2.16,4c2.082,0.577,4.242,0.82,6.4,0.72h20.48c-0.8,1.2-1.92,2.56-3.36,4.24l-5.28,5.92l-6.88,8l-8,9.12   c-2.88,3.2-4.773,5.387-5.68,6.56c-1.885,2.418-1.643,5.868,0.56,8c1.679,1.249,3.754,1.846,5.84,1.68h37.12   c1.774,0.142,3.538-0.37,4.96-1.44c1.058-0.959,1.642-2.333,1.6-3.76C298.901,166.969,298.288,165.538,297.184,164.538z \"/> </g></g><g> <g>  <path d= \"M381.104,119.578c-1.74-1.39-3.939-2.075-6.16-1.92h-33.84l31.6-35.28l2.96-3.28l1.92-2.32   c0.528-0.742,0.958-1.549,1.28-2.4c0.363-0.917,0.552-1.894,0.56-2.88c0.223-2.333-0.933-4.583-2.96-5.76   c-2.629-1.206-5.512-1.755-8.4-1.6h-39.68c-2.096-0.143-4.172,0.483-5.84,1.76c-1.378,1.173-2.145,2.911-2.08,4.72   c0,2.72,0.907,4.373,2.72,4.96c2.6,0.739,5.299,1.063,8,0.96h25.6c-1.067,1.493-2.453,3.253-4.16,5.28l-6.64,7.52l-8.64,9.6   l-10.32,11.44c-3.573,4-5.92,6.667-7.04,8c-2.54,3.085-2.224,7.618,0.72,10.32c2.11,1.59,4.726,2.357,7.36,2.16h46.64   c2.258,0.284,4.541-0.287,6.4-1.6c1.359-1.187,2.121-2.916,2.08-4.72C383.253,122.659,382.492,120.845,381.104,119.578z \"/> </g></g><g> <g>  <path d= \"M353.504,254.298c-2.279-2.359-5.767-3.089-8.8-1.84c-86.708,35.894-186.097-5.298-221.992-92.007   c-18.227-44.031-17.127-93.693,3.032-136.873c1.889-3.994,0.182-8.763-3.812-10.652c-2.05-0.97-4.416-1.023-6.508-0.148   C20.363,51.827-25.044,160.545,14.005,255.606s147.767,140.468,242.829,101.419c43.356-17.81,78.394-51.325,98.111-93.848   C356.332,260.203,355.761,256.682,353.504,254.298z M186.224,355.098c-93.977-0.016-170.147-76.212-170.131-170.189   c0.01-61.708,33.428-118.574,87.331-148.611c-6.383,18.946-9.626,38.808-9.6,58.8c0.005,102.813,83.356,186.156,186.169,186.151   c17.231-0.001,34.378-2.394,50.951-7.111C299.919,324.303,245.207,354.91,186.224,355.098z \"/> </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>";
                } else if (res.status.status == 99) {
                    // 99=UNKNOWN
                    text = "mower.unknown";
                    icon = "<svg version= \"1.1 \" id= \"Layer_1 \" xmlns= \"http://www.w3.org/2000/svg \" xmlns:xlink= \"http://www.w3.org/1999/xlink \" x= \"0px \" y= \"0px \"  viewBox= \"0 0 426.667 426.667 \" style= \"enable-background:new 0 0 426.667 426.667; \" xml:space= \"preserve \"><g> <g>  <rect x= \"192 \" y= \"298.667 \" width= \"42.667 \" height= \"42.667 \"/> </g></g><g> <g>  <path d= \"M213.333,0C95.513,0,0,95.513,0,213.333s95.513,213.333,213.333,213.333s213.333-95.513,213.333-213.333   S331.154,0,213.333,0z M213.333,388.053c-96.495,0-174.72-78.225-174.72-174.72s78.225-174.72,174.72-174.72   c96.446,0.117,174.602,78.273,174.72,174.72C388.053,309.829,309.829,388.053,213.333,388.053z \"/> </g></g><g> <g>  <path d= \"M296.32,150.4c-10.974-45.833-57.025-74.091-102.858-63.117c-38.533,9.226-65.646,43.762-65.462,83.384h42.667   c2.003-23.564,22.729-41.043,46.293-39.04s41.043,22.729,39.04,46.293c-4.358,21.204-23.38,36.169-45.013,35.413   c-10.486,0-18.987,8.501-18.987,18.987v0v45.013h42.667v-24.32C279.787,241.378,307.232,195.701,296.32,150.4z \"/> </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>";
                }



                miniTiles.push({icon: icon, text: api.translateAPI.t(text), colorDefault: color});
            }

            if (res.status && res.status.mode != null && res.status.mode != "undefined") {
                let title = "mower.na";
                let icon = "";
                if (res.status.mode == 0) {
                    title = "mower.auto";
                    icon = iconAuto;
                } else if (res.status.mode == 1) {
                    title = "mower.man";
                    icon = iconMan;
                } else if (res.status.mode == 2) {
                    title = "mower.home";
                    icon = iconHome2;
                } else if (res.status.mode == 3) {
                    title = "mower.eod";
                    icon = iconEod;
                }

                miniTiles.push({icon: icon, text: api.translateAPI.t(title), colorDefault: api.themeAPI.constants().PRIMARY_COLOR_KEY});

                if (res.status && res.status.battery != null && res.status.battery != "undefined") {
                    let icon = api.exported.Icons.class.list()["battery-0"];
                    if (res.status.battery < 25) {
                        icon = api.exported.Icons.class.list()["battery-0"];
                    } else if (res.status.battery < 50) {
                        icon = api.exported.Icons.class.list()["battery-1"];
                    } else if (res.status.battery < 75) {
                        icon = api.exported.Icons.class.list()["battery-2"];
                    } else if (res.status.battery < 95) {
                        icon = api.exported.Icons.class.list()["battery-3"];
                    } else {
                        icon = api.exported.Icons.class.list()["battery-4"];
                    }

                    miniTiles.push({icon: icon, text: res.status.battery + "%", colorDefault: api.themeAPI.constants().DARK_COLOR_KEY});
                }

                if (res.blades != null && res.blades != "undefined") {
                    miniTiles.push({icon: iconBlades, text: res.blades.quality + "%", colorDefault: (res.blades.quality == 0 ? api.themeAPI.constants().OFF_COLOR_KEY : api.themeAPI.constants().DARK_COLOR_KEY)});
                }

                const timerIcon = "<svg version=\"1.1\" id=\"Capa_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"  viewBox=\"0 0 512 512\" style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\"><g> <g>  <path d=\"M347.216,301.211l-71.387-53.54V138.609c0-10.966-8.864-19.83-19.83-19.83c-10.966,0-19.83,8.864-19.83,19.83v118.978   c0,6.246,2.935,12.136,7.932,15.864l79.318,59.489c3.569,2.677,7.734,3.966,11.878,3.966c6.048,0,11.997-2.717,15.884-7.952   C357.766,320.208,355.981,307.775,347.216,301.211z\"/> </g></g><g> <g>  <path d=\"M256,0C114.833,0,0,114.833,0,256s114.833,256,256,256s256-114.833,256-256S397.167,0,256,0z M256,472.341   c-119.275,0-216.341-97.066-216.341-216.341S136.725,39.659,256,39.659c119.295,0,216.341,97.066,216.341,216.341   S375.275,472.341,256,472.341z\"/> </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>";
                let text = "";

                if (res.timer && res.timer.next && res.timer.next.time && (res.timer.status == 0 || res.timer.status == 2)) {
                    text = res.timer.next.time.substring(0, 5);
                } else if (res.timer != null && res.timer.status != null && res.timer.status != "undefined" && res.timer.status == 2) {
                    text = api.translateAPI.t("mower.weather.pause");
                } else if (res.timer && !res.timer.next && res.timer.status == 0) {
                    text = api.translateAPI.t("mower.weather.pause");
                } else if (res.timer && !res.timer.next && res.timer.status == 1) {
                    text = api.translateAPI.t("mower.active");
                }
                miniTiles.push({icon: timerIcon, text: text, colorDefault: api.themeAPI.constants().DARK_COLOR_KEY});

            }

            const tile = api.dashboardAPI.Tile("robonect-all", api.dashboardAPI.TileType().TILE_SUB_TILES, null, null, null, null, null, null, 0, 107, ROBONECT_REGISTER_KEY, {miniTiles:miniTiles, buttons:[{auto: iconAuto}, {man: iconMan}, {home: iconHome2}, {eod: iconEod}]}, api.webAPI.Authentication().AUTH_USAGE_LEVEL);
            api.dashboardAPI.registerTile(tile);
        }

        /**
         * Process API callback
         *
         * @param  {APIRequest} apiRequest An APIRequest
         * @returns {Promise}  A promise with an APIResponse object
         */
        processAPI(apiRequest) {
            const self = this;
            console.log(apiRequest.data);
            if (apiRequest.route.startsWith(":/" + ROBONECT_REGISTER_KEY + "/")) {

                return new Promise((resolve, reject) => {
                    if (apiRequest.data && apiRequest.data.action) {
                        let mode = null;
                        if (apiRequest.data.action == "auto") {
                            mode = "auto";
                        } else if (apiRequest.data.action == "man") {
                            mode = "man";
                        } else if (apiRequest.data.action == "home") {
                            mode = "home";
                        } else if (apiRequest.data.action == "eod") {
                            mode = "eod";
                        }

                        if (mode) {
                            self.getInfo("/json?cmd=mode&mode=" + mode, (err, res) => {
                                if (!err && res.successful)  {
                                    setTimeout((self) => {
                                        self.refresh();
                                    }, 1000, this);
                                    resolve(self.api.webAPI.APIResponse(true, {success:true}));
                                } else {
                                    reject(this.api.webAPI.APIResponse(false, {}, 8913, "Fail mode robonect " + mode));
                                }
                            });
                        }

                    }
                });
            }
        }

        /**
         * Get mower status
         *
         * @param  {Function} cb            A callback e.g. : `(err, res) => {}`
         */
        getStatus(cb) {
            this.getInfo("/json?cmd=status", cb);
        }

        /**
         * Get mower version
         *
         * @param  {Function} cb            A callback e.g. : `(err, res) => {}`
         */
        getVersion(cb) {
            this.getInfo("/json?cmd=version", cb);
        }

        /**
         * Get mower info
         *
         * @param  {string} endpoint            The endpoint
         * @param  {Function} cb            A callback e.g. : `(err, res) => {}`
         */
        getInfo(endpoint, cb) {
            const configuration = api.configurationAPI.getConfiguration();
            if (configuration && configuration.ip) {
                let credentials = "";
                if (configuration.username && configuration.password) {
                    credentials = encodeURIComponent(configuration.username) + ":" + encodeURIComponent(configuration.password) + "@";
                }

                const url = "http://" + credentials + configuration.ip + endpoint;
                const options = {json: true};
                request(url, options, (error, res, body) => {
                    if (error) {
                        cb(error);
                    }

                    if (!error && res.statusCode == 200) {
                        cb(null, body);
                    }
                });
            } else {
                cb(Error("No ip defined"));
            }
        }
    }

    api.registerInstance(new Robonect(api));
}

module.exports.attributes = {
    loadedCallback: loaded,
    name: "robonect",
    version: "0.0.1",
    category: "misc",
    description: "Robonect plugin",
    defaultDisabled: true,
    dependencies:[]
};
