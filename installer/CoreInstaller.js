"use strict";
// Install dependencies
module.exports = {install:(installationManager) => {
    // Mac OS X
    installationManager.register("0.0.3", ["x32", "x64"], "brew install imagemagick", false, false, true);
    installationManager.register("0.0.3", ["x32", "x64"], "brew install graphicsmagick", false, false, true);
    installationManager.register("0.0.3", ["x32", "x64"], "brew install libav", false, false, true);
    installationManager.register("0.0.3", ["x32", "x64"], "pip install -U platformio", false, false, true);
    installationManager.register("0.0.3", ["x32", "x64"], "pio platform install https://github.com/platformio/platform-espressif8266.git#feature/stage", false, false, true);
    installationManager.register("0.0.3", ["x32", "x64"], "brew install portaudio sox mplayer", false, true, true);


    // Raspberry Pi
    installationManager.register("0.0.3", ["arm", "arm64"], "apt-get update", true, true);
    installationManager.register("0.0.3", ["arm", "arm64"], "apt-get install -y imagemagick graphicsmagick", true, true);
    installationManager.register("0.0.3", ["arm", "arm64"], "apt-get install -y libav-tools", true, true);
    installationManager.register("0.0.3", ["arm", "arm64"], "pip install -U platformio", true, true);
    installationManager.register("0.0.3", ["arm", "arm64"], "pio platform install https://github.com/platformio/platform-espressif8266.git#feature/stage", true, true);
    installationManager.register("0.0.3", ["arm", "arm64"], "apt-get install -y libudev-dev", true, true); // Usb port detection
    installationManager.register("0.0.3", ["arm", "arm64"], "apt-get update", true, true);
    installationManager.register("0.0.3", ["arm", "arm64"], "apt-get install -y libasound2-dev python-pyaudio python3-pyaudio sox", true, true); // Bot engine
    installationManager.register("0.0.3", ["arm", "arm64"], "apt-get install -y mplayer festival festvox-kallpc16k", true, true); // Bot engine

    // Global
    installationManager.register("0.0.3", "*", "pip install pyaudio", true, true);

}};
