/*
* Creates a variable that is derived from others
*
* PARAMETERS
* 
* assignment:	A function to be executen (usually a variable assignment)
* condition:	A function of the changed variable returning true/false if the assignment should be executed
* 
*/

function DerivedVariable(parameters){
	//Get the assignment to be executed
	this.assignment = parameters.assignment || function(){return true;};
	
	//Get the condition for the change
	this.condition = parameters.condition || function(changed_variable){return true;};
}