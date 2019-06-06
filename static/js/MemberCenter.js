// 顯示個人資訊頁面
function person() {
    var temp = '<table><tr><td>email</td><td>' + info.email + '</td></tr>';
    temp += '<tr><td>姓名:</td><td>' + info.user_name + '</td></tr>';
    temp += '<tr><td>電話:</td><td>' + info.phone + '</td></tr>';
    temp += '<tr><td>地址:</td><td>' + info.address + '</td></tr>';
    temp += '<tr><td>其他聯絡方式:</td><td><textarea rows="5" cols="50" readonly>' + info.contact + '</textarea></td></tr>';
    temp += '<tr><td>購買評價:</td><td>' + info.buyer_rate + '</td></tr>';
    temp += '<tr><td>販賣評價:</td><td>' + info.seller_rate + '</td></tr>';
    temp += '<tr><td>第三方資訊</td><td>' + info.tp_info.provider + '</td></tr>';
    temp += '<tr><td></td><td><input type="button" onclick="change()" value="修改"></td></tr></table>';
    document.getElementById("content").innerHTML = temp;
}

function addtemp(string,items)
{
  var myfunction = "";
  if (string === "交易中") {
    myfunction = "ToTrade(this)";
  }
  else {
    myfunction = "ToProduct(this)";
  }

  temp = '<div class="container-fluid"><div class="row">';
  for (var i = 0; i < items.length; i++) {
      temp += '<div class="col-md-2"><img src="';
      temp += items[i].images[0];
      temp += '" id="' + items[i].id;
      temp += '" onclick="' + myfunction + '"><p id="' + items[i].id;
      temp += '" onclick="' + myfunction + '">';
      temp += items[i].product_name;
      temp += '</p></div>';
  }
  temp += '</div></div>';
  console.log(temp);
  return temp;
}

// 顯示追蹤中清單頁面
function likes() {
    var items = info.tracking_items;
    var temp = "";
    if (items.length == 0) {
        temp = "<p>無追蹤中商品</p>";
    }
    else {
        temp = addtemp("追蹤中",items);
    }
    document.getElementById("content").innerHTML = temp;
}

// 顯示競標中清單頁面
function buying() {
    var items = info.bidding_items;
    var temp = "";
    if (items.length == 0) {
        temp = "<p>無競標中商品</p>";
    }
    else {
      temp = addtemp("競標中",items);

    }
    document.getElementById("content").innerHTML = temp;
}

// 顯示交易中清單頁面
function dealing() {
    var items = info.dealing_items;
    var temp = "";
    if (items.length == 0) {
        temp = "<p>無交易中商品</p>";
    }
    else {
    temp = addtemp("交易中",items);

    }
    document.getElementById("content").innerHTML = temp;
}

// 顯示販賣中清單頁面
function selling() {
    var items = info.onsale_items;
    var temp = "";
    if (items.length == 0) {
        temp = "<p>無販賣中商品</p>";
    }
    else {
      temp = addtemp("販賣中",items);
    }
    document.getElementById("content").innerHTML = temp;
}

// 顯示已完成清單頁面
function finish() {
    var items = info.done_items;
    var temp = "";
    if (items.length == 0) {
        temp = "<p>無已完成商品</p>";
    }
    else {
        temp = addtemp("已完成",items);
    }
    document.getElementById("content").innerHTML = temp;
}

// 前往商品頁面
function ToProduct(obj) {
    $.ajax({
        url: "/postproductid2product/",
        type: "POST",
        async: false,
        cache: false,
        data:{"id": obj.id},
        success: function(response) {
            location.href = response;
        },
        error: function(){
            window.alert("找不到商品！");
        }
    })
}

// 前往交易頁面
function ToTrade(obj){
    $.ajax({
        url: "/postproductid2trade/",
        type: "POST",
        async: false,
        cache: false,
        data:{"id": obj.id},
        success: function(response) {
            location.href = response;
        },
        error: function(){
            window.alert("找不到商品！");
        }
    })
}

// 更改個人資訊
function change() {
    var temp = '<form method="POST" action="' + "/updateuserinfo/" + '">\n' + csrf_token + '\n<table><tr><td>email</td><td>' + info.email + '</td></tr>';
    temp += '<tr><td>*姓名:</td><td><input type="text" name="user_name" style="float:left" value="' + info.user_name + '" required></td></tr>';
    temp += '<tr><td>電話:</td><td><br><input type="tel" pattern="[0-9]{7,10}" name="phone" value="' + info.phone + '"></td></tr>';
    temp += '<tr><td>*地址:</td><td><input type="text" name="address" style="float:left" value="' + info.address + '" required></td></tr>';
    temp += '<tr><td>其他聯絡方式:</td><td><textarea rows="5" cols="50" name="contact">' + info.contact + '</textarea></td></tr>';
    temp += '<tr><td>購買評價:</td><td>' + info.buyer_rate + '</td></tr>';
    temp += '<tr><td>販賣評價:</td><td>' + info.seller_rate + '</td></tr>';
    var tp = info.tp_info;
    temp += '<tr><td>第三方資訊</td><td>' + tp.provider + '</td></tr>';
    temp += '<tr><td></td><td><input type="submit" value="送出"><input type="button" onclick="person()" value="取消"></td></tr></table></form>';
    document.getElementById("content").innerHTML = temp;

    $('#check').change(function(){
        if(document.getElementById("check").value!=document.getElementById("password").value){
            document.getElementById("error").innerHTML = '輸入與前者不符';
        }
        else {
            document.getElementById("error").innerHTML = '';
        }
    });
}

// 游標移入時更改選單背景顏色
$(function(){
    $('li').hover(function(){
        // 游標移入
        $(this).addClass('liCover');
    },function(){
        // 游標移出
        $(this).removeClass('liCover');
    });
});
