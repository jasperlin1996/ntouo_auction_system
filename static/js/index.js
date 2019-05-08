var page = document.getElementById("page");
var bar = document.getElementById("bar");
var body = document.getElementsByClassName("body");
var wid = $(window).width();
var hei = $(window).height();
var maxwidth = screen.width;
var products = 150;
var count = 1;
var pageWidth;

for (let i = 0; i < bar.children.length; i++) {
  bar.children[i].style.fontSize = (wid / maxwidth) * 100 + "%";
  // console.log(bar.children[i].style.fontSize);
}

// console.log(page);
// console.log(wid);
// page.style.left = (wid / 2) - 300 + "px";

while ((products / 20) > 0) {
  $(".page ul").append("  <li class='page-item'><a class='page-link' href='#'>" + count + "</a></li>");
  products -= 20;
  if (products < 1 && count < 5) {
    $(".page ul").append("  <li class='page-item'><a class='page-link' href='#'>>></a></li>");
    pageWidth = 90 + (35 * count);
    // console.log(pageWidth);
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
    page.style.left = (wid / 2) - (pageWidth / 2) + "px";

    var barHeight = $(".header1").height();
    $(".pos-f-t").css('top', barHeight + 'px');
    $("#bar2").css('margin-left', 55 + "px");
    $("#blank").css('height', hei * 0.1 + "px");

  }).resize()
});


var need2 = "<span id='bar2' style='position:absolute; color:white; float:left;'><a onclick= index()" +
  ">主頁面</a><a>會員中心</a><a>意見回饋</a><a>瀏覽紀錄</a><a onclick='signIn()'> 登入</a><a onclick='signUpString()'> 註冊</a></span>";
$("#afterBut").after(need2);