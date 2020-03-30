/*
 * Checkboxes for the form
 * 
 * PARAMETERS
 * 
 * label:			The optional label of the checkbox group (string or function returning string)
 * tooltip:			The optional tooltip of the checkbox group (string or function returning string)
 * show:			If the checkbox group should be shown, default is true (function returning true/false)
 * disabled:		If the checkbox group should be disabled, default is false (function returning true/false)
 * 
 */

function Checkbox(form, step, page, parameters){
	
	//Set label with string or function
	this.label = parameters.label || '';
	if(typeof this.label !== 'function'){var label_text = this.label;this.label = function(self, index){return label_text}}; 
	
	//Set tooltip with string or function
	this.tooltip = parameters.tooltip || '';
	if(typeof this.tooltip !== 'function'){var tooltip_text = this.tooltip;this.tooltip = function(self, index){return tooltip_text}};
	
	//Set show, default is function returning true
	this.show = parameters.show || function(self, index){return true;};
	
	//Set disabled, default is function returning false
	this.disabled = parameters.disabled || function(self, index){return false;};
	
	//Set form, step and page
	this.form = form;
	this.step = step;
	this.page = page;
	
	//Initialise options
	this.checkboxes = [];
	
	//Initialise alert
	this.alert = [];
	this.has_alert = false;
	
	//Add an alert
	this.add_alert = function(parameters){
		var new_alert = new Alert(this.form, this.step, this.page, this, parameters);
		this.alerts.push(new_alert);
		return new_alert;
	}
	
	//METHOD Adds an option to the checkbox group
	this.add_checkbox = function(parameters){
		var new_checkbox = new CheckboxOption(this.form, this.step, this.page, this, parameters);
		this.checkboxes.push(new_checkbox);
		return new_checkbox;
	};
	
	//METHOD renders the checkbox group
	this.render = function(index){
		//Get current value if present, otherwise use default if present
		this.value = get_value(this, index);
		
		//render
		return nunjucks.renderString(template_checkbox_group , {checkbox : this, navigation : navigation, index : index});
	}
}

/*
 * A checkbox within a checkbox group
 * 
 * PARAMETERS
 * 
 * variable_name:	The variable name of the checkbox group within the page dictionary
 * label:			The optional label of the option (string or function returning string)
 * tooltip:			The optional tooltip of the option (string or function returning string)
 * show:			If the option should be shown, default is true (function returning true/false)
 * disabled:		If the checkbox group should be disabled, default is false (function returning true/false)
 * default:			If this option should be default (function returning true or false)
 * 
 */

function CheckboxOption(form, step, page, checkbox, parameters){
	
	//Set the variable name of the radio group, throw exception if not found
	this.variable_name = parameters.variable_name || console.error('Variable name of Checkbox not set!');
	
	//Set label with string or function
	this.label = parameters.label || '';
	if(typeof this.label !== 'function'){var label_text = this.label;this.label = function(self){return label_text}}; 
	
	//Set tooltip with string or function
	this.tooltip = parameters.tooltip || '';
	if(typeof this.tooltip !== 'function'){var tooltip_text = this.tooltip;this.tooltip = function(self){return tooltip_text}};
	
	//Set show
	this.show = parameters.show || function(self){return true;};
	
	//Set disabled, default is function returning false
	this.disabled = parameters.disabled || function(self){return false;};
	
	//Set form, step, page and radio
	this.form = form;
	this.step = step;
	this.page = page;
	this.checkbox = checkbox;
	
	//Set default
	this.default = parameters.default || function(self){return false;};
	
	//METHOD renders an individual checkbox
	this.render = function(index){
		//Get current value if present, otherwise use default if present
		this.value = get_value(this, index);
		
		//render
		return nunjucks.renderString(template_checkbox , {checkbox : this, index : index});
	}
	
}