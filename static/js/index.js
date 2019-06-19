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
var currentPage = 1;


//小bar分類表
$("#afterBut").prop("disabled",false);

//產生頁碼
  while ((products_length / 20) > 0)
  {
      $(".page ul").append("  <li id='page" + pagecount + "' class='page-item'><a class='page-link' onclick='GetProducts(" + pagecount + ")'>" + pagecount + "</a></li>");
      products_length -= 20;
      if (products_length < 1 && pagecount < 5)
       {
          $(".page ul").append("  <li class='page-item'><a onclick='nextPage()' class='page-link' >>></a></li>");
          pageWidth = 90 + (35 * pagecount);
       }
      if (pagecount >= 5)
      {
          $(".page ul").append("  <li class='page-item'><a class='page-link' href='#'>...</a></li>");
          $(".page ul").append("  <li class='page-item'><a class='page-link' href='#'>>></a></li>");
          pageWidth = 90 + (35 * (pagecount + 1)); //  90 >> <<   35 數字
          break;
      }
      pagecount++;
  }
pagecount--; //最後多加的扣掉

GetProducts(1);

//更換頁面
function GetProducts(index) {
  //  loading
  $("#loader").show();
  $("#loadspace").css("display", "block");
  isLoading = true;
  //  換頁
  var pageString = "page" + index;
  var previousPageString = "page" + currentPage;
  var numOfProduct;
  product_count = 0;
  //頁碼顏色
  document.getElementById(previousPageString).classList.remove("active");
  document.getElementById(pageString).classList.add("active");
  currentPage = index;

  //填寫資料
  //判斷商品數量
  if ((products.length - (index - 1) * 20) >= 20)
    numOfProduct = 20;
  else
    numOfProduct = products.length - (index - 1) * 20;

  //逐一填入商品
  $("#row").html("<div id='blank1' class='col-md-12'></div><div class='col-md-1'></div>");
  for (var i = ((index - 1) * 20); i < ((index - 1) * 20 + numOfProduct); i++) {
    if (product_count == 5) {
      $("#row").append("<div class='col-md-1'></div><div class='col-md-1'></div>");
      product_count = 0;
    }
    product_count++;
    if (i == ((index - 1) * 20 + numOfProduct) - 1)
      $("#row").append("<div class='col-md-2'><img onload='start()' id='"+ products[i].id + "' src='" + products[i].images[0] + "' %}' class='img-thumbnail img' alt=" + products[i].product_name + "><p>" + products[i].product_name + "</p></div>");
    else
      $("#row").append("<div class='col-md-2'><img id='"+ products[i].id +"' src='" + products[i].images[0] + "' %}' class='img-thumbnail img' alt=" + products[i].product_name + "><p>" + products[i].product_name + "</p></div>");
  }
  $("#row").append("<div id='blank2' class='col-md-12'></div>");
  //重設blank
  changeblankCSS();

  //按下商品post
  $('.col-md-2').on('mousedown',function()
  {
    var myproductid = $(this).children()[0].id;
    //window.alert("title:" + mytitle);
    addHistory(myproductid);
    $.ajax(
    {
      url:"/postproductid2product/",
      type:'POST',
      data:{'id':myproductid},
      cache:false,
      async:false,
      success:function(response)
      {
        location.href = response;
      }
    });
  });

}

// >>的函式
function nextPage() {

  if (currentPage != pagecount)
    GetProducts(currentPage + 1);
}

// <<的函式
function previousPage() {
  if (currentPage != 1)
    GetProducts(currentPage - 1);
}

//換新頁面blank 的 css
function changeblankCSS() {
  if ($(window).width() > 768) {
    $("#blank1").css('height', hei * 0.1 + "px");
    $("#blank2").css('height', hei * 0.1 + "px");
  } else {
    $("#blank1").css('height', hei * 0.15 + "px");
    $("#blank2").css('height', hei * 0.15 + "px");
  }
}

//變更視窗大小時
$(function() {
  $(window).resize(function() {
    wid = $(window).width();
    page.style.left = (wid / 2) - (pageWidth / 2) + "px";
    changeblankCSS();

  }).resize()
});
