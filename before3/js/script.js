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
  var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
  var allMenuesUrl = "https://davids-restaurant.herokuapp.com/menu_items.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoriesHtml = "snippets/category-snippet.html";
  var menuItemTitleHtml = "snippets/menue-items-title.html";
  var menuItemHtml = "snippets/menue-item.html";

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
    console.log("loadMenuCategories gestartet");
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
  var finalHtml = categoriesTitleHtml+"<section class='row'>"; 

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

  dc.loadMenuItems = function (short_name) {
    console.log("loadMenuItems gestartet");
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allMenuesUrl+"?category="+short_name,
      buildAndShowMenuesHTML);
  };
// builds HTML for the menues page based
  // on the date from the server
//    var menuItemTitleHtml = "snippets/menue-items-title.html";
 // var menuItemHtml = "snippets/menue-item.html";
  function buildAndShowMenuesHTML (menues) {
    // load title snippet 
    $ajaxUtils.sendGetRequest(
      menuItemTitleHtml,
      function (menueTitleHtml) {
        // retrieve single menu snippet
        $ajaxUtils.sendGetRequest(
          menuItemHtml,
          function (menuHtml) {
            var menuesViewHtml = 
              buildMenuesViewHtml  (menues,
                                     menueTitleHtml,
                                     menuHtml);
              insertHtml("#main-content",menuesViewHtml);
          },
        false);
    },
      false);
  };

// using menu data and snippets html 
// to build menues view html to be inserted into page
function buildMenuesViewHtml(menues,
                                  menueTitleHtml,
                                  menuHtml) {
  var finalHtml = menueTitleHtml+ "<section class='row'>"; 

  //loop over menues
  for (var i = 0; i<menues.menu_items.length;i++) {
    //insert category values
    //    description: "broccoli, carrots, baby corn, water chestnuts, mushrooms, and snow peas sauteed in brown sauce"
    //id: 953
    //large_portion_name: "large"
    //name: "Wok's Mixed Vegetables"
    //price_large: 11.45
    //price_small: 9.45
    //short_name: "VG1"
    //small_portion_name: "pint"
    var html = menuHtml;
    var name = menues.menu_items[i].name;
    var short_name = menues.menu_items[i].short_name; 
    var catShortName = menues.menu_items[i].catShortName ;
    var price_large = menues.menu_items[i].price_large ;
    var price_small = menues.menu_items[i].price_small ;
    var description = menues.menu_items[i].description;
    var large_portion_name = menues.menu_item[i].large_portion_name;
    var small_portion_name = menues.menu_item[i].small_portion_name;
    html = insertProperty(html,"name",name);
    html = insertProperty(html,"short_name",short_name);
    html = insertProperty(html,"catShortName",catShortName);
    html = insertProperty(html,"price_large",price_large);
    html = insertProperty(html,"price_small",price_small);
    html = insertProperty(html,"description",description);
    html = insertProperty(html,"large_portion_name",large_portion_name);
    html = insertProperty(html,"small_portion_name",small_portion_name);

    finalHtml += html;

  };
  return finalHtml;
};

  global.$dc = dc; 
})(window);


