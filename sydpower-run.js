/**
 * @module SydpowerConnector
 */
    
const axios = require('axios');
const crypto = require("crypto");
const mqtt = require("mqtt");
const express = require('express');
const { sign, highLowToInt } = require('./sydpower-functions.js');
const REGISTERS = require('./sydpower-registers.js');

// Endpoint
const endpoint = "https://api.next.bspapp.com/client";
const clientSecret = "5rCEdl/nx7IgViBe4QYRiQ==";

// Fake device informations
const deviceId = crypto.randomBytes(16).toString('hex').toUpperCase();
const deviceBrand = "Samsung";
const deviceModel = "SM-A426B";
const appVersion = 123;
const appVersionCode = "1.2.3";
const deviceOsVersion = 10;
const deviceUserAgent = "Mozilla/5.0 (Linux; Android 10; SM-A426B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.86 Mobile Safari/537.36";
const deviceBrowserVersion = "130.0.6723.86";

// API routes
const API_AUTH = "api-auth";
const API_LOGIN = "api-login";
const API_DOLOGIN = "api-dolog";
const API_MQTT = "api-mqtt";
const API_DEVICES = "api-devs";

// MQTT configuration
const mqttHost = "ws://mqtt.sydpower.com:8083/mqtt";
const clientId = "client_helloyou";
const password = "helloyou";

/**
 * Constructor with conf injection
 * @constructor
 * @classdesc SydpowerConnector
 * @param {Object} params - Configuration for SydpowerConnector
 */
function SydpowerConnector(params) {
    this.init();
}

SydpowerConnector.prototype.init = function () {
    const that = this;

    this.devices = {};
    this.username = "";
    this.password = "";

    process.argv.slice(2).forEach(function (val, index, array) {
        if (index == 0) {
            that.username = val;
        } else if (index == 1) {
            that.password = val;
        }
    });

    that.startWebserver();
    that.connect();
}

SydpowerConnector.prototype.api = async function (config) {
    return new Promise(function(resolve, reject){
        var method = "serverless.function.runtime.invoke", params = "{}";
        const clientInfo = "{\"PLATFORM\":\"app\",\"OS\":\"android\",\"APPID\":\"__UNI__55F5E7F\",\"DEVICEID\":\""+deviceId+"\",\"channel\":\"google\",\"scene\":1001,\"appId\":\"__UNI__55F5E7F\",\"appLanguage\":\"en\",\"appName\":\"BrightEMS\",\"appVersion\":\""+appVersionCode+"\",\"appVersionCode\":"+appVersion+",\"appWgtVersion\":\""+appVersionCode+"\",\"browserName\":\"chrome\",\"browserVersion\":\""+deviceBrowserVersion+"\",\"deviceBrand\":\""+deviceBrand+"\",\"deviceId\":\""+deviceId+"\",\"deviceModel\":\""+deviceModel+"\",\"deviceType\":\"phone\",\"osName\":\"android\",\"osVersion\":\""+deviceOsVersion+"\",\"romName\":\"Android\",\"romVersion\":\""+deviceOsVersion+"\",\"ua\":\""+deviceUserAgent+"\",\"uniPlatform\":\"app\",\"uniRuntimeVersion\":\"4.24\",\"locale\":\"en\",\"LOCALE\":\"en\"}";
        switch (config.route) {
            case API_AUTH:
                method = "serverless.auth.user.anonymousAuthorize";
                break;
            case API_LOGIN:
                params = "{\"functionTarget\":\"router\",\"functionArgs\":{\"$url\":\"user/pub/login\",\"data\":{\"locale\":\"en\",\"username\":\""+config.username+"\",\"password\":\""+config.password+"\"},\"clientInfo\":"+clientInfo+"}}"
                break;
            case API_DOLOGIN:
                params = "{\"functionTarget\":\"router\",\"functionArgs\":{\"$url\":\"user/pub/loginByToken\",\"data\":{\"locale\":\"en\"},\"clientInfo\":"+clientInfo+",\"uniIdToken\":\""+config.accessToken+"\"}}";
                break;
            case API_MQTT:
                params = "{\"functionTarget\":\"router\",\"functionArgs\":{\"$url\":\"common/emqx.getAccessToken\",\"data\":{\"locale\":\"en\"},\"clientInfo\":"+clientInfo+",\"uniIdToken\":\""+config.accessToken+"\"}}";
                break;
            case API_DEVICES:
                params = "{\"functionTarget\":\"router\",\"functionArgs\":{\"$url\":\"client/device/kh/getList\",\"data\":{\"locale\":\"en\",\"pageIndex\":1,\"pageSize\":100},\"clientInfo\":"+clientInfo+",\"uniIdToken\":\""+config.accessToken+"\"}}";
                break;
        }
        var data = {
            "method": method,
            "params": params,
            "spaceId": "mp-6c382a98-49b8-40ba-b761-645d83e8ee74",
            "timestamp": Date.now()
        }
        if (config.authorizeToken)
            data.token = config.authorizeToken;

        axios.post(endpoint, data,
            { headers: {
            'Content-Type': 'application/json',
            'x-serverless-sign': sign(data, clientSecret),
            'user-agent': deviceUserAgent,
            //'Host': 'api.next.bspapp.com',
            //'Cookie': 'aliyungf_tc=6ccbbe185d7a20ccd11876122062a95d3c2b36b39982176d5b659fbb21bfdebd; acw_tc=ac11000117311341444382137e4b2eb51a4e01b71b4af31152d3f98956a504',
        }}).then(function (response) {
            resolve(response.data);
        }).catch(function (error) {
            reject(error);
        });
    });
}

