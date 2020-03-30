/* A step of the form
*
* PARAMETERS
*
* title: 		 The title of the form, can be a string or a javascrip function returning a string
* show:			 A javascript function returning true/false, determining if step should be shown, true is default
* variable_name: The key of this step in the variables dictionary
* 
 */

function Step(form, parameters){
	
	//Set title with string or function, create error if not found
	this.title = parameters.title || console.error('Step without title found!');
	if(typeof this.title !== 'function'){var title_text = this.title;this.title = function(self){return String(title_text)};}; 

	//Set show, default is function returning true
	this.show = parameters.show || function(self){return true;};
	
	//Set the variable name of this step, throw exception if not found
	this.variable_name = parameters.variable_name || console.error('Variable name of Step not set!');
	
	//Set form the step belongs to, step id and increase number of steps
	this.form = form;
	this.step_id = this.form.n_steps; //Make a sloppy (deep) copy, not a reference
	this.form.n_steps++;
	
	//Initialise no of pages
	this.n_pages = 0;
	
	//Creates the step variable in data dictionary if not defined
	create_step_variable(this.variable_name);
	
	//Initialise pages of the step
	this.pages = [];
	
	//Initialise no of pages
	this.n_pages = 0;

	//Initialise alert flag for the step
	this.has_alert = false;
	
	//METHOD add page to step
	this.add_page = function(parameters){
		var new_page = new Page(this.form, this, parameters);
		this.pages.push(new_page);
		return new_page;
	}
	
	//METHOD add multipage to step
	this.add_multipage = function(parameters){
		var new_multipage = new Multipage(this.form, this, parameters);
		this.pages.push(new_multipage);
		return new_multipage;
	}
	
	//Render Step
	this.render = function(){
		return nunjucks.renderString(template_step , {step : this, navigation : navigation});
	};
}