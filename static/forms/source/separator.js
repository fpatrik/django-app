/*
*
* A line separating content within a page
*
* PARAMETERS
* 
* show:		A function returning true/false determining if the separator should be shown, default is true
* 
*/

function Separator(form, step, page, parameters){
	
	//Set show, default is function returning true
	this.show = parameters.show || function(self){return true;};
	
	//Set form, step and page
	this.form = form;
	this.step = step;
	this.page = page;
	
	//METHOD renders the separator
	this.render = function(index){
		//render
		return nunjucks.renderString(template_separator , {separator : this, index : index});
	}
}