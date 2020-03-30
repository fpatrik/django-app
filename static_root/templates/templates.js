// FORM TEMPLATE
template_form = "\
<div class='row'>\
    <nav class='col-md-3 hidden-sm' id='Stepmenu'>\
        <ul class='nav nav-stacked' style='margin-top:140px;'>\
            {{ form.render_navigation() | safe }}\
        </ul>\
    </nav>\
    <div class='col-md-9 col-sm-12'>\
    	{% for step in form.steps %}\
    	{% if loop.index0 == navigation.step %}\
			{{ step.render() | safe }}\
		{% endif %}\
		{% endfor %}\
    </div>\
</div>";

// NAVIGATION TEMPLATE
template_navigation = "{% for step in form.steps %}\
{% if step.show(step) %}\
<li class='{% if loop.index0 == navigation.step %}active{% endif %}'>\
	<a class='scrollmenu' onclick=\"navigation['step']={{step.step_id}};navigation['page']=0;navigation['multipage']['overview']=true;window.form.render();\">{{ step.title(step) }}{% if step.has_alert %}<span class='glyphicon glyphicon-exclamation-sign' style='color:rgb(169, 68, 66);margin-left:5px;'></span>{% elif navigation.end %}<span class='glyphicon glyphicon-ok' style='color:rgb(92,184,92);margin-left:5px;'></span>{% endif %}</a>\
	{% if step.pages.length > 0 %}\
	<ul class='nav nav-stacked'>\
	{% for page in step.pages %}\
		{% if page.type == 'page' %}\
			{% if page.show(page) %}\
				<li class='{% if loop.index0 == navigation.page %}active{% endif %}'>\
					<a class='scrollmenu' onmouseup=\"navigation['step']={{step.step_id}};navigation['page']={{ page.page_id }};window.form.render();\">{{ page.title(page) }}{% if page.has_alert[0] %}<span class='glyphicon glyphicon-exclamation-sign' style='color:rgb(169, 68, 66);margin-left:5px;'></span>{% endif %}</a>\
				</li>\
			{% endif %}\
		{% endif %}\
		{% if page.type == 'multipage' %}\
			{% if page.show(page) %}\
				<li class='{% if loop.index0 == navigation.page %}active{% endif %}'>\
					<a class='scrollmenu' onmouseup=\"navigation['step']={{step.step_id}};navigation['page']={{ page.page_id }};navigation['multipage']['overview']=true;window.form.render();\">{{ page.title(multipage) }}{% if page.any_alert() %}<span class='glyphicon glyphicon-exclamation-sign' style='color:rgb(169, 68, 66);margin-left:5px;'></span>{% endif %}</a>\
				<ul class='nav nav-stacked'>\
				{% for instance in range(page.n_instances) %}\
					<li class='{% if not navigation.multipage.overview and loop.index0 == navigation.multipage.instance %}active{% endif %}'>\
						<a class='scrollmenu' onmouseup=\"navigation['step']={{step.step_id}};navigation['page']={{ page.page_id }};navigation['multipage']['overview']=false;navigation['multipage']['instance']={{loop.index0}};window.window.form.render();\">{{ page.naming(page, loop.index0) }}{% if page.has_alert[loop.index0] %}<span class='glyphicon glyphicon-exclamation-sign' style='color:rgb(169, 68, 66);margin-left:5px;'></span>{% endif %}</a>\
					</li>\
				{% endfor %}\
				</ul>\
				</li>\
			{% endif %}\
		{% endif %}\
	{% endfor %}\
	</ul>\
	{% endif %}\
</li>\
{% endif %}\
{% endfor %}";

//STEP TEMPLATE
template_step = "{% if step.show(step) %}{% for page in step.pages%}\
{% if loop.index0 == navigation.page %}\
    	{{ page.render() | safe }}\
{% endif %}\
{% endfor %}{% endif %}";
	
