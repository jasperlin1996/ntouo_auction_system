window.onload = load;

function load() {
    var canChange = 0;
    var url = location.href;
    if(url.indexOf('?')==-1) {
        console.log("no product input");
    }
    else {
        var array = url.split('?');
        if (array.indexOf('&')!=-1) {
            canChange = 1;
        }
        var id = array[1];
        //var info = {% 'get-product-info' %};

        var str = '';
        str += '<table><tr><td>圖片:</td><td><img src="';
        str += '../static/img/cantFind.png' // info.image
        str += '"></td></tr><tr><td>名稱:</td><td>';
        str += '找不到商品'; // info.product_name;
        str += '</td></tr><td>狀態:</td><td>';
        /*
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
        */
        str += '</td></tr><tr><td>直購/拍賣:</td><td>';
        /*if (info.type == 0) { // 拍賣
            str += '拍賣</td></tr><tr><td>直購價:</td><td>';
            str += info.price;
            str += '元</td></tr><tr><td>底價:</td><td>';
            str += info.current_price;
            str += '元</td></tr><tr><td>每標底價:</td><td>';
            str += info.price_per_mark;
        }*/
        str += '拍賣</td></tr><tr><td>直購價:</td><td>1000元</td></tr>';
        str += '<tr><td>底價:</td><td>1000元</td></tr>';
        str += '<tr><td>每標底價:</td><td>1000元</td></tr>';
        /*else { // 直購
            str += '直購</td><tr><tr><td>直購價:</td><td>';
            str += info.price;
            str += '元</td></tr><tr><td>底價:</td><td>';
            str += '元</td></tr><tr><td>每標底價:</td><td>';
        }*/
        str += '<tr><td>分類:</td><td>';
        str += 'one'; // info.catagory;
        str += '</td></tr><tr><td>敘述:</td><td>';
        str += '124879684gj'; // info.description;
        str += '</td></tr><tr><td>希望交易方式:</td><td>';
        str += '..............'; // info.trading_method
        str += '</td></tr><tr><td>結標日期:</td><td>';
        str += '1999年12月31日'; // info.deadline
        if (canChange == 1) {
            str += '</td></tr><tr><td></td><td>';
            str += '<input type="button" onclick="change()" value="修改">';
            str += '<input type="button" onclick="obtained()" value="下架">';
        }
        else {
            str += '</td></tr><tr><td></td><td>';
            str += '<input type="button" onclick="bid()" value="出價">';
            str += '<input type="button" onclick="buy()" value="直接購買">';
        }
        str += '</td></tr></table>';
        document.getElementById("content").innerHTML = str;
    }
}

function change() {
    console.log('change');
    str = '<table><tr><td>圖片:</td><td><img src="';
    str += '../static/img/cantFind.png"' // info.image
    str += '></td><td><input id="image" type="file" accept="image/jpeg, image/png"';
    str += '"></td></tr><tr><td>名稱:</td><td>';
    str += '找不到商品'; // info.product_name;
    str += '</td><td><input id="product_name" type="text">'
    str += '</td></tr><tr><td>直購/拍賣:</td><td>';
    /*if (info.type == 0) { // 拍賣
        str += '拍賣</td><td>';
        str += '<input id="sell" type="radio" name="buuStyle"/>直購';
        str += '<input id="sale" type="radio" name="buyStyle" checked="true"/>拍賣';
        str += '</td></tr><tr><td>直購價:</td><td>';
        str += info.price;
        str += '元</td></tr><tr><td>底價:</td><td>';
        str += info.current_price;
        str += '元</td></tr><tr><td>每標底價:</td><td>';
        str += info.price_per_mark;
    }*/
    str += '拍賣</td><td>';
    str += '<input id="sell" type="radio" name="buuStyle"/>直購';
    str += '<input id="sale" type="radio" name="buyStyle" checked="true"/>拍賣';
    str += '</td></tr><tr><td>直購價:</td><td>1000元</td>';
    str += '<td><input id="price" type="text"></td></tr>';
    str += '<tr><td>底價:</td><td>1000元</td>';
    str += '<td><input id="current_price" type="text"></td></tr>';
    str += '<tr><td>每標底價:</td><td>1000元</td>';
    str += '<td><input id="price_per_mark" type="text></td></tr>';
    /*else { // 直購
        str += '直購</td><td>';
        str += '<input id="sell" type="radio" name="buuStyle" checked="true"/>直購';
        str += '<input id="sale" type="radio" name="buyStyle"/>拍賣';
        str += '</td><tr><tr><td>直購價:</td><td>';
        str += info.price;
        str += '元</td></tr><tr><td>底價:</td><td>';
        str += '元</td></tr><tr><td>每標底價:</td><td>';
    }*/
    str += '<tr><td>分類:</td><td>';
    str += 'one'; // info.catagory;
    str += '</td></tr><tr><td>敘述:</td><td>';
    str += '124879684gj'; // info.description;
    str += '</td>';
    str += '<td><input id="description" type="text"></td></tr><tr><td>希望交易方式:</td><td>';
    str += '..............'; // info.trading_method
    str += '</td><td><input id="trading_method" type="text"></td>';
    str += '</tr><tr><td>結標日期:</td><td>';
    str += '1999年12月31日'; // info.deadline
    str += '</td><td><input id="deadline" type="date"></td>';
    str += '</tr><tr><td></td><td>';
    str += '<input type="submit" onclick="send()" value="確認修改">';
    str += '<input type="button" onclick="load()" value="取消">';
    str += '</td></tr></table>';
    document.getElementById("content").innerHTML = str;
}

function bid() {

}

function buy() {

}

function send() {

}

function obtained() {

}