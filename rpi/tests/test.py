import datetime

outFile = "/home/pi/current-date.txt"
fDate2 = open(outFile, "w")
fDate2.write(str(datetime.datetime.now()))
fDate2.close()