// PAGE TEMPLATE
template_page = "{% if page.show(page) %}\
<div class='panel panel-primary' style='margin-top:150px;'>\
	<div class='panel-heading'><h3 class='panel-title inline'>{{ page.title() }}</h3>{% if page.tooltip(page) != '' %}<a class='tooltips' data-toggle='tooltip' data-placement='right' title='{{ page.tooltip(page) }}'>\
		<i class='glyphicon glyphicon-info-sign title-icon'></i>\
    </a>{% endif %}</div>\
    <div class='panel-body'>\
    	{% for element in page.elements %}\
            	{{ element.render() | safe }}\
            {% endfor %}\
    </div>\
</div>\
<ul class='pager'>\
{% if page.previous_page().value %}\
<li class='previous'><a onmouseup=\"navigation['step']={{ page.previous_page().step }};navigation['page']={{ page.previous_page().page }};navigation['multipage']['overview']=true;window.form.render();\">Zurück</a></li>\
{% endif %}\
{% if page.next_page().value %}\
<li class='next'><a onmouseup=\"navigation['step']={{ page.next_page().step }};navigation['page']={{ page.next_page().page }};navigation['multipage']['overview']=true;window.form.render();\">Weiter</a></li>\
{% else %}\
<li class='next'><a onclick=\"navigation['end']=true;window.form.render();\">Eingaben Überprüfen</a></li>\
	<li class='next'><a onmouseup=\"alert(JSON.stringify(window.variables))\">Eingaben Anzeigen</a></li>\
{% endif %}\
</ul>{% endif %}";

//RADIO TEMPLATE
template_radio = "{% if radio.show(radio, index) %}\
<div class='form-group'>\
{% if radio.has_alert(radio, navigation.end, index) %}<div class='alert alert-danger'>{% endif %}\
	{% if radio.label(radio, index) != '' %}<label>{{ radio.label(radio, index) }}</label>{% endif %}\
	{% if radio.tooltip(radio, index) != '' %}<a class='tooltips' data-toggle='tooltip' data-placement='right' title='{{ radio.tooltip(radio, index) }}'><i class='glyphicon glyphicon-info-sign'></i></a> {% endif %}\
		{% for option in radio.options %}\
		{% if option.show(option, index) %}\
			<div class='radio'>\
				<label><input type='radio' value='{{ option.value }}' onchange=\"set_variable(['{{ radio.step.variable_name }}', '{{ radio.page.variable_name }}'{% if index > -1 %}, {{ index }}{% endif %}, '{{ radio.variable_name }}'], '{{ option.value }}');window.form.render();\" {% if radio.value == option.value %}checked='checked'{% endif %}{% if radio.disabled(radio, index) or option.disabled(option, index) %}disabled='disabled'{% endif %}> {{ option.label(option) }}</label>\
				{% if option.tooltip(option, index) != '' %}\
				<a class='tooltips' data-toggle='tooltip' data-placement='right' title='{{ option.tooltip(option, index) }}'>\
            		<i class='glyphicon glyphicon-info-sign'></i>\
            	</a>\
				{% endif %}\
			</div>\
		{% endif %}\
		{% endfor %}\
	{% if radio.has_alert(radio, navigation.end, index) %}\
	<ul id='alert-list'>\
	{% for alert in radio.alerts %}\
	{% if alert.condition(radio, navigation.end, index) %}\
		<li>{{ alert.message(radio) }}</li>\
	{% endif %}\
	{% endfor %}\
	</ul>\
	</div>\
	{% endif %}\
</div>{% endif %}";

//CHECKBOX GROUP TEMPLATE
template_checkbox_group = "{% if checkbox.show(checkbox, index) %}\
<div class='form-group'>\
{% if checkbox.has_alert %}<div class='alert alert-danger'>{% endif %}\
	{% if checkbox.label(checkbox, index) != '' %}<label>{{ checkbox.label(checkbox, index) }}</label>{% endif %}\
	{% if checkbox.tooltip(checkbox, index) != '' %}<a class='tooltips' data-toggle='tooltip' data-placement='right' title='{{ checkbox.tooltip(checkbox, index) }}'><i class='glyphicon glyphicon-info-sign'></i></a> {% endif %}\
		{% for instance in checkbox.checkboxes %}\
			{{ instance.render(index) | safe }}\
		{% endfor %}\
	{% if checkbox.has_alert %}\
	<ul id='alert-list'>\
	{% for alert in checkbox.alerts %}\
	{% if alert.condition(checkbox, navigation.end, index) %}\
		<li>{{ alert.message(checkbox) }}</li>\
	{% endif %}\
	{% endfor %}\
	</ul>\
	</div>\
	{% endif %}\
</div>{% endif %}";


