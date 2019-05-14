function signUpString() {
  return (location.href = '/signup').toString();
}

function signIn() {
  return (location.href = '/signin').toString();
}

function index() {
  return (location.href = '/').toString();
}

var isLoading = true;
var spinner = document.getElementById("loader");

function start() {
  if (isLoading) {
    spinner.setAttribute('hidden', true);
    $("#loadspace").css("display", "none");
    isLoading = false;
  }
}

var body = document.getElementsByTagName("body");
var need =
  " <header class='header1'><img style='position:absolute;width:50px;height:50px;margin-left:10px;margin-top:5px;' src='./static/img/ntoulogo.png'><div style='margin-top:15px'><a id='sign'>海大拍賣</a><input type=button value='搜尋' disabled style='font-size:15px;'><input type='text' style='width:100px;'>" +
  "<span id='bar' class='bar' style='color:white; float: right;'><a onclick= index()" +
  ">主頁面</a><a>會員中心</a><a>意見回饋</a><a>瀏覽紀錄</a><a onclick='signIn()'> 登入</a><a onclick='signUpString()'> 註冊</a></span></div></header>";

$("body").prepend(need);