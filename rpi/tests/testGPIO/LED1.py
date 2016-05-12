import RPi.GPIO as GPIO ## Import GPIO library
GPIO.setmode(GPIO.BOARD) ## Use board pin numbering
GPIO.setup(24, GPIO.OUT) ## Setup GPIO Pin 17 to OUT
GPIO.output(24,True) ## Turn on GPIO pin 17
#GPIO.output(24,False)
