// 顯示個人資訊頁面
function person() {
    var temp = '<table><tr><td>海大email</td><td>' + info.ntou_email + '</td></tr>';
    temp += '<tr><td>密碼:</td><td id="pass">********<input type="button" onclick="showPassword()" value="查看"></td></tr>';
    temp += '<tr><td>姓名:</td><td>' + info.name + '</td></tr>';
    temp += '<tr><td>電話:</td><td>' + info.phone + '</td></tr>';
    temp += '<tr><td>地址:</td><td>' + info.address + '</td></tr>';
    temp += '<tr><td>其他聯絡方式:</td><td><textarea rows="5" cols="50" readonly>' + info.contact + '</textarea></td></tr>';
    temp += '<tr><td>購買評價:</td><td>' + info.buyer_rate + '</td></tr>';
    temp += '<tr><td>販賣評價:</td><td>' + info.seller_rate + '</td></tr>';
    temp += '<tr><td>第三方資訊</td><td>' + info.tp_info + '</td></tr>';
    temp += '<tr><td></td><td><input type="button" onclick="change()" value="修改"></td></tr></table>';
    document.getElementById("content").innerHTML = temp;
}

// 顯示追蹤中清單頁面
function likes() {
    var items = info.tracking_items;
    var temp = "";
    if (items.length == 0) {
        temp = "<p>無追蹤中商品</p>";
    }
    else {
        temp = '<table id="obj">';
        for (var i = 0; i < items.length; i++) {
            temp += '<tr><td><a href="';
            temp += '../templates/Product.html?' + item[i].id;
            temp += '"><img src="';
            temp += items[i].image;
            temp += '"></a></td><td><a href="';
            temp += '../templates/Product.html?' + item[i].id;
            temp += '">' + items[i].product_name;
            temp += '</td></a></tr>';
        }
        temp += '</table>';
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
        temp = '<table id="obj">';
        for (var i = 0; i < items.length; i++) {
            temp += '<tr><td><a href="';
            temp += '../templates/Product.html?' + item[i].id;
            temp += '"><img src="';
            temp += items[i].image;
            temp += '"></a></td><td><a href="';
            temp += '../templates/Product.html?' + item[i].id;
            temp += '">' + items[i].product_name;
            temp += '</td></a></tr>';
        }
        temp += '</table>';
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
        temp = '<table id="obj">';
        for (var i = 0; i < items.length; i++) {
            temp += '<tr><td><a href="';
            temp += '../templates/Product.html?' + item[i].id;
            temp += '"><img src="';
            temp += items[i].image;
            temp += '"></a></td><td><a href="';
            temp += '../templates/Product.html?' + item[i].id;
            temp += '">' + items[i].product_name;
            temp += '</td></a></tr>';
        }
        temp += '</table>';
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
        temp = '<table id="obj">';
        for (var i = 0; i < items.length; i++) {
            temp += '<tr><td><a href="';
            temp += '../templates/Product.html?&' + item[i].id;
            temp += '"><img src="';
            temp += items[i].image;
            temp += '"></a></td><td><a href="';
            temp += '../templates/Product.html?&' + item[i].id;
            temp += '">' + items[i].product_name;
            temp += '</td></a></tr>';
        }
        temp += '</table>';
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
        temp = '<table id="obj">';
        for (var i = 0; i < items.length; i++) {
            temp += '<tr><td><a href="';
            temp += '../templates/Product.html?' + item[i].id;
            temp += '"><img src="';
            temp += items[i].image;
            temp += '"></a></td><td><a href="';
            temp += '../templates/Product.html?' + item[i].id;
            temp += '">' + items[i].product_name;
            temp += '</td></a></tr>';
        }
        temp += '</table>';
    }
    document.getElementById("content").innerHTML = temp;
}

// 顯示密碼
function showPassword() {
    document.getElementById("pass").innerHTML = info.password + '<input type="button" onclick="hidePassword()" value="隱藏">';
}

// 隱藏密碼
function hidePassword() {
    document.getElementById("pass").innerHTML = '********<input type="button" onclick="showPassword()" value="查看">'
}

// 更改個人資訊
function change() {
    var temp = '<form method="POST" action="' + "/updateuserinfo/" + '" onsubmit="return checkForm()">\n' + csrf_token + '\n<table><tr><td>海大email</td><td>' + info.ntou_email + '</td></tr>';
    temp += '<tr><td>*密碼:</td><td>'/*輸入新密碼<input type="password" id="password" name="password" value="'*/ + info.password + /*'" required><br>確認密碼<input type="password" id="check" required><p id="error"></p>*/'</td></tr>';
    temp += '<tr><td>*姓名:</td><td><input type="text" name="user_name" style="float:left" value="' + info.name + '" required></td></tr>';
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

function checkForm() {
    /*if(document.getElementById("check").value!=document.getElementById("password").value) {
        alert("輸入密碼兩者不同!");
        return false;
    }
    else {
        return true;
    }*/
    return true;
}