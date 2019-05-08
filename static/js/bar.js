function signUpString() {
  return (location.href = '/signup').toString();
}

function signIn() {
  return (location.href = '/signin').toString();
}

function index() {
  return (location.href = '/').toString();
}



var body = document.getElementsByTagName("body");
var need =
  " <header class='header1'><div style='margin-top:15px'><a id='sign'>海大拍賣</a><input style='width:100px;' type='text'><button disabled>搜尋</button>" +
  "<span id='bar' class='bar' style='color:white; float: right;'><a onclick= index()" +
  ">主頁面</a><a>會員中心</a><a>意見回饋</a><a>瀏覽紀錄</a><a onclick='signIn()'> 登入</a><a onclick='signUpString()'> 註冊</a></span></div></header>";

$("body").prepend(need);

var bar = document.getElementById("bar");
var wid = $(window).width();
var maxwidth = screen.width;


$(function() {
  $(window).resize(function() {
    wid = $(window).width();
    if (maxwidth < wid) maxwidth = wid;
    for (let i = 0; i < bar.children.length; i++) {
      bar.children[i].style.fontSize = (wid / maxwidth) * 100 + "%";
      // console.log(bar.children[i].style.fontSize);
    }
    if ($(window).width() < 800) {
      bar.style.width = 70 + "px";
      bar.style.color = "black";
      bar.style.marginTop = 45 + "px";
      for (let i = 0; i < bar.children.length; i++) {
        bar.children[i].style.fontSize = (wid / maxwidth) * 60 + "%";
        // console.log(bar.children[i].style.fontSize);
      }
    } else {
      bar.style.width = wid - 600;
      // console.log( bar.style.width);
      bar.style.color = "white";
      bar.style.marginTop = 0 + "px";
    }
  }).resize();
});