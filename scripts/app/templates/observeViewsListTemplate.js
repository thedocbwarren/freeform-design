define(["handlebars"],function(n){n=n["default"];var a=n.template,e=n.templates=n.templates||{};return e.observeViewsListTemplate=a({1:function(n,a,e,l,i){var t,s=null!=a?a:{},d=e.helperMissing,r="function",c=n.escapeExpression;return'        <li>\n            <div class="flexContainer">\n                <div>\n                    <div class="avatar circle float left">C</div>\n                    <p>'+c((t=null!=(t=e.view||(null!=a?a.view:a))?t:d,typeof t===r?t.call(s,{name:"view",hash:{},data:i}):t))+'<br/><span class="secondary">'+c((t=null!=(t=e.channel||(null!=a?a.channel:a))?t:d,typeof t===r?t.call(s,{name:"channel",hash:{},data:i}):t))+'</span><br/><span class="secondary">'+c((t=null!=(t=e.identifer||(null!=a?a.identifer:a))?t:d,typeof t===r?t.call(s,{name:"identifer",hash:{},data:i}):t))+'</span></p>\n                </div>\n                <div>\n                    <div class="inlineButton large" data-index="'+c((t=null!=(t=e.index||i&&i.index)?t:d,typeof t===r?t.call(s,{name:"index",hash:{},data:i}):t))+'" data-mediator="edit" data-click="editView"><i class="material-icons md-dark">edit</i></div>\n                </div>\n            </div>\n        </li>\n'},compiler:[7,">= 4.0.0"],main:function(n,a,e,l,i){var t;return'<div>\n    <ul class="center">\n'+(null!=(t=e.each.call(null!=a?a:{},null!=a?a.views:a,{name:"each",hash:{},fn:n.program(1,i,0),inverse:n.noop,data:i}))?t:"")+"    </ul>\n</div>\n"},useData:!0})});
