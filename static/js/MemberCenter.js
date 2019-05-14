var word = 0;

// 顯示個人資訊頁面
function person() {
    var temp = "<table><tr><td>帳號:</td><td>";
    temp += '123456'; // {{ account }};
    temp += '</td></tr><tr><td>密碼:</td><td id="pass">********<input type="button" onclick="showPassword()" value="查看"></td></tr><tr><td>姓名:</td><td>';
    temp += '王金魚'; // {{ user_name }};
    temp += '</td></tr><tr><td>海大email</td><td>';
    temp += '123546@ntou'; // {{ ntou_email }};
    temp += '</td></tr><tr><td>電話:</td><td>';
    temp += '031659'; // {{ phone }};
    temp += '</td></tr><tr><td>地址:</td><td>';
    temp += '基隆市中正區北寧路2號'; // {{ address }};
    temp += '</td></tr><tr><td>其他聯絡方式:</td><td><textarea rows="5" cols="50" readonly>';
    temp += 'line:165461'; // {{ contact }};
    temp += '</textarea></td></tr><tr><td>購買評價:</td><td>';
    temp += '2.5'; // {{ buyer_rate }};
    temp += '</td></tr><tr><td>販賣評價:</td><td>';
    temp += '4.5'; // {{ seller_rate }};
    temp += '</td></tr><tr><td>第三方資訊</td><td>';
    // 第三方資訊顯示
    temp += '</td></tr><tr><td></td><td><input type="button" onclick="change()" value="修改"></td></tr></table>';
    document.getElementById("content").innerHTML = temp;
}

// 顯示追蹤中清單頁面
function likes() {
    //var items = {{ tracking_items | safe }};
    var temp = "";
    /*if (items.length == 0) {
        temp = "<p>無追蹤中商品</p>";
    }
    else {*/
        temp = '<table id="obj">';
        for (var i = 0; i < 10/*items.length*/; i++) {
            temp += '<tr><td><a href="';
            temp += '../templates/Product.html?'; //+ item[i].id
            temp += '"><img src="';
            temp += '../static/img/cantFind.png';  // items[i].image;
            temp += '"></a></td><td><a href="';
            temp += '../templates/Product.html?'; //+ item[i].id
            temp += '">找不到商品';  // items[i].product_name;
            temp += '</td></a></tr>';
        }
        temp += '</table>';
    //}
    document.getElementById("content").innerHTML = temp;
}

// 顯示競標中清單頁面
function buying() {
    //var items = {{ bidding_items | safe }};
    var temp = "";
    /*if (items.length == 0) {
        temp = "<p>無競標中商品</p>";
    }
    else {*/
        temp = '<table id="obj">';
        for (var i = 0; i < 2/*items.length*/; i++) {
            temp += '<tr><td><a href="';
            temp += '../templates/Product.html?'; //+ item[i].id
            temp += '"><img src="';
            temp += '../static/img/cantFind.png';  // items[i].image;
            temp += '"></a></td><td><a href="';
            temp += '../templates/Product.html?'; //+ item[i].id
            temp += '">找不到商品';  // items[i].product_name;
            temp += '</td></a></tr>';
        }
        temp += '</table>';
    //}
    document.getElementById("content").innerHTML = temp;
}

// 顯示交易中清單頁面
function dealing() {
    //var items = {{ dealing_items | safe }};
    var temp = "";
    /*if (items.length == 0) {
        temp = "<p>無交易中商品</p>";
    }*/
    //else {
        temp = '<table id="obj">';
        for (var i = 0; i < 2/*items.length*/; i++) {
            temp += '<tr><td><a href="';
            temp += '../templates/Product.html?'; //+ item[i].id
            temp += '"><img src="';
            temp += '../static/img/cantFind.png';  // items[i].image;
            temp += '"></a></td><td><a href="';
            temp += '../templates/Product.html?'; //+ item[i].id
            temp += '">找不到商品';  // items[i].product_name;
            temp += '</td></a></tr>';
        }
        temp += '</table>';
    //}
    document.getElementById("content").innerHTML = temp;
}

