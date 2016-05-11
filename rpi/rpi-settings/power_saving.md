# Power saving on the Pi

## USB Hub

### Stop USB Hub
`sudo bash ~/RPI/stop_usb_hub.sh`

### Start USB Hub again
`sudo bash ~/RPI/start_usb_hub.sh`


## Video Output

### Stop Video Output
`sudo bash ~/RPI/stop_video_output.sh`

### Start Video Output again
`sudo bash ~/RPI/start_video_output.sh`


## Performance

### Set performance to power save
`echo "powersave" |sudo tee /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor`


