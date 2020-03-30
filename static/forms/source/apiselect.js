/*
 * API select for form
 * 
 * PARAMETERS
 * 
 * title:			The optional title of the API select (string or function returning string)
 * label:			The optional label of the text input (string or function returning string)
 * tooltip:			The optional tooltip of the text input (string or function returning string)
 * show:			If the text input should be shown, default is true (function returning true/false)
 * 
 */

function ApiSelect(form, step, page, parameters){
	
	//Set title with string or function
	this.title = parameters.title || '';
	if(typeof this.title !== 'function'){var title_text = this.title;this.title = function(self){return title_text}}; 
	
	//Set label with string or function
	this.label = parameters.label || '';
	if(typeof this.label !== 'function'){var label_text = this.label;this.label = function(self){return label_text}}; 
	
	//Set tooltip with string or function
	this.tooltip = parameters.tooltip || '';
	if(typeof this.tooltip !== 'function'){var tooltip_text = this.tooltip;this.tooltip = function(self){return tooltip_text}};
	
	//Set show, default is function returning true
	this.show = parameters.show || function(self){return true;};
	
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
	
	//METHOD renders the API select
	this.render = function(index){
		
		//render
		return nunjucks.renderString(template_apiselect, {api : this, form_api : window.api, navigation : navigation, index : index});
	}
}