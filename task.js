function Task(functionToDo,theThis,...argumentsToInnerFunction){

	/*
		this function emulates the Task object implemented in Max/MSP javascript
		so that you can write javascript for use timing events in either browser or Max/MSP platforms
	*/

	functionToDo.task=this;
	this.arguments=argumentsToInnerFunction;
	
	this.theTimeoutsInProgress=[];//this property isn't in the specification, but i added it because i couldn't think of another way to manage this.cancel();

	this.getArguments=function(){
		return this.arguments;
	}

	this.setArguments=function(...incomingArguments){
		this.arguments=incomingArguments;
	}

	this.function=functionToDo;
	
	this.getFunction=function(){
		return this.function;
	}

	this.setFunction=function(incomingFunction){
		this.function=incomingFunction;
	}

	this.running=false;
	
	this.getRunning=function(){
		return this.running;
	}

	this.interval=500;
	
	this.getInterval=function(){
		return this.interval;
	}

	this.setInterval=function(interval){
		this.interval=interval;
	}

	this.object=theThis;

	this.getObject=function(){
		return this.object;
	}

	this.setObject=function(object){
		this.object=object;
	}

	this.iterations=0;

	this.getIterations=function(){
		return this.iterations;
	}

	this.execute=function(){
		this.function(...this.arguments);
	}

	this.cancel=function(){
		for(i=0;i<this.theTimeoutsInProgress.length;i++){
			clearTimeout(this.theTimeoutsInProgress.pop());
		}
		this.running=0;
	}

	this.repeat=function(number=Infinity,initialDelay=0){
		this.cancel();
		this.iterations=0;
		this.running=true;

		var theNumberOfTimesToRepeat=number;
		var functionHolderVariable;

		this.theTaskForRepeating=function(){

			if(this.iterations<theNumberOfTimesToRepeat){
				this.iterations+=1;
				this.execute();

				console.log(this.iterations);

				//i don't totally understand "bind()", but that's what solved this
				this.theTimeoutsInProgress.push(setTimeout(this.theTaskForRepeating.bind(this),this.interval));
			}else{
				this.running=false;
				this.iterations=0;
			}
		}

		functionHolderVariable=this.theTaskForRepeating;

		if(this.iterations<theNumberOfTimesToRepeat){
			this.theTimeoutsInProgress.push(setTimeout(this.theTaskForRepeating(),initialDelay));
		}

	}

	this.schedule=function(delay=0){
		this.repeat(1,delay);
		this.running=true;
	}
}