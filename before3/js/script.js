$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });

  // In Firefox and Safari, the click event doesn't retain the focus
  // on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler
  // which is set up above will not be called.
  // Refer to issue #28 in the repo.
  // Solution: force focus on the element that the click event fired on
  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });
});

(function (global) { 

  var dc = {};

  var homeHtml = "snippets/home-snippet.html";
  var allCategoriesUrl = "http://davids-restaurant.herokuapp.com/categories.json";
  var categoriesTitleHtml "snippets/categories-title-snippet.html";
  var categoriesHtml "snippets/category-snippet.html";

  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  var showLoading = function(selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector,html);
  };

  //return substitute for '{{propName}}'
  // with propValue in given 'string'
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{"+ propName +"}}";
    string = string.replace(new RegExp(propToReplace, "g"),propValue);
    return string; 
  };

  document.addEventListener("DOMContentLoaded", function (event) {

    // on first load, show home view 
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      homeHtml,
      function (responseText) {
        document.querySelector("#main-content")
         .innerHTML = responseText;
       },
       false);
  });

  //load the menu categories
  dc.loadMenuCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      buildAndShowCategoriesHTML);
  };

  // builds HTML for the categories page based
  // on the date from the server
  function buildAndShowCategoriesHTML (categories) {
    // load title snippet 
    $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
      function (categoriesTitleHtml) {
        // retrieve single category snippet
        $ajaxUtils.sendGetRequest(
          categoriesHtml,
          function (categoryHtml) {
            var categoriesViewHtml = 
              buildCategoriesViewHtml (categories,
                                        categoriesTitleHtml,
                                        categoryHtml);
              insertHtml("#main-content",categoriesViewHtml);
          },
        false);
    },
      false);
  };

// using categories data and snippets html 
// to build categories view html to be inserted into page
function buildCategoriesViewHtml(categories,
                                  categoriesTitleHtml,
                                  categoryHtml) {
  finalHtml += "<section class='row'>"; 

  //loop over categories
  for (var i = 0; i<categories.length;i++) {
    //insert category values
    var html = categoryHtml;
    var name = categories[i].name;
    var short_name = categories[i].short_name; 
    html = insertProperty(html,"name",name);
    html = insertProperty(html,"short_name",short_name);
    finalHtml += html;
  };
  return finalHtml;
};

  global.$dc = dc; 
})(window);


