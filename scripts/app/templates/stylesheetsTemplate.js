define(['handlebars'], function(Handlebars) {
  Handlebars = Handlebars["default"];  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
return templates['stylesheetsTemplate'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "        <li>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + " <div class=\"inlineButton\" data-stylesheets=\"edit\" data-click=\"editStylesheet\"><i class=\"material-icons md-dark\">edit</i></div></li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<h2>Async Stylesheets</h2>\n<div id=\"asyncStylesheets\" class=\"editList\">\n    <ul>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.asyncStylesheets : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n</div>\n<h2>Sync Stylesheets</h2>\n<div id=\"syncStylesheets\" class=\"editList\">\n    <ul>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.syncStylesheets : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n</div>\n";
},"useData":true});
});
