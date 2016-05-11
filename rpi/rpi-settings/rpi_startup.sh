#!/bin/bash

#Stop usb bus
echo 0 > /sys/devices/platform/soc/3f980000.usb/buspower;

#Stop video hub
/opt/vc/bin/tvservice -o

#Stop bluetooth
/etc/init.d/bluetooth stop

exit 0
