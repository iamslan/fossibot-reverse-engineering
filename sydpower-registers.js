const { getReadModbus, getWriteModbus } = require('./sydpower-functions.js');

// Modbus registers
const REGISTER_MODBUS_ADDRESS = 17;
const REGISTER_MODBUS_COUNT = 80;
const REGISTER_TOTAL_INPUT = 6;
const REGISTER_TOTAL_OUTPUT = 39;
const REGISTER_ACTIVE_OUTPUT_LIST = 41;
const REGISTER_STATE_OF_CHARGE = 56;
const REGISTER_MAXIMUM_CHARGING_CURRENT = 20;
const REGISTER_USB_OUTPUT = 24;
const REGISTER_DC_OUTPUT = 25;
const REGISTER_AC_OUTPUT = 26;
const REGISTER_LED = 27;
const REGISTER_AC_SILENT_CHARGING = 57;
const REGISTER_USB_STANDBY_TIME = 59;
const REGISTER_AC_STANDBY_TIME = 60;
const REGISTER_DC_STANDBY_TIME = 61;
const REGISTER_SCREEN_REST_TIME = 62;
const REGISTER_STOP_CHARGE_AFTER = 63;
const REGISTER_DISCHARGE_LIMIT = 66;
const REGISTER_CHARGING_LIMIT = 67;
const REGISTER_SLEEP_TIME = 68;
const _REGISTERS = [];
_REGISTERS[REGISTER_TOTAL_INPUT] =  {
    name: "Total Input",
    unit: "W"
};
_REGISTERS[REGISTER_MAXIMUM_CHARGING_CURRENT] = {
    name: "Maximum charging current setting",
    unit: "int",
    possibleValues: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
};
_REGISTERS[REGISTER_USB_OUTPUT] = {
    name: "USB Output",
    unit: "boolean",
    possibleValues: [true,false]
};
_REGISTERS[REGISTER_DC_OUTPUT] = {
    name: "DC Output",
    unit: "boolean",
    possibleValues: [true,false]
};
_REGISTERS[REGISTER_AC_OUTPUT] = {
    name: "AC Output",
    unit: "boolean",
    possibleValues: [true,false]
};
_REGISTERS[REGISTER_LED] = {
    name: "LED light",
    unit: "int",
    possibleValues: [0,1,2,3],
    description: "0 = disabled, 1 = Always, 2 = SOS, 3 = Flash"
};
_REGISTERS[REGISTER_TOTAL_OUTPUT] = {
    name: "Total Output",
    unit: "W"
};
_REGISTERS[REGISTER_ACTIVE_OUTPUT_LIST] = {
    name: "Active outputs list",
    description: "None = 26, USB output = 640, DC output = 1152, AC output = 2052, Led light = 4224"
};
_REGISTERS[REGISTER_STATE_OF_CHARGE] = {
    name: "State of Charge",
    unit: "%",
    description: "Divide by 10 for 0>100%"
};
_REGISTERS[REGISTER_AC_SILENT_CHARGING] = {
    name: "AC silent charging",
    unit: "boolean",
    possibleValues: [true,false]
};
_REGISTERS[REGISTER_USB_STANDBY_TIME] = {
    name: "USB standby time",
    unit: "int",
    possibleValues: [0,3,5,10,30],
    description: "minutes"
};
_REGISTERS[REGISTER_AC_STANDBY_TIME] = {
    name: "AC standby time",
    unit: "int",
    possibleValues: [0,480,960,1440],
    description: "minutes"
};
_REGISTERS[REGISTER_DC_STANDBY_TIME] = {
    name: "DC standby time",
    unit: "int",
    possibleValues: [0,480,960,1440],
    description: "minutes"
};
_REGISTERS[REGISTER_SCREEN_REST_TIME] = {
    name: "AC standby time",
    unit: "int",
    possibleValues: [0,180,300,600,1800],
    description: "seconds"
};
_REGISTERS[REGISTER_STOP_CHARGE_AFTER] = {
    name: "Stop charge after",
    unit: "int",
    description: "minutes"
};
_REGISTERS[REGISTER_DISCHARGE_LIMIT] = {
    name: "Discharge lower limit",
    unit: "permille",
    description: "Divide by 10 for 0>100%"
};
_REGISTERS[REGISTER_CHARGING_LIMIT] = {
    name: "AC charging upper limit in EPS mode",
    unit: "permille",
    description: "Divide by 10 for 0>100%"
};
_REGISTERS[REGISTER_SLEEP_TIME] = {
    name: "Whole machine unused time",
    unit: "int",
    possibleValues: [5,10,30,480],
    description: "minutes"
};