//CHECKBOX TEMPLATE
template_checkbox = "{% if checkbox.show(checkbox, index) %}\
<div class='checkbox'>\
	<label><input type='checkbox' onchange=\"set_variable(['{{ checkbox.step.variable_name }}', '{{ checkbox.page.variable_name }}'{% if index > -1 %}, {{ index }}{% endif %}, '{{ checkbox.variable_name }}'], {% if checkbox.value %}false{% else %}true{% endif %});window.form.render();\" {% if checkbox.value %}checked='checked'{% endif %}{% if checkbox.disabled(checkbox, index) or checkbox.checkbox.disabled(checkbox.checkbox) %}disabled='disabled'{% endif %}> {{ checkbox.label(checkbox, index) }}</label>\
	{% if checkbox.tooltip(checkbox, index) != '' %}\
		<a class='tooltips' data-toggle='tooltip' data-placement='right' title='{{ checkbox.tooltip(checkbox, index) }}'>\
            <i class='glyphicon glyphicon-info-sign'></i>\
        </a>\
	{% endif %}\
</div>\
{% endif %}";

//TEXT TEMPLATE
template_text = "{% if text.show(text, index) %}\
<div class='form-group'>\
	{% if text.has_alert(text, navigation.end, index) %}<div class='alert alert-danger'>{% endif %}\
	{% if text.label(text, index) != '' %}<label>{{ text.label(text, index) }}</label>{% endif %}\
	{% if text.tooltip(text, index) != '' %}<a class='tooltips' data-toggle='tooltip' data-placement='right' title='{{ text.tooltip(text, index) }}'><i class='glyphicon glyphicon-info-sign'></i></a> {% endif %}\
	<input type='text' id='id_{{text.variable_name }}' value='{{ text.value }}' class='form-control{% if text.date(text, index) %} date{% endif %}{% if text.year(text, index) %} year{% endif %}'{% if text.disabled(text, index) %}disabled='disabled'{% endif %} placeholder='{{ text.placeholder(text, index) }}' onchange=\"set_variable(['{{ text.step.variable_name }}', '{{ text.page.variable_name }}'{% if index > -1 %}, {{ index }}{% endif %}, '{{ text.variable_name }}'], event.target.value);setTimeout(function(){window.form.render()},1);\" {% if text.date(text, index) or text.year(text, index) %}onchange=\"set_variable(['{{ text.step.variable_name }}', '{{ text.page.variable_name }}'{% if index > -1 %}, {{ index }}{% endif %}, '{{ text.variable_name }}'], event.target.value);window.form.render();\"{% endif %}>\
	{% if text.has_alert(text, navigation.end, index) %}\
	<ul id='alert-list'>\
	{% for alert in text.alerts %}\
	{% if alert.condition(text, navigation.end, index) %}\
		<li>{{ alert.message(text) }}</li>\
	{% endif %}\
	{% endfor %}\
	</ul>\
	</div>\
	{% endif %}\
</div>\
{% endif %}";

//TEXTAREA TEMPLATE
template_textarea = "{% if textarea.show(textarea, index) %}\
<div class='form-group'>\
	{% if textarea.has_alert(textarea, navigation.end, index) %}<div class='alert alert-danger'>{% endif %}\
	{% if textarea.label(textarea, index) != '' %}<label>{{ textarea.label(textarea, index) }}</label>{% endif %}\
	{% if textarea.tooltip(textarea, index) != '' %}<a class='tooltips' data-toggle='tooltip' data-placement='right' title='{{ textarea.tooltip(textarea, index) }}'><i class='glyphicon glyphicon-info-sign'></i></a> {% endif %}\
	<textarea class='form-control' rows='10' cols='70' {% if textarea.disabled(textarea, index) %}disabled='disabled'{% endif %} placeholder='{{ textarea.placeholder(textarea) }}' onchange=\"set_variable(['{{ textarea.step.variable_name }}', '{{ textarea.page.variable_name }}'{% if index > -1 %}, {{ index }}{% endif %}, '{{ textarea.variable_name }}'], event.target.value);setTimeout(function(){window.form.render()},1);\">{{ textarea.value }}</textarea>\
	{% if textarea.has_alert(textarea, navigation.end, index) %}\
	<ul id='alert-list'>\
	{% for alert in textarea.alerts %}\
	{% if alert.condition(textarea, navigation.end, index) %}\
	<li>{{ alert.message(textarea) }}</li>\
	{% endif %}\
	{% endfor %}\
	</ul>\
	</div>{% endif %}\
</div>\
{% endif %}"
	
