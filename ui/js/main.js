var vUrl = 'api/';
var username = null;
var password = null;
// Hot replace toastr
var swalDefaults = {
    reverseButtons: true,
    allowEscapeKey: true,
    allowOutsideClick: true,
    cancelButtonColor: "#ABB0AF",
    confirmButtonColor: "#99BD47"
};
var toastr = {};

$(document).ready(function() {
    var ePassword = null;
    var isAdmin = false;
    var objects = '';
    var fullObjects = '';
    var keys = '';
    var settings = '';
    var devicesKeys = '';
    var fullDevicesKeys = '';
    var fullDevicesLabels = '';
    var refreshCameraInt = 5; // In seconds
    var refreshListInt = 5; // In seconds
    var cameraPanVal = 30;
    var ambiancesItems = null;
    var alarmStatus = false;
    var holidaysStatus = false;
    var actionData = {};
    var userData = {};
    var deviceData = {};
    var radioSignalData = null;
    var cameras = {};
    var selectedCamera = null;
    var selectedHistoryCamera = null;
    var displayLog = false;
    var getDashboardRunning = false;
    var timeLapseRunning = false;
    var icons = {
        '': 'No icon',
        'f0eb': 'Lightbulb',
        'e83f': 'Camera',
        'f0f4': 'Cafe',
        'f0e7': 'Bolt',
        'f001': 'Music',
        'f095': 'Phone',
        'f1b9': 'Car',
        'f108': 'TV',
        'f109': 'Laptop',
        'f185': 'Sun',
        'f041': 'Map marker',
        'f000': 'Glass',
        'f015': 'Home',
        'f06d': 'Fire',
        'f0e0': 'Envelope',
        'f00c': 'Checkmark',
        'f0c2': 'Cloud',
        'f126': 'Network',
        'f030': 'Photo',
        'f085': 'Settings',
        'f02d': 'Books',
        'f0f3': 'Bell',
        'f0fc': 'Beer',
        'f069': 'Snowflake',
        'f0f5': 'Fork and knife',
        'f1ae': 'Child',
        'f02f': 'Printer',
        'f072': 'Plane',
        'f1b0': 'Animals',
        'f040': 'Pencil',
        'f011': 'Powersign',
        'f084': 'Key',
        'f03e': 'Image',
        'f11b': 'Gamepad',
        'f008': 'Movie',
        'f0c3': 'Laboratory',
        'f00a': 'Grid',
        'f099': 'Bird',
        'f113': 'Cat',
        'f187': 'Archive',
        'f236': 'Bed'
    };
    $.getJSON("./fonts/icons.json", function(json) {
        icons = json;
    });

    var fallbackSpeechSynthesis = window.getSpeechSynthesis();
    var fallbackSpeechSynthesisUtterance = window.getSpeechSynthesisUtterance();
    var lng = 'en-US';
    var setFocusToChatInputTimer;
    var reqCamera = null;
    var reqList = null;
    var reqLogs = null;
    var reqLogsIsRunning = false;
    var usersInHouse;
    var oneWireList = 'n/a';
    var userPicture = null;
    var videoToken = null;
    var videoLength = null;
    var videoTmpFile = null;
    var videoTimeLapseTimer = null;
    var cameraIsLoading = false;
    var cameraHistoryDays = 5;
    var objectsList;
    var infoTileList = new Array();
    var tilesData = {};
    var ambianceList;
    var houseInfo;
    var tileEditMode = false;
    var videoCameraMode = false;
    var cameraWallStream;

    var Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function(e) {
            var t = "";
            var n, r, i, s, o, u, a;
            var f = 0;
            e = Base64._utf8_encode(e);
            while (f < e.length) {
                n = e.charCodeAt(f++);
                r = e.charCodeAt(f++);
                i = e.charCodeAt(f++);
                s = n >> 2;
                o = (n & 3) << 4 | r >> 4;
                u = (r & 15) << 2 | i >> 6;
                a = i & 63;
                if (isNaN(r)) {
                    u = a = 64
                } else if (isNaN(i)) {
                    a = 64
                }
                t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
            }
            return t
        },
        decode: function(e) {
            var t = "";
            var n, r, i;
            var s, o, u, a;
            var f = 0;
            e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (f < e.length) {
                s = this._keyStr.indexOf(e.charAt(f++));
                o = this._keyStr.indexOf(e.charAt(f++));
                u = this._keyStr.indexOf(e.charAt(f++));
                a = this._keyStr.indexOf(e.charAt(f++));
                n = s << 2 | o >> 4;
                r = (o & 15) << 4 | u >> 2;
                i = (u & 3) << 6 | a;
                t = t + String.fromCharCode(n);
                if (u != 64) {
                    t = t + String.fromCharCode(r)
                }
                if (a != 64) {
                    t = t + String.fromCharCode(i)
                }
            }
            t = Base64._utf8_decode(t);
            return t
        },
        _utf8_encode: function(e) {
            e = e.replace(/\r\n/g, "\n");
            var t = "";
            for (var n = 0; n < e.length; n++) {
                var r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r)
                } else if (r > 127 && r < 2048) {
                    t += String.fromCharCode(r >> 6 | 192);
                    t += String.fromCharCode(r & 63 | 128)
                } else {
                    t += String.fromCharCode(r >> 12 | 224);
                    t += String.fromCharCode(r >> 6 & 63 | 128);
                    t += String.fromCharCode(r & 63 | 128)
                }
            }
            return t
        },
        _utf8_decode: function(e) {
            var t = "";
            var n = 0;
            var r = c1 = c2 = 0;
            while (n < e.length) {
                r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r);
                    n++
                } else if (r > 191 && r < 224) {
                    c2 = e.charCodeAt(n + 1);
                    t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                    n += 2
                } else {
                    c2 = e.charCodeAt(n + 1);
                    c3 = e.charCodeAt(n + 2);
                    t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                    n += 3
                }
            }
            return t
        }
    }

    var mapLayers = new Array();
    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: 'map',
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: true
            })
        }),
        view: new ol.View({
            center: [0, 0],
            zoom: 2
        })
    });

    var t = function(key, map) {
        var l = key;
        if (localization && localization[key]) {
            l = localization[key];
            if (l == null || l == '') {
                l = key;
            }
            if (map) {
                for (i = 0; i < map.length; i++) {
                    l = l.replace("%@", map[i]);
                }
            }
        }

        return l;
    }

    var getColor = function(colorName) {
        return $("#" + colorName).css("background-color");
    }

    toastr.success = function(text) {
        swal(Object.assign({
                title: t('js.success', null),
                type: "success",
                html: text,
                showCancelButton: false
            },
            swalDefaults
        ));
    }
    toastr.info = function(text) {
        swal(Object.assign({
                title: t('js.info', null),
                html: text,
                showCancelButton: false
            },
            swalDefaults
        ));
    }
    toastr.error = function(text) {
        swal(Object.assign({
                title: t('js.error', null),
                type: "error",
                html: text,
                showCancelButton: false
            },
            swalDefaults
        ));
    }
    toastr.clear = function() {
        swal.clickCancel();
    }

    var showLoader = function() {
        document.getElementById("gLoader").innerHTML = '<div class="loading"></div>';
    }

    var hideLoader = function() {
        document.getElementById("gLoader").innerHTML = '';
    }

    var sleep = function(seconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > (seconds * 1000)) {
                break;
            }
        }
    }

    var iconsLabel = function() {
        var i = icons;
        var keys = Object.keys(i);
        for (j = 0; j < keys.length; j++) {
            i[keys[j]] = '<i data-unicode="' + keys[j] + '">&#x' + keys[j] + '</i>';
        }

        return i;
    }

    var consolelog = function(message) {
        if (displayLog) {
            console.log(message);
        }
    }

    var displayError = function(msg) {
        errorData = JSON.parse(msg.responseText);
        toastr.remove();
        toastr.error(errorData.message + " (" + errorData.code + ")");
    }

    var setError = function(message) {
        var code = parseInt(message.status);
        if (code == 0 || code == 404) {
            return;
        }

        var displayedMessage = message;
        if (message.responseText) {
            errorData = JSON.parse(message.responseText);
            code = errorData.code;
            displayedMessage = errorData.message + '<br/>[#' + code + ']';
        }

        if (message.statusText) {
            errorData = message.statusText;
            code = message.status;
            displayedMessage = errorData + '<br/>[#' + code + ']';
        }

        // Logout
        if (code == 875 || code == 511) {
            removeCredentials();
            location.reload();
        } else {
            toastr.error(displayedMessage);
        }
    }

    var bakeCookie = function(key, value) {
        if (typeof(Storage) !== undefined) {
            localStorage.setItem(key, value);
        }
    }

    var readCookie = function(key) {
        if (typeof(Storage) !== undefined) {
            return localStorage.getItem(key);
        } else {
            return null;
        }
    }

    var deleteCookie = function(key) {
        if (typeof(Storage) !== undefined) {
            localStorage.removeItem(key);
        }
    }

    var storeCredentials = function() {
        bakeCookie("hautomationL", Base64.encode(username));
        bakeCookie("hautomationP", Base64.encode(password));
        bakeCookie("hautomationEP", ePassword);
        bakeCookie("hautomationT", isAdmin);
    }


    var loadCredentials = function() {
        if (readCookie("hautomationL")) username = Base64.decode(readCookie("hautomationL"));
        if (readCookie("hautomationP")) password = Base64.decode(readCookie("hautomationP"));
        if (readCookie("hautomationEP")) ePassword = readCookie("hautomationEP");
        if (readCookie("hautomationT")) isAdmin = readCookie("hautomationT");
    }

    var removeCredentials = function() {
        consolelog("Removing credentials");
        deleteCookie("hautomationL");
        deleteCookie("hautomationP");
        deleteCookie("hautomationEP");
        deleteCookie("hautomationT");
    }

    $('#signOut').click(function() {
        removeCredentials();
        location.reload();
    });

    var start = function() {
        getDashboard();
        getSettings();
        //getCameras();
        getFullObjects();
    }

    var startLogin = function(displayError) {
        consolelog("login");
        $("#loginLoader").fadeIn("slow", function() {
            // Animation complete
        });

        $("#loginFormContent").fadeOut("slow", function() {
            // Animation complete
        });

        loadCredentials();

        if (username == null ||  username == '') {
            username = $('#username').val();
        }

        if (password == null || password == '') {
            password = $('#password').val();
        }

        $.ajax({
            type: "GET",
            url: vUrl + "login/",
            data: {
                u: username,
                p: password
            }
        }).done(function(msg) {
            obj = msg;
            //username = $('#username').val();
            isAdmin = obj["admin"];
            consolelog(obj);
            $("#loginForm").fadeOut("slow", function() {
                // Animation complete
            });
            $("#informations").show();
            if (!isAdmin) {
                $('#manageZone').remove();
                $('#manageTab').remove();
            }
            adminFormReady();

            // Login
            if ($("#rememberMe").is(':checked')) {
                storeCredentials();
            }
            start();

        }).fail(function(msg) {
            $("#loginForm").show();
            $("#informations").hide();
            $("#loginLoader").fadeOut("slow", function() {
                // Animation complete
            });

            $("#loginFormContent").fadeIn("slow", function() {
                // Animation complete
            });
            if (displayError) {
                setError(t("js.login.error", null));
            };
        });
    }

    $('#login').click(function() {
        removeCredentials();
        startLogin(true);
    });

    startLogin(false);

    var nl2br = function(str, is_xhtml) {
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    }

    var generateAnimation = function(cssOne, cssTwo, iconOne, iconTwo) {
        html = '';
        html = html + '<div class="animation-container">';
        html = html + '<i class="fa deviceIcon animation ' + cssOne + '" data-unicode="' + iconOne + '">&#x' + iconOne + '</i>';
        if (cssTwo != null) {
            html = html + '<i class="fa deviceIcon animation ' + cssTwo + '" data-unicode="' + iconTwo + '">&#x' + iconTwo + '</i>';
        }
        html = html + '</div>';
        return html;
    }

    var getLogs = function() {
        if (!reqLogsIsRunning) {
            reqLogsIsRunning = true;
            reqLogs = $.ajax({
                type: "POST",
                url: vUrl,
                data: {
                    username: username,
                    ePassword: ePassword,
                    method: "getLogs",
                    filter: $('#logFilter').val()
                }
            }).done(function(msg) {
                reqLogsIsRunning = false;
                $("#manageLogsDetails").empty();
                $("#manageLogsDetails").html(nl2br(msg));
                //consolelog(msg);
                $('#refreshLogsButton').toggleClass('active');
            }).fail(function(msg) {
                reqLogsIsRunning = false;
                setError(msg);
                $('#refreshLogsButton').toggleClass('active');
            });
        }
    }

    var deviceInfo = function() {
        if (isAdmin) {
            reqDeviceInfo = $.ajax({
                type: "POST",
                url: vUrl,
                data: {
                    username: username,
                    ePassword: ePassword,
                    method: "deviceInfo"
                }
            }).done(function(msg) {
                var obj = jQuery.parseJSON(msg);
                $('#dateInfoValue').html(obj.date);
                $('#timeInfoValue').html(obj.time);
                $('#diskInfoValue').html(obj.diskUsedPercentage + ' %');
                $('#memoryInfoValue').html(obj.memoryUsagePercentage + ' %');
                $('#cpuInfoValue').html(obj.cpuUsagePercentage + ' %');
                $('#uptimeInfoValue').html(obj.upTime);
                $('#localIpValue').html(obj.localIp);
                $('#distantAccessValue').html(obj.host);

                if (obj.https) {
                    $('#httpsValue').html('<i class="glyphicon glyphicon-ok"></i>');
                } else {
                    $('#httpsValue').html('<i class="glyphicon glyphicon-remove"></i>');
                }

                oneWireList = obj.oneWire.join();
                $('#oneWireInfoValue').html(oneWireList);
            }).fail(function(msg) {
                $('#deviceInfo').remove();
            });
        } else {
            $('#deviceInfo').remove();
        }
    }

    var uploadBackup = $("#restoreBackupUploader").uploadFile({
        url: vUrl,
        fileName: "backupFile",
        /*formData: {
            username: readCookie("hautomationL"),
            ePassword: readCookie("hautomationP"),
            method: "restoreBackup"
         },*/
        dynamicFormData: function() {
            //var data ="XYZ=1&ABCD=2";
            var data = {
                "method": "restoreBackup",
                "username": username,
                "ePassword": ePassword
            };
            return data;
        },
        dragDrop: true,
        showFileCounter: true,
        acceptFiles: "zip",
        maxFileCount: 1,
        maxFileSize: 100000 * 1024,
        dragDropStr: '<span><i class="glyphicon glyphicon-open"></i> ' + t('js.backup.drop.label', null) + '</span>',
        abortStr: t('js.backup.drop.abort', null),
        cancelStr: t('js.backup.drop.reinit', null),
        doneStr: t('js.backup.drop.done', null),
        multiDragErrorStr: t('js.backup.drop.multidrag', null),
        extErrorStr: t('js.backup.drop.ext', null),
        sizeErrorStr: t('js.backup.drop.size', null),
        uploadErrorStr: t('js.backup.drop.upload.deny', null),
        uploadStr: t('js.backup.drop.upload', null),
        onSuccess: function(files, data, xhr, pd) {
            toastr.success(t('js.backup.restore.success', [files[0]]));
            $('#restoreBackup').html(t('js.backup.restore.success', [files[0]]));
        },
        onError: function(files, status, errMsg, pd) {
            toastr.error(t('js.backup.restore.failed', [files[0]]));
            $('#restoreBackup').html("");
        },
        onCancel: function(files, pd) {
            toastr.info(t('js.backup.restore.canceled', [files[0]]));
            $('#restoreBackup').html("");
        },
        onSubmit: function(files) {
            toastr.info(t('js.backup.restore.processing', [files[0]]));
            $('#restoreBackup').html(t('js.backup.restore.processing', [files[0]]));
        }
    });

    var updateTimeLapseStatus = function() {
        if (!timeLapseRunning) {
            timeLapseRunning = true;
            reqTimeLapseStatus = $.ajax({
                type: "POST",
                url: vUrl,
                data: {
                    username: username,
                    ePassword: ePassword,
                    method: "getTimeLapseStatus",
                    videoToken: videoToken,
                    videoTmpFile: videoTmpFile
                }
            }).done(function(msg) {
                var obj = jQuery.parseJSON(msg);
                consolelog(obj);
                clearInterval(videoTimeLapseTimer);
                if (obj.generated === true) {
                    toastr.info(t('js.timelapse.success', null));

                    $("#timeLapseResults").html(t('js.timelapse.success.result', ['<a href="' + vUrl + '?username=' + username + '&ePassword=' + encodeURIComponent(ePassword) + '&method=getTimeLapse&videoToken=' + videoToken + '" target="_blank">', '</a>']));
                    $('timeLapse').prop('disabled', false);
                } else {
                    var percVideoProcess = Math.round((obj.size * 100) / videoLength);
                    if (percVideoProcess >= 99) percVideoProcess = 99;
                    $("#timeLapseResults").html('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="' + percVideoProcess + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percVideoProcess + '%;">' + percVideoProcess + '%</div></div>');
                    videoTimeLapseTimer = window.setInterval(updateTimeLapseStatus, 5000);
                }
                timeLapseRunning = false;
            }).fail(function(msg) {
                timeLapseRunning = false;
            });
        }
    }

    $("#timeLapse").click(function() {
        var timeLapseDuration = $('#timeLapseDuration').val();
        $('timeLapse').prop('disabled', true);

        $("#timeLapseResults").html(t('js.timelapse.generating', null));
        var nightScene = true;

        swal(Object.assign({
            title: t('js.timelapse.nightscene', null),
            type: "info",
            showCancelButton: true,
            confirmButtonText: t('js.yes', null),
            cancelButtonText: t('js.no', null),
            showLoaderOnConfirm: true
        }, swalDefaults)).then(function() {

        }, function(mode) {
            if (mode && mode != 'cancel') {
                return;
            }

            if (!mode) {
                nightScene = true;
            } else {
                nightScene = false;
            }

            reqTimeLapse = $.ajax({
                type: "POST",
                url: vUrl,
                data: {
                    username: username,
                    ePassword: ePassword,
                    method: "timeLapse",
                    camera: selectedCamera,
                    nightScene: nightScene,
                    timeLapseDuration: timeLapseDuration
                }
            }).done(function(msg) {
                var obj = jQuery.parseJSON(msg);
                consolelog(obj);
                videoLength = obj.estimatedSize;
                videoToken = obj.token;
                videoTmpFile = obj.tmpFile;

                $("#timeLapseResults").html(t('js.timelapse.generating2', [obj.width, obj.height]));
                updateTimeLapseStatus();

            }).fail(function(msg) {
                $("#timeLapseResults").html('');
                $('timeLapse').prop('disabled', false);
                setError(msg);
            });
        });
    });

    $("#btnBackupMode").click(function() {
        backupScripts = $("#backupMode").val();

        toastr.info(t('js.backup.progress', null));
        $('#backupFile').html(t('js.backup.progress.short', null));
        reqDeviceInfo = $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "backup",
                backupScript: backupScripts
            }
        }).done(function(msg) {
            var obj = jQuery.parseJSON(msg);
            var label = t('js.backup.done', [obj.zipArchive, '<a href="' + vUrl + '?method=getBackup&backupId=' + encodeURIComponent(obj.backupId) + '">', '</a>']);
            toastr.info(label);
            $('#backupFile').html(label);

        }).fail(function(msg) {
            setError(msg);
        });

    });

    $("#savePluginForm").click(function() {
        $("#pluginForm").submit();
    });

    window.genericAction = function genericAction(oMethod, oName) {
        getDashboardRunning = true;
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: oMethod,
                name: oName
            }
        }).done(function(msg) {
            var response = JSON.parse(msg);
            if (response.success) {
                toastr.success(response.success);
            }
            if (response.info) {
                toastr.info(response.info);
            }
            if (response.failed) {
                toastr.error(response.failed);
            }
            getDashboardRunning = false;
        }).fail(function(msg) {
            var response = JSON.parse(msg);
            setError(msg);
            getDashboardRunning = false;
        });
    };

    // Search in plugins table
    $('#pluginFilter').keyup(function() {
        var rex = new RegExp($(this).val(), 'i');
        $('.searchable tr').hide();
        $('.searchable tr').filter(function() {
            return rex.test($(this).text());
        }).show();

    });

    var displayPlugins = function(jsonData) {
        if (jsonData) {
            var keys = Object.keys(jsonData);
            pluginsTable = $("#pluginsTableBody");
            pluginsTable.empty();
            for (i = 0; i < keys.length; i++) {
                enabledButton = '<input type="checkbox" data-size="mini" data-on-color="success" id="plugin-enabled-' + jsonData[keys[i]].identifier + '" ';
                if (jsonData[keys[i]].enabled) {
                    enabledButton = enabledButton + ' checked>';
                } else {
                    enabledButton = enabledButton + '>';
                }

                var actionsPlugin = "&nbsp;";
                if (Object.keys(jsonData[keys[i]].config.schema).length > 0) {
                    actionsPlugin = "<button type=\"button\" class=\"setManageUser btn btn-primary btn-sm plugin-select\" id=\"configure-plugin-" + jsonData[keys[i]].identifier + "\"> <span class=\"glyphicon glyphicon-cog\"></span> </button>";
                }

                services = '';
                for (j = 0; j < jsonData[keys[i]].services.length; j++) {
                    if (jsonData[keys[i]].services[j].status) {
                        services += '<span class="label label-success">' + jsonData[keys[i]].services[j].name + '</span>';
                    } else {
                        services += '<span class="label label-danger">' + jsonData[keys[i]].services[j].name + '</span>';
                    }
                }


                var info = "<tr class=\"left\"><td class=\"middle\"><strong>" + jsonData[keys[i]].name + "</strong></td><td class=\"middle\"><span class=\"label label-primary\">" + jsonData[keys[i]].type + "</span>";
                if (jsonData[keys[i]].sensor) {
                    info = info + "&nbsp;<span class=\"label label-info\">" + t('js.sensor', null) + "</span>";
                }

                info = info + "</td><td class=\"middle\">" + jsonData[keys[i]].description + "</td><td class=\"middle\">" + jsonData[keys[i]].version + "</td><td class=\"middle\">" + services + "</td><td class=\"middle\">" + enabledButton + "</td><td class=\"middle\">" + actionsPlugin + "</td></tr>";
                pluginsTable.append(info);
                $("#plugin-enabled-" + jsonData[keys[i]].identifier).bootstrapSwitch();

                $("#plugin-enabled-" + jsonData[keys[i]].identifier).on('switchChange.bootstrapSwitch', function(event, state) {
                    var status = "off";
                    if (state) {
                        status = "on";
                    }
                    var pluginIdentifier = $(this).attr('id').replace('plugin-enabled-', '');
                    reqPluginSetEnabled = $.ajax({
                        type: "POST",
                        url: vUrl,
                        data: {
                            username: username,
                            ePassword: ePassword,
                            method: "setPluginEnabled",
                            pluginIdentifier: pluginIdentifier,
                            status: status
                        }
                    }).done(function(msg) {
                        $("#managePluginsItem").trigger("click");
                    }).fail(function(msg) {
                        $("#managePluginsItem").trigger("click");
                        displayError(msg);
                    });
                });
            }
        }
        $("#pluginsLoader").hide();
        $(".plugin-select").click(function() {
            var pluginIdentifier = $(this).attr('id').replace('configure-plugin-', '');
            $('#pluginModal').modal('show');
            for (var i = 0; i < jsonData.length; i++) {
                if (pluginIdentifier == jsonData[i].identifier) {
                    var plugin = jsonData[i];
                    break;
                }
            }
            //var plugin = jsonData[pluginIdentifier];
            $("#pluginForm").empty();
            configForm = plugin.config.form;
            for (i = 0; i < plugin.config.form.length; i++) {
                consolelog(eval(plugin.config.form[i].onChange));
            }

            $("#pluginForm").jsonForm({
                schema: plugin.config.schema,
                "form": plugin.config.form,
                "value": plugin.configValues,
                onSubmit: function(errors, values) {
                    if (errors) {
                        setError(t('js.invalid.form.data', null));
                    } else {
                        reqPluginSetConfig = $.ajax({
                            type: "POST",
                            url: vUrl,
                            data: {
                                username: username,
                                ePassword: ePassword,
                                method: "setPluginConfig",
                                data: JSON.stringify(values),
                                pluginIdentifier: pluginIdentifier
                            }
                        }).done(function(msg) {
                            for (var i = 0; i < jsonData.length; i++) {
                                if (pluginIdentifier == jsonData[i].identifier) {
                                    jsonData[i].configValues = values;
                                    break;
                                }
                            }

                            $('#pluginModal').modal('hide');
                            toastr.success(t('js.plugin.settings.saved', null));
                        }).fail(function(msg) {
                            //jsonData[pluginIdentifier].configValues = values;
                            $('#pluginModal').modal('hide');
                            displayError(msg);
                        });
                    }
                }
            });
        });
        $('#pluginFilter').keyup();
    }

    $("#managePluginsItem").click(function() {
        var pluginsData = JSON.parse(readCookie('plugins-cache'), function(key, value) {
            if (value && (typeof value === 'string') && value.indexOf("function") === 0) {
                // we can only pass a function as string in JSON ==> doing a real function
                var jsFunc = new Function('return ' + value)();
                return jsFunc;
            }

            return value;
        });

        if (pluginsData) {
            displayPlugins(pluginsData);
        }

        $("#pluginsLoader").show();
        reqPluginList = $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getPluginList"
            }
        }).done(function(msg) {
            // var jsonData = JSON.parse(msg);
            bakeCookie('plugins-cache', msg);
            var jsonData = JSON.parse(msg, function(key, value) {
                if (value && (typeof value === 'string') && value.indexOf("function") === 0) {
                    // we can only pass a function as string in JSON ==> doing a real function
                    var jsFunc = new Function('return ' + value)();
                    return jsFunc;
                }

                return value;
            });
            displayPlugins(jsonData);


        }).fail(function(msg) {
            $("#pluginsLoader").hide();
        });
    });

    $("#btnBackup").click(function() {
        $("#backupModal").modal();
    });

    $("#btnTestNotification").click(function() {
        var reqTestNotification = $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "testNotification"
            }
        }).done(function(msg) {
            //var obj = jQuery.parseJSON(msg);
            toastr.success(t('js.test.notification.result', null));

        }).fail(function(msg) {

        });
    });

    var logTimerId = -100;
    $("#manageLogsItem").click(function() {
        if (!reqLogsIsRunning) {
            //window.setInterval(getLogs,3000);
            $('#refreshLogsButton').toggleClass('active');
            getLogs();

        }
    });

    var timerLog = function() {
        if (!reqLogsIsRunning) {
            $('#refreshLogsButton').toggleClass('active');
            getLogs();
        }

        if ($('#manageLogs').is(':visible') && (logTimerId == -100)) {
            logTimerId = 0;
            logTimerId = window.setInterval(timerLog, 3000);
            consolelog(logTimerId);
        }

        if (!$('#manageLogs').is(':visible') && (logTimerId != -100)) {
            clearInterval(logTimerId);
            logTimerId = -100;
        }
    }

    $("#refreshLogsButton").click(function() {
        timerLog();
    });

    $("#stopRefreshLogsButton").click(function() {
        clearInterval(logTimerId);
        logTimerId = -100;
    });

    var setFocusToChatInput = function() {
        $("#askMe").focus()
        window.clearTimeout(setFocusToChatInputTimer);
    }



    $('#askMe').keypress(function(e) {
        if (e.keyCode == 13) {
            consolelog($('#askMe').val());
            $('#chatHistory').append('<div class="from-me"><p>' + $('#askMe').val() + '</p></div><div class="clear-chat"></div><div id="chatLoader" class="center"><img src="img/ajax-loader.gif" id="configLoader" /></div>');
            $("#chatContent").animate({
                scrollTop: ($('#chatContent').height() * 1000)
            });

            $.ajax({
                type: "POST",
                url: vUrl,
                data: {
                    username: username,
                    ePassword: ePassword,
                    method: "voiceCommand",
                    words: '["' + $('#askMe').val() + '"]'
                }
            }).done(function(msg) {
                var obj = jQuery.parseJSON(msg);
                $('#chatLoader').remove();
                $('#chatHistory').append('<div class="from-them"><p>' + obj.msg + '</p></div><div class="clear-chat"></div>');
                $("#chatContent").animate({
                    scrollTop: ($('#chatContent').height() * 1000)
                });
                var u = new fallbackSpeechSynthesisUtterance(obj.msg);
                u.lang = lng;
                u.volume = 1.0;
                u.rate = 1.0;
                fallbackSpeechSynthesis.speak(u);

            }).fail(function(msg) {
                $('#chatLoader').remove();
                $('#chatHistory').append('<div class="from-them"><p>' + t('js.chat.failed', null) + '</p></div><div class="clear-chat"></div>');
                $("#chatContent").animate({
                    scrollTop: ($('#chatContent').height() * 1000)
                });
                var u = new fallbackSpeechSynthesisUtterance(obj.msg);
                u.lang = lng;
                u.volume = 1.0;
                u.rate = 1.0;
                fallbackSpeechSynthesis.speak(u);
            });

            $('#askMe').val('');
            setFocusToChatInput();

        }
    });

    var drawTable = function() {
        $("#addDeviceForm").empty();
        $("#devicesLoader").hide();

        var data = [];
        for (var i = 0; i < deviceData.length; i++) {
            var tmp = {};
            tmp.id = deviceData[i].id;
            tmp.description = deviceData[i].name;
            tmp.icon = deviceData[i].icon;
            data.push(tmp);
        }

        drawSquareAdminInterface(data, $("#devicesTable"), "device-set-", "device-del-", "setManageDevice", "delManageDevice");

        $(".setManageDevice").click(function() {
            if (event.target.tagName.toLowerCase() === 'span') {
                targetId = event.target.parentNode.id.replace("device-set-", "");
            } else {
                targetId = event.target.id.replace("device-set-", "");
            }
            consolelog("changed !" + targetId);
            consolelog(fullObjects[targetId]);
            manageDeviceForm(fullObjects[targetId], targetId);
        });

        $(".delManageDevice").click(function() {
            if (event.target.tagName.toLowerCase() === 'span') {
                targetId = event.target.parentNode.id.replace("device-del-", "");
            } else {
                targetId = event.target.id.replace("device-del-", "");
            }
            consolelog("changed !" + targetId);
            consolelog(fullObjects[targetId]);

            swal(Object.assign({
                title: t('js.device.delete.confirmation', [fullObjects[targetId].description]),
                type: "warning",
                showCancelButton: true,
                confirmButtonText: t('js.continue', null),
                cancelButtonText: t('js.cancel', null),
                showLoaderOnConfirm: true
            }, swalDefaults)).then(function() {
                delete deviceData[targetId];
                setDevices();
                $("#manageDevicesItem").click();
            }, function(mode) {
                if (mode && mode != 'cancel') {
                    return;
                }
            });
        });
    }

    var getFullObjects = function() {
        $("#deviceTable").show();
        /*$.ajax({
            type: "GET",
            url: vUrl + "conf/devices/get/",
            data: {
                u: username,
                p: password
            }
        }).done(function(msg) {
            var jsonData = msg;
            if (jsonData) {
                deviceData = jsonData;
                deviceTable = $("#deviceTableBody");
                deviceTable.empty();
                consolelog(jsonData);

                drawTable();
            }
        }).fail(function(msg) {
            setError(msg);
            $("#devicesLoader").hide();
        });*/
    };

    var generateTile = function(tile) {
        var htmlTile = '<div class="col-md-3 tile" id="' + tile.identifier + '-tile">';
        var backgroundColor = '#FFFFFF';
        var foregroundColor = '#000000';
        if (tile.colors.colorDefault) {
            backgroundColor = tile.colors.colorDefault;
        }

        if (tile.colors.colorOn && tile.status) {
            backgroundColor = tile.colors.colorOn;
        }

        if (tile.colors.colorOff && !tile.status) {
            backgroundColor = tile.colors.colorOff;
        }

        if (tile.colors.colorContent) {
            foregroundColor = tile.colors.colorContent;
        }

        htmlTile += '<input type="hidden" id="' + tile.identifier + 'data" name="' + tile.identifier + 'data" value="' + Base64.encode(JSON.stringify(tile)) + '"/>';
        // consolelog(tile);
        // var action =
        // if (tile.action != null) {

        // }
        tilesData[tile.identifier] = tile.object;
        var actionCss = '';
        if (tile.action) {
            actionCss = tile.action + ' action';
        }

        switch (tile.type) {

            case "InfoOneText":
                htmlTile += '<div id="' + tile.identifier + '" class="' + actionCss + ' subTile" style="background-color:' + backgroundColor + ';color:' + foregroundColor + ';">';
                htmlTile += '<i class="fa deviceIcon" data-unicode="' + tile.icon + '">&#x' + tile.icon + '</i><br/>';
                if (tile.text.length > 50) {
                    htmlTile += '<span class="smallerText">' + tile.text + '</span>';
                } else {
                    htmlTile += tile.text;
                }
                htmlTile += '</div>';
                break;
            case "InfoTwoText":
                htmlTile += '<div id="' + tile.identifier + '" class="' + actionCss + ' infoTile subTile" style="background-color:' + backgroundColor + ';color:' + foregroundColor + ';">';
                htmlTile += '<i class="fa deviceIcon" data-unicode="' + tile.icon + '">&#x' + tile.icon + '</i><br/>';
                htmlTile += tile.text;
                htmlTile += '<h5>' + tile.subtext + '</h5>';
                htmlTile += '</div>';
                break;
            case "InfoTwoIcon":
                htmlTile += '<div id="' + tile.identifier + '" class="' + actionCss + ' infoTile subTile" style="background-color:' + backgroundColor + ';color:' + foregroundColor + ';">';
                htmlTile += '<i class="fa deviceIcon" data-unicode="' + tile.icon + '">&#x' + tile.icon + '</i><br/>';
                htmlTile += '<i class="fa deviceSubIcon" data-unicode="' + tile.subicon + '">&#x' + tile.subicon + '</i><br />';
                htmlTile += tile.text;
                htmlTile += '</div>';
                break;
            case "ActionOneIcon":
                htmlTile += '<div id="' + tile.identifier + '" class="' + actionCss + ' action actionNoStatusTile subTile" style="background-color:' + backgroundColor + ';color:' + foregroundColor + ';">';
                htmlTile += '<i class="fa deviceIcon" data-unicode="' + tile.icon + '">&#x' + tile.icon + '</i><br/>';
                htmlTile += tile.text;
                htmlTile += '</div>';
                break;
            case "ActionOneIconStatus":
                var val = '0';
                if (tile.status) val = '1';
                htmlTile += '<input type="hidden" id="' + tile.action + ' ' + tile.identifier + 'cb" name="' + tile.identifier + 'cb" value="' + val + '" />';
                htmlTile += '<div id="' + tile.identifier + '" ';
                htmlTile += 'class="action deviceTile ';
                if (tile.status) htmlTile += 'deviceTileActive ';
                htmlTile += 'subTile" style="background-color:' + backgroundColor + ';color:' + foregroundColor + ';">';
                htmlTile += '<i class="fa deviceIcon" data-unicode="' + tile.icon + '">&#x' + tile.icon + '</i><br/>';
                htmlTile += tile.text;
                htmlTile += '</div>';
                break;
            case "PictureText":
                htmlTile += '<div id="' + tile.identifier + '" class="' + actionCss + ' infoTile subTile action" style="background-color:' + backgroundColor + ';color:' + foregroundColor + ';">';
                htmlTile += ' <div class="tileCrop"><img src="data:image/jpg;base64,' + tile.picture + '" class="tileImage" /></div>';
                htmlTile += ' <div class="tileImageText">' + tile.text + '</div>';
                htmlTile += '</div>';
                break;
            case "PicturesIcon":
                htmlTile += '<div id="' + tile.identifier + '" class="' + actionCss + ' infoTile subTile" style="background-color:' + backgroundColor + ';color:' + foregroundColor + ';">';
                htmlTile += '<i class="fa deviceIcon" data-unicode="' + tile.icon + '">&#x' + tile.icon + '</i><br/>';
                for (i = 0; i < tile.pictures.length; i++) {
                    htmlTile += '<img src="data:image/jpg;base64,' + tile.pictures[i] + '" />&nbsp;&nbsp;';
                }
                htmlTile += '</div>';
                break;
            case "GenericAction":
                htmlTile += '<div id="' + tile.action + '--H--' + tile.identifier + '" class="' + actionCss + ' genericAction action actionNoStatusTile subTile" style="background-color:' + backgroundColor + ';color:' + foregroundColor + ';">';
                htmlTile += '<i class="fa deviceIcon" data-unicode="' + tile.icon + '">&#x' + tile.icon + '</i><br/>';
                htmlTile += tile.text;
                htmlTile += '</div>';
                break;
            case "GenericActionWithStatus":
                var val = '0';
                if (tile.status) val = '1';
                htmlTile += '<input type="hidden" id="' + tile.identifier + 'cb" name="' + tile.identifier + 'cb" value="' + val + '" />';
                htmlTile += '<div id="' + tile.action + '--H--' + tile.identifier + '" ';
                htmlTile += 'class="' + actionCss + ' genericActionWithStatus action deviceTile ';
                if (tile.status) htmlTile += 'deviceTileActive ';
                htmlTile += 'subTile" style="background-color:' + backgroundColor + ';color:' + foregroundColor + ';">';
                htmlTile += '<i class="fa deviceIcon" data-unicode="' + tile.icon + '">&#x' + tile.icon + '</i><br/>';
                htmlTile += tile.text;
                htmlTile += '</div>';
                break;
            default:
                htmlTile += '<div id="' + tile.identifier + '" class="' + actionCss + ' infoTile subTile" style="background-color:' + backgroundColor + ';color:' + foregroundColor + ';">';
                htmlTile += '<i class="fa deviceIcon" data-unicode="' + tile.icon + '">&#x' + tile.icon + '</i><br/>';
                htmlTile += tile.text;
                htmlTile += '<h5>' + tile.subtext + '</h5>';
                htmlTile += '</div>';
                break;
        }
        htmlTile += '</div>';
        return htmlTile;
    }


    var generateTiles = function(dashboardItems, container) {
        var tiles = '';
        var line = 0;

        for (k = 0; k < dashboardItems.length; k++) {
            if (line == 0) tiles += '<div class="row tileRow">';

            dashboardItem = dashboardItems[k];

            var tile = generateTile(dashboardItem);
            tiles += tile;

            line++;
            if (line > 3) {
                line = 0;
                tiles += '</div>';
            };
        }
        if (line <= 3) tiles += '</div>';

        if (!$.trim($('#' + container).html()).length) {
            $("#" + container).hide();
            $("#" + container).html(tiles);
            $("#" + container).fadeIn("slow", function() {
                // Animation complete
            });
        } else {
            $("#" + container).html(tiles);
        }

        // Actions
        $(".statistics").click(function(e) {
            statisticsBtn.click();
        });

        $('#mapModal').unbind();
        $('#mapModal').on('shown.bs.modal', function() {
            map.updateSize();
        });

        var c = document.getElementById('popupMap');
        var overlay = new ol.Overlay({
            element: c
        });
        map.addOverlay(overlay);

        $(".map").click(function(e) {
            if (tilesData[e.currentTarget.id]) {
                var locations = tilesData[e.currentTarget.id].locations;

                // Remove layers
                for (i = 0; i < mapLayers.length; i++) {
                    map.removeLayer(mapLayers[i]);
                }
                mapLayers = [];

                for (i = 0; i < locations.length; i++) {
                    var l = locations[i];
                    // consolelog(l);

                    var iconFeature = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.transform([l.longitude, l.latitude], 'EPSG:4326', 'EPSG:3857')),
                        hData: l
                    });

                    var iconStyle = new ol.style.Style({
                        image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
                            anchor: [0.5, 46],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'pixels',
                            opacity: 0.75,
                            src: 'img/map-marker.png'
                        }))
                    });

                    iconFeature.setStyle(iconStyle);

                    var vectorSource = new ol.source.Vector({
                        features: [iconFeature]
                    });

                    var vectorLayer = new ol.layer.Vector({
                        source: vectorSource
                    });

                    mapLayers.push(vectorLayer);
                    map.addLayer(vectorLayer);

                    $("#mapInfosTitle").html(l.title);
                    $("#mapInfosSubtitle").html(l.detailed);
                    $("#mapInfosDate").html(l.dateFormatted);
                }

                map.on("click", function(e) {
                    map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
                        $("#mapInfosTitle").html(feature.T.hData.title);
                        $("#mapInfosSubtitle").html(feature.T.hData.detailed);
                        $("#mapInfosDate").html(feature.T.hData.dateFormatted);
                        //document.getElementById('popupMapContent').innerHTML = '<p>' + feature.T.hData.title + '</p>';
                        consolelog(feature.T.hData);
                    })
                });

                // Zoom
                if (mapLayers.length > 0) {
                    var ml = mapLayers[(mapLayers.length - 1)];

                    var extent = ml.getSource().getExtent();
                    map.getView().fit(extent, map.getSize());
                    map.getView().setZoom(16);
                }



                $('#mapModal').modal();
            }
        });
    }

    var getTile = function(tileId) {
        return JSON.parse(Base64.decode($("#" + tileId + "data").val()));
    }

    var getDashboard = function() {
        if (getDashboardRunning) return;

        document.getElementById("dashboard-generated-date").innerHTML = '';
        var dashboardContent = JSON.parse(readCookie('dashboard-cache'));
        var dashboardTs = 0;
        if (dashboardContent) {
            dashboardTs = dashboardContent.timestamp;
            // Cache
            if (dashboardContent.tiles) {
                generateTiles(dashboardContent.tiles, 'tiles');
                tileActions();
            }
            document.getElementById("dashboard-generated-date").innerHTML = '<h6>' + t('js.dashboard.lastrefresh') + ' ' + dashboardContent.timestampFormatted + '</h6>';
        }

        getDashboardRunning = true;
        $.ajax({
            type: "GET",
            url: vUrl + "dashboard/get/" + dashboardTs + "/",
            data: {
                u: username,
                p: password,
            }
        }).done(function(msg) {
            if (msg) {
                var dashboardItems = msg;
                if (dashboardItems) {
                    bakeCookie('dashboard-cache', JSON.stringify(msg));
                    generateTiles(dashboardItems.tiles, 'tiles');
                    tileActions();
                }
                //getCamera();
                document.getElementById("dashboard-generated-date").innerHTML = '<h6>' + t('js.dashboard.lastrefresh') + ' ' + dashboardItems.timestampFormatted + '</h6>';
            }
            getDashboardRunning = false;
        }).fail(function(msg) {
            setError(msg);
            getDashboardRunning = false;
        });
    };

    $("#dashboardItem").click(function() {
        getDashboard();
    });

    var now = function() {
        return Date.now() / 1000 | 0;
    }

    var tileActions = function() {
        var pressTimer;

        // Keyboard press
        document.onkeypress = function(evt) {
            if (evt.key == 'm') {
                if ($('#tiles').is(':visible') && !$('.modal').hasClass('in')) {
                    if ((username == "") || (username == "admin")) {
                        toastr.info(t('js.edit.tiles.auto.login.deny', null));
                        return;
                    }
                    showLoader();

                    $.ajax({
                        type: "POST",
                        url: vUrl,
                        data: {
                            username: username,
                            ePassword: ePassword,
                            method: "getDashboard",
                            data: JSON.stringify({
                                all: !tileEditMode
                            })
                        }
                    }).done(function(msg) {
                        var dashboardItems = JSON.parse(msg);
                        if (!tileEditMode) {
                            if (dashboardItems) {
                                generateTiles(dashboardItems.tiles, 'tiles');
                                tileActions();
                            }
                            getCamera();
                            tileEditMode = true;
                            getDashboardRunning = false;
                            $(".tile").addClass("shake-little");
                            $(".tile").addClass("shake-constant");
                            for (k = 0; k < dashboardItems.tiles.length; k++) {
                                var excluded = false;
                                if ((settings.user !== null) && (settings.user.excludeTiles !== null)) {
                                    if (jQuery.inArray(dashboardItems.tiles[k].identifier, settings.user.excludeTiles) !== -1) {
                                        excluded = true;
                                    }
                                }

                                var tileMenu = '<div class="editingTiles"> \
                                        <div class="btn-group" data-toggle="buttons"> <br /><br />\
                                          <label class="btn editTiles';
                                if (!excluded) {
                                    tileMenu += ' btn-success active';
                                } else {
                                    tileMenu += ' btn-default';
                                }
                                tileMenu += '" id="' + dashboardItems.tiles[k].identifier + '-editTiles-visible"><input type="radio" class="editTiles" name="' + dashboardItems.tiles[k].identifier + '-editTiles" autocomplete="off"';
                                if (!excluded) {
                                    tileMenu += ' btn-success checked';
                                } else {
                                    tileMenu += ' btn-default';
                                }
                                tileMenu += '><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> \
                                          </label> \
                                          <label class="btn editTiles';
                                if (excluded) {
                                    tileMenu += ' btn-danger active';
                                } else {
                                    tileMenu += ' btn-default';
                                }
                                tileMenu += '" id="' + dashboardItems.tiles[k].identifier + '-editTiles-invisible"><input type="radio" class="editTiles" name="' + dashboardItems.tiles[k].identifier + '-editTiles" autocomplete="off" checked';
                                if (excluded) {
                                    tileMenu += ' btn-danger checked';
                                } else {
                                    tileMenu += ' btn-default';
                                }
                                tileMenu += '><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> \
                                          </label> \
                                        </div> \
                                    </div>';
                                $("#" + dashboardItems.tiles[k].identifier + '-tile').append(tileMenu);
                            }

                            $(".editTiles").click(function(e) {
                                identifier = e.currentTarget.id;
                                var visible = false;
                                if (identifier.indexOf('invisible') === -1) {
                                    visible = true;
                                };
                                consolelog(visible);
                                identifier = identifier.replace("-editTiles-visible", "").replace("-editTiles-invisible", "");

                                if (!settings.user.excludeTiles) {
                                    settings.user.excludeTiles = new Array();
                                }
                                if (!visible) {
                                    if (jQuery.inArray(identifier, settings.user.excludeTiles) === -1) {
                                        settings.user.excludeTiles.push(identifier);
                                    }
                                } else {
                                    if (jQuery.inArray(identifier, settings.user.excludeTiles) !== -1) {
                                        settings.user.excludeTiles = jQuery.grep(settings.user.excludeTiles, function(value) {
                                            return value != identifier;
                                        });
                                    }
                                }

                            });
                        } else {
                            tileEditMode = false;
                            $(".tile").removeClass("shake-little");
                            $(".tile").removeClass("shake-constant");
                            $(".tile").removeClass("editingTiles");
                            $(".editingTiles").remove();
                            showLoader();
                            $.ajax({
                                type: "POST",
                                url: vUrl,
                                data: {
                                    username: username,
                                    ePassword: ePassword,
                                    method: "setExcludeTiles",
                                    data: JSON.stringify({
                                        excludeTiles: settings.user.excludeTiles
                                    })
                                }
                            }).done(function(msg) {
                                getDashboard();
                                hideLoader();
                            }).fail(function(msg) {
                                hideLoader();
                            });

                        }
                        hideLoader();
                    }).fail(function(msg) {
                        hideLoader();
                    });
                }
            }
        };

        $(".genericAction").click(function() {
            tileData = event.target.id.split("--H--");
            if (tileData.length == 2) {
                var callback = tileData[0];
                var tileId = tileData[1];

                $.ajax({
                    type: "POST",
                    url: vUrl,
                    data: {
                        username: username,
                        ePassword: ePassword,
                        method: callback,
                        name: tileId
                    }
                }).done(function(msg) {
                    var response = JSON.parse(msg);
                    if (response.success) {
                        toastr.success(response.success);
                    }
                    if (response.info) {
                        toastr.info(response.info);
                    }
                    if (response.failed) {
                        toastr.error(response.failed);
                    }
                }).fail(function(msg) {
                    var response = JSON.parse(msg);
                    setError(msg);
                });
            }
        });

        $(".genericActionWithStatus").click(function() {
            tileData = event.target.id.split("--H--");
            if (tileData.length == 2) {
                var callback = tileData[0];
                var tileId = tileData[1];
                var tile = getTile(tileId);

                consolelog(callback);
                consolelog(tileId);

                cb = $("#" + tileId + "cb");
                btn = $("#" + event.target.id);
                //consolelog("Old val :"+cb.val());
                if (cb.val() == "1") {
                    cb.val("0");
                } else {
                    cb.val("1");
                }
                //consolelog("New val :"+cb.val());
                status = "off";
                if (cb.val() == "1") {
                    status = "on";
                    if (tile.colors.colorOn) {
                        btn.css("background-color", tile.colors.colorOn);
                    }
                } else {
                    btn.removeClass("deviceTileActive");
                    if (tile.colors.colorOff) {
                        btn.css("background-color", tile.colors.colorOff);
                    }
                }

                // Update dashboard cache
                msg = readCookie('dashboard-cache');
                if (msg) {
                    data = JSON.parse(msg);
                    if (data.tiles) {
                        for (var i = 0; i < data.tiles.length; i++) {
                            if ((data.tiles[i].identifier == tileId) && ((data.tiles[i].status == 0) || (data.tiles[i].status == 1))) {
                                data.tiles[i].status = !data.tiles[i].status;
                                consolelog("Local update status found for tileId" + tileId);
                                break;
                            }
                        }

                        bakeCookie('dashboard-cache', JSON.stringify(data));
                    }
                }

                $.ajax({
                    type: "POST",
                    url: vUrl,
                    data: {
                        username: username,
                        ePassword: ePassword,
                        method: callback,
                        status: status,
                        name: tileId
                    }
                }).done(function(msg) {
                    var response = JSON.parse(msg);
                    if (response.success) {
                        toastr.success(response.success);
                    }
                    if (response.info) {
                        toastr.info(response.info);
                    }
                    if (response.failed) {
                        toastr.error(response.failed);
                    }
                }).fail(function(msg) {
                    var response = JSON.parse(msg);
                    setError(msg);
                });
            }


        });

        var generateChatContent = function() {
            notificationsTable = $("#notificationsTable");
            notificationsTable.empty();
            consolelog(notifications);
            for (i = (notifications.length - 1); i >= 0; i--) {
                consolelog(notifications[i]);
                if (notifications[i]) {
                    if (notifications[i].message && notifications[i].message != "" && notifications[i].message != 'null') {
                        $('#chatHistory').append('<p><h6>' + notifications[i].dt + '</h6></p><div class="from-them"><p>' + notifications[i].message + '</p></div><div class="clear-chat"></div>');
                    }
                    if (notifications[i].image && notifications[i].image != "") {
                        var img = Base64.decode(notifications[i].image);
                        $('#chatHistory').append('<div class="from-them"><p><img class="chat-image" src="data:image/jpg;base64,' + notifications[i].image + '" /></p></div><div class="clear-chat"></div>');
                    }
                }

            }
            $("#chatContent").animate({
                scrollTop: ($('#chatContent').height() * 1000)
            });
        }

        $('#chat--H--chat').unbind();
        $('#chat--H--chat').click(function() {
            $('#chatModal').unbind();
            $('#chatModal').on('show.bs.modal', function(e) {
                notifications = JSON.parse(readCookie('chat-cache'));
                var timestamp = 0;
                if (notifications) {
                    if (notifications.length > 0) {
                        timestamp = notifications[0].ts;
                    }

                    setTimeout(function() {
                        generateChatContent();
                    }, 1000);
                }

                setFocusToChatInputTimer = window.setInterval(setFocusToChatInput, 900);
                $('#chatHistory').empty();
                $.ajax({
                    type: "POST",
                    url: vUrl,
                    data: {
                        username: username,
                        ePassword: ePassword,
                        method: "getLastNotifications",
                        ts: timestamp
                    }
                }).done(function(msg) {

                    var tmpNotifications = jQuery.parseJSON(msg);
                    var currentTs = now();
                    var tmp = [];
                    if (notifications) {
                        for (var i = 0 ; i < notifications.length ; i++) {
                            if (notifications[i].ts < (currentTs - (7 * 24 * 60 * 60))) {

                            } else {
                                tmp.push(notifications[i]);
                            }
                        }
                    }
                    notifications = tmpNotifications.concat(tmp);
                    bakeCookie('chat-cache',  JSON.stringify(notifications));


                    generateChatContent();
                }).fail(function(msg) {
                    setError(msg);
                });
            });

            $('#chatModal').modal();
        });



        $('#cameras').click(function() {
            $("#cameraTabAction").trigger("click");
        });

        $('#ambiances--H--ambiances').click(function() {
            $("#ambianceTabBtn").trigger("click");
        });
    }

    var getAmbiancesItems = function() {

        ambiancesItems = JSON.parse(readCookie('ambiances-cache'));
        if (ambiancesItems == null) {
            showLoader();
        } else {
            generateTiles(ambiancesItems, 'tilesAmbiance');
            tileActions();
        }

        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getAmbiancesItems"
            }
        }).done(function(msg) {
            ambiancesItems = JSON.parse(msg);
            if (ambiancesItems) {
                generateTiles(ambiancesItems, 'tilesAmbiance');
                tileActions();
            }
            bakeCookie('ambiances-cache', msg);
            hideLoader();
        }).fail(function(msg) {
            setError(msg);
            hideLoader();
        });
    };

    $("#ambianceTabBtn").click(function() {
        getAmbiancesItems();
    });

    var refreshCamera = function() {
        /*if ($('#cameraTab').attr('class').indexOf("active") > 0) {
            consolelog("Refreshing camera");
            if (reqCamera != null) {
                reqCamera.abort();
            };
            if (!videoCameraMode) {
                getCamera();
            }
        }*/
    }

    var refreshList = function() {
        if ($('#switchsTab').attr('class').indexOf("active") > 0) {
            consolelog("Refreshing data");
            if (reqList != null) {
                reqList.abort();
            };
            if (!tileEditMode) getDashboard();
        }

        if ($('#cameraTab').attr('class').indexOf("active") <= 0) {
            if (cameras) {
                var keys = Object.keys(cameras);
                for (i = 0; i < keys.length; i++) {
                    if ($("#camera-preview-" + keys[i]) && $("#camera-preview-" + keys[i]).attr("src") != "") {
                        // Clear MJPEG stream
                        $("#camera-preview-" + keys[i]).attr("src", "");
                        consolelog("Stopping MJPEG flow for " + "#camera-preview-" + keys[i]);
                    }
                }

                if ($("#cameraSource") && $("#cameraSource").attr("src") != "") {
                    $("#cameraSource").attr("src", "");
                }
            }
        }
    }

    var getSettings = function() {
        consolelog("Get settings");
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getSettings"
            }
        }).done(function(msg) {
            settings = jQuery.parseJSON(msg);

            displayLog = settings.debug;
            if (!settings.debug) {
                $("#debugTab").remove();
            }

            consolelog(settings);

            if (settings.lng) {
                lng = settings.lng;
            }

            if (!settings.enablePlan) {
                $("#planMenu").remove();
            }

            if (settings.agentRefreshCamera) {
                refreshCameraInt = settings.agentRefreshCamera;
            }

            if (settings.agentRefreshList) {
                refreshListInt = settings.agentRefreshList;
            }



            // Timers
            window.setInterval(refreshCamera, (refreshCameraInt * 1000));
            window.setInterval(refreshList, (refreshListInt * 1000));
        }).fail(function(msg) {
            setError(msg);
        });
    }

    var drawCameras = function() {
        if (cameras == null) {
            return false;
        }
        keys = Object.keys(cameras);
        cameraSelector = $("#cameraSelector");

        foundDefaultCamera = false;
        var wall = '<div class="container"><div class="row">';
        var j = 0;

        if ($("#cameraWall").html().length == 0) {
            cameraSelector.empty();
            cameraSelector.append("<label class=\"btn btn-default cameraSelectorClick\" id=\"idcameraall\"><input type=\"radio\" name=\"options\" id=\"optCameraall\" />" + t('js.camera.selector.all', null) + "</label>");

            cameraWallStream = [];
            for (i = 0; i < keys.length; i++) {
                //camSelectorContent =
                cameraSelector.append("<label class=\"btn btn-default cameraSelectorClick\" id=\"idcamera" + cameras[keys[i]]["key"] + "\"><input type=\"radio\" name=\"options\" id=\"optCamera" + cameras[keys[i]]["key"] + "\" />" + cameras[keys[i]]["description"] + "</label>");

                if (cameras[keys[i]]["videoUrl"] !== null) {
                    if ((j > 0) && ((j % 3) == 0)) {
                        wall += '</div><div class="row">';
                    }


                    var canvasId = 'wall-stream-' + keys[i];

                    //var player = new MJPEG.Player(canvasId, (vUrl + cameras[keys[i]]["videoUrl"]), {});
                    //cameraWallStream.push(player);

                    // wall += '<div class="col-md-4 cameraWallCrop cameraSelectorClick" id="idcam' + cameras[keys[i]]["key"] + '"><div>' + cameras[keys[i]]["description"] + '</div><canvas id="' + canvasId + '"></canvas></div>';
                    wall += '<div class="col-md-4 cameraWallCrop cameraSelectorClick" id="idcam' + cameras[keys[i]]["key"] + '"><div>' + cameras[keys[i]]["description"] + '</div><img class="cameraWallImage" id="camera-preview-' + cameras[keys[i]]["key"] + '" src="' + vUrl + cameras[keys[i]]["videoUrl"] + '" /></div>';
                    $("#cameraWall").html(wall);

                    j++;
                }

                $("#idcameraall").button('toggle');
                $("#idHistoryCameraall").button('toggle');
            }

            wall += '</div></div>';
            $(".camController").hide();
            $("#cameraWall").html(wall);

        } else {
            // Resume video
            for (i = 0; i < keys.length; i++) {
                if (cameras[keys[i]]["videoUrl"] !== null && $("#camera-preview-" + keys[i]).attr("src") == "") {
                    consolelog("Resuming video for #camera-preview-" + cameras[keys[i]]["key"]);
                    $("#camera-preview-" + cameras[keys[i]]["key"]).attr("src", vUrl + cameras[keys[i]]["videoUrl"]);
                }
            }
        }

        dailyTimeLapseLink();

        $(".cameraSelectorClick").click(function(evt) {
            // for (var i = 0 ; i < cameraWallStream.length ; i++) {
            //    cameraWallStream[i].stop();
            // }
            reqCamera.abort();
            //consolelog(evt);
            document.getElementById("cameraSource").src = "";
            selectedCamera = evt.currentTarget.id.replace("idcamera", "");
            selectedCamera = selectedCamera.replace("idcam", "");
            $("#idcamera" + selectedCamera).button('toggle');

            $("cameraWall").hide();
            if (selectedCamera == 'all') {
                $("#cameraHistoryForm").hide();

                // Stop camera source
                if ($("#cameraSource") && $("#cameraSource").attr("src") != "") {
                    $("#cameraSource").attr("src", "");
                }

                // Restart cameraWall
                var keys = Object.keys(cameras);
                for (i = 0; i < keys.length; i++) {
                    if ($("#camera-preview-" + keys[i]) && $("#camera-preview-" + keys[i]).attr("src") == "") {
                        consolelog("Restart MJPEG flow for " + "#camera-preview-" + keys[i]);
                        $("#camera-preview-" + cameras[keys[i]]["key"]).attr("src", vUrl + cameras[keys[i]]["videoUrl"]);
                    }
                }

                $(".camController").hide();
                $("#cameraWall").show();


            } else {
                $("#cameraHistoryForm").show();

                // Stop camera wall stream
                var keys = Object.keys(cameras);
                for (i = 0; i < keys.length; i++) {
                    if ($("#camera-preview-" + keys[i]) && $("#camera-preview-" + keys[i]).attr("src") != "") {
                        // Clear MJPEG stream
                        $("#camera-preview-" + keys[i]).attr("src", "");
                        consolelog("Stopping MJPEG flow for " + "#camera-preview-" + keys[i]);
                    }
                }

                $("#cameraWall").hide();
                $(".camController").show();
                dailyTimeLapseLink();
                getCamera();
            }

            consolelog(selectedCamera);
        });
    }


    var getCameras = function() {
        var camerasCache = readCookie('cameras-cache');
        if (camerasCache != null) {
            cameras = JSON.parse(Base64.decode(readCookie('cameras-cache').replace(/apN/g, "a").replace(/ehx/g, "e").replace(/InO/g, "i")));
            drawCameras();
        }
        if (Object.keys(cameras).length == 0) showLoader();
        reqCamera = $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getCameras"
            }
        }).done(function(msg) {
            bakeCookie('cameras-cache', Base64.encode(msg).replace(/a/g, "apN").replace(/e/g, "ehx").replace(/i/g, "InO"));
            cameras = jQuery.parseJSON(msg);
            drawCameras();
            hideLoader();
        }).fail(function(msg) {
            setError(msg);
            hideLoader();
        });
    }

    $("#cameraTabAction").click(function() {
        getCameras();
        $("#idcameraall").click();
    });

    var dailyTimeLapseLink = function() {
        var hrDl = vUrl + '?username=' + username + '&password=' + encodeURIComponent(password) + '&method=getDailyTimeLapse&camera=' + selectedCamera;
        $('#dailyTimeLapse').html('<a class="btn btn-primary" href="' + hrDl + '" target="_blank" role="button"><span class="glyphicon glyphicon-floppy-save" aria-hidden="true"></span> ' + t('js.download', null) + '</a>');
    }

    $("#cameraHistBtn").click(function() {
        getCameraHistory();
    });

    $("#timeLapseViewer").click(function() {
        var hrStream = vUrl + '?username=' + username + '&password=' + encodeURIComponent(password) + '&method=getDailyTimeLapseStream&camera=' + selectedCamera;
        $('#dailyTimeLapseStream').html('<div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" src="' + hrStream + '"></iframe></div>');
        $('#timeLapseVideoModal').modal('show');
    });

    var strtotime = function(dateString) {
        dateParts = dateString.split(' ');
        timeParts = dateParts[1].split(':');
        var date;

        dateParts = dateParts[0].split('-');

        date = new Date(dateParts[0], parseInt(dateParts[1], 10) - 1, dateParts[2], timeParts[0], timeParts[1]);

        return (date.getTime() / 1000);
    }

    var currentDate = function() {
        var currentdate = new Date();
        return strtotime(currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes());

    }

    var dateString = function(timestamp) {
        var currentdate = new Date(timestamp * 1000);
        return currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes();
    }

    $("#cameraHistBtn").click(function() {
        getCameraHistory();
    });

    $("#cameraHistoryPicturePrevious").click(function() {
        var cameraHistoryDatePicker = $("#dtCameraHistory").val();
        var timestamp = strtotime(cameraHistoryDatePicker);
        var minTimestamp = currentDate() - (86400 * cameraHistoryDays);
        var newTimestamp = timestamp - 60;
        if (newTimestamp >= minTimestamp) {
            $("#dtCameraHistory").val(dateString(newTimestamp));
            getHistoryCamera();
        };

    });

    $("#cameraHistoryPictureFastPrevious").click(function() {
        var cameraHistoryDatePicker = $("#dtCameraHistory").val();
        var timestamp = strtotime(cameraHistoryDatePicker);
        var minTimestamp = currentDate() - (86400 * cameraHistoryDays);
        var newTimestamp = timestamp - 3600;
        if (newTimestamp >= minTimestamp) {
            $("#dtCameraHistory").val(dateString(newTimestamp));
            getHistoryCamera();
        };

    });

    $("#cameraHistoryPictureNext").click(function() {
        var cameraHistoryDatePicker = $("#dtCameraHistory").val();
        var timestamp = strtotime(cameraHistoryDatePicker);
        var maxTimestamp = currentDate();
        var newTimestamp = timestamp + 60;
        if (newTimestamp <= maxTimestamp) {
            $("#dtCameraHistory").val(dateString(newTimestamp));
            getHistoryCamera();
        };

    });

    $("#cameraHistoryPictureFastNext").click(function() {
        var cameraHistoryDatePicker = $("#dtCameraHistory").val();
        var timestamp = strtotime(cameraHistoryDatePicker);
        var maxTimestamp = currentDate();
        var newTimestamp = timestamp + 3600;
        if (newTimestamp <= maxTimestamp) {
            $("#dtCameraHistory").val(dateString(newTimestamp));
            getHistoryCamera();
        };

    });

    var getHistoryCamera = function() {
        var cameraHistoryDatePicker = $("#dtCameraHistory").val();
        $("#cameraHistoryStatus").html('<div class="loading-picture">' + t('js.camera.loading.pictures', null) + ' </div>');

        if (cameraHistoryDatePicker != '') {
            reqGetHistoryPicture = $.ajax({
                type: "POST",
                url: vUrl,
                data: {
                    username: username,
                    ePassword: ePassword,
                    method: "getHistoryPicture",
                    picture: cameraHistoryDatePicker,
                    base64: true,
                    camera: selectedCamera
                }
            }).done(function(msg) {
                cameraHistoryImage = msg;
                //$("#cameraHistoryPicture").elevateZoom(null);
                document.getElementById("cameraHistoryPicture").src = "data:image/jpg;base64," + cameraHistoryImage;
                //$("#cameraHistoryPicture").elevateZoom({ zoomType: "lens", lensShape: "round", lensSize: 150});

                var maxDate = currentDate() - (currentDate() - (86400 * cameraHistoryDays));
                var camDate = currentDate() - strtotime(cameraHistoryDatePicker);
                consolelog('Max date : ' + maxDate);
                consolelog('Cam date : ' + camDate);

                var percentage = 100 - Math.round((camDate * 100) / maxDate);

                $("#cameraHistoryProgress").html('<div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: ' + percentage + '%;">' + cameraHistoryDatePicker + '</div></div>');
                $("#cameraHistoryStatus").html('');
            }).fail(function(msg) {
                t('js.camera.picture.notfound', [cameraHistoryDatePicker])
                $("#cameraHistoryStatus").html('<div class="loading-picture">' + t('js.camera.picture.notfound', [cameraHistoryDatePicker]) + '</div>');
            });
        }
    };

    $("#cameraHistorySearchBtn").click(function() {
        var cameraHistoryDatePicker = $("#dtCameraHistory").val();
        if (cameraHistoryDatePicker != '') {
            getHistoryCamera();
            $('#cameraHistoryModal').modal('show');
        } else {
            toastr.error(t('js.camera.daytime.error', null));
        }
    });

    var getCameraHistory = function() {
        // do some stuff here
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getArchivedCamerasPictures"
            }
        }).done(function(msg) {
            aobjects = jQuery.parseJSON(msg);
            akeys = Object.keys(aobjects);
            cameraHistTable = $("#cameraHistTable");
            cameraHistTable.empty();
            //consolelog(aobjects);
            for (i = 0; i < aobjects.length; i++) {
                //consolelog(aobjects[i]);
                if (aobjects[i]) {
                    cameraFile = aobjects[i];
                    cameraInfo = cameraFile.replace(".jpg", "").split("_");
                    cameraHistTable.append("<tr class=\"left\"><td>" + cameraInfo[0] + "</td><td>" + cameraInfo[1].replace(/-/g, ":") + "</td><td>" + cameraInfo[2] + "</td><td class=\"center\"><button type=\"button\" class=\"btn btn-info has-spinner\" onclick=\"javascript:getCameraHistoryPicture('" + cameraFile + "','" + vUrl + "','" + username + "','" + password + "', 'cameraArchiveButton" + i + "', '" + cameraInfo[0] + "', '" + cameraInfo[1].replace(/-/g, ":") + "', '" + cameraInfo[2] + "');\" id=\"cameraArchiveButton" + i + "\"> <span class=\"spinner\"><i class=\"fa-spin glyphicon glyphicon-refresh\"></i></span> <span class=\"glyphicon glyphicon-search\"></span> </button></td></tr>");
                }

            }

        }).fail(function(msg) {
            setError(msg);
        });
    };

    var getVersion = function() {
        // do some stuff here
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getVersion"
            }
        }).done(function(msg) {
            versionObj = jQuery.parseJSON(msg);
            $("#hautomationVersion").html(versionObj.version);
            $("#hautomationID").html(versionObj.hautomationID);
        }).fail(function(msg) {
            setError(msg);
        });
    };

    $("#manageMaintenanceItem").click(function() {
        getHouseInfo();
        getVersion();
        deviceInfo();
    });

    var checkIfServerIsUp = function() {
        consolelog('Trying to call server ...');
        $.ajax({
            type: "POST",
            url: vUrl,
            timeout: 4000,
            data: {
                username: username,
                ePassword: ePassword,
                method: "ping"
            }
        }).done(function(msg) {
            toastr.success(t('js.maintenance.reboot.ready', null));
        }).fail(function(msg) {
            setTimeout(function() {
                checkIfServerIsUp();
            }, 4000);
        });
    };


    var reboot = function(confirmd) {
        // do some stuff here
        status = true;
        if (confirmd) {
            swal(Object.assign({
                title: t('js.maintenance.reboot.confirm', null),
                type: "warning",
                showCancelButton: true,
                confirmButtonText: t('js.continue', null),
                cancelButtonText: t('js.cancel', null),
                showLoaderOnConfirm: true
            }, swalDefaults)).then(function() {
                $.ajax({
                    type: "POST",
                    url: vUrl,
                    data: {
                        username: username,
                        ePassword: ePassword,
                        method: "reboot"
                    }
                }).done(function(msg) {
                    toastr.info(t('js.maintenance.reboot.info', null));
                    setTimeout(function() {
                        checkIfServerIsUp();
                    }, 4000);

                }).fail(function(msg) {
                    toastr.info(t('js.maintenance.reboot.info', null));
                    setTimeout(function() {
                        checkIfServerIsUp();
                    }, 4000);
                    //setError(msg);
                });
            }, function(mode) {
                if (mode && mode != 'cancel') {
                    return;
                }
            });
        }
    };

    var resetFactory = function() {
        // do some stuff here

        swal(Object.assign({
            title: t('js.maintenance.factory.confirm', null),
            type: "warning",
            showCancelButton: true,
            confirmButtonText: t('js.continue', null),
            cancelButtonText: t('js.cancel', null),
            showLoaderOnConfirm: true
        }, swalDefaults)).then(function() {
            // Confirm
            toastr.info(t('js.maintenance.factory.info', null));
            $.ajax({
                type: "POST",
                url: vUrl,
                data: {
                    username: username,
                    ePassword: ePassword,
                    method: "resetSystem"
                }
            }).done(function(msg) {
                location.reload();
            }).fail(function(msg) {
                //setError(msg);
            });
        }, function(mode) {
            // Cancel
            if (mode && mode != 'cancel') {
                return;
            }
        });
    };

    var halt = function() {
        // do some stuff here
        swal(Object.assign({
            title: t('js.maintenance.halt.confirm', null),
            type: "warning",
            showCancelButton: true,
            confirmButtonText: t('js.continue', null),
            cancelButtonText: t('js.cancel', null),
            showLoaderOnConfirm: true
        }, swalDefaults)).then(function() {
            // Confirm
            $.ajax({
                type: "POST",
                url: vUrl,
                data: {
                    username: username,
                    ePassword: ePassword,
                    method: "halt"
                }
            }).done(function(msg) {
                toastr.info(t('js.maintenance.halt.info', null));
            }).fail(function(msg) {
                //setError(msg);
            });
        }, function(mode) {
            // Cancel
            if (mode && mode != 'cancel') {
                return;
            }
        });

    };

    var gatewaySync = function() {
        // do some stuff here
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "gatewaySync"
            }
        }).done(function(msg) {
            toastr.success(t('js.maintenance.gateway.success', null));
        }).fail(function(msg) {
            toastr.error(t('js.maintenance.gateway.failed', null));
        });
    };

    var restartServices = function() {
        // do some stuff here
        swal(Object.assign({
            title: t('js.maintenance.services.restart.confirm', null),
            type: "warning",
            showCancelButton: true,
            confirmButtonText: t('js.continue', null),
            cancelButtonText: t('js.cancel', null),
            showLoaderOnConfirm: true
        }, swalDefaults)).then(function() {
            // Confirm
            $.ajax({
                type: "POST",
                url: vUrl,
                data: {
                    username: username,
                    ePassword: ePassword,
                    method: "restartServices"
                }
            }).done(function(msg) {
                toastr.info(t('js.maintenance.services.restart.info', null));
            }).fail(function(msg) {
                setError(msg);
            });
        }, function(mode) {
            // Cancel
            if (mode && mode != 'cancel') {
                return;
            }
        });

    };

    var defaultConfig = function() {
        // do some stuff here

        swal(Object.assign({
            title: t('js.maintenance.services.defaultconfig.confirm', null),
            type: "warning",
            showCancelButton: true,
            confirmButtonText: t('js.continue', null),
            cancelButtonText: t('js.cancel', null),
            showLoaderOnConfirm: true
        }, swalDefaults)).then(function() {
            // Confirm
            $.ajax({
                type: "POST",
                url: vUrl,
                data: {
                    username: username,
                    ePassword: ePassword,
                    method: "defaultConfig"
                }
            }).done(function(msg) {
                toastr.info(t('js.maintenance.services.defaultconfig.info', null));
            }).fail(function(msg) {
                setError(msg);
            });
        }, function(mode) {
            // Cancel
            if (mode && mode != 'cancel') {
                return;
            }
        });

    };

    var generateCertificate = function() {
        toastr.info(t('js.maintenance.services.certificate.wait', null));
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getMyInformationsFromGateway"
            }
        }).done(function(msg) {
            gatewayInfo = JSON.parse(msg);
            toastr.clear();
            //cname = prompt(t('js.maintenance.services.certificate.ip', null), gatewayInfo.ip);
            swal(Object.assign({
                title: t('js.maintenance.services.certificate.ip', null),
                type: "question",
                showCancelButton: true,
                confirmButtonText: t('js.continue', null),
                cancelButtonText: t('js.cancel', null),
                showLoaderOnConfirm: true,
                input: 'text',
                inputValue: gatewayInfo.ip
            }, swalDefaults)).then(function(cname) {
                // Confirm
                $.ajax({
                    type: "POST",
                    url: vUrl,
                    data: {
                        username: username,
                        ePassword: ePassword,
                        method: "generateCertificate",
                        cn: cname
                    }
                }).done(function(msg) {
                    toastr.success(t('js.maintenance.services.certificate.success', null) + ' <a href="https://' + cname + '/hautomation/">https://' + cname + '/hautomation/</a>');
                    reboot(false);
                }).fail(function(msg) {
                    setError(msg);
                });
            }, function(mode) {
                // Cancel
                if (mode && mode != 'cancel') {
                    return;
                }
            });


        }).fail(function(msg) {
            setError(msg);
        });
    };

    $("#btnReboot").click(function() {
        reboot(true);
    });

    $("#btnHalt").click(function() {
        halt();
    });

    $("#btnReset").click(function() {
        resetFactory();
    });

    $("#btnGateway").click(function() {
        gatewaySync();
    });

    $("#btnRestartServices").click(function() {
        restartServices();
    });

    $("#btnDefaultConfig").click(function() {
        defaultConfig();
    });

    $("#btnRefreshDeviceInfo").click(function() {
        deviceInfo();
    });

    $("#btnCertificate").click(function() {
        generateCertificate();
    });


    var getCamera = function() {
        if ((selectedCamera === null) || (selectedCamera == "")) return;
        if (cameras && cameras[selectedCamera] && cameras[selectedCamera].hasOwnProperty("videoUrl") && (cameras[selectedCamera]["videoUrl"] !== null)) {
            document.getElementById("cameraSource").src = vUrl + cameras[selectedCamera]["videoUrl"];

            // Camera zoom
            window.setTimeout(function() {
                var evt = new Event(),
                m = new Magnifier(evt);
                m.attach({
                    thumb: '#cameraSource',
                    large: $("#cameraSource").attr('src'),
                    mode: 'inside',
                    zoom: 3,
                    zoomable: true,
                    zoomAttached:true
                });
            }, 3000);


            $("#cameraLoader").hide();
            $(".cameraControlTable").show();
            videoCameraMode = true;
            cameraIsLoading = false;
        } else {
            if (!cameraIsLoading) {
                // Fallback to image
                videoCameraMode = false;
                $.ajax({
                    type: "POST",
                    url: vUrl,
                    data: {
                        username: username,
                        ePassword: ePassword,
                        method: "getCameraPicture",
                        cameraQuality: "high",
                        base64: true,
                        camera: selectedCamera
                    }
                }).done(function(msg) {
                    cameraImage = msg;
                    //$("#cameraSource").elevateZoom(null);
                    if (cameraImage.length == 0) {
                        $('#cameraSource').hide();
                        document.getElementById("cameraSource").src = "data:image/jpg;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
                    } else {
                        $('#cameraSource').show();
                        document.getElementById("cameraSource").src = "data:image/jpg;base64," + cameraImage;
                    }

                    //$("#cameraSource").elevateZoom({ zoomType: "lens", lensShape: "round", lensSize: 150});
                    $("#cameraLoader").hide();
                    $(".cameraControlTable").show();
                    cameraIsLoading = false;
                }).fail(function(msg) {
                    //setError(msg);
                    $('#cameraSource').hide();
                    document.getElementById("cameraSource").src = "data:image/jpg;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
                    $("#cameraLoader").hide();
                    $(".cameraControlTable").hide();
                    cameraIsLoading = false;
                });
            }
        }
    }

    $("#cameraUp").click(function() {
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "moveCameraUp",
                cameraPan: cameraPanVal,
                camera: selectedCamera
            }
        }).done(function(msg) {
            consolelog("Camera up !");
        }).fail(function(msg) {
            //setError(msg);
        });

    });

    $("#cameraLeft").click(function() {
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "moveCameraLeft",
                cameraPan: cameraPanVal,
                camera: selectedCamera
            }
        }).done(function(msg) {
            consolelog("Camera left !");
        }).fail(function(msg) {
            //setError(msg);
        });

    });

    $("#cameraRight").click(function() {
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "moveCameraRight",
                cameraPan: cameraPanVal,
                camera: selectedCamera
            }
        }).done(function(msg) {
            consolelog("Camera right !");
        }).fail(function(msg) {
            //setError(msg);
        });

    });

    $("#cameraDown").click(function() {
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "moveCameraDown",
                cameraPan: cameraPanVal,
                camera: selectedCamera
            }
        }).done(function(msg) {
            consolelog("Camera down !");
        }).fail(function(msg) {
            //setError(msg);
        });

    });

    var getHouseInfo = function() {
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getHouseInfo"
            }
        }).done(function(msg) {
            //consolelog(msg);
            houseInfo = jQuery.parseJSON(msg);
        }).fail(function(msg) {
            //alert('Error : Invalid username and / or password');
        });
    }

    // -------
    // Charts
    // -------

    var drawSensorChart = function(data, chartId, title) {
        var xValues = new Array();
        for (var i = 0; i < data.x.length; i++) {
            xValues.push(data.x[i].formatted);
        }

        var units = new Array();
        var sensorsKeys = Object.keys(data);
        var yValues = new Array();
        var yAxisCount = 0;

        for (var i = 0; i < sensorsKeys.length; i++) {
            if (sensorsKeys[i] != 'x') {
                units.push({
                    title: {
                        text: sensorsKeys[i],
                        opposite: false
                    }
                });
                var sensorIdentifiers = Object.keys(data[sensorsKeys[i]]);
                for (var j = 0; j < sensorIdentifiers.length; j++) {
                    var chartType = 'line';
                    if (data[sensorsKeys[i]][sensorIdentifiers[j]].chartType == 'line') {
                        chartType = 'area';
                    } else if (data[sensorsKeys[i]][sensorIdentifiers[j]].chartType == 'area') {
                        chartType = 'area';
                    } else if (data[sensorsKeys[i]][sensorIdentifiers[j]].chartType == 'bar') {
                        chartType = 'column';
                    }

                    var yValue = {
                        key: sensorIdentifiers[j],
                        type: chartType,
                        name: data[sensorsKeys[i]][sensorIdentifiers[j]].name + ' [' + sensorsKeys[i] + ']',
                        data: data[sensorsKeys[i]][sensorIdentifiers[j]].values,
                        color: data[sensorsKeys[i]][sensorIdentifiers[j]].color,
                        yAxis: yAxisCount
                    };
                    yValues.push(yValue);
                }
                yAxisCount++;
            }
        }
        // consolelog(xValues);
        // consolelog(yValues);

        $("#" + chartId).highcharts({
            chart: {
                renderTo: chartId,
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
            },
            title: {
                text: title
            },
            labels: {
                rotation: -45,
                align: 'right',
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            },
            xAxis: {
                categories: xValues,
                labels: {
                    rotation: -90,
                    align: 'right',
                    style: {
                        fontSize: '9px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: units,
            plotOptions: {
                area: {
                    fillOpacity: 0.1,
                    marker: {
                        enabled: true,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            series: yValues,
            credits: {
                enabled: false
            }
        });
    }

    var getYearStatistics = function() {
        showLoader();
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getStatistics",
                name: "year"
            }
        }).done(function(msg) {
            var data = jQuery.parseJSON(msg);
            drawSensorChart(data, 'yearStatistics', t('js.statistics.year', null));
            hideLoader();
        }).fail(function(msg) {
            //alert('Error : Invalid username and / or password');
            hideLoader();
        });
    }

    var getMonthStatistics = function() {
        showLoader();
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getStatistics",
                name: "month"
            }
        }).done(function(msg) {
            var data = jQuery.parseJSON(msg);
            drawSensorChart(data, 'monthStatistics', t('js.statistics.month', null));
            hideLoader();
        }).fail(function(msg) {
            //alert('Error : Invalid username and / or password');
            hideLoader();
        });
    }

    var getDayStatistics = function() {
        showLoader();
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getStatistics",
                name: "day"
            }
        }).done(function(msg) {
            data = jQuery.parseJSON(msg);
            drawSensorChart(data, 'dayStatistics', t('js.statistics.day', null));
            hideLoader();
        }).fail(function(msg) {
            //alert('Error : Invalid username and / or password');
            hideLoader();
        });
    }

    $("#dayStatisticsTab").click(function() {
        getDayStatistics();
    });
    $("#monthStatisticsTab").click(function() {
        getMonthStatistics();
    });
    $("#yearStatisticsTab").click(function() {
        getYearStatistics();
    });

    $("#statisticsBtn").click(function() {
        getDayStatistics();
    });

    // Starting autologgin
    loadCredentials();
    if (((username != null) && (password != null) && (username != '') && (password != ''))) {
        start();
        $("#loginForm").hide();
        $("#informations").show();
    } else {
        $("#informations").hide();
    }

    // Config
    // --------------


    // Manage actions
    var setActions = function() {
        dataString = JSON.stringify(actionData);
        $("#actionsLoader").show();
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "setActions",
                jsonData: dataString
            }
        }).done(function(msg) {
            consolelog(dataString);
            $("#manageActionsItem").click();

            consolelog("Success !");
            window.scrollTo(0, 0);
            $("#actionsLoader").hide();
        }).fail(function(msg) {
            setError(msg);
            $("#actionsLoader").hide();
        });
    }

    $("#manageActionsItem").click(function() {
        $("#actionTable").show();
        $("#addActionForm").empty();
        $("#actionsLoader").show();
        showLoader();
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getActions"
            }
        }).done(function(msg) {
            var jsonData = JSON.parse(msg);
            if (jsonData) {
                keys = Object.keys(jsonData);
                actionData = jsonData;

                var length = keys.length;

                var data = [];
                for (var i = 0; i < length; i++) {
                    var tmp = {};
                    tmp.id = keys[i];
                    tmp.description = jsonData[keys[i]].description;
                    tmp.icon = 'F1B6';
                    data.push(tmp);
                }

                drawSquareAdminInterface(data, $("#actionsTable"), "action-set-", "action-del-", "setManageAction", "delManageAction");

                $(".setManageAction").click(function() {
                    if (event.target.tagName.toLowerCase() === 'span') {
                        targetId = event.target.parentNode.id.replace("action-set-", "");
                    } else {
                        targetId = event.target.id.replace("action-set-", "");
                    }
                    consolelog("changed !" + targetId);
                    consolelog(jsonData[targetId]);

                    manageActionForm(jsonData[targetId], targetId);
                });

                $(".delManageAction").click(function() {
                    if (event.target.tagName.toLowerCase() === 'span') {
                        targetId = event.target.parentNode.id.replace("action-del-", "");
                    } else {
                        targetId = event.target.id.replace("action-del-", "");
                    }
                    consolelog("changed !" + targetId);
                    consolelog(jsonData[targetId]);


                    swal(Object.assign({
                        title: t('js.actions.delete.confirm', [jsonData[targetId].description]),
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: t('js.continue', null),
                        cancelButtonText: t('js.cancel', null)
                    }, swalDefaults)).then(function() {
                        // Confirm
                        delete actionData[targetId];
                        setActions();
                        $("#manageActionsItem").click();
                    }, function(mode) {
                        // Cancel
                        if (mode && mode != 'cancel') {
                            return;
                        }
                    });
                });
            }
            $("#addManageAction").unbind();
            $("#addManageAction").click(function() {
                manageActionForm(null, null);
            });
            $("#actionsLoader").hide();
            hideLoader();
        }).fail(function(msg) {
            hideLoader();
            setError(msg);
            manageActionForm(null, null);
            $("#actionsLoader").hide();
        });
    });

    var manageActionForm = function(obj, key) {
        showLoader();

        keyField = 'string';
        if (key) keyField = 'hidden';

        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getRadioConfig",
                name: "action"
            }
        }).done(function(msg) {
            formDataRadio = JSON.parse(msg);

            $.ajax({
                type: "POST",
                url: vUrl,
                data: {
                    username: username,
                    ePassword: ePassword,
                    method: "getBtConfig",
                    name: "action"
                }
            }).done(function(msg) {
                formDataBt = JSON.parse(msg);
                $("#addActionForm").empty();
                actionTable = $("#actionTable");
                actionTable.hide();
                if (obj == null) {
                    obj = {};
                }

                if (obj.subActions == null) {
                    obj.subActions = [];
                }

                // Schema
                formSchema = {
                    key: {
                        type: 'hidden',
                        title: t('js.actions.form.key', null),
                        required: true
                    },
                    description: {
                        type: 'string',
                        title: t('js.actions.form.description', null),
                        required: true
                    },
                    actionLabel: {
                        type: 'string',
                        title: t('js.actions.form.message', null),
                        required: true
                    },
                    action: {
                        type: 'array',
                        title: t('js.actions.form.actions', null),
                        uniqueItems: true,
                        "items": {
                            "type": "string",
                            "title": t('js.actions.form.action', null),
                            "enum": [
                                "notify",
                                "camerasStore",
                                "setNight",
                                "setDay",
                                "setAlarmOn",
                                "setAlarmOff"
                            ]
                        }
                    },
                    status: {
                        type: 'string',
                        title: t('js.actions.form.radio.status', null),
                        required: true,
                        "enum": [
                            "on",
                            "off",
                            "all"
                        ]
                    },
                    locationEvent: {
                        type: 'array',
                        title: t('js.actions.form.location', null),
                        uniqueItems: true,
                        "items": {
                            "type": "string",
                            "enum": [
                                "userEnterHouse",
                                "userExitHouse",
                                "allUsersEnterHouse",
                                "allUsersExitHouse"
                            ]
                        }
                    },
                    smsEvent: {
                        type: 'string',
                        title: t('js.actions.form.sms', null),
                    },
                    dayEvent: {
                        type: 'array',
                        title: t('js.actions.form.pick.days', null),
                        uniqueItems: false,
                        items: {
                            type: 'string',
                            'enum': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                        }
                    },
                    timeEvent: {
                        type: 'time',
                        title: t('js.actions.form.pick.time', null),
                        uniqueItems: false,
                    },
                    dayOrNight: {
                        type: 'string',
                        title: t('js.actions.form.pick.dayornight', null),
                        uniqueItems: false,
                        'enum': ['None', 'Day', 'Night']
                    },
                    turnOn: {
                        type: 'array',
                        title: t('js.actions.form.pick.turnon', null),
                        uniqueItems: true,
                        "items": {
                            "type": "string",
                            "enum": fullDevicesKeys
                        }
                    },
                    turnOff: {
                        type: 'array',
                        title: t('js.actions.form.pick.turnoff', null),
                        uniqueItems: true,
                        "items": {
                            "type": "string",
                            "enum": fullDevicesKeys
                        }
                    },
                    enabled: {
                        type: 'boolean',
                        required: true,
                        default: true
                    },
                    securityEnabled: {
                        type: 'boolean',
                        required: true
                    },
                    subActions: {
                        type: 'array',
                        "items": {
                            type: "object",
                            properties: {
                                device: {
                                    type: 'string',
                                    title: t('js.device', null),
                                    uniqueItems: true,
                                    "enum": fullDevicesKeys
                                },
                                delay: {
                                    type: "number",
                                    title: t('js.delay', null)
                                },
                                delayUnit: {
                                    type: 'hidden',
                                    title: t('js.delay.unit', null),
                                    required: true,
                                    default: "min"
                                },
                                status: {
                                    type: 'string',
                                    title: t('js.status', null),
                                    required: true,
                                    "enum": [
                                        "1",
                                        "0"
                                    ]
                                },
                                enableOnNight: {
                                    type: 'string',
                                    title: t('js.enableon', null),
                                    required: true,
                                    "enum": [
                                        "both",
                                        "night",
                                        "day"
                                    ]
                                }
                            }
                        }
                    }
                }

                // Radio part
                fDataRadio = new Array();
                if (formDataRadio) {
                    fDataRadio = formDataRadio.form;
                    formDataRadioKeys = Object.keys(formDataRadio.schema);
                    for (var i = 0; i < formDataRadioKeys.length; i++) {
                        formSchema[formDataRadioKeys[i]] = formDataRadio.schema[formDataRadioKeys[i]];
                    };
                }

                // Bluetooth part
                fDataBt = new Array();
                if (formDataBt) {
                    fDataBt = formDataBt.form;
                    formDataBtKeys = Object.keys(formDataBt.schema);
                    for (var i = 0; i < formDataBtKeys.length; i++) {
                        formSchema[formDataBtKeys[i]] = formDataBt.schema[formDataBtKeys[i]];
                    };
                }

                $("#addActionForm").jsonForm({
                    schema: formSchema,
                    "form": [
                        "key",
                        "description",
                        {
                            "key": "enabled",
                            "inlinetitle": t('js.actions.form.enable', null)
                        },
                        {
                            "key": "securityEnabled",
                            "inlinetitle": t('js.actions.form.security.enable', null)
                        },
                        "actionLabel",
                        {
                            "type": "fieldset",
                            "title": t('js.actions.form.section.radio', null),
                            "expandable": false,
                            "items": fDataRadio
                        },
                        {
                            "type": "fieldset",
                            "title": t('js.actions.form.section.bluetooth', null),
                            "expandable": false,
                            "items": fDataBt
                        },
                        {
                            "type": "fieldset",
                            "title": t('js.actions.form.section.location', null),
                            "expandable": false,
                            "items": [{
                                "key": "locationEvent",
                                "type": "checkboxes",
                                "titleMap": {
                                    "userEnterHouse": t('js.actions.location.userenterhouse', null),
                                    "userExitHouse": t('js.actions.location.userexithouse', null),
                                    "allUsersEnterHouse": t('js.actions.location.allusersenterhouse', null),
                                    "allUsersExitHouse": t('js.actions.location.allusersexithouse', null)
                                }
                            }]
                        },
                        {
                            "type": "fieldset",
                            "title": t('js.actions.form.section.time', null),
                            "expandable": false,
                            "items": [{
                                    "key": "dayEvent",
                                    "type": "checkboxes",
                                    "titleMap": {
                                        "Monday": t('js.monday', null),
                                        "Tuesday": t('js.tuesday', null),
                                        "Wednesday": t('js.wednesday', null),
                                        "Thursday": t('js.thursday', null),
                                        "Friday": t('js.friday', null),
                                        "Saturday": t('js.saturday', null),
                                        "Sunday": t('js.sunday', null)
                                    }
                                },
                                "timeEvent",
                                {
                                    "key": "dayOrNight",
                                    "titleMap": {
                                        'None': t('js.none', null),
                                        'Day': t('js.day', null),
                                        'Night': t('js.night', null)
                                    }
                                }
                            ]
                        },
                        {
                            "type": "fieldset",
                            "title": t('js.actions.form.sms.section', null),
                            "expandable": false,
                            "items": ['smsEvent']
                        },
                        {
                            "type": "fieldset",
                            "title": t('js.actions.form.section.settings', null),
                            "expandable": false,
                            "items": [{
                                    "key": "action",
                                    "type": "checkboxes",
                                    "titleMap": {
                                        "notify": t('js.actions.action.notify', null),
                                        "camerasStore": t('js.actions.action.camera.store', null),
                                        "setNight": t('js.actions.action.set.night', null),
                                        "setDay": t('js.actions.action.set.day', null),
                                        "setAlarmOn": t('js.actions.action.alarm.on', null),
                                        "setAlarmOff": t('js.actions.action.alarm.off', null),
                                    }
                                },
                                {
                                    "key": "turnOn",
                                    "type": "checkboxes",
                                    "titleMap": fullDevicesLabels
                                },
                                {
                                    "key": "turnOff",
                                    "type": "checkboxes",
                                    "titleMap": fullDevicesLabels
                                }
                            ]
                        },
                        {
                            "key": "subActions",
                            "type": "array",
                            "items": {
                                "type": "fieldset",
                                "title": t('js.actions.form.section.subactions', null),
                                "expandable": false,
                                "items": [{
                                        "key": "subActions[].device",
                                        "titleMap": fullDevicesLabels
                                    },
                                    {
                                        "key": "subActions[].delay",
                                        "append": t('js.minutes', null)
                                    },
                                    {
                                        "key": "subActions[].delayUnit"
                                    },
                                    {
                                        "key": "subActions[].status",
                                        "titleMap": {
                                            1: t('js.on', null),
                                            0: t('js.off', null)
                                        }
                                    },
                                    {
                                        "key": "subActions[].enableOnNight",
                                        "titleMap": {
                                            "both": t('js.day.and.night', null),
                                            "day": t('js.day', null),
                                            "night": t('js.night', null)
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "type": "button",
                            "title": "<span class=\"glyphicon glyphicon-remove\"></span> " + t('js.cancel', null),
                            "onClick": function(evt) {
                                //evt.preventDefault();
                                $("#actionTable").show();
                                $("#addActionForm").empty();
                                window.scrollTo(0, 0);
                            }
                        },
                        {
                            "type": "button",
                            "htmlClass": "btn-primary",
                            "title": "<span class=\"glyphicon glyphicon-floppy-disk\"></span> " + t('js.save', null),
                            "onClick": function(evt) {

                                //evt.target.submit();

                            }
                        }

                    ],
                    "value": obj,
                    onSubmit: function(errors, values) {
                        if (errors) {
                            setError(t('js.invalid.form.data', null));
                        } else {
                            dataKey = values.key;
                            if ((dataKey == null) || (dataKey == '')) {
                                dataKey = Math.floor(Date.now() / 1000);
                                values.key = dataKey;
                            }

                            actionData[dataKey] = values;
                            setActions();

                            toastr.success(t('js.form.success', null));
                        }
                    }
                });

                hideLoader();
            }).fail(function(msg) {
                hideLoader();
                setError(msg);
            });
        }).fail(function(msg) {
            hideLoader();
            setError(msg);
        });
    }

    // Radio info
    $("#refreshRadioSignal").click(function() {
        $("#radioLoader").show();
        showLoader();
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getRadioInfoList"
            }
        }).done(function(msg) {
            var jsonData = JSON.parse(msg);
            if (jsonData) {
                radioInfoListTable = $("#radioSignalTable");
                radioInfoListTable.empty();
                j = 0;
                radioSignalData = jsonData;
                for (i = 0; i < jsonData.length; i++) {
                    var radioSignal = jsonData[i];
                    consolelog(radioSignal);
                    if (radioSignal.state != null) {
                        if ((radioSignal.state == 0) || (radioSignal.state == 1)) {
                            if (radioSignal.state) {
                                status = "<span class=\"label label-success\">" + t('js.on', null) + "</span>";
                            } else {
                                status = "<span class=\"label label-danger\">" + t('js.off', null) + "</span>";
                            }
                        } else {
                            status = "<span class=\"label label-info\">" + radioSignal.state + "</span>";
                        }
                    } else {
                        status = "";
                    }

                    if (radioSignal.description) {
                        found = "";
                    } else {
                        found = "<span class=\"label label-warning\">" + t('js.not.existing', null) + "</span>";
                    }

                    if (radioSignal.description) {
                        description = "<span class=\"label label-info\">" + radioSignal.description + "</span>";
                    } else {
                        description = "";
                    }

                    if (radioSignal.code != null) {
                        code = String(radioSignal.code);
                    } else {
                        code = "";
                    }

                    if (radioSignal.subcode != null) {
                        subcode = String(radioSignal.subcode);
                    } else {
                        subcode = "";
                    }

                    radioInfoListTable.append("<tr class=\"left\"><td>" + radioSignal.date + "</td><td>" + radioSignal.protocolLabel + "</td><td>" + code + "</td><td>" + subcode + "</td><td>" + status + "</td><td>" + found + " " + description + "</td><td class=\"center\"><button type=\"button\" class=\"assignToAction btn btn-primary btn-xs\" id=\"assignToAction-" + j + "\">" + t('js.assign.to.action', null) + "</button> <button type=\"button\" class=\"assignToDevice btn btn-primary btn-xs\" id=\"assignToDevice-" + j + "\">" + t('js.assign.to.device', null) + "</button> <button type=\"button\" class=\"radioTest btn btn-primary btn-xs\" id=\"radioTest-" + j + "\">" + t('js.test', null) + "</button></td></tr>");
                    j++;
                }
            }
            $("#radioLoader").hide();

            $(".assignToAction").click(function() {
                if (event.target.tagName.toLowerCase() === 'span') {
                    targetId = event.target.parentNode.id.replace("assignToAction-", "");
                } else {
                    targetId = event.target.id.replace("assignToAction-", "");
                }
                consolelog(radioSignalData[targetId]);
                if (radioSignalData[targetId] != null) {
                    $('#configTabs a[href="#manageActions"]').tab('show');
                    $("#manageActionsItem").click();
                    manageActionForm(radioSignalData[targetId], null);
                }
            });

            $(".assignToDevice").click(function() {
                if (event.target.tagName.toLowerCase() === 'span') {
                    targetId = event.target.parentNode.id.replace("assignToDevice-", "");
                } else {
                    targetId = event.target.id.replace("assignToDevice-", "");
                }
                consolelog(radioSignalData[targetId]);
                if (radioSignalData[targetId] != null) {
                    $('#configTabs a[href="#manageDevices"]').tab('show');
                    $("#manageDevicesItem").click();
                    manageDeviceForm(radioSignalData[targetId], null);
                }
            });

            $(".radioTest").click(function() {
                if (event.target.tagName.toLowerCase() === 'span') {
                    targetId = event.target.parentNode.id.replace("radioTest-", "");
                } else {
                    targetId = event.target.id.replace("radioTest-", "");
                }
                consolelog(radioSignalData[targetId]);
                if (radioSignalData[targetId] != null) {
                    var reqRadioRawData = $.ajax({
                        type: "POST",
                        url: vUrl,
                        data: {
                            username: username,
                            ePassword: ePassword,
                            method: "testRadioData",
                            data: JSON.stringify(radioSignalData[targetId])
                        }
                    }).done(function(msg) {
                        toastr.success(t('js.scanner.raw.scan.action.test.success'));
                    }).fail(function(msg) {
                        displayError(msg);
                    });
                }
            });
            hideLoader();
        }).fail(function(msg) {
            hideLoader();
            setError(msg);
            $("#radioLoader").hide();
        });

    });

    // Manage users
    var setUsers = function() {
        dataString = JSON.stringify(userData);
        $("#usersLoader").show();
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "setUsers",
                jsonData: dataString
            }
        }).done(function(msg) {
            consolelog(dataString);
            $("#manageUsersItem").click();

            consolelog("Success !");
            window.scrollTo(0, 0);
            $("#usersLoader").hide();
        }).fail(function(msg) {
            setError(msg);
            $("#usersLoader").hide();
        });
    }

    $("#manageUsersItem").click(function() {
        document.getElementById('userIconImg').setAttribute('src', '');
        $("#userTable").show();
        $("#addUserForm").empty();
        $("#usersLoader").show();
        showLoader();
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getUsers"
            }
        }).done(function(msg) {
            var jsonData = JSON.parse(msg);
            if (jsonData) {
                keys = Object.keys(jsonData);
                userData = jsonData;

                var length = keys.length;

                var data = [];
                for (var i = 0; i < length; i++) {
                    var tmp = {};
                    tmp.id = keys[i];
                    tmp.description = keys[i].charAt(0).toUpperCase() + keys[i].substr(1);
                    tmp.icon = 'f2bd';
                    data.push(tmp);
                }

                drawSquareAdminInterface(data, $("#usersTable"), "user-set-", "user-del-", "setManageUser", "delManageUser");

                $(".setManageUser").click(function() {
                    if (event.target.tagName.toLowerCase() === 'span') {
                        targetId = event.target.parentNode.id.replace("user-set-", "");
                    } else {
                        targetId = event.target.id.replace("user-set-", "");
                    }
                    consolelog("changed !" + targetId);
                    consolelog(jsonData[targetId]);

                    manageUserForm(jsonData[targetId], targetId);
                });

                $(".delManageUser").click(function() {
                    if (event.target.tagName.toLowerCase() === 'span') {
                        targetId = event.target.parentNode.id.replace("user-del-", "");
                    } else {
                        targetId = event.target.id.replace("user-del-", "");
                    }
                    consolelog("changed !" + targetId);
                    consolelog(jsonData[targetId]);

                    swal(Object.assign({
                        title: t('js.user.delete.confirm', [targetId.charAt(0).toUpperCase() + targetId.substr(1)]),
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: t('js.continue', null),
                        cancelButtonText: t('js.cancel', null)
                    }, swalDefaults)).then(function() {
                        // Confirm
                        delete userData[targetId];
                        setUsers();
                        $("#manageUsersItem").click();
                    }, function(mode) {
                        // Cancel
                        if (mode && mode != 'cancel') {
                            return;
                        }
                    });
                });

            }
            $("#addManageUser").unbind();
            $("#addManageUser").click(function() {
                manageUserForm(null, null);
            });
            $("#usersLoader").hide();
            hideLoader();
        }).fail(function(msg) {
            hideLoader();
            setError(msg);
            $("#usersLoader").hide();
        });
    });

    var manageUserForm = function(obj, key) {
        $("#addUserForm").empty();
        userTable = $("#userTable");
        userTable.hide();
        $("#userIconDiv").show();
        keyFieldReadOnly = false;
        if (key) keyFieldReadOnly = true;
        if (obj && obj.pictureUrl) {
            $("#userIconBase64").val('');
            document.getElementById('userIconImg').setAttribute('src', obj.pictureUrl);
        } else {
            $("#userIconBase64").val('');
        }

        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getBtConfig",
                name: "action"
            }
        }).done(function(msg) {
            formDataBt = JSON.parse(msg);

            formSchema = {
                username: {
                    type: 'string',
                    title: t('js.user.form.login', null),
                    required: true,
                    readonly: keyFieldReadOnly
                },
                pictureUrl: {
                    type: 'hidden',
                    title: t('js.user.form.picture.url', null),
                    required: true
                },
                password: {
                    type: 'password',
                    title: t('js.user.form.password', null),
                    required: true
                },
                email: {
                    type: 'email',
                    title: t('js.user.form.email', null),
                    required: false
                },
                phone: {
                    type: 'tel',
                    title: t('js.user.form.tel', null),
                    required: false
                },
                userImage: {
                    title: t('js.user.form.picture', null),
                    type: 'file'
                },
                admin: {
                    type: 'boolean',
                    required: true
                },
                isInZone: {
                    type: 'boolean',
                    required: true,
                    visible: false,
                    default: 1
                },
                longitude: {
                    type: 'hidden',
                    title: t('js.user.form.longitude', null),
                    required: false
                },
                latitude: {
                    type: 'hidden',
                    title: t('js.user.form.latitude', null),
                    required: false
                },
                radius: {
                    type: 'hidden',
                    title: t('js.user.form.radius', null),
                    required: false
                },
                speed: {
                    type: 'hidden',
                    title: t('js.user.form.speed', null),
                    required: false
                }
            };

            // Bluetooth part
            fDataBt = new Array();
            if (formDataBt) {
                formDataBtKeys = Object.keys(formDataBt.schema);
                btFieldDisplayed = ["btleDevice"];
                for (var i = 0; i < formDataBtKeys.length; i++) {
                    if ($.inArray(formDataBtKeys[i], btFieldDisplayed) > -1) {
                        formSchema[formDataBtKeys[i]] = formDataBt.schema[formDataBtKeys[i]];
                    }
                };

                for (i = 0; i < formDataBt.form.length; i++) {
                    if ($.inArray(formDataBt.form[i].key, btFieldDisplayed) > -1) {
                        fDataBt.push(formDataBt.form[i]);
                    }
                }
            }

            $("#addUserForm").jsonForm({
                schema: formSchema,
                "form": [{
                        "type": "fieldset",
                        "title": "User info",
                        "items": [
                            "username", "pictureUrl", "password", "email", "phone", "userImage",
                            {
                                "key": "admin",
                                "inlinetitle": t('js.user.form.admin', null)
                            },
                            {
                                "key": "isInZone",
                                "inlinetitle": t('js.user.form.in.house', null)
                            }
                        ]
                    },
                    {
                        "type": "fieldset",
                        "title": t('js.bluetooth', null),
                        "expandable": false,
                        "items": fDataBt
                    },
                    {
                        "type": "button",
                        "title": "<span class=\"glyphicon glyphicon-remove\"></span> " + t('js.cancel', null),
                        "onClick": function(evt) {
                            //evt.preventDefault();
                            $("#userTable").show();
                            $("#addUserForm").empty();
                            document.getElementById('userIconImg').setAttribute('src', '');
                            window.scrollTo(0, 0);
                            $("#userIconDiv").hide();
                        }
                    },
                    {
                        "type": "button",
                        "title": "<span class=\"glyphicon glyphicon-picture\"></span> " + t('js.upload.picture', null),
                        "onClick": function(evt) {
                            evt.preventDefault();
                            var files = $('[name="userImage"]').prop("files");
                            var file = files[0];
                            userPicture = null;
                            consolelog(file);

                            if (files && file) {
                                var reader = new FileReader();

                                reader.onload = function(readerEvt) {
                                    var binaryString = readerEvt.target.result;

                                    userPicture = btoa(binaryString);
                                    $("#userIconBase64").val(userPicture);
                                    document.getElementById('userIconImg').setAttribute('src', 'data:image/png;base64,' + userPicture);
                                    window.scrollTo(0, 0);
                                    toastr.success(t('js.upload.success', null));
                                };

                                reader.readAsBinaryString(file);
                                userPicture = $("#userIconBase64").val();
                            }
                        }
                    },
                    {
                        "type": "button",
                        "htmlClass": "btn-primary",
                        "title": "<span class=\"glyphicon glyphicon-floppy-disk\"></span>  " + t('js.save', null),
                        "onClick": function(evt) {
                            // consolelog(evt);
                            // evt.preventDefault();
                            // evt.target.form.submit();
                        }
                    }
                    /*, {
                                        "type": "submit",
                                        "title": " " + t('js.save', null),
                                        "onSubmit": function (evt) {
                                            evt.preventDefault();
                                        }
                                    }*/

                ],
                "value": obj,
                onSubmit: function(errors, values) {
                    if (errors) {
                        setError(t('js.invalid.form.data', null));
                    } else {

                        consolelog('Display b64 image');
                        consolelog(userPicture);
                        values['picture'] = userPicture;
                        consolelog(values);
                        dataKey = values.username;
                        userData[dataKey] = values;
                        consolelog(userData);
                        setUsers();

                        document.getElementById('userIconImg').setAttribute('src', '');
                        $("#userIconDiv").hide();

                        toastr.success(t('js.form.success', null));
                    }
                }
            });


        }).fail(function(msg) {
            setError(msg);
        });


    }

    // Manage ambiances
    var setAmbiances = function() {
        consolelog(ambianceData);
        dataString = JSON.stringify(ambianceData);
        $("#ambiancesLoader").show();
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "setAmbiances",
                jsonData: dataString
            }
        }).done(function(msg) {
            consolelog(dataString);
            $("#manageAmbiancesItem").click();

            consolelog("Success !");
            window.scrollTo(0, 0);
        }).fail(function(msg) {
            setError(msg);
        });
    }

    $("#manageAmbiancesItem").click(function() {
        $("#ambianceTable").show();
        $("#addAmbianceForm").empty();
        showLoader();
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getAmbiances"
            }
        }).done(function(msg) {
            var jsonData = JSON.parse(msg);
            if (jsonData) {
                keys = Object.keys(jsonData);
                ambianceData = jsonData;

                var length = keys.length;

                var data = [];
                for (var i = 0; i < length; i++) {
                    var tmp = {};
                    tmp.id = keys[i];
                    tmp.description = jsonData[keys[i]].name;
                    tmp.icon = jsonData[keys[i]].icon;
                    data.push(tmp);
                }

                drawSquareAdminInterface(data, $("#ambiancesTable"), "ambiance-set-", "ambiance-del-", "setManageAmbiance", "delManageAmbiance");

                $(".setManageAmbiance").click(function() {
                    if (event.target.tagName.toLowerCase() === 'span') {
                        targetId = event.target.parentNode.id.replace("ambiance-set-", "");
                    } else {
                        targetId = event.target.id.replace("ambiance-set-", "");
                    }
                    consolelog("changed !" + targetId);
                    consolelog(jsonData[targetId]);

                    manageAmbianceForm(jsonData[targetId], targetId);
                });

                $(".delManageAmbiance").click(function() {
                    if (event.target.tagName.toLowerCase() === 'span') {
                        targetId = event.target.parentNode.id.replace("ambiance-del-", "");
                    } else {
                        targetId = event.target.id.replace("ambiance-del-", "");
                    }
                    consolelog("changed !" + targetId);
                    consolelog(jsonData[targetId]);

                    swal(Object.assign({
                        title: t('js.ambiances.form.confirm', [jsonData[targetId].name]),
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: t('js.continue', null),
                        cancelButtonText: t('js.cancel', null)
                    }, swalDefaults)).then(function() {
                        // Confirm
                        delete ambianceData[targetId];
                        setAmbiances();
                        $("#manageAmbiancesItem").click();
                    }, function(mode) {
                        // Cancel
                        if (mode && mode != 'cancel') {
                            return;
                        }
                    });
                });
            }
            $("#addManageAmbiance").unbind();
            $("#addManageAmbiance").click(function() {
                manageAmbianceForm(null, null);
            });
            $("#ambiancesLoader").hide();
            hideLoader();
        }).fail(function(msg) {
            hideLoader();
            setError(msg);
            $("#ambiancesLoader").hide();
        });
    });



    var manageAmbianceForm = function(obj, key) {
        $("#addAmbianceForm").empty();
        ambianceTable = $("#ambianceTable");
        ambianceTable.hide();
        keyField = 'string';
        if (key) keyField = 'hidden';

        $("#addAmbianceForm").jsonForm({
            schema: {
                key: {
                    type: 'hidden',
                    title: t('js.ambiances.form.key', null),
                    required: true
                },
                name: {
                    type: 'string',
                    title: t('js.ambiances.form.description', null),
                    required: true
                },
                codes: {
                    type: 'array',
                    title: t('js.ambiances.form.devices', null),
                    uniqueItems: true,
                    "items": {
                        "type": "string",
                        "title": t('js.ambiances.form.devices', null),
                        "enum": fullDevicesKeys
                    }
                },
                icon: {
                    type: 'string',
                    title: t('js.ambiances.form.icon', null),
                    enum: Object.keys(icons)
                }
            },
            "form": [
                "key", "name",
                {
                    "key": "icon",
                    "titleMap": iconsLabel(),
                    "fieldHtmlClass": "selectpicker",
                    "htmlClass": "iconPicker"
                },
                {
                    "key": "codes",
                    "type": "checkboxes",
                    "titleMap": fullDevicesLabels
                },
                {
                    "type": "button",
                    "title": "<span class=\"glyphicon glyphicon-remove\"></span> " + t('js.cancel', null),
                    "onClick": function(evt) {
                        //evt.preventDefault();
                        $("#ambianceTable").show();
                        $("#addAmbianceForm").empty();
                        window.scrollTo(0, 0);
                    }
                },
                {
                    "type": "button",
                    "htmlClass": "btn-primary",
                    "title": "<span class=\"glyphicon glyphicon-floppy-disk\"></span>  " + t('js.save', null),
                    "onClick": function(evt) {
                        // evt.target.submit();
                    }
                }

            ],
            "value": obj,
            onSubmit: function(errors, values) {
                if (errors) {
                    setError(t('js.invalid.form.data', null));
                } else {
                    dataKey = values.key;
                    if ((dataKey == null) || (dataKey == '')) {
                        dataKey = Math.floor(Date.now() / 1000);
                        values.key = dataKey;
                    }
                    ambianceData[dataKey] = values;

                    setAmbiances();

                    toastr.success(t('js.form.success', null));
                }
            }
        });
        $('.selectpicker').selectpicker({
            showTick: false,
            style: "fa",
            showIcon: false,
            tickIcon: ''
        });
    }

    // Manage devices
    var setDevices = function() {
        dataString = JSON.stringify(deviceData);
        $("#devicesLoader").show();
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "setObjects",
                jsonData: dataString
            }
        }).done(function(msg) {
            consolelog(dataString);
            $("#manageDevicesItem").click();

            consolelog("Success !");
            window.scrollTo(0, 0);
            $("#devicesLoader").hide();
        }).fail(function(msg) {
            setError(msg);
            $("#devicesLoader").hide();
        });
    }

    $("#manageDevicesItem").click(function() {

        getFullObjects();

        $("#addManageDevice").unbind();
        $("#addManageDevice").click(function() {
            manageDeviceForm(null, null);
        });

    });



    var manageDeviceForm = function(obj, key) {
        showLoader();

        keyField = 'string';
        if (key) keyField = 'hidden';

        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getRadioConfig",
                name: "device"
            }
        }).done(function(msg) {
            $("#addDeviceForm").empty();
            deviceTable = $("#deviceTable");
            deviceTable.hide();

            formData = JSON.parse(msg);

            // Schema
            formSchema = {
                id: {
                    type: 'hidden',
                    title: t('js.devices.form.key', null),
                    required: false
                },
                description: {
                    type: 'string',
                    title: t('js.devices.form.description', null),
                    required: true
                },
                excludeFromAll: {
                    type: 'boolean',
                    required: true
                },
                visible: {
                    type: 'boolean',
                    required: true,
                    default: true
                },
                icon: {
                    type: 'string',
                    title: t('js.devices.form.icon', null),
                    enum: Object.keys(icons)
                },
                priority: {
                    type: 'hidden',
                    title: t('js.devices.form.priority', null),
                    required: false,
                    default: 0
                },
                enableOnNight: {
                    type: 'string',
                    title: t('js.enableon', null),
                    required: true,
                    "enum": [
                        "both",
                        "night",
                        "day"
                    ]
                },
                voice: {
                    type: 'string',
                    title: t('js.devices.form.voice.keywords', null),
                    required: false,
                    default: ''
                }
            };

            formDataKeys = Object.keys(formData.schema);
            for (var i = 0; i < formDataKeys.length; i++) {
                formSchema[formDataKeys[i]] = formData.schema[formDataKeys[i]];
            };

            // Form
            form = [
                "id", "description",
                {
                    "key": "icon",
                    "titleMap": iconsLabel(),
                    "fieldHtmlClass": "selectpicker",
                    "htmlClass": "iconPicker"
                },
                {
                    "key": "excludeFromAll",
                    "inlinetitle": t('js.devices.form.exclude.from.all', null)

                },
                {
                    "key": "visible",
                    "inlinetitle": t('js.devices.form.visible', null)
                },
                "priority",
                {
                    "key": "enableOnNight",
                    "titleMap": {
                        "both": t('js.day.and.night', null),
                        "night": t('js.night', null),
                        "day": t('js.day', null)
                    }
                }, "voice",
                {
                    "type": "button",
                    "title": "<span class=\"glyphicon glyphicon-remove\"></span> " + t('js.cancel', null),
                    "onClick": function(evt) {
                        //evt.preventDefault();
                        $("#deviceTable").show();
                        $("#addDeviceForm").empty();
                        window.scrollTo(0, 0);
                    }
                },
                {
                    "type": "button",
                    "htmlClass": "btn-primary",
                    "title": "<span class=\"glyphicon glyphicon-floppy-disk\"></span>  " + t('js.save', null),
                    "onClick": function(evt) {
                        // evt.target.submit();
                    }
                }
            ];

            index = 2;
            for (var i = 0; i < formData.form.length; i++) {
                form.splice(index + i, 0, formData.form[i]);
            }

            $("#addDeviceForm").jsonForm({
                schema: formSchema,
                "form": form,
                "value": obj,
                onSubmit: function(errors, values) {
                    if (errors) {
                        setError(t('js.invalid.form.data', null));
                    } else {
                        dataKey = values.id;
                        if ((dataKey == null) || (dataKey == '')) {
                            dataKey = Math.floor(Date.now() / 1000);
                            values.id = dataKey;
                        }
                        deviceData[dataKey] = values;
                        consolelog(dataKey);

                        setDevices();
                        toastr.success(t('js.form.success', null));
                    }
                }
            });
            $('.selectpicker').selectpicker({
                showTick: false,
                style: "fa",
                showIcon: false,
                tickIcon: ''
            });
            hideLoader();
        }).fail(function(msg) {
            hideLoader();
            setError(msg);
        });
    }

    // Manage alarm

    var setManageAlarm = function(alarmData) {
        dataString = JSON.stringify(alarmData);
        consolelog(dataString);
        $("#alarmLoader").show();
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "setManageAlarm",
                jsonData: dataString
            }
        }).done(function(msg) {
            consolelog(dataString);

            consolelog("Success !");
            window.scrollTo(0, 0);
            $("#alarmLoader").hide();
        }).fail(function(msg) {
            setError(msg);
            $("#alarmLoader").hide();
        });
    }

    $("#manageAlarmItem").click(function() {
        $("#alarmTable").show();
        $("#addAlarmForm").empty();
        $("#alarmLoader").show();
        showLoader();
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getManageAlarm"
            }
        }).done(function(msg) {
            var jsonData = JSON.parse(msg);
            if (jsonData) {
                //keys = Object.keys(jsonData);
                manageAlarmForm(jsonData, null);

            } else {
                manageAlarmForm(null, null);
            }
            $("#alarmLoader").hide();
            hideLoader();
        }).fail(function(msg) {
            hideLoader();
            setError(msg);
            manageAlarmForm(null, null);
            $("#alarmLoader").hide();
        });
    });


    var manageAlarmForm = function(obj, key) {
        consolelog(obj);
        consolelog(obj.sensors);
        showLoader();
        reqPluginList = $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getSensors"
            }
        }).done(function(msg) {
            var jsonData = JSON.parse(msg, function(key, value) {
                if (value && (typeof value === 'string') && value.indexOf("function") === 0) {
                    // we can only pass a function as string in JSON ==> doing a real function
                    var jsFunc = new Function('return ' + value)();
                    return jsFunc;
                }

                return value;
            });

            var sensorItems = [];
            var sensorItemsLabels = {};
            for (var i = 0 ; i < jsonData.length ; i ++) {
                if (jsonData[i].type == 'PRESENCE-SENSOR') {
                    sensorItems.push(jsonData[i].identifier);
                    sensorItemsLabels[jsonData[i].identifier] = jsonData[i].sensorName;
                }
            }
            console.log(sensorItems);
            console.log(sensorItemsLabels);
            if (obj.cameraShotSensors == null) {
                obj.cameraShotSensors = [];
            }

            hideLoader();

            $("#addAlarmForm").jsonForm({
                schema: {
                    status: {
                        type: 'boolean',
                        inlinetitle: t('js.status', null),
                        required: true
                    },
                    autoEnableWithUsers: {
                        type: 'boolean'
                    },
                    objects: {
                        type: 'array',
                        title: t('js.alarm.form.devices', null),
                        uniqueItems: true,
                        "items": {
                            "type": "string",
                            "title": t('js.alarm.form.devices.short', null),
                            "enum": fullDevicesKeys
                        }
                    },
                    triggerOn: {
                        type: 'array',
                        title: t('js.alarm.form.triggerred.on', null),
                        uniqueItems: true,
                        "items": {
                            "type": "string",
                            "title": t('js.alarm.form.triggered.short', null),
                            "enum": fullDevicesKeys
                        }
                    },
                    triggerOff: {
                        type: 'array',
                        title: t('js.alarm.form.triggerred.off', null),
                        uniqueItems: true,
                        "items": {
                            "type": "string",
                            "title": t('js.alarm.form.triggered.short', null),
                            "enum": fullDevicesKeys
                        }
                    },
                    warnShotWhenNobodyIsAtHouse: {
                        type: 'boolean',
                        default:true
                    },
                    sensors: {
                        type: 'array',
                        title: t('js.alarm.form.sensors', null),
                        "items": {
                            type: "object",
                            properties: {
                                sensor: {
                                    type: 'string',
                                    uniqueItems: true,
                                    "enum": sensorItems
                                },
                                shotOnlyWhenAlarmIsOn: {
                                    type: 'boolean',
                                    default:true
                                },
                                sensorTriggerAlarm: {
                                    type: 'boolean',
                                    default:true
                                }
                            }
                        }
                    }
                },
                "form": [{
                        "key": "status",
                        "htmlClass": "invisible"
                    },
                    {
                        "key": "autoEnableWithUsers",
                        "inlinetitle": t('js.alarm.form.auto.enable.users', null)
                    },
                    {
                        "key": "objects",
                        "type": "checkboxes",
                        "titleMap": fullDevicesLabels
                    },
                    {
                        "key": "warnShotWhenNobodyIsAtHouse",
                        "inlinetitle": t('js.alarm.form.warn.nobody.in.house', null)
                    },
                    {
                        "key": "sensors",
                        "type": "array",
                        "items": {
                            "type": "fieldset",
                            "expandable": false,
                            "items": [{
                                    "key": "sensors[].sensor",
                                    "titleMap": sensorItemsLabels
                                },
                                {
                                    "key":"sensors[].shotOnlyWhenAlarmIsOn",
                                    "inlinetitle":t('js.alarm.form.sensors.enable.on.alarm', null),
                                },
                                {
                                    "key":"sensors[].sensorTriggerAlarm",
                                    "inlinetitle":t('js.alarm.form.sensors.sensor.trigger.alarm', null),
                                }
                            ]
                        }
                    },
                    {
                        "key": "triggerOn",
                        "type": "checkboxes",
                        "titleMap": fullDevicesLabels
                    },
                    {
                        "key": "triggerOff",
                        "type": "checkboxes",
                        "titleMap": fullDevicesLabels
                    },
                    {
                        "type": "button",
                        "htmlClass": "btn-primary",
                        "title": "<span class=\"glyphicon glyphicon-floppy-disk\"></span>  " + t('js.save', null),
                        "onClick": function(evt) {
                            // evt.target.submit();
                        }
                    }

                ],
                "value": obj.alarm,
                onSubmit: function(errors, values) {
                    if (errors) {
                        setError(t('js.invalid.form.data', null));
                    } else {
                        setManageAlarm(values);
                        toastr.success(t('js.form.success', null));
                    }
                }
            });
        }).fail(function(msg) {
            displayError(msg);
            hideLoader();
        });
    }

    // Manage cameras
    var setCameras = function() {
        consolelog(cameraData);
        dataString = JSON.stringify(cameraData);
        $("#camerasLoader").show();
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "setCameras",
                jsonData: dataString
            }
        }).done(function(msg) {
            consolelog(dataString);
            $("#manageCamerasItem").click();

            consolelog("Success !");
            window.scrollTo(0, 0);
        }).fail(function(msg) {
            setError(msg);
        });
    }

    $("#manageCamerasItem").click(function() {
        $("#cameraTable").show();
        $("#addCameraForm").empty();
        showLoader();
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getCamerasAdmin"
            }
        }).done(function(msg) {
            var jsonData = JSON.parse(msg);
            if (jsonData) {
                keys = Object.keys(jsonData);

                var length = keys.length;

                var data = [];
                for (var i = 0; i < length; i++) {
                    var tmp = {};
                    tmp.id = keys[i];
                    tmp.description = jsonData[keys[i]].description;
                    tmp.icon = 'E83F';
                    data.push(tmp);
                }

                drawSquareAdminInterface(data, $("#camerasTable"), "camera-set-", "camera-del-", "setManageCamera", "delManageCamera");

                $(".setManageCamera").click(function() {
                    if (event.target.tagName.toLowerCase() === 'span') {
                        targetId = event.target.parentNode.id.replace("camera-set-", "");
                    } else {
                        targetId = event.target.id.replace("camera-set-", "");
                    }
                    consolelog("changed !" + targetId);
                    consolelog(jsonData[targetId]);

                    manageCameraForm(jsonData[targetId], targetId);
                });

                $(".delManageCamera").click(function() {
                    if (event.target.tagName.toLowerCase() === 'span') {
                        targetId = event.target.parentNode.id.replace("camera-del-", "");
                    } else {
                        targetId = event.target.id.replace("camera-del-", "");
                    }
                    consolelog("changed !" + targetId);
                    consolelog(jsonData[targetId]);

                    swal(Object.assign({
                        title: t('js.cameras.form.confirm', [jsonData[targetId].description]),
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: t('js.continue', null),
                        cancelButtonText: t('js.cancel', null),
                        showLoaderOnConfirm: true
                    }, swalDefaults)).then(function() {
                        // Confirm
                        $.ajax({
                            type: "POST",
                            url: vUrl,
                            data: {
                                username: username,
                                ePassword: ePassword,
                                method: "delCamera",
                                name: targetId
                            }
                        }).done(function(msg) {
                            $("#manageCamerasItem").click();
                        }).fail(function(msg) {
                            setError(msg);
                        });
                    }, function(mode) {
                        // Cancel
                        if (mode && mode != 'cancel') {
                            return;
                        }
                    });
                });
            }
            $("#addManageCamera").unbind();
            $("#addManageCamera").click(function() {
                manageCameraForm(null, null);
            });
            $("#camerasLoader").hide();
            hideLoader();
        }).fail(function(msg) {
            hideLoader();
            setError(msg);
            $("#camerasLoader").hide();
        });
    });

    var manageCameraSubform = function(obj, key, subform, cameraPluginList) {
        $("#addCameraForm").empty();
        cameraTable = $("#cameraTable");
        cameraTable.hide();
        keyField = 'string';
        if (key) keyField = 'hidden';

        cameraPluginSchemaDescriptor = {
            key: {
                type: "hidden"
            },
            cameraPlugin: {
                type: "string",
                title: t('js.cameras.subform.type', null),
                readonly: true
            },
            description: {
                type: "string",
                title: t('js.cameras.subform.description', null)
            },
            defaultCam: {
                type: "boolean"
            }
        };
        schemaDescriptor = jQuery.extend(cameraPluginSchemaDescriptor, subform.schema);
        formDescriptor = [{
            "key": "key"
        }, {
            "key": "cameraPlugin"
        }, {
            "key": "description"
        }, {
            "key": "defaultCam",
            "inlinetitle": t('js.cameras.subform.default', null)
        }];
        buttonsDescriptor = [{
            "type": "button",
            "title": "<span class=\"glyphicon glyphicon-remove\"></span> " + t('js.cancel', null),
            "onClick": function(evt) {
                $("#cameraTable").show();
                $("#addCameraForm").empty();
                window.scrollTo(0, 0);
            }
        }, {
            "type": "button",
            "htmlClass": "btn-primary",
            "title": "<span class=\"glyphicon glyphicon-floppy-disk\"></span> " + t('js.save', null),
            "onClick": function(evt) { /*evt.target.submit();*/ }
        }];
        formDescriptor = formDescriptor.concat(subform.form);
        formDescriptor = formDescriptor.concat(buttonsDescriptor);


        $("#addCameraForm").jsonForm({
            schema: schemaDescriptor,
            "form": formDescriptor,
            "value": obj,
            onSubmit: function(errors, values) {
                consolelog(errors);
                if (errors) {
                    setError(t('js.invalid.form.data', null));
                } else {
                    //dataKey = values.key;
                    //cameraData[dataKey] = values;
                    cameraData = values;
                    setCameras();
                    toastr.success(t('js.form.success', null));
                }
            }
        });
    }

    var manageCameraForm = function(obj, key) {
        $("#addCameraForm").empty();
        cameraTable = $("#cameraTable");
        cameraTable.hide();
        keyField = 'string';
        if (key) keyField = 'hidden';

        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getSupportedCameraList"
            }
        }).done(function(msg) {
            cameras = JSON.parse(msg, function(key, value) {
                if (value && (typeof value === 'string') && value.indexOf("function") === 0) {
                    // we can only pass a function as string in JSON ==> doing a real function
                    var jsFunc = new Function('return ' + value)();
                    return jsFunc;
                }

                return value;
            });

            cameraPluginList = new Array(t('js.cameras.plugins.pick', null));
            cameraPluginFormList = new Array();
            cameraPluginFormTitlesList = {};
            for (var i = 0; i < cameras.length; i++) {
                cameraPluginList.push(cameras[i].identifier);
                cameraPluginFormList[cameras[i].identifier] = cameras[i].config;
                cKey = cameras[i].identifier;
                cValue = cameras[i].name;
                cameraPluginFormTitlesList[cKey] = cValue;
            }

            if (obj != null) {
                if (obj.cameraPlugin) {
                    manageCameraSubform(obj, key, cameraPluginFormList[obj.cameraPlugin], cameraPluginList);
                    return false;
                }
            }
            $("#addCameraForm").empty();
            $("#addCameraForm").jsonForm({
                schema: {
                    cameraPlugin: {
                        "type": "string",
                        "title": t('js.cameras.subform.type', null),
                        "enum": cameraPluginList
                    }
                },
                "form": [{
                    "key": "cameraPlugin",
                    "titleMap": cameraPluginFormTitlesList,
                    "onChange": function(evt) {
                        if (!obj) {
                            obj = {
                                cameraPlugin: null
                            };
                        }
                        obj.cameraPlugin = evt.target.value;
                        manageCameraSubform(obj, key, cameraPluginFormList[evt.target.value], cameraPluginList);
                    }
                }],
                "value": obj
            });
        }).fail(function(msg) {
            setError(msg);
        });
    }
    // Manage config

    var setManageConfig = function(configData) {
        dataString = JSON.stringify(configData);
        consolelog(dataString);
        $("#configLoader").show();
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "setConfig",
                jsonData: dataString
            }
        }).done(function(msg) {
            consolelog(dataString);

            consolelog("Success !");
            window.scrollTo(0, 0);
            $("#configLoader").hide();
        }).fail(function(msg) {
            setError(msg);
            $("#configLoader").hide();
        });
    }

    $("#manageConfigItem").click(function() {
        $("#configTable").show();
        $("#addConfigForm").empty();
        $("#configLoader").show();
        showLoader();
        $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getConfig"
            }
        }).done(function(msg) {
            var jsonData = JSON.parse(msg);
            if (jsonData) {
                //keys = Object.keys(jsonData);
                manageConfigForm(jsonData, null);

            }
            $("#configLoader").hide();
            hideLoader();
        }).fail(function(msg) {
            hideLoader();
            setError(msg);
            $("#configLoader").hide();

        });
    });


    var manageConfigForm = function(obj, key) {


        $("#addConfigForm").jsonForm({
            schema: {
                hautomationID: {
                    "type": "string",
                    "readonly": true,
                    "title": t('js.global.configuration.form.hautomation.id', null)
                },
                gatewayMode: {
                    "type": "number",
                    "title": t('js.global.configuration.form.gateway.mode', null),
                    "enum": [
                        0, 1
                    ]
                },
                disableAutoUpdate: {
                    type: 'boolean',
                    required: false
                },
                lng: {
                    type: 'string',
                    title: t('js.global.configuration.form.language', null),
                    enum: ['en', 'fr'],
                    required: true
                },
                agentRefreshCamera: {
                    type: 'number',
                    title: t('js.global.configuration.form.camera.refresh', null),
                    required: true
                },
                agentRefreshList: {
                    type: 'number',
                    title: t('js.global.configuration.form.dashboard', null),
                    required: true
                },
                cacheDashboard: {
                    type: 'boolean',
                    default: true
                },
                iotAutoUpdate: {
                    type: 'boolean',
                    default: true
                },
                encryptionKey: {
                    type: 'string',
                    title: t('js.global.configuration.form.encryption.key', null),
                    required: true
                },
                sessionTime: {
                    type: 'number',
                    title: t('js.global.configuration.form.session.time', null),
                    required: true
                },
                adminLogin: {
                    type: 'string',
                    title: t('js.global.configuration.form.admin.login', null),
                    required: true
                },
                adminPassword: {
                    type: 'password',
                    title: t('js.global.configuration.form.admin.password', null),
                    required: true
                },
                enableAutoAuth: {
                    type: 'boolean',
                    required: false
                },
                autoAuthAdmin: {
                    type: 'boolean',
                    required: false
                },
                houseLongitude: {
                    type: 'number',
                    title: t('js.global.configuration.form.longitude', null),
                    required: true
                },
                houseLatitude: {
                    type: 'number',
                    title: t('js.global.configuration.form.latitude', null),
                    required: true
                },
                houseRadius: {
                    type: 'number',
                    title: t('js.global.configuration.form.radius', null),
                    required: true
                },
                mysqlHost: {
                    type: 'string',
                    title: t('js.global.configuration.form.mysql.host', null),
                    required: true
                },
                dbType: {
                    "type": "number",
                    "title": t('js.global.configuration.form.database.type', null),
                    "enum": [
                        'sqlite',
                        'mysql'
                    ]
                },
                mysqlDb: {
                    type: 'string',
                    title: t('js.global.configuration.form.mysql.db', null),
                    required: true
                },
                mysqlUser: {
                    type: 'string',
                    title: t('js.global.configuration.form.mysql.login', null),
                    required: true
                },
                mysqlPassword: {
                    type: 'password',
                    title: t('js.global.configuration.form.mysql.password', null),
                    required: true
                },
                debug: {
                    type: 'boolean',
                    required: true
                },
                logLevel: {
                    "type": "number",
                    "title": t('js.global.configuration.form.loglevel', null),
                    "enum": [
                        0,
                        1,
                        2,
                        3,
                        4,
                        5
                    ]
                }
            },
            "form": [
                "hautomationID",
                {
                    "key": "gatewayMode",
                    "titleMap": {
                        0: t('js.global.configuration.form.gateway.mode.proxy', null),
                        1: t('js.global.configuration.form.gateway.mode.redirect', null)
                    }
                },
                {
                    "key": "disableAutoUpdate",
                    "inlinetitle": t('js.global.configuration.form.disable.autoupdate', null)
                },
                {
                    "key": "agentRefreshCamera",
                    "append": t('js.seconds', null)
                },
                {
                    "key": "agentRefreshList",
                    "append": t('js.seconds', null)
                },
                {
                    "key": "cacheDashboard",
                    "inlinetitle": t('js.global.configuration.form.dashboard.cache', null)
                },
                {
                    "key": "iotAutoUpdate",
                    "inlinetitle": t('js.global.configuration.form.dashboard.iot.auto.update', null)
                },
                {
                    "type": "fieldset",
                    "title": t('js.global.configuration.form.section.authentication', null),
                    "expandable": false,
                    "items": [
                        "encryptionKey",
                        {
                            "key": "sessionTime",
                            "append": t('js.seconds', null)
                        },
                        "adminLogin", "adminPassword",
                        {
                            "key": "enableAutoAuth",
                            "inlinetitle": t('js.global.configuration.form.auto.login', null)
                        },
                        {
                            "key": "autoAuthAdmin",
                            "inlinetitle": t('js.global.configuration.form.auto.login.admin', null)
                        }
                    ]
                },
                {
                    "type": "fieldset",
                    "title": t('js.global.configuration.form.section.house.info', null),
                    "expandable": false,
                    "items": [
                        "houseLongitude", "houseLatitude",
                        {
                            "key": "houseRadius",
                            "append": t('js.meters', null)
                        }
                    ]
                },
                {
                    "type": "fieldset",
                    "title": t('js.global.configuration.form.section.language.and.format', null),
                    "expandable": false,
                    "items": [{
                        "key": "lng",
                        "titleMap": {
                            "en": t('js.global.configuration.form.language.en', null),
                            "fr": t('js.global.configuration.form.language.fr', null)
                        }
                    }]
                },
                {
                    "type": "fieldset",
                    "title": t('js.global.configuration.form.section.database', null),
                    "expandable": false,
                    "items": [
                        "dbType",
                        "mysqlHost",
                        "mysqlDb",
                        "mysqlUser",
                        "mysqlPassword"
                    ]
                },
                {
                    "type": "fieldset",
                    "title": t('js.global.configuration.form.debug', null),
                    "expandable": false,
                    "items": [{
                            "key": "debug",
                            "inlinetitle": t('js.enable', null)
                        },
                        "logLevel"
                    ]
                },
                {
                    "type": "button",
                    "htmlClass": "btn-primary",
                    "title": "<span class=\"glyphicon glyphicon-floppy-disk\"></span> " + t('js.save', null),
                    "onClick": function(evt) {
                        // evt.target.submit();
                    }
                }
            ],
            "value": obj,
            onSubmit: function(errors, values) {

                if (errors) {
                    setError(t('js.invalid.form.data', null));
                } else {
                    setManageConfig(values);
                    toastr.success(t('js.form.success', null));
                }
            }
        });
    }

    $("#manageSensorsItem").click(function() {
        $("#sensorsLoader").show();
        showLoader();
        reqPluginList = $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getSensors"
            }
        }).done(function(msg) {
            var jsonData = JSON.parse(msg, function(key, value) {
                if (value && (typeof value === 'string') && value.indexOf("function") === 0) {
                    // we can only pass a function as string in JSON ==> doing a real function
                    var jsFunc = new Function('return ' + value)();
                    return jsFunc;
                }

                return value;
            });

            var nbLine = 4;
            var colcount = 0;
            var sensorsContent = '';
            $("#sensorsContent").empty();

            for (var i = 0; i < jsonData.length; i++) {
                if (colcount == 0) {
                    sensorsContent = sensorsContent + '<div class="row">';
                }
                sensorsContent = sensorsContent + '<div class="col-md-2 sensorClick sensorTile" id="' + jsonData[i].identifier + '" style="background-color:' + jsonData[i].color + '">';
                sensorsContent = sensorsContent + '<i class="fa sensorIcon" data-unicode="' + jsonData[i].icon + '">&#x' + jsonData[i].icon + '</i><br/>';
                sensorsContent = sensorsContent + '<span class="label label-success">' + jsonData[i].type + '</span><br/>';
                sensorsContent = sensorsContent + '<span class="label">' + jsonData[i].configValues.sensorLocationExisting + '</span><br/><br />';
                sensorsContent = sensorsContent + '<strong>' + jsonData[i].sensorName + '</strong>';
                sensorsContent = sensorsContent + '</div>';
                colcount++;
                if (colcount == 5) {
                    sensorsContent = sensorsContent + '</div>';
                    colcount = 0;
                }
            }
            if (colcount != 0) {
                sensorsContent = sensorsContent + '</div>';
            }
            $("#sensorsContent").html(sensorsContent);

            $("#sensorsLoader").hide();

            $(".sensorClick").unbind();
            $(".sensorClick").click(function(e) {
                $("#deleteSensorForm").show();
                $('#sensorModal').modal('show');
                $('#sensorSelectForm').empty();
                $('#sensorOtaFlashBtn').empty();

                var res = e.currentTarget.id.split("-");
                var key = res[(res.length - 1)];

                $("#deleteSensorForm").unbind();
                $("#deleteSensorForm").click(function() {

                    swal(Object.assign({
                        title: t('js.global.sensors.form.confirm', null),
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: t('js.continue', null),
                        cancelButtonText: t('js.cancel', null),
                        showLoaderOnConfirm: true
                    }, swalDefaults)).then(function() {
                        // Confirm
                        showLoader();
                        var reqDelSensor = $.ajax({
                            type: "POST",
                            url: vUrl,
                            data: {
                                username: username,
                                ePassword: ePassword,
                                method: "deleteSensor",
                                data: JSON.stringify({
                                    'identifier': key
                                })
                            }
                        }).done(function(msg) {
                            $('#sensorModal').modal('hide');
                            toastr.success(t('js.global.sensors.form.deleted', null));
                            $("#manageSensorsItem").click();
                            hideLoader();
                        }).fail(function(msg) {
                            displayError(msg);
                            hideLoader();
                        });
                    }, function(mode) {
                        // Cancel
                        if (mode && mode != 'cancel') {
                            return;
                        }
                    });
                });

                var plugin = null;
                for (var i = 0; i < jsonData.length; i++) {
                    if (jsonData[i].identifier == e.currentTarget.id) {
                        plugin = jsonData[i];
                        break;
                    }
                }

                if (plugin.otaFlash) {
                    document.getElementById('sensorOtaFlashBtn').innerHTML = '<button class="btn btn-primary" aria-hidden="true" id="otaFlash"><span class="glyphicon glyphicon-export" aria-hidden="true"></span> ' + t('js.global.sensors.ota.flash', null) + '</button>';
                }

                // Display OTA form
                $("#sensorOtaFlashBtn").unbind();
                $("#sensorOtaFlashBtn").click(function() {
                    $('#sensorModal').modal('hide');
                    flashSensor(plugin);
                });

                // Display sensor form
                $("#saveSensorForm").unbind();
                $("#saveSensorForm").click(function() {
                    $("#sensorForm").submit();
                });

                $("#sensorForm").empty();
                var pluginIdentifier = plugin.baseIdentifier;
                consolelog("------");
                consolelog(plugin.config.schema);
                consolelog(plugin.config.form);
                $("#sensorForm").jsonForm({
                    schema: plugin.config.schema,
                    "form": plugin.config.form,
                    "value": plugin.configValues,
                    onSubmit: function(errors, values) {
                        if (errors) {
                            setError(t('js.invalid.form.data', null));
                        } else {
                            values.key = key;
                            if (values.sensorLocation && (values.sensorLocation != '')) values.sensorLocationExisting = values.sensorLocation;
                            values.sensorLocation = null;
                            showLoader();
                            reqPluginSetConfig = $.ajax({
                                type: "POST",
                                url: vUrl,
                                data: {
                                    username: username,
                                    ePassword: ePassword,
                                    method: "setSensor",
                                    data: JSON.stringify(values),
                                    pluginIdentifier: pluginIdentifier
                                }
                            }).done(function(msg) {
                                $('#sensorModal').modal('hide');
                                toastr.success('Sensor saved');
                                $("#manageSensorsItem").click();
                                hideLoader();
                            }).fail(function(msg) {
                                displayError(msg);
                                hideLoader();
                            });
                        }
                    }
                });
            });
            hideLoader();
        });
    });

    $("#addSensors").click(function() {
        $("#sensorsLoader").show();
        showLoader();
        reqPluginList = $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getSensorPluginList"
            }
        }).done(function(msg) {
            $("#sensorsLoader").hide();
            $("#deleteSensorForm").hide();
            // var jsonData = JSON.parse(msg);
            var jsonData = JSON.parse(msg, function(key, value) {
                if (value && (typeof value === 'string') && value.indexOf("function") === 0) {
                    // we can only pass a function as string in JSON ==> doing a real function
                    var jsFunc = new Function('return ' + value)();
                    return jsFunc;
                }

                return value;
            });

            if (jsonData) {
                var formContent = '<select id="sensorSelector" class="form-control">';
                formContent = formContent + '<option value="">' + t('js.global.sensors.form.sensor.type.default', null) + '</option>';
                var keys = Object.keys(jsonData);

                for (var i = 0; i < keys.length; i++) {
                    formContent = formContent + '<option value="' + keys[i] + '">' + jsonData[keys[i]].name + ' (' + jsonData[keys[i]].type + ')' + '</option>';
                }

                formContent = formContent + '</select>';
                $('#sensorSelectForm').empty();
                $('#sensorForm').empty();
                $('#sensorSelectForm').append(formContent);
                $('#sensorModal').modal('show');
                $("#sensorSelector").unbind();
                $('#sensorSelector').change(function() {
                    var key = $('#sensorSelector').val();
                    if (key == '') return;
                    // Display sensor form
                    $("#saveSensorForm").unbind();
                    $("#saveSensorForm").click(function() {
                        $("#sensorForm").submit();
                    });

                    var plugin = jsonData[key];
                    consolelog(plugin);
                    $("#sensorForm").empty();
                    var pluginIdentifier = plugin.identifier;
                    var selectedPluginId = parseInt(key);
                    consolelog("----->");
                    consolelog(plugin);

                    $("#sensorForm").jsonForm({
                        schema: plugin.config.schema,
                        "form": plugin.config.form,
                        "value": plugin.configValues,
                        onSubmit: function(errors, values) {
                            if (errors || (values.sensorLocation == null && values.sensorLocationExisting == null)) {
                                setError(t('js.invalid.form.data', null));
                            } else {
                                if (values.sensorLocation && (values.sensorLocation != '')) values.sensorLocationExisting = values.sensorLocation;
                                values.sensorLocation = null;
                                reqPluginSetConfig = $.ajax({
                                    type: "POST",
                                    url: vUrl,
                                    data: {
                                        username: username,
                                        ePassword: ePassword,
                                        method: "setSensor",
                                        data: JSON.stringify(values),
                                        pluginIdentifier: pluginIdentifier
                                    }
                                }).done(function(msg) {
                                    jsonData[selectedPluginId].configValues = values;
                                    $('#sensorModal').modal('hide');
                                    toastr.success(t('js.form.success', null));
                                    $("#manageSensorsItem").click();
                                }).fail(function(msg) {
                                    displayError(msg);
                                });
                            }
                        }
                    });
                });
            }
            hideLoader();
        });
    });

    var iotAppForm = function(iotApp, sensorInfo) {
        $("#sensorFlashForm").empty();
        $("#flashIoTBtn").unbind();
        $("#flashIoTBtn").click(function() {
            $("#sensorFlashForm").submit();
        });

        $("#sensorFlashForm").jsonForm({
            schema: iotApp.form.schema,
            "form": iotApp.form.form,
            "value": iotApp.form.values,
            onSubmit: function(errors, values) {
                if (errors) {
                    setError(t('js.invalid.form.data', null));
                } else {
                    if (values.sensorLocation && (values.sensorLocation != '')) values.sensorLocationExisting = values.sensorLocation;
                    values.sensorLocation = null;
                    var data = {};
                    data.iotApp = iotApp;
                    data.dataValues = values;
                    data.ota = false;
                    if (sensorInfo != null) data.ota = true;

                    var flashIoT = $.ajax({
                        type: "POST",
                        url: vUrl,
                        data: {
                            username: username,
                            ePassword: ePassword,
                            method: "flashIoT",
                            data: JSON.stringify(data)
                        }
                    }).done(function(msg) {
                        var data = JSON.parse(msg);
                        var board = data.board;
                        var buildToken = data.buildToken;

                        if (data.buildToken) {
                            $("#iotModuleSelectForm").empty();
                            $("#sensorFlashForm").empty();
                            $("#sensorFlashForm").unbind();
                            $("#flashIoTBtn").hide();
                            $("#closeIoTBtn").hide();

                            var refreshIoTBuildToken = function() {
                                consolelog("Refreshing build");
                                var flashIoT = $.ajax({
                                    type: "POST",
                                    url: vUrl,
                                    data: {
                                        username: username,
                                        ePassword: ePassword,
                                        method: "flashIoTStatus",
                                        data: msg
                                    }
                                }).done(function(msg) {
                                    var status = JSON.parse(msg);
                                    var stateHtml = '<table class="table table-condensed">';
                                    var hasError = false;
                                    for (i = 0; i < status.steps.length; i++) {
                                        if (status.steps[i].state == -1) hasError = true;
                                        var styleClass = 'active';
                                        if (status.steps[i].state == -1) styleClass = 'danger';
                                        if (status.steps[i].state == 1) styleClass = 'info';
                                        if (status.steps[i].state == 2) styleClass = 'success';
                                        stateHtml = stateHtml + '<tr class="' + styleClass + '">';
                                        if (status.steps[i].id == "build") {
                                            stateHtml = stateHtml + '<td><span class="glyphicon glyphicon-wrench" aria-hidden="true"></span></td>';
                                        } else {
                                            if (status.steps[i].id == "uploading") {
                                                stateHtml = stateHtml + '<td><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span></td>';
                                            } else {
                                                stateHtml = stateHtml + '<td>&nbsp;</td>';
                                            }
                                        }
                                        stateHtml = stateHtml + '<td>' + status.steps[i].label + '</td>';
                                        stateHtml = stateHtml + '<td>' + status.steps[i].status + '</td>';
                                        stateHtml = stateHtml + '</tr>';
                                    }
                                    stateHtml = stateHtml + '</table>';

                                    var title = t('js.global.sensors.form.iot.flashing');
                                    var additionnalInfo = '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">' +
                                        '<div class="panel panel-default">' +
                                        '<div class="panel-heading" role="tab" id="flashDetailsHeading">' +
                                        '<h4 class="panel-title">' +
                                        '<a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#flashDetails" aria-expanded="true" aria-controls="flashDetails">' +
                                        t('js.details') +
                                        '</a>' +
                                        '</h4>' +
                                        '</div>' +
                                        '<div id="flashDetails" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">' +
                                        '<div class="panel-body">' +
                                        '<code>' + nl2br(status.log) + '</code>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>';
                                    if (status.finished) {
                                        if (hasError) {
                                            title = t('js.global.sensors.form.iot.flashing.error');
                                        } else {
                                            title = t('js.global.sensors.form.iot.flashing.success');
                                        }
                                    }

                                    var loaderFlashing = '<span></span>';
                                    if (!status.finished && !hasError) {
                                        loaderFlashing = '<div style="float: left;top: -8px;position: relative"><img src="img/squares.svg" /></div>';
                                    }

                                    stateHtml = '<h3>' + iotApp.name + '</h3>' + loaderFlashing + '<h4>' + title + '</h4>' + stateHtml + '<br/>' + additionnalInfo;

                                    document.getElementById("flashResults").innerHTML = stateHtml;

                                    if (!status.finished) {
                                        window.setTimeout(refreshIoTBuildToken, 3000);
                                    } else {
                                        $("#closeIoTBtn").show();
                                    }

                                    if (status.firmwareAvailable) {
                                        $("#dlFirmwareIoTBtn").show();
                                        $("#dlFirmwareIoTBtn").unbind();
                                        var ob = {};
                                        ob.board = board;
                                        ob.buildToken = buildToken;

                                        $("#dlFirmwareIoTBtn").click(function() {
                                            var newWindow = window.open("", "_blank");
                                            newWindow.location.href = vUrl + '?username=' + encodeURIComponent(username) + '&ePassword=' + ePassword + '&method=getIoTFirmware&data=' + encodeURIComponent(JSON.stringify(ob));
                                        });
                                    }

                                }).fail(function(msg) {
                                    displayError(msg);
                                    $("#flashIoTBtn").show();
                                    $("#closeIoTBtn").show();
                                });
                            }
                            refreshIoTBuildToken();
                        }
                    }).fail(function(msg) {
                        displayError(msg);
                    });
                }
            }
        });
    }

    var flashSensor = function(sensorInfo) {
        $("#sensorsLoader").show();
        $("#flashResults").empty();
        $("#flashIoTBtn").show();
        $("#closeIoTBtn").show();
        $("#flashIoTBtn").unbind();
        $("#dlFirmwareIoTBtn").hide();
        showLoader();
        reqFlashSensor = $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getIoTApps"
            }
        }).done(function(msg) {
            $("#sensorsLoader").hide();

            // var jsonData = JSON.parse(msg);
            var jsonData = JSON.parse(msg, function(key, value) {
                if (value && (typeof value === 'string') && value.indexOf("function") === 0) {
                    // we can only pass a function as string in JSON ==> doing a real function
                    var jsFunc = new Function('return ' + value)();
                    return jsFunc;
                }

                return value;
            });

            if (jsonData) {
                var formContent = '';
                if (sensorInfo == null) {
                    formContent = '<select id="iotSelector" class="form-control">';
                    formContent = formContent + '<option value="-1">' + t('js.global.sensors.form.iot.type.default', null) + '</option>';
                    for (var i = 0; i < jsonData.length; i++) {
                        formContent = formContent + '<option value="' + i + '">' + jsonData[i].name + '</option>';
                    }

                    formContent = formContent + '</select>';
                }

                $('#iotModuleSelectForm').empty();
                $('#iotModuleForm').empty();
                $('#iotModuleSelectForm').append(formContent);
                $('#sensorFlashModal').modal('show');
                $("#sensorFlashForm").empty();
                $("#iotSelector").unbind();
                $('#iotSelector').change(function() {
                    var i = $('#iotSelector').val();
                    if (i != -1) {
                        var iotApp = jsonData[i];
                        iotAppForm(iotApp, sensorInfo);
                    }
                });

                if (sensorInfo != null) {
                    var selectedIotApp = sensorInfo.otaParams.iotApp;
                    for (var i = 0; i < jsonData.length; i++) {
                        // Update form with new downloaded
                        if (jsonData[i].identifier == sensorInfo.otaParams.iotApp.identifier) {
                            selectedIotApp = jsonData[i];
                        }
                    }
                    selectedIotApp.form.values = sensorInfo.otaParams.dataValues;
                    iotAppForm(selectedIotApp, sensorInfo);
                }
            }
            hideLoader();
        });
    }

    $("#flashSensor").click(function(evt) {
        flashSensor(null);
    });

    var scanRawRadioSignalCountdown = function(data, value, nextFunc) {
        document.getElementById("rawScanData").innerHTML = data.replace('PLHOLDER', value);
        value--;
        consolelog(value);
        if (value > 0) {
            window.setTimeout(function() {
                scanRawRadioSignalCountdown(data, value, nextFunc);
            }, 1000);
        } else {
            if (nextFunc) nextFunc();
        }
    }

    $("#scanRawRadioData").click(function() {
        $('#rawScannerModal').modal('show');

        // Scanning
        var pending = function() {
            document.getElementById('rawScanAnimation').innerHTML = generateAnimation('leftRight-center', 'leftRight-moving', 'f002', 'F141');
            document.getElementById("rawScanData").innerHTML = '<h4>' + t('js.scanner.raw.scan.analysis') + '</h4>';
        }

        // Scanning
        var scanning = function() {
            document.getElementById('rawScanAnimation').innerHTML = generateAnimation('upDown-up', 'upDown-bottom', 'F0F7', 'F25A');
            scanRawRadioSignalCountdown('<h4>' + t('js.scanner.raw.scan.scanning', ['<strong>PLHOLDER</strong>']) + '</h4>', 13, pending);
        }

        // Prepare
        document.getElementById('rawScanAnimation').innerHTML = generateAnimation('leftCenter-left', 'leftCenter-right', 'f21d', 'F0F7');
        scanRawRadioSignalCountdown('<h4>' + t('js.scanner.raw.scan.pending', ['<strong>PLHOLDER</strong>']) + '</h4>', 5, scanning);


        var reqRadioRawData = $.ajax({
            type: "POST",
            url: vUrl,
            data: {
                username: username,
                ePassword: ePassword,
                method: "getRadioRawData"
            }
        }).done(function(msg) {
            $('#rawScanAnimation').empty();
            var data = JSON.parse(msg);

            var html = '<table class="table table-bordered">';
            html = html + '<thead><tr>';
            html = html + '<th>' + t('js.scanner.raw.scan.module') + '</th>';
            html = html + '<th>' + t('js.scanner.raw.scan.raw.code') + '</th>';
            html = html + '<th>' + t('js.scanner.raw.scan.action') + '</th>';
            html = html + '</tr></thead><tbody>';

            var keys = Object.keys(data);
            for (var i = 0; i < keys.length; i++) {
                for (var j = 0; j < data[keys[i]].length; j++) {
                    var rawCode = data[keys[i]][j];
                    html = html + '<tr>';
                    html = html + '<td>' + keys[i] + '</td>';
                    html = html + '<td><span class="label label-primary">' + rawCode.length + '</span> <span class="label label-info">' + $.md5(rawCode) + '</span> <br /><code class="codeSmall">' + rawCode + '</code></td>';
                    html = html + '<td class="top"><input type="hidden" value="' + keys[i] + '" id="raw-data-module-' + i + '-' + j + '" /><input type="hidden" value="' + rawCode + '" id="raw-data-' + i + '-' + j + '" /><button type="button" class="btn btn-primary btn-xs rawDataTestBtn" id="raw-data-btn-' + i + '-' + j + '">' + t('js.scanner.raw.scan.action.test') + '</button> <button type="button" class="btn btn-primary btn-xs rawDataAssignDeviceBtn" id="raw-data-assign-btn-' + i + '-' + j + '">' + t('js.scanner.raw.scan.action.assign.device') + '</button></td>';
                    html = html + '</tr>';
                }
            }

            html = html + '</tbody></table>';

            document.getElementById("rawScanData").innerHTML = html;

            // Actions
            $(".rawDataTestBtn").unbind();
            $(".rawDataTestBtn").click(function() {
                var rawCodeFieldId = $(this).attr('id').replace('raw-data-btn-', 'raw-data-');
                var rawCodeModuleId = $(this).attr('id').replace('raw-data-btn-', 'raw-data-module-');

                var data = {};
                data.rawCode = $("#" + rawCodeFieldId).val();
                data.module = $("#" + rawCodeModuleId).val();

                var reqRadioRawData = $.ajax({
                    type: "POST",
                    url: vUrl,
                    data: {
                        username: username,
                        ePassword: ePassword,
                        method: "testRadioRawData",
                        data: JSON.stringify(data)
                    }
                }).done(function(msg) {
                    toastr.success(t('js.scanner.raw.scan.action.test.success'));
                }).fail(function(msg) {
                    displayError(msg);
                });
            });

            $(".rawDataAssignDeviceBtn").unbind();
            $(".rawDataAssignDeviceBtn").click(function() {
                var rawCodeFieldId = $(this).attr('id').replace('raw-data-assign-btn-', 'raw-data-');
                var rawCodeModuleId = $(this).attr('id').replace('raw-data-assign-btn-', 'raw-data-module-');

                var data = {};
                data.rawCode = $("#" + rawCodeFieldId).val();
                data.module = $("#" + rawCodeModuleId).val();


                var html = '';
                html = html + '<select name="mode" id="radio-raw-code-mode" class="form-control">';
                html = html + '<option value="new">' + t('js.scanner.raw.scan.action.assign.select') + '</option>';
                html = html + '<option value="new">' + t('js.scanner.raw.scan.action.assign.new.device') + '</option>';
                html = html + '<option value="existing">' + t('js.scanner.raw.scan.action.assign.existing.device') + '</option>';
                html = html + '</select>';
                html = html + '<br/>';
                html = html + '<select name="device" id="radio-raw-code-device" class="form-control">';
                var objKeys = Object.keys(fullObjects);
                for (var k = 0; k < objKeys.length; k++) {
                    html = html + '<option value="' + objKeys[k] + '">' + fullObjects[objKeys[k]].description + '</option>';
                }
                html = html + '</select>';
                html = html + '<br/>';
                html = html + '<select name="status" id="radio-raw-code-status" class="form-control">';
                html = html + '<option value="">' + t('js.scanner.raw.scan.action.assign.status.select') + '</option>';
                html = html + '<option value="1">' + t('js.scanner.raw.scan.action.assign.status.select.on') + '</option>';
                html = html + '<option value="0">' + t('js.scanner.raw.scan.action.assign.status.select.off') + '</option>';
                html = html + '</select>';

                document.getElementById("rawScanData").innerHTML = html;

                $("#radio-raw-code-device").hide();
                $("#radio-raw-code-status").hide();

                $("#radio-raw-code-mode").unbind();
                $("#radio-raw-code-mode").change(function() {
                    if ($(this).val() != '') {
                        $("#radio-raw-code-status").show();
                    } else {
                        $("#radio-raw-code-status").hide();
                    }

                    if ($(this).val() == 'existing') {
                        $("#radio-raw-code-device").show();
                    } else {
                        $("#radio-raw-code-device").hide();
                    }
                });

                $("#radio-raw-code-status").unbind();
                $("#radio-raw-code-status").change(function() {
                    if ($(this).val() != '') {
                        if (($("#radio-raw-code-mode").val() == 'new') || (($("#radio-raw-code-mode").val() == 'existing') && ($("#radio-raw-code-device").val() != ''))) {
                            var device = {};
                            if (($("#radio-raw-code-mode").val() == 'existing') && ($("#radio-raw-code-device").val() != '')) {
                                device = fullObjects[$("#radio-raw-code-device").val()];
                            }

                            device.module = data.module;
                            if ($(this).val() == '1') {
                                device.rawCodeOn = data.rawCode;
                            }

                            if ($(this).val() == '0') {
                                device.rawCodeOff = data.rawCode;
                            }

                            $('#configTabs a[href="#manageDevices"]').tab('show');
                            $("#manageDevicesItem").click();
                            consolelog(device);
                            manageDeviceForm(device, null);

                            $('#rawScannerModal').modal('hide');
                        }
                    }
                });
            });
        }).fail(function(msg) {
            document.getElementById("rawScanData").innerHTML = t('js.scanner.raw.scan.error');
        });

    });
});

