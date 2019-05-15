var page = document.getElementById("page");
var bar = document.getElementById("bar");
var body = document.getElementsByClassName("body");
var wid = $(window).width();
var hei = $(window).height();
var maxwidth = screen.width;
var pagecount = 1;
var pageWidth;

var product_count = 0;
var products_length = products.length;
var currentPage = 2;
console.log(products);

//產生頁碼
while ((products_length / 20) > 0) {
  $(".page ul").append("  <li id='page" + pagecount + "' class='page-item'><a class='page-link' onclick='GetProducts(" + pagecount + ")'>" + pagecount + "</a></li>");
  products_length -= 20;
  if (products_length < 1 && pagecount < 5) {
    $(".page ul").append("  <li class='page-item'><a onclick='nextPage()' class='page-link' >>></a></li>");
    pageWidth = 90 + (35 * pagecount);
  }
  if (pagecount >= 5) {
    $(".page ul").append("  <li class='page-item'><a class='page-link' href='#'>...</a></li>");
    $(".page ul").append("  <li class='page-item'><a class='page-link' href='#'>>></a></li>");
    pageWidth = 90 + (35 * (pagecount + 1)); //  90 >> <<   35 數字
    break;
  }
  pagecount++;
}
pagecount--;
GetProducts(1);
//更換頁面
function GetProducts(index) {

  var pageString = "page" + index;
  var previousPageString = "page" + currentPage;
  var numOfProduct;
  product_count = 0;

  document.getElementById(previousPageString).classList.remove("active");
  document.getElementById(pageString).classList.add("active");
  currentPage = index;

  if ((products.length - (index - 1) * 20) >= 20)
    numOfProduct = 20;
  else
    numOfProduct = products.length - (index - 1) * 20;

  $("#row").html("<div id='blank1' class='col-md-12'></div><div class='col-md-1'></div>");
  for (var i = ((index - 1) * 20); i < ((index - 1) * 20 + numOfProduct); i++) {
    if (product_count == 5) {
      $("#row").append("<div class='col-md-1'></div><div class='col-md-1'></div>");
      product_count = 0;
    }
    product_count++;
    $("#row").append("<div class='col-md-2'><img src='" + products[i].images[0] + "' %}' class='img-thumbnail img' alt=" + products[i].product_name + "><p>" + products[i].product_name + "</p></div>");
  }
  $("#row").append("<div id='blank2' class='col-md-12'></div>");
}

// >>的函示
function nextPage() {

  if (currentPage != pagecount)
    GetProducts(currentPage + 1);
}

// <<的函示
function previousPage() {
  if (currentPage != 1)
    GetProducts(currentPage - 1);
}

//變更視窗大小時
$(function() {
  $(window).resize(function() {
    wid = $(window).width();
    page.style.left = (wid / 2) - (pageWidth / 2) + "px";

    var barHeight = $(".header1").height();
    $(".pos-f-t").css('top', barHeight + 'px');
    $("#bar2").css('margin-left', 50 + "px");
    $("#bar2").css('width', wid * 0.8 + "px");
    $("#blank1").css('height', hei * 0.01 + "px");
    $("#blank2").css('height', hei * 0.1 + "px");
    $("#loadspace").css('top', barHeight + "px");
    if ($(window).width() < 1040) {
      $("#loadspace").css('top', barHeight + 58 + "px");
    }

  }).resize()
});