function getWriteModusValue(register, value) {
    switch (_REGISTERS[register].unit) {
        case "permille":
            value = parseInt(value);
            if (value < 0 || value > 1000 || !((value % 10) == 0 || (value % 10) == 5)) {
                console.log(`Register [${_REGISTERS[register].name}] does not support value ${value}`);
                return;
            }
            break;
        case "int":
            value = parseInt(value);           
            if (_REGISTERS[register].possibleValues) {
                if (!_REGISTERS[register].possibleValues.includes(value)) {
                    console.log(`Register [${_REGISTERS[register].name}] does not support value ${value}`);
                    return;
                }
            } else {
                if (value < 0) {
                    console.log(`Register [${_REGISTERS[register].name}] does not support value ${value}`);
                    return;
                }
            }
            break;
    }
    console.log(`Register [${_REGISTERS[register].name}] will switch to ${value}`);
    return getWriteModbus(REGISTER_MODBUS_ADDRESS, register, value);
}

const REGRequestSettings = getReadModbus(REGISTER_MODBUS_ADDRESS, REGISTER_MODBUS_COUNT);
const REGDisableUSBOutput = getWriteModbus(REGISTER_MODBUS_ADDRESS, REGISTER_USB_OUTPUT, 0);
const REGEnableUSBOutput = getWriteModbus(REGISTER_MODBUS_ADDRESS, REGISTER_USB_OUTPUT, 1);
const REGDisableDCOutput = getWriteModbus(REGISTER_MODBUS_ADDRESS, REGISTER_DC_OUTPUT, 0);
const REGEnableDCOutput = getWriteModbus(REGISTER_MODBUS_ADDRESS, REGISTER_DC_OUTPUT, 1);
const REGDisableACOutput = getWriteModbus(REGISTER_MODBUS_ADDRESS, REGISTER_AC_OUTPUT, 0);
const REGEnableACOutput = getWriteModbus(REGISTER_MODBUS_ADDRESS, REGISTER_AC_OUTPUT, 1);
const REGDisableLED = getWriteModbus(REGISTER_MODBUS_ADDRESS, REGISTER_LED, 0);
const REGEnableLEDAlways = getWriteModbus(REGISTER_MODBUS_ADDRESS, REGISTER_LED, 1);
const REGEnableLEDSOS = getWriteModbus(REGISTER_MODBUS_ADDRESS, REGISTER_LED, 2);
const REGEnableLEDFlash = getWriteModbus(REGISTER_MODBUS_ADDRESS, REGISTER_LED, 3);
const REGDisableACSilentCharging = getWriteModbus(REGISTER_MODBUS_ADDRESS, REGISTER_AC_SILENT_CHARGING, 0);
const REGEnableACSilentCharging = getWriteModbus(REGISTER_MODBUS_ADDRESS, REGISTER_AC_SILENT_CHARGING, 1);
function REGDischargeLowerLimit(value) { return getWriteModusValue(REGISTER_DISCHARGE_LIMIT, value); }
function REGChargeUpperLimit(value) { return getWriteModusValue(REGISTER_CHARGING_LIMIT, value); }
function REGStopChargeAfter(value) { return getWriteModusValue(REGISTER_STOP_CHARGE_AFTER, value); }
function REGMaxChargeCurrent(value) { return getWriteModusValue(REGISTER_MAXIMUM_CHARGING_CURRENT, value); }
function REGScreenRestTime(value) { return getWriteModusValue(REGISTER_SCREEN_REST_TIME, value); }
function REGAcStandbyTime(value) { return getWriteModusValue(REGISTER_AC_STANDBY_TIME, value); }
function REGDcStandbyTime(value) { return getWriteModusValue(REGISTER_DC_STANDBY_TIME, value); }
function REGUsbStandbyTime(value) { return getWriteModusValue(REGISTER_USB_STANDBY_TIME, value); }
function REGSleepTime(value) { return getWriteModusValue(REGISTER_SLEEP_TIME, value); }

module.exports = {
    REGRequestSettings,
    REGDisableUSBOutput,
    REGEnableUSBOutput,
    REGDisableDCOutput,
    REGEnableDCOutput,
    REGDisableACOutput,
    REGEnableACOutput, 
    REGDisableLED,
    REGEnableLEDAlways,
    REGEnableLEDFlash,
    REGEnableLEDSOS,
    REGDisableACSilentCharging,
    REGEnableACSilentCharging,
    REGDischargeLowerLimit,
    REGChargeUpperLimit,
    REGStopChargeAfter,
    REGMaxChargeCurrent,
    REGScreenRestTime,
    REGAcStandbyTime,
    REGDcStandbyTime,
    REGUsbStandbyTime,
    REGSleepTime
};