//DROPDOWN TEMPLATE
template_dropdown = "{% if dropdown.show(dropdown, index) %}\
<div class='form-group'>\
	{% if dropdown.has_alert(dropdown, navigation.end, index) %}<div class='alert alert-danger'>{% endif %}\
	{% if dropdown.label(dropdown, index) != '' %}<label>{{ dropdown.label(dropdown, index) }}</label>{% endif %}\
	{% if dropdown.tooltip(dropdown, index) != '' %}<a class='tooltips' data-toggle='tooltip' data-placement='right' title='{{ dropdown.tooltip(dropdown, index) }}'><i class='glyphicon glyphicon-info-sign'></i></a> {% endif %}\
	<select class='form-control' {% if dropdown.disabled(dropdown, index) %}disabled='disabled'{% endif %}>\
	<option value='' onclick=\"set_variable(['{{ dropdown.step.variable_name }}', '{{ dropdown.page.variable_name }}'{% if index > -1 %}, {{ index }}{% endif %}, '{{ dropdown.variable_name }}'], '');window.form.render();\"></option>\
		{% for option in dropdown.options %}\
		{% if option.show(dropdown) %}\
		<option value='{{ option.value }}' {% if dropdown.value == option.value %}selected='selected'{% endif %} onclick=\"set_variable(['{{ dropdown.step.variable_name }}', '{{ dropdown.page.variable_name }}'{% if index > -1 %}, {{ index }}{% endif %}, '{{ dropdown.variable_name }}'], '{{ option.value }}');window.form.render();\">{{ option.label(dropdown) }}</option>\
		{% endif %}\
		{% endfor %}\
	</select>\
	{% if dropdown.has_alert(dropdown, navigation.end, index) %}\
	<ul id='alert-list'>\
	{% for alert in dropdown.alerts %}\
	{% if alert.condition(dropdown, navigation.end, index) %}\
	<li>{{ alert.message(dropdown) }}</li>\
	{% endif %}\
	{% endfor %}\
	</ul>\
	</div>\
	{% endif %}\
 </div>\
{% endif %}";

//MODELSELECT TEMPLATE
template_modelselect="{% if modelselect.show(modelselect, index) %}\
	<div class='form-group'>\
	{% if modelselect.has_alert(modelselect, navigation.end, index) %}<div class='alert alert-danger'>{% endif %}\
	{% if modelselect.label(modelselect, index) != '' %}<label>{{ modelselect.label(modelselect, index) }}</label>{% endif %}\
	{% if modelselect.tooltip(modelselect, index) != '' %}<a class='tooltips' data-toggle='tooltip' data-placement='right' title='{{ modelselect.tooltip(modelselect, index) }}'><i class='glyphicon glyphicon-info-sign'></i></a> {% endif %}\
	<select class='form-control' onchange=\"set_variable(['{{ modelselect.step.variable_name }}', '{{ modelselect.page.variable_name }}'{% if index > -1 %}, {{ index }}{% endif %}, '{{ modelselect.variable_name }}'], this.value);window.form.render();\">\
		<option value='' {% if not modelselect.value or modelselect.value == '' %}selected='selected'{% endif %}></option>\
		{% for source in modelselect.model.sources %}\
			{% for instance in variables[source.step.variable_name][source.variable_name] %}\
			{% if not (source.step.variable_name == modelselect.step.variable_name and source.step == modelselect.step) %}\
				{% set target_value = \"[\" + source.step.variable_name + \", \" + source.variable_name + \", \" + loop.index0 + \"]\" %}\
				<option value='[{{ source.step.variable_name }}, {{ source.variable_name }}, {{ loop.index0 }}]' {% if modelselect.value == target_value %}selected='selected'{% endif %}>{{ source.naming(source, loop.index0) }}</option>\
			{% endfor %}\
			{% endif %}\
		{% endfor %}\
	</select>\
	{% if modelselect.has_alert(modelselect, navigation.end, index) %}\
	<ul id='alert-list'>\
	{% for alert in modelselect.alerts %}\
	{% if alert.condition(modelselect, navigation.end, index) %}\
	<li>{{ alert.message(modelselect) }}</li>\
	{% endif %}\
	{% endfor %}\
	</ul>\
	</div>\
	{% endif %}\
	</div>\
	{% endif %}";

