(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['controllersTemplate'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <li>\n            <div class=\"flexContainer\">\n                <p>"
    + alias4(((helper = (helper = helpers.controller || (depth0 != null ? depth0.controller : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"controller","hash":{},"data":data}) : helper)))
    + "</p>\n                <div>\n                    <div class=\"inlineButton large\" data-index=\""
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" data-controllers=\"edit\" data-click=\"editController\"><i class=\"material-icons md-dark\">edit</i></div>\n                </div>\n            </div>\n        </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div>\n    <ul>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.controllers : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n</div>\n";
},"useData":true});
})();