var drawSquareAdminInterface = function(data, div, idBtnSetPrefix, idBtnDelPrefix, btnSetClass, btnDelClass) {
    var nbLine = 4;
    var colcount = 0;
    var dataContent = '';
    div.empty();

    for (var i = 0; i < data.length; i++) {
        if (colcount == 0) {
            dataContent = dataContent + '<div class="row">';
        }
        dataContent = dataContent + '<div class="col-md-2 squareAdmin" id="' + data[i].id + '" >';
        if (data[i].icon) {
            dataContent = dataContent + '<div><i class="fa sensorIcon" data-unicode="' + data[i].icon + '">&#x' + data[i].icon + '</i></div>';
        }
        dataContent = dataContent + '<div class="squareAdminText">' + data[i].description + '</div>';
        dataContent = dataContent + '<div>';
        dataContent = dataContent + "<button type=\"button\" class=\"" + btnSetClass + " btn btn-primary btn-sm\" id=\"" + idBtnSetPrefix + data[i].id + "\"> <span class=\"glyphicon glyphicon-pencil\"></span>";
        dataContent = dataContent + "<button type=\"button\" class=\"" + btnDelClass + " btn btn-danger btn-sm\" id=\"" + idBtnDelPrefix + data[i].id + "\"> <span class=\"glyphicon glyphicon-trash\"></span>";
        dataContent = dataContent + '</div>';
        dataContent = dataContent + '</div>';
        colcount++;
        if (colcount == 5) {
            dataContent = dataContent + '</div>';
            colcount = 0;
        }
    }
    if (colcount != 0) {
        dataContent = dataContent + '</div>';
    }
    div.html(dataContent);
}

var getCameraHistoryPicture = function(pictureFile, vUrl, username, password, buttonClicked, pictureDate, pictureTime, pictureLocation) {
    // do some stuff here
    $('#' + buttonClicked).toggleClass('active');
    $.ajax({
        type: "POST",
        url: vUrl,
        data: {
            username: username,
            password: password,
            picture: pictureFile,
            base64: true,
            method: "getArchivedPicture"
        }
    }).done(function(msg) {
        cameraImage = msg;
        document.getElementById("cameraHistorySource").src = "data:image/jpg;base64," + cameraImage;
        document.getElementById("pictureDate").innerHTML = pictureDate;
        document.getElementById("pictureTime").innerHTML = pictureTime;
        document.getElementById("pictureLocation").innerHTML = pictureLocation;
        $('#cameraArchiveModal').modal('show');
        $('#' + buttonClicked).toggleClass('active');
    }).fail(function(msg) {
        $('#' + buttonClicked).toggleClass('active');
        setError(msg);
    });
};