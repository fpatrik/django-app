/*
 * Radio buttons for the form
 * 
 * PARAMETERS
 * 
 * variable_name:	The variable name of the radio group within the page dictionary
 * label:			The optional label of the radio group (string or function returning string)
 * tooltip:			The optional tooltip of the radio group (string or function returning string)
 * show:			If the radio group should be shown, default is true (function returning true/false)
 * required:		If the text input is a required field, default is false (function returning true/false or true/false)
 * disabled:		If the radio group should be disabled, default is false (function returning true/false)
 * default:			The default value of the radio group
 * 
 */

function Radio(form, step, page, parameters){
	
	//Set the variable name of the radio group, throw exception if not found
	this.variable_name = parameters.variable_name || console.error('Variable name of Radio Group not set!');
	
	//Set label with string or function
	this.label = parameters.label || '';
	if(typeof this.label !== 'function'){var label_text = this.label;this.label = function(self){return label_text}}; 
	
	//Set tooltip with string or function
	this.tooltip = parameters.tooltip || '';
	if(typeof this.tooltip !== 'function'){var tooltip_text = this.tooltip;this.tooltip = function(self){return tooltip_text}};
	
	//Set show, default is function returning true
	this.show = parameters.show || function(self){return true;};
	
	//Set disabled, default is function returning false
	this.disabled = parameters.disabled || function(self){return false;};
	
	//Set default
	this.default = parameters.default || '';
	if(typeof this.default !== 'function'){var default_text = this.default;this.default = function(self){return default_text}};
	
	//Set form, step and page
	this.form = form;
	this.step = step;
	this.page = page;
	
	//METHOD to set default from options
	this.set_default = function(value){
		if(this.page.type == 'page'){
			set_variable_default([this.step.variable_name, this.page.variable_name, this.variable_name], get_value(this));
		}
	}
	
	//Set default value in variables
	if(this.default() != ''){
		this.set_default(this.default());
	}
	
	//Initialise options
	this.options = [];
	
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
				if(self.required() && self.show(self, index) && self.page.show() && end && (typeof variables[self.step.variable_name][self.page.variable_name][self.variable_name] == 'undefined')){
					return true;
				}
			}
			else if(self.page.type = 'multipage'){
				if(self.required() && self.show(self, index) && self.page.show() && end && (typeof variables[self.step.variable_name][self.page.variable_name][index][self.variable_name] == 'undefined')){
					return true;
				}
			}
			
			return false;
		}
	, 'message' : 'Dieses Feld benötigt eine Wahl'});
	
	//METHOD Adds an option to the radio group
	this.add_option = function(parameters){
		var new_option = new RadioOption(this.form, this.step, this.page, this, parameters);
		this.options.push(new_option);
		return new_option;
	};
	
	//METHOD renders the radio group
	this.render = function(index){
		//Get current value if present, otherwise use default if present
		this.value = get_value(this, index);
		
		//render
		return nunjucks.renderString(template_radio , {radio : this, navigation : navigation, index : index});
	}
}

/*
 * An option within a radio group
 * 
 * PARAMETERS
 * 
 * value:		The value of the option (string)
 * label:		The optional label of the option (string or function returning string)
 * tooltip:		The optional tooltip of the option (string or function returning string)
 * show:		If the radio group should be shown, default is true (function returning true/false)
 * default:		If this option should be default (function returning true or false)
 * disabled:	If the radio option should be disabled, default is false (function returning true/false)
 * 
 */

function RadioOption(form, step, page, radio, parameters){
	
	//Set value
	this.value = parameters.value || console.error('Radio option without value found!');
	
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
	this.radio = radio;
	
	//Set default
	this.default = parameters.default || function(self){return false;};
	if(this.default(this.radio)){var value_text = this.value;this.radio.default = function(self){return value_text;};this.radio.set_default();}
	
}