var page = document.getElementById("page");
var bar = document.getElementById("bar");
var body = document.getElementsByClassName("body");
var wid = $(window).width();
var hei = $(window).height();
var maxwidth = screen.width;
var count = 1;
var pageWidth;

var count = 0;
var products_length = products.length;
for (var i = 0; i < products.length; i++) {
  if (count == 5) {
    $("#row").append("<div class='col-md-1'></div><div class='col-md-1'></div>");
    count = 0;
  }
  count++;
  $("#row").append("<div class='col-md-2'><img src='" + products[i].images[i] + "' %}' class='img-thumbnail img' alt='switch'><p>switch</p></div>");
}



while ((products_length / 20) > 0) {
  $(".page ul").append("  <li class='page-item'><a class='page-link' href='#'>" + count + "</a></li>");
  products_length -= 20;
  if (products_length < 1 && count < 5) {
    $(".page ul").append("  <li class='page-item'><a class='page-link' href='#'>>></a></li>");
    pageWidth = 90 + (35 * count);
  }
  if (count >= 5) {
    $(".page ul").append("  <li class='page-item'><a class='page-link' href='#'>...</a></li>");
    $(".page ul").append("  <li class='page-item'><a class='page-link' href='#'>>></a></li>");
    pageWidth = 90 + (35 * (count + 1)); //  90 >> <<   35 數字
    break;
  }
  count++;
}



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


var need2 = "<span id='bar2'><a onclick= index()" +
  ">主頁面</a><a>會員中心</a><a>意見回饋</a><a>瀏覽紀錄</a><a onclick='signIn()'> 登入</a><a onclick='signUpString()'> 註冊</a></span>";
$("#afterBut").after(need2);