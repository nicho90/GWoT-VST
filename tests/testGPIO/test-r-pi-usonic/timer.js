MEASUREMENT_INTERVAL = 5000;

var timer = {
        running : false,
        interval : MEASUREMENT_INTERVAL,
	timeout : null,
        callback : function(){
                console.log("time.callback");
        },
        start : function(callback,interval){
                console.log("timer.start" + JSON.stringify(this.timeout));
                var elem = this;
                //clearInterval(this.timeout);
                this.timeout = null;
		console.log("clear int" + JSON.stringify(this.timeout));
		this.running = true;
                if(callback) this.callback = callback;
                if(interval) this.interval = interval;
                this.timeout = setTimeout(function(){
                        elem.execute(elem)
                }, this.interval);
        },
        execute : function(e){
                console.log("timer.execute" + JSON.stringify(this.timeout));
                if(!e.running) return false;
                e.callback();
                e.start();
        },
        stop : function(){
                console.log("timer.stop" + this.timeout);
                this.running = false;
		clearInterval(this.timeout);
        },
        set_interval : function(interval){
                console.log("timer.set_interval" + this.timeout);
                //clearInterval(this.timeout);
		this.timeout = null;
                this.start(false,interval);
        }
};


timer.start(false, 5000);

setTimeout(function(){
	timer.set_interval(2000);
	console.log("Set intervall 2000")
},7000);

setTimeout(function(){
	timer.stop();
	console.log("Stop timer");
},20000);
