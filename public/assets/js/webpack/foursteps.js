!function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,e,n){Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var n=t&&t.__esModule?function(){return t["default"]}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=5)}({5:function(t,e){function n(t){return a[t]}function i(t){return s[t]}function r(){var t=window.location.hash;if(t.length>0){var e=$(".events li a"),n=e.filter(function(){return $(this).text()===i(t)});n.length>0&&!n.hasClass("selected")&&n.first().click()}else window.location.hash="#step_1"}function o(t){var e=window.location.hash,r=t.target.text;r!==i(e)&&window.history.pushState({},"TestTitle",n(r))}function c(t){var e=window.location.hash;setTimeout(function(){var t=$(".events li a.selected").first(),i=n(t.text());e!==i&&window.history.pushState({},"TestTitle",i)},100)}var s=new Array;s["#step_1"]="Step 1",s["#step_2"]="Step 2",s["#step_3"]="Step 3",s["#step_4"]="Step 4",s["#did_i_click"]="Did I click?",s["#insights_tree"]="Insights Tree";var a=new Array;a["Step 1"]="#step_1",a["Step 2"]="#step_2",a["Step 3"]="#step_3",a["Step 4"]="#step_4",a["Did I click?"]="#did_i_click",a["Insights Tree"]="#insights_tree",window.onpopstate=r,$(document).ready(r),$(document).keyup(function(t){var e=t.keyCode?t.keyCode:t.which;37!==e&&39!==e||c(t)}),$(".events li a").click(o),$(".next").click(c),$(".prev").click(c),$(".nextbtn").click(c)}});