SydpowerConnector.prototype.connect = async function () {
    const that = this;
    const authRequest = await that.api({
        route: API_AUTH
    });
    const authorizeToken = authRequest.data.accessToken;
    console.log(`Fetched anonymous authorized token: ${authorizeToken}`);

    const loginRequest = await that.api({
        route: API_LOGIN, 
        authorizeToken: authorizeToken, 
        username: that.username,
        password: that.password
    });
    const accessToken = loginRequest.data.token;
    console.log(`Fetched logged-in access token: ${accessToken}`);

    // Not needed?
    /*const loginTokenRequest = await that.api({
        route: API_DOLOGIN,
        authorizeToken: authorizeToken, 
        accessToken: accessToken
    });*/

    const mqttAccessTokenRequest = await that.api({
        route: API_MQTT,
        authorizeToken: authorizeToken, 
        accessToken: accessToken
    });
    console.log(`Fetched MQTT access token: ${mqttAccessTokenRequest.data.access_token}`);

    const devicesRequest = await that.api({
        route: API_DEVICES,
        authorizeToken: authorizeToken, 
        accessToken: accessToken
    });
    const devicesIds = [];
    for (const device of devicesRequest.data.rows) {
        const deviceId = device.device_id.replace(/:/g, "");
        console.log(device);
        that.devices[deviceId] = device;
        devicesIds.push(deviceId);
    }
    console.log(`Fetched MQTT subscription channels: ${devicesIds}`);

    that.getDeviceData(mqttAccessTokenRequest.data.access_token, devicesIds, true);
}

SydpowerConnector.prototype.mqttPublish = function (deviceMac, message) {
    const publishTopic = deviceMac+"/client/request/data";
    this.mqttClient.publish(publishTopic, message, { qos: 1 }, (error) => {
        console.log(`Published ${message} to topic '${publishTopic}'`)
        if (error) {
            console.error(error)
        }
    });
}

