/*
*
* A disabled text input for display purposes
*
* PARAMETERS
* 
* show:			A function returning true/false determining if the separator should be shown, default is true
* label:		The label to be shown. A string or a function returning a string
* value:		The label to be shown. A string or a function returning a string
* 
*/

function TextLabel(form, step, page, parameters){
	
	//Set label with string or function
	this.label = parameters.label || '';
	if(typeof this.label !== 'function'){var label_text = this.label;this.label = function(self){return label_text}}; 
	
	//Set value with string or function
	this.value = parameters.value || '';
	if(typeof this.value !== 'function'){var value_text = this.value;this.value = function(self){return value_text}};
	
	//Set tooltip with string or function
	this.tooltip = parameters.tooltip || '';
	if(typeof this.tooltip !== 'function'){var tooltip_text = this.tooltip;this.tooltip = function(self){return tooltip_text}};
	
	//Set show, default is function returning true
	this.show = parameters.show || function(self){return true;};
	
	//Set form, step and page
	this.form = form;
	this.step = step;
	this.page = page;
	
	//METHOD renders the separator
	this.render = function(index){
		//render
		return nunjucks.renderString(template_textlabel , {textlabel : this, index : index});
	}
}