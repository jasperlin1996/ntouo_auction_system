
var page = document.getElementById("page");
var wid = $(window).width();
var hei = $(window).height();
var pageWidth;
var product_count = 0;
var goodID = "good_ID";

/*
    add history to cookie
    title 商品標題
    picUrl 圖片網址
    ID 商品ID
*/
//Add Viewing History to Cookie
function addHistory(ID) {

    
    var historyAmount = parseInt(getCookieByName("history_amount"));
    window.alert("ID:" + ID);
    console.log(historyAmount);
    if (historyAmount < 1 || historyAmount != historyAmount) {
        document.cookie = goodID + "=" + ID + ";";
        document.cookie = "history_amount=1;";
    }

    else {
        var IDs = getCookieByName(goodID);
        document.cookie = goodID + "=" + ID + "," + IDs + ";";
        document.cookie = "history_amount=" + String(historyAmount+1) + ";";
    }
    return;
}

/*
    Get History From Cookie

*/

function getHistory()
{
    
    var historyAmount = parseInt(getCookieByName("history_amount"));
    console.log(historyAmount);
    if (historyAmount < 1 || historyAmount != historyAmount)
    {
        console.log("No Viewing History");
        return;
    }
    var history_goods = getCookieByName(goodID).split(',');
    for (i = 0; i < historyAmount;i++)
    {   
        console.log(history_goods[i]);
    }    
    return history_goods;
}

function displayHistory()
{
    var historyAmount = parseInt(getCookieByName("history_amount"));
    if (historyAmount < 1 || historyAmount != historyAmount)
    {
        window.alert("Go View Something!");
        return;
    }
    
    var history = getHistory();

    $("#row").html("<div id='blank1' class='col-md-12'></div><div class='col-md-1'></div>");
    for (var i = 0; i < historyAmount; i++) {
        if (product_count == 5) {
            $("#row").append("<div class='col-md-1'></div><div class='col-md-1'></div>");
            product_count = 0;
        }
        product_count++;
        if (i == historyAmount - 1)
            $("#row").append("<div class='col-md-2'><img onload='start()' id='" + history[2][i] + "' src='" + history[1][i] + "' %}' class='img-thumbnail img' alt=" + history[0][i] + "><p>" + history[0][i] + "</p></div>");
        else
            $("#row").append("<div class='col-md-2'><img id='" + history[2][i] + "' src='" + history[1][i] + "' %}' class='img-thumbnail img' alt=" + history[0][i] + "><p>" + history[0][i] + "</p></div>");
    }
    $("#row").append("<div id='blank2' class='col-md-12'></div>");
    changeblankCSS();
}

//delete specific history cookie
function deleteHistory(number)
{
   
    var goodAmount = parseInt(getCookieByName("history_amount"));
    if(number>=goodAmount)
    {
        console.log("nothing to Delete");
        return;
    }
    var history_goods = new Array();
        history_goods = getHistory();
        history_goods.splice(number, 1);
        document.cookie = goodID + "=" + history_goods + ";";
    console.log("deleted");
    displayHistory();
}

//
function killAllHistory() 
{
    document.cookie = goodID + "=; expires=Sun, 10 Dec 1995 01:00:00 GMT";
    document.cookie = "history_amount=0;";
}

//get cookie through cookie name
function getCookieByName(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) {
            var bingan = c.substring(name.length, c.length);
            //window.alert(bingan);
            return bingan;
        }
    }
    return "";
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
$(function () {
    $(window).resize(function () {
        wid = $(window).width();
        page.style.left = (wid / 2) - (pageWidth / 2) + "px";
        changeblankCSS();

    }).resize()
});