SydpowerConnector.prototype.getDeviceData = function (accessToken, devicesMacs, debug = false) {
    const that = this;
    // Connect to fetch data
    that.mqttClient = mqtt.connect(mqttHost, {
        clientId,
        username: accessToken,
        password: password,
        clean: true,
        connectTimeout: 4000,
    });
    that.mqttClient.on('connect', function () {
        console.log(`Connected to MQTT broker!`);
        // MQTT topics
        const subscribeTopics = [];
        devicesMacs.forEach(deviceMac => {
            subscribeTopics.push(deviceMac+"/device/response/state");
            subscribeTopics.push(deviceMac+"/device/response/client/+");
        });    
        // Subscribe to get updates on status
        that.mqttClient.subscribe(subscribeTopics, () => {
            console.log(`Subscribed to topics '${subscribeTopics}'`)
        })   
        devicesMacs.forEach(deviceMac => {
            that.mqttPublish(deviceMac, new Uint8Array(REGISTERS["REGRequestSettings"]));
        });
    });
    that.mqttClient.on('message', (topic, message) => {
        console.log(`New message on topic '${topic}'`)
        const deviceMac = topic.split('/')[0];
        // message is an array of 8-bit unsigned integers
        const arr = Object.values(new Uint8Array(message))
        // Following MODBUS protocol, removing 6 first control indexes
        const c = arr.slice(6);
        // Everything from index 6 to -2 is just a list of 16-bit analog registers
        // Let's transform the array:
        const e = [];
        for (let t = 0; t < c.length; t += 2) {
            e.push(highLowToInt({ high: c[t], low: c[t + 1] }));
        }
        // 16 bits registers are in var e
        if (e.length == 81 && topic.includes('device/response/client/04')) {
            const activeOutputs = ("0000000000000000" + e[41].toString(2).padStart(8, "0")).slice(-16).split("");
            that.devices[deviceMac].soc = (e[56]/1000*100).toFixed(1);
            that.devices[deviceMac].totalInput = e[6];
            that.devices[deviceMac].totalOutput = e[39];
            that.devices[deviceMac].usbOutput = activeOutputs[6] == "1";
            that.devices[deviceMac].dcOutput = activeOutputs[5] == "1";
            that.devices[deviceMac].acOutput = activeOutputs[4] == "1";
            that.devices[deviceMac].ledOutput = activeOutputs[3] == "1";
        } else if (e.length == 81 && topic.includes('device/response/client/data')) {
            that.devices[deviceMac].maximumChargingCurrent = e[20];
            that.devices[deviceMac].acSilentCharging = e[57] == "1";
            that.devices[deviceMac].usbStandbyTime = e[59];
            that.devices[deviceMac].acStandbyTime = e[60];
            that.devices[deviceMac].dcStandbyTime = e[61];
            that.devices[deviceMac].screenRestTime = e[62];
            that.devices[deviceMac].stopChargeAfter = e[63];
            that.devices[deviceMac].dischargeLowerLimit = e[66];
            that.devices[deviceMac].acChargingUpperLimit = e[67];
            that.devices[deviceMac].wholeMachineUnusedTime = e[68];
        }
        console.table(that.devices);
    });

    that.mqttClient.on('error', function (error) {
        console.log(error);
    });
}

SydpowerConnector.prototype.runCommand = async function (deviceId, command, value, res) {
    var that = this;
    if (REGISTERS[command]) {
        if (that.mqttClient) {
            var message;
            if (typeof REGISTERS[command] == "function") {
                message = REGISTERS[command](value);
                setTimeout(function() {
                    that.mqttPublish(deviceId, new Uint8Array(REGISTERS["REGRequestSettings"]));
                }, 1000);
            } else {
                message = REGISTERS[command];
            }
            that.mqttPublish(deviceId, new Uint8Array(message));
            res.json({ success: `Command ${command} sent`});
        } else {
            res.json({ error: 'MQTT not connected, cannot send commands.'});
        }
    } else {
        res.json({ error: 'Command not found'});
    }

}

SydpowerConnector.prototype.startWebserver = async function () {
    const that = this;
    const app = express()

    app.get('/', function (req, res) {
        res.json({ name: 'sydpower-mqtt', alive: true })
    })
    app.get('/devices', function (req, res) {
        res.json(that.devices);
    })
    app.get('/devices/:deviceId', function (req, res) {
        if (that.devices[req.params.deviceId]) {
            res.json(that.devices[req.params.deviceId]);
        } else {
            res.json({ error: 'Device not found'});
        }
    })
    app.get('/devices/:deviceId/:command', function (req, res) {
        that.runCommand(req.params.deviceId, req.params.command, null, res);
    })

    app.get('/devices/:deviceId/:command/:value', function (req, res) {
        that.runCommand(req.params.deviceId, req.params.command, req.params.value, res);
    })

    app.listen(3000);
}

new SydpowerConnector();