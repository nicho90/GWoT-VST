import RPi.GPIO as GPIO
import time
import paho.mqtt.client as mqtt

GPIO.setmode(GPIO.BCM)

TRIG = 23 
ECHO = 24

print "Distance Measurement In Progress"

GPIO.setup(TRIG,GPIO.OUT)
GPIO.setup(ECHO,GPIO.IN)

GPIO.output(TRIG, False)
print "Waiting For Sensor To Settle"
time.sleep(2)

mqttc = mqtt.Client("python_pub")
mqttc.connect("127.0.0.1", 1883)

def publish(dist):
	mqttc.publish("pi/distance",dist)

def measure():
	GPIO.output(TRIG, True)
	print "Send signal"
	time.sleep(0.00001)
	GPIO.output(TRIG, False)
	print "Stop signal"

	while GPIO.input(ECHO)==0:
	  	pulse_start = time.time()
		# print "Pulse start"

	while GPIO.input(ECHO)==1:
  		pulse_end = time.time()
		# print "Pulse end"

	pulse_duration = pulse_end - pulse_start

	distance = pulse_duration * 17150

	distance = round(distance, 2)
	
	publish(distance)
	print "Distance:",distance,"cm"

while True:
	measure()	
	time.sleep(5)

GPIO.cleanup()
