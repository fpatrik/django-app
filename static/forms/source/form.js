/* The form object containing the entire form
*
* PARAMETERS:
*
* title: The title of the form, can be a string or a javascrip function returning a string.
* debug: Boolean value if debug should be turned on
*
*/

function Form(parameters){
	
	//Get the title from the parameters
	this.title = parameters.title || '';
	if(typeof this.title !== 'function'){var title_text = this.title;this.title = function(self){return title_text}};
	
	//Get debug from parameters
	this.debug = parameters.debug || false;
	
	//Initialise steps of the form
	this.steps = [];
	
	//Initialise derived variables
	this.derived_variables = [];
	
	//Initialise no of steps
	this.n_steps = 0;
	
	//METHOD Add step to form
	this.add_step = function(parameters){
		var new_step = new Step(this, parameters);
		this.steps.push(new_step);
		return new_step;
	};
	
	//METHOD Add derived variable to form
	this.add_derived_variable = function(parameters){
		var new_derived_variable = new DerivedVariable(parameters);
		this.derived_variables.push(new_derived_variable);
		return new_derived_variable;
	};

	
	//Render the form
	this.render = function(){
		//Save active element
		var active_element = document.activeElement.id;
		
		//Update alerts
		update_alerts(navigation.end);
		
		//Set document title
		document.getElementById('document-title').innerHTML = this.title(this);
		document.getElementById('title').innerHTML = this.title(this);
		
		//Render content
		document.getElementById('core').innerHTML = nunjucks.renderString(template_form , {form : this, navigation : navigation});
		
		//Activate tooltips
		$('a.tooltips').tooltip();
		
		//Acitvate datepickers
		$('.date').datepicker({
			changeYear: false,
			maxDate: '10Y',
			minDate: '-10Y',
			yearRange: '-10:+10'
		});
		$('.year').datepicker();
		
		//Reset active element
		if(document.getElementById(active_element) != null){
			document.getElementById(active_element).focus();
		}
		
		//Show alert on window close
		//window.onbeforeunload = function(event){if(event.target.tagName != 'A'){return 'Diese Seite bittet Sie zu bestätigen, dass Sie die Seite verlassen möchten – Daten, die Sie eingegeben haben, werden unter Umständen nicht gespeichert.'}};
	}
	
	//Render the navigation
	this.render_navigation = function(){
		return nunjucks.renderString(template_navigation , {form : this, navigation : navigation});
	};
}