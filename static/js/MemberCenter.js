var word = 0;

// 顯示個人資訊頁面
function person() {
    var temp = '<table><tr><td>海大email</td><td>' + {{ ntou_email }} + '</td></tr>';
    temp += '<tr><td>密碼:</td><td id="pass">********<input type="button" onclick="showPassword()" value="查看"></td></tr>';
    temp += '<tr><td>姓名:</td><td>' + {{ user_name }} + '</td></tr>';
    temp += '<tr><td>電話:</td><td>' + {{ phone }} + '</td></tr>';
    temp += '<tr><td>地址:</td><td>' + {{ address }} + '</td></tr>';
    temp += '<tr><td>其他聯絡方式:</td><td><textarea rows="5" cols="50" readonly>' + {{ contact }} + '</textarea></td></tr>';
    temp += '<tr><td>購買評價:</td><td>' + {{ buyer_rate }} + '</td></tr>';
    temp += '<tr><td>販賣評價:</td><td>' + {{ seller_rate }} + '</td></tr>';
    temp += '<tr><td>第三方資訊</td><td>';
    // 第三方資訊顯示
    temp += '</td></tr>';
    temp += '<tr><td></td><td><input type="button" onclick="change()" value="修改"></td></tr></table>';
    document.getElementById("content").innerHTML = temp;
}

// 顯示追蹤中清單頁面
function likes() {
    var items = {{ tracking_items | safe }};
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
            temp += '">'; + items[i].product_name;
            temp += '</a></td></tr>';
        }
        temp += '</table>';
    }
    document.getElementById("content").innerHTML = temp;
}

// 顯示競標中清單頁面
function buying() {
    var items = {{ bidding_items | safe }};
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
            temp += '</a></td></tr>';
        }
        temp += '</table>';
    }
    document.getElementById("content").innerHTML = temp;
}

// 顯示交易中清單頁面
function dealing() {
    var items = {{ dealing_items | safe }};
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
            temp += '</a></td></tr>';
        }
        temp += '</table>';
    }
    document.getElementById("content").innerHTML = temp;
}

// 顯示販賣中清單頁面
function selling() {
    var items = {{ onsale_items | safe }};
    var temp = "";
    if (items.length == 0) {
        temp = "<p>無販賣中商品</p>";
    }
    else {
        temp = '<table id="obj">';
        for (var i = 0; i < items.length; i++) {
            temp += '<tr><td><a href="';
            temp += '../templates/Product.html?' + item[i].id;
            temp += '"><img src="';
            temp += items[i].image;
            temp += '"></a></td><td><a href="';
            temp += '../templates/Product.html?' + item[i].id
            temp += '">' + items[i].product_name;
            temp += '</a></td></tr>';
        }
        temp += '</table>';
    }
    document.getElementById("content").innerHTML = temp;
}

// 顯示已完成清單頁面
function finish() {
    var items = {{ done_items | safe }};
    var temp = "";
    if (items.length == 0) {
        temp = "<p>無已完成商品</p>";
    }
    else {
        temp = '<table id="obj">';
        for (var i = 0; i < items.length; i++) {
            temp += '<tr><td><a href="';
            temp += '../templates/Product.html?' + item[i].id
            temp += '"><img src="';
            temp += items[i].image;
            temp += '"></a></td><td><a href="';
            temp += '../templates/Product.html?' + item[i].id;
            temp += '">' + items[i].product_name;
            temp += '</a></td></tr>';
        }
        temp += '</table>';
    }
    document.getElementById("content").innerHTML = temp;
}

// 顯示密碼
function showPassword() {
    document.getElementById("pass").innerHTML = {{ password | safe }} + '<input type="button" onclick="hidePassword()" value="隱藏">';
}

// 隱藏密碼
function hidePassword() {
    document.getElementById("pass").innerHTML = '********<input type="button" onclick="showPassword()" value="查看">'
}

// 更改個人資訊
function change() {
    var temp = '<table><tr><td>海大email</td><td>' + {{ ntou_email | safe }} + '</td></tr>';
    temp += '<tr><td>密碼:</td><td>輸入新密碼<input name="password" type="password"></td></tr>';
    temp += '<tr><td>姓名:</td><td><textarea rows="1" cols="30" name="user_name">' + {{ user_name | safe }} + '</textarea></td></tr>';
    temp += '<tr><td>海大email</td><td>' + {{ ntou_email | safe }} + '</td></tr>';
    temp += '<tr><td>電話:</td><td><textarea rows="1" cols="30" name="phone">' + {{ phone | safe }} + '</textarea></td></tr>';
    temp += '<tr><td>地址:</td><td><textarea rows="1" cols="30" name="address">' + {{ address | safe }} + '</textarea></td></tr>';
    temp += '<tr><td>其他聯絡方式:</td><td><textarea rows="5" cols="50" name="contact">' + {{ contact | safe }} + '</textarea></td></tr>';
    temp += '<tr><td>購買評價:</td><td>' + {{ buyer_rate | safe }} + '</td></tr>';
    temp += '<tr><td>販賣評價:</td><td>' + {{ seller_rate | safe }} + '</td></tr>';
    var tp = {{ tp_info }};
    temp += '<tr><td>第三方資訊</td><td>' + tp.provider + '</td></tr>';
    temp += '<tr><td></td><td><input type="submit" value="送出"><input type="button" onclick="person()" value="取消"></td></tr></table>';
    document.getElementById("content").innerHTML = temp;
}