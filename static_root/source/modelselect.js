/*
 * Select an instance of a model
 * 
 * PARAMETERS
 * 
 * variable_name:	The variable name of the modelselect within the page dictionary
 * label:			The optional label of the modelselect (string or function returning string)
 * tooltip:			The optional tooltip of the modelselect (string or function returning string)
 * show:			If the modelselect should be shown, default is true (function returning true/false)
 * disabled:		If the modelselect should be disabled, default is false (function returning true/false)
 * 
 */

function ModelSelect(form, step, page, model, parameters){
	//Set the model to select from
	this.model = model;
	
	//Set the variable name of the modelselect, throw exception if not found
	this.variable_name = parameters.variable_name || console.error('Variable name of Modelselect not set!');
	
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
	
	//Set form, step and page
	this.form = form;
	this.step = step;
	this.page = page;
	
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
				if(self.required() && self.show(self, index) && end && (typeof variables[self.step.variable_name][self.page.variable_name][self.variable_name] == 'undefined' || variables[self.step.variable_name][self.page.variable_name][self.variable_name] == '')){
					return true;
				}
			}
			else if(self.page.type = 'multipage'){
				if(self.required() && self.show(self, index) && end && (typeof variables[self.step.variable_name][self.page.variable_name][index][self.variable_name] == 'undefined' || variables[self.step.variable_name][self.page.variable_name][index][self.variable_name] == '')){
					return true;
				}
			}
			
			return false;
		}
	, 'message' : 'Dieses Feld benötigt eine Wahl'});
	
	//METHOD renders the model select
	this.render = function(index){
		//Get current value if present, otherwise use default if present
		this.value = get_value(this, index);
		console.log(variables['anteilbuch']['zuweisung'])
		//render
		return nunjucks.renderString(template_modelselect , {modelselect : this, variables : variables, navigation : navigation, index : index});
	}
}