//MULTIPAGE OVERVIEW TEMPLATE
template_multipage_overview = "{% if multipage.show(multipage) %}\
<div class='panel panel-primary' style='margin-top:150px;'>\
	<div class='panel-heading'><h3 class='panel-title inline'>{{ multipage.title(multipage) }}</h3>{% if multipage.tooltip(multipage) != '' %}<a class='tooltips' data-toggle='tooltip' data-placement='right' title='{{ multipage.tooltip(multipage) }}'>\
		<i class='glyphicon glyphicon-info-sign title-icon'></i>\
    </a>{% endif %}</div>\
    <div class='panel-body'>\
    	<table class='table table-hover'>\
		    <thead>\
		      <tr>\
		        <th>Name</th>\
		        <th>Bearbeiten</th>\
		        <th>Löschen</th>\
		      </tr>\
		    </thead>\
		    <tbody>\
		    {% for instance in range(multipage.n_instances) %}\
		      <tr>\
		        <td>{% if multipage.suggestions_active(suggestions, loop.index0) %}{{ multipage.suggestions_model.render(multipage, loop.index0) | safe }}{% else %}{{ multipage.naming(multipage, instance) }}{% endif %}</td>\
		        <td><button type='button' onclick=\"navigation['multipage']['overview']=false;navigation['multipage']['instance']={{ loop.index0 }};window.form.render();\" class='btn btn-success'><span class='glyphicon glyphicon-pencil' aria-hidden='false'></span></button></td>\
		        <td><button type='button' onclick=\"window.form.steps[navigation.step].pages[navigation.page].remove_instance({{ loop.index0 }});\" class='btn btn-danger'><span class='glyphicon glyphicon-remove' aria-hidden='false'></span></button></td>\
		      </tr>\
		    {% endfor %}\
		    </tbody>\
		  </table>\
		  <button type='button' onclick='window.form.steps[navigation.step].pages[navigation.page].add_instance();' class='btn btn-primary add center-block'><span class='glyphicon glyphicon-plus' aria-hidden='false'></span> {{ multipage.title(multipage) }}</button>\
    </div>\
</div>\
<ul class='pager'>\
{% if multipage.previous_page().value %}\
<li class='previous'><a onclick=\"navigation['step']={{ multipage.previous_page().step }};navigation['page']={{ multipage.previous_page().page }};window.form.render();\">Zurück</a></li>\
{% endif %}\
{% if multipage.next_page().value %}\
<li class='next'><a onclick=\"navigation['step']={{ multipage.next_page().step }};navigation['page']={{ multipage.next_page().page }};window.form.render();\">Weiter</a></li>\
{% else %}\
<li class='next'><a onclick=\"navigation['end']=true;window.form.render();\">Eingaben Überprüfen</a></li>\
	<li class='next'><a onclick=\"alert(JSON.stringify(window.variables))\">Eingaben Anzeigen</a></li>\
{% endif %}\
</ul>{% endif %}";

//MULTIPAGE INSTANCE TEMPLATE
template_multipage_instance = "{% if multipage.show(multipage, index) %}\
	<div class='panel panel-primary' style='margin-top:150px;'>\
		<div class='panel-heading'><h3 class='panel-title inline'>{{ multipage.naming(multipage, instance) }}</h3>{% if multipage.tooltip(multipage, index) != '' %}<a class='tooltips' data-toggle='tooltip' data-placement='right' title='{{ multipage.tooltip(multipage, index) }}'>\
			<i class='glyphicon glyphicon-info-sign title-icon'></i>\
	    </a>{% endif %}</div>\
	    <div class='panel-body'>\
	    	{% for element in multipage.elements %}\
	           {{ element.render(instance) | safe }}\
	        {% endfor %}\
	    </div>\
	</div>\
	<ul class='pager'>\
	<li class='previous'><a onclick=\"navigation['multipage']['overview']=true;window.form.render();\">Zurück zur Übersicht</a></li>\
	</ul>{% endif %}";

//MULTIPAGE DROPDOWN TEMPLATE
template_model_dropdown = "<div class='form-group'>\
	<select class='form-control' onchange=''>\
		<option></option>\
		{% for source in model.sources %}\
			{% set source_i = loop.index0 %}\
			{% for i in range(source.n_instances) %}\
				<option onclick=\"window.form.steps[{{ multipage.step.step_id }}].pages[{{ multipage.page_id }}].suggestions_model.accept_suggestion({{ source_i }}, {{ i }}, '{{ multipage.step.variable_name }}', '{{ multipage.variable_name }}', {{ index }})\">{{ source.naming(source, i) }}</option>\
			{% endfor %}\
		{% endfor %}\
	</select>\
 </div>";

//SEPARATOR TEMPLATE
template_separator = "{% if separator.show(separator, index) %}\
	<hr/>\
{% endif %}";

//LABEL TEMPLATE
template_label = "{% if label.show(label, index) %}\
	<label style='font-size:{{ label.font_size(label, index) }}px;margin-bottom:15px;margin-top:15px;'>{{ label.label(label, index) }}</label>\
{% endif %}";