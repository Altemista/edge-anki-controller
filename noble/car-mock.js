// Copyright 2018 NTT Group

// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to the following
// conditions:

// The above copyright notice and this permission notice shall be included in all copies
// or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
// PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
// FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

const EventEmitter = require('events');

class CarMock {

    constructor(readCaracteristicsMock, trackConfiguration) {
        this.readCaracteristicsMock = readCaracteristicsMock;
        this.trackConfiguration = trackConfiguration;
        this.trackTileIndex = 0;

        this.validConfiguration = !this.trackConfiguration.outdated;

        this.interval = setInterval(this.sendLocalizationPositionUpdate.bind(this), 5000)
    }

    sendTransitionUpdate() {
        this.readCaracteristicsMock.mockReadFromDevice(this.createTransitionMessage());
    }

    sendPingMessage() {
        var pingMessage = new Buffer(4);
        pingMessage.writeUInt8(0x01, 0);
        pingMessage.writeUInt8(0x17, 1);
        pingMessage.writeUInt8(0x01, 2);
        pingMessage.writeUInt8(0x01, 3);
        this.readCaracteristicsMock.mockReadFromDevice(pingMessage);
    }

    sendLocalizationPositionUpdate() {

        this.sendTransitionUpdate();
        var tile = this.trackConfiguration.tiles[this.trackTileIndex];
        var tilePosition = undefined;

        if(this.validConfiguration) {
            for(var key in tile.lane4.positions) {
                tilePosition = tile.lane4.positions[key];
                break;
            }
        }

        this.readCaracteristicsMock.mockReadFromDevice(this.createPositionMessage(tile.realId, tilePosition));

        this.trackTileIndex++;
        if(this.trackTileIndex >= Object.keys(this.trackConfiguration.tiles).length-1) {
            this.trackTileIndex = 0;
        }
    }

    createTransitionMessage() {
        //<Buffer 12 29 00 00 02 2b 55 c2 00 ff 81 46 00 00 00 00 00 25 32>
        var transitionMessage = new Buffer(19);
        transitionMessage.writeUInt8(0x12, 0);
        transitionMessage.writeUInt8(0x29, 1);
        transitionMessage.writeUInt8(0x00, 2);
        transitionMessage.writeUInt8(0x00, 3);
        transitionMessage.writeUInt8(0x02, 4);
        transitionMessage.writeUInt8(0x2b, 5);
        transitionMessage.writeUInt8(0x55, 6);
        transitionMessage.writeUInt8(0xc2, 7);
        transitionMessage.writeUInt8(0x00, 8);
        transitionMessage.writeUInt8(0xff, 9);
        transitionMessage.writeUInt8(0x81, 10);
        transitionMessage.writeUInt8(0x46, 11);
        transitionMessage.writeUInt8(0x00, 12);
        transitionMessage.writeUInt8(0x00, 13);
        transitionMessage.writeUInt8(0x00, 14);
        transitionMessage.writeUInt8(0x00, 15);
        transitionMessage.writeUInt8(0x00, 16);
        transitionMessage.writeUInt8(0x25, 17);
        transitionMessage.writeUInt8(0x32, 18);
        return transitionMessage;
    }

    createPositionMessage(tileId, tilePosition) {
        var localizationMessage = new Buffer(17);
        localizationMessage.writeUInt8(0x10, 0);
        localizationMessage.writeUInt8(0x27, 1);
        var positionHex = tilePosition.toString(16);
        localizationMessage.writeUInt8("0x" + positionHex, 2);
        //convert int to hex
        var hexValue = tileId.toString(16);
        localizationMessage.writeUInt8("0x" + hexValue, 3);
        localizationMessage.writeUInt8(0x48, 4);
        localizationMessage.writeUInt8(0xe1, 5);
        localizationMessage.writeUInt8(0x86, 6);
        localizationMessage.writeUInt8(0xc2, 7);
        localizationMessage.writeUInt8(0x02, 8);
        localizationMessage.writeUInt8(0x01, 9);
        localizationMessage.writeUInt8(0x47, 10);
        localizationMessage.writeUInt8(0x00, 11);
        localizationMessage.writeUInt8(0x00, 12);
        localizationMessage.writeUInt8(0x00, 13);
        localizationMessage.writeUInt8(0x02, 14);
        localizationMessage.writeUInt8(0xfa, 15);
        localizationMessage.writeUInt8(0x00, 16);
        return localizationMessage;
    }
}

module.exports = CarMock;
