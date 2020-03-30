/*
*
* A label without input
*
* PARAMETERS
* 
* show:			A function returning true/false determining if the separator should be shown, default is true
* label:		The label to be shown. A string or a function returning a string
* font_size:	Font size of the label. Function returning a string with the font size e.g. '16'
* 
*/

function Label(form, step, page, parameters){
	
	//Set label with string or function
	this.label = parameters.label || '';
	if(typeof this.label !== 'function'){var label_text = this.label;this.label = function(self){return label_text}}; 
	
	//Set show, default is function returning true
	this.show = parameters.show || function(self){return true;};
	
	//Set font_size, default is function returning '16'
	this.font_size = parameters.font_size || function(self){return '16';};
	
	//Set form, step and page
	this.form = form;
	this.step = step;
	this.page = page;
	
	//METHOD renders the separator
	this.render = function(index){
		//render
		return nunjucks.renderString(template_label , {label : this, index : index});
	}
}