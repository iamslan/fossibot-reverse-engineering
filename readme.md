Sydpower API reverse engineering

**Concerned products:** Fossibot power stations using BrightEMS application. Currently tested with F2400 and F3600 Pro.

# Usage

``node sydpower-run.js [USERNAME] [PASSWORD]``

# Disclaimer

I'm not responsible for anything that this software can cause.

Be extra carefull with registers, possibles values are shown in ``sydpower-registers.js``

For example, passing 0 to "whole machine unused time" will brick the device (I bricked one :D)

# Features

- login to your account to get the needed authentication tokens
- fetch your registered devices
- connect to mqtt and get devices informations realtime
- open ``http://localhost:3000/devices`` for easier reading of current status