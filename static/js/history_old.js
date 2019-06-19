
var page = document.getElementById("page");
var wid = $(window).width();
var hei = $(window).height();
var pageWidth;
var product_count = 0;
const cookieName = ["good_title", "good_pic", "good_ID"];




/*
    add history to cookie
    title 商品標題
    picUrl 圖片網址
    ID 商品ID
*/
//Add Viewing History to Cookie
function addHistory(title, picUrl, ID) {

    var historyAmount = parseInt(getCookieByName("history_amount"));
    window.alert("title:" + title);
    window.alert("pic" + picUrl);
    window.alert("ID:" + ID);
    console.log(historyAmount);
    if (historyAmount < 1 || historyAmount != historyAmount) {
        document.cookie = "good_title=" + title + ";";
        document.cookie = "good_pic=" + picUrl + ";";
        document.cookie = "good_ID=" + ID + ";";
        document.cookie = "history_amount=1;";
    }
    else {
        var titles = getCookieByName("good_title");
        var pics = getCookieByName("good_pic");
        var IDs = getCookieByName("good_ID");

        document.cookie = "good_title=" + title + "," + titles + ";";
        document.cookie = "good_pic=" + picUrl + "," + pics + ";";
        document.cookie = "good_ID=" + ID + "," + IDs + ";";
        document.cookie = "history_amount=" + String(historyAmount + 1) + ";";
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
    if (historyAmount<1)
    {
        console.log("No Viewing History");
        return;
    }
    var history_goods = new Array(3);
    
    
    
    for (i = 0; i < 3;i++)
    {   
        history_goods[i] = new Array();
        history_goods[i] = getCookieByName(cookieName[i]).split(',');
        for (j = 0; j < historyAmount;j++)
        {
            console.log(history_goods[i][j]);
        }    
    }    
    return history_goods;
}

function displayHistory()
{
    var history_amount = parseInt(getCookieByName("history_amount"));
    if(history_amount<1)
    {
        window.alert("Go View Something!");
        return;
    }
    var history = getHistory();
    
    $("#row").html("<div id='blank1' class='col-md-12'></div><div class='col-md-1'></div>");
    for (var i = 0; i < history_amount; i++) {
        if (product_count == 5) {
            $("#row").append("<div class='col-md-1'></div><div class='col-md-1'></div>");
            product_count = 0;
        }
        product_count++;
        if (i == history_amount - 1)
            $("#row").append("<div class='col-md-2'><img onload='start()' id='" + history[2][i] + "' src='" + history[1][i] + "' %}' class='img-thumbnail img' alt=" + history[0][i] + "><p>" + history[0][i] + "</p></div>");
        else
            $("#row").append("<div class='col-md-2'><img id='" + history[2][i] + "' src='" + history[1][i] + "' %}' class='img-thumbnail img' alt=" + history[0][i] + "><p>" + history[0][i] + "</p></div>");
    }
    $("#row").append("<div id='blank2' class='col-md-12'></div>");
    changeblankCSS();
}

function deleteHistory(number)
{
    var goodAmount = parseInt(getCookieByName("history_amount"));
    if(number>=goodAmount)
    {
        console.log("nothing to Delete");
        return;
    }
    var history_goods = getHistory();
    for(i=0;i<3;i++)
    {
        history_goods[i].splice(number, 1);
        document.cookie = cookieName[i] + "=" + history_goods[i] + ";";
    }
    document.cookie = "history_amount=" + String(goodAmount-1) + ";";
    console.log("deleted");
    displayHistory();
}

function killAllHistory() 
{
    document.cookie = "good_title=; expires=Sun, 10 Dec 1995 01:00:00 GMT";
    document.cookie = "good_pic=; expires=Sun, 10 Dec 1995 01:00:00 GMT";
    document.cookie = "good_ID=; expires=Sun, 10 Dec 1995 01:00:00 GMT";
    document.cookie = "history_amount=0;";
}

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
        $("#blank1").css('height', hei * 0.001 + "px");
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
