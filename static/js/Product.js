window.onload = load;

function load() {
    var canChange = 0;
    var url = location.href;
    if(url.indexOf('?')==-1) {
        console.log("no product input");
    }
    else {
        var array = url.split('?');
        
        var id = array[1];
        var info = {{ get_product_info | safe }};
        if ({{ request.session.idToken }} == info.saler) {
            canChange = 1;
        }

        var str = '';
        str += '<table><tr><td>圖片:</td><td><img src="' + info.image + '"></td></tr>';
        str += '"<tr><td>名稱:</td><td>' + info.product_name + '</td></tr>';
        
        str += '<tr><td>狀態:</td><td>';
        if (info.status == 0) {
            str += '待出售';
        }
        else if (info.status == 1) {
            str += '競標中';
        }
        else if (info.status == 2) {
            str += '交易中';
        }
        else if (info.status == 3) {
            str += '已賣出';
        }
        else {
            str += '已下架';
        }

        str += '</td></tr><tr><td>直購/拍賣:</td><td>';
        if (info.type == 0) { // 拍賣
            str += '拍賣</td></tr>';
            str += '<tr><td>直購價:</td><td>' + info.price + '元</td></tr>';
            str += '<tr><td>底價:</td><td>' + info.current_price + '元</td></tr>';
            str += '<tr><td>每標底價:</td><td>' + info.price_per_mark + '元</td></tr>';
        }
        else { // 直購
            str += '直購</td><tr><tr><td>直購價:</td><td>' + info.price + '元</td></tr>';
        }

        str += '<tr><td>分類:</td><td>' + info.catagory + '</td></tr>';
        str += '<tr><td>敘述:</td><td>' + info.description + '</td></tr>';
        str += '<tr><td>賣家:</td><td>' + info.saler + '</td></tr>';
        str += '<tr><td>希望交易方式:</td><td>' + info.trading_method + '</td></tr>';
        str += '<tr><td>結標日期:</td><td>' + info.deadline + '</td></tr>';
        
        if (canChange == 1) {
            str += '<tr><td></td><td>';
            str += '<input type="button" onclick="change()" value="修改">';
        }
        else {
            str += '<tr><td></td><td>';
            str += '<input type="button" onclick="bid()" value="出價">';
            str += '<input type="button" onclick="buy()" value="直接購買">';
        }
        str += '</td></tr></table>';
        document.getElementById("content").innerHTML = str;
    }
}

function change() {
    console.log('change');
    str = '<table><tr><td>圖片:</td><td><img src="' + info.image + '"></td><td><input name="image" type="file" accept="image/jpeg, image/png"></td></tr>';
    str += '<tr><td>名稱:</td><td>' + info.product_name + '</td><td><input name="product_name" type="text"></td></tr>';
    
    str += '<tr><td>狀態:</td><td>';
    if (info.status == 0) {
        str += '待出售';
    }
    else if (info.status == 1) {
        str += '競標中';
    }
    else if (info.status == 2) {
        str += '交易中';
    }
    else if (info.status == 3) {
        str += '已賣出';
    }
    else {
        str += '已下架';
    }
    str += '</td><td></td></tr>';

    str += '<tr><td>直購/拍賣:</td><td>';
    if (info.type == 0) { // 拍賣
        str += '拍賣</td><td></td></tr>';
        str += '<tr><td>直購價:</td><td>' + info.price + '元</td><td></td></tr>';
        str += '<tr><td>底價:</td><td>' + info.current_price + '元</td><td></td></tr>';
        str += '<tr><td>每標底價:</td><td>' + info.price_per_mark + '元</td><td></td></tr>';
    }
    else { // 直購
        str += '直購</td><td></td></tr>';
        str += '<tr><td>直購價:</td><td>' + info.price + '元</td><td></td></tr>';
    }

    str += '<tr><td>分類:</td><td>' + info.catagory + '</td></tr>';
    str += '<tr><td>敘述:</td><td>' + info.description + '</td><td><input name="description" type="text"></td></tr>';
    str += '<tr><td>賣家:</td><td>' + info.saler + '</td><td></td></tr>';
    str += '<tr><td>希望交易方式:</td><td>' + info.trading_method + '</td><td><input name="trading_method" type="text"></td></tr>';
    str += '<tr><td>結標日期:</td><td>' + info.deadline + '</td><td><input name="deadline" type="date"></td></tr>';
    str += '<tr><td></td><td></td><td>';
    str += '<input type="submit" value="確認修改">';
    str += '<input type="button" onclick="load()" value="取消">';
    str += '</td></tr></table>';
    document.getElementById("content").innerHTML = str;
}

function bid() {

}

function buy() {

}