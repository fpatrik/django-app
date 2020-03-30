/*
 * Text input for the form
 * 
 * PARAMETERS
 * 
 * variable_name:	The variable name of the text input within the page dictionary
 * label:			The optional label of the text input (string or function returning string)
 * tooltip:			The optional tooltip of the text input (string or function returning string)
 * placeholder:		The optional placeholder of the text input (string or function returning string)
 * show:			If the text input should be shown, default is true (function returning true/false)
 * disabled:		If the text input should be disabled, default is false (function returning true/false)
 * required:		If the text input is a required field, default is false (function returning true/false or true/false)
 * default:			The default value of the text input
 * date:			If a datepicker should be shown, default is false (function returning true/false or true/false)
 * year:			If a datepicker (with years e.g. for birthdays) should be shown, default is false (function returning true/false or true/false)
 * 
 */

function Text(form, step, page, parameters){
	
	//Set the variable name of the radio group, throw exception if not found
	this.variable_name = parameters.variable_name || console.error('Variable name of Text input not set!');
	
	//Set label with string or function
	this.label = parameters.label || '';
	if(typeof this.label !== 'function'){var label_text = this.label;this.label = function(self){return label_text}}; 
	
	//Set tooltip with string or function
	this.tooltip = parameters.tooltip || '';
	if(typeof this.tooltip !== 'function'){var tooltip_text = this.tooltip;this.tooltip = function(self){return tooltip_text}};
	
	//Set placeholder with string or function
	this.placeholder = parameters.placeholder || '';
	if(typeof this.placeholder !== 'function'){var placeholder_text = this.placeholder;this.placeholder = function(self){return placeholder_text}};
	
	//Set show, default is function returning true
	this.show = parameters.show || function(self){return true;};
	
	//Set disabled, default is function returning false
	this.disabled = parameters.disabled || function(self){return false;};
	
	//Set date, default is function returning false
	this.date = parameters.date || '';
    if(typeof this.date !== 'function' && this.date === true){this.date = function(self){return true}}else{this.date = function(self){return false}};
	
	//Set year, default is function returning false
	this.year = parameters.year || '';
    if(typeof this.year !== 'function' && this.year === true){this.year = function(self){return true}}else{this.year = function(self){return false}};
	
	//Set default
	this.default = parameters.default || '';
	if(typeof this.default !== 'function'){var default_text = this.default;this.default = function(self){return default_text}};
	
	//Set form, step and page
	this.form = form;
	this.step = step;
	this.page = page;
	
	//Set default value in variables
	if(this.page.type == 'page'){
		set_variable_default([this.step.variable_name, this.page.variable_name, this.variable_name], get_value(this))
	}
	
	//Initialise alert
	this.alerts = [];
	
	//Returns true if text has an alert
	this.has_alert = function(self, end, index){
		for(var i = 0; i < this.alerts.length; i++){
			if(this.alerts[i].condition(self, end, index)){
				return true;
			}
		}
		return false;
	}
	
	//Add an alert
	this.add_alert = function(parameters){
		var new_alert = new Alert(this.form, this.step, this.page, this, parameters);
		this.alerts.push(new_alert);
		return new_alert;
	}
	
	//Add a required alert
	this.required = parameters.required || '';
	if(typeof this.required !== 'function'){var required_value = this.required;this.required = function(self){return required_value}};
	this.add_alert({'condition' : 
		function(self, end, index){
			if(self.page.type == 'page'){
				if(self.required() && self.show(self, index) && self.page.show() && end && (typeof variables[self.step.variable_name][self.page.variable_name][self.variable_name] == 'undefined' || variables[self.step.variable_name][self.page.variable_name][self.variable_name] == '')){
					return true;
				}
			}
			else if(self.page.type = 'multipage'){
				if(self.required() && self.show(self, index) && self.page.show() && end && (typeof variables[self.step.variable_name][self.page.variable_name][index][self.variable_name] == 'undefined' || variables[self.step.variable_name][self.page.variable_name][index][self.variable_name] == '')){
					return true;
				}
			}
			
			return false;
		}
	, 'message' : 'Dieses Feld benötigt eine Eingabe'});
	
	//METHOD renders the text input
	this.render = function(index){
		//Get current value if present, otherwise use default if present
		this.value = get_value(this, index);

		//render
		return nunjucks.renderString(template_text , {text : this, navigation : navigation, index : index});
	}
}