// 顯示販賣中清單頁面
function selling() {
    //var items = {{ onsale_items | safe }};
    var temp = "";
    /*if (items.length == 0) {
        temp = "<p>無販賣中商品</p>";
    }*/
    //else {
        temp = '<table id="obj">';
        for (var i = 0; i < 2/*items.length*/; i++) {
            temp += '<tr><td><a href="';
            temp += '../templates/Product.html?&'; //+ item[i].id
            temp += '"><img src="';
            temp += '../static/img/cantFind.png';  // items[i].image;
            temp += '"></a></td><td><a href="';
            temp += '../templates/Product.html?&'; //+ item[i].id
            temp += '">找不到商品';  // items[i].product_name;
            temp += '</td></a></tr>';
        }
        temp += '</table>';
    //}
    document.getElementById("content").innerHTML = temp;
}

// 顯示已完成清單頁面
function finish() {
    //var items = {{ done_items | safe }};
    var temp = "";
    /*if (items.length == 0) {
        temp = "<p>無已完成商品</p>";
    }*/
    //else {
        temp = '<table id="obj">';
        for (var i = 0; i < 2/*items.length*/; i++) {
            temp += '<tr><td><a href="';
            temp += '../templates/Product.html?'; //+ item[i].id
            temp += '"><img src="';
            temp += '../static/img/cantFind.png';  // items[i].image;
            temp += '"></a></td><td><a href="';
            temp += '../templates/Product.html?'; //+ item[i].id
            temp += '">找不到商品';  // items[i].product_name;
            temp += '</td></a></tr>';
        }
        temp += '</table>';
    //}
    document.getElementById("content").innerHTML = temp;
}

// 顯示密碼
function showPassword() {
    document.getElementById("pass").innerHTML = /* {{ password | safe }} + */'<input type="button" onclick="hidePassword()" value="隱藏">';
}

// 隱藏密碼
function hidePassword() {
    document.getElementById("pass").innerHTML = '********<input type="button" onclick="showPassword()" value="查看">'
}

// 更改個人資訊
function change() {
    var temp = "<table><tr><td>帳號:</td><td>";
    temp += '123456'; // {{ account | safe }};
    temp += '</td></tr><tr><td>密碼:</td><td id="pass">********<input type="button" onclick="showPassword()" value="查看"></td></tr><tr><td>姓名:</td><td>';
    temp += '<textarea rows="1" cols="30" id="user_name">王金魚</textarea>'; // {{ user_name | safe }};
    temp += '</td></tr><tr><td>海大email</td><td>';
    temp += '123546@ntou'; // {{ ntou_email | safe }};
    temp += '</td></tr><tr><td>電話:</td><td>';
    temp += '<textarea rows="1" cols="30" id="phone">031659</textarea>'; // {{ phone | safe }};
    temp += '</td></tr><tr><td>地址:</td><td>';
    temp += '<textarea rows="1" cols="30" id="address">基隆市中正區北寧路2號</textarea>'; // {{ address | safe }};
    temp += '</td></tr><tr><td>其他聯絡方式:</td><td><textarea rows="5" cols="50">';
    temp += 'line:165461'; // {{ contact | safe }};
    temp += '</textarea></td></tr><tr><td>購買評價:</td><td>';
    temp += '2.5'; // {{ buyer_rate | safe }};
    temp += '</td></tr><tr><td>販賣評價:</td><td>';
    temp += '4.5'; // {{ seller_rate | safe }};
    temp += '</td></tr><tr><td>第三方資訊</td><td>';
    // 第三方資訊顯示
    temp += '</td></tr><tr><td></td><td><input type="submit" value="送出"><input type="button" onclick="person()" value="取消"></td></tr></table>';
    document.getElementById("content").innerHTML = temp;
}

