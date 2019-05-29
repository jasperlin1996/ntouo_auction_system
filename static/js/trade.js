console.log(info);
$('#buyer').html(info.user_name + "(買家)");
$('#buyer-address').html("<i class='glyphicon glyphicon-map-marker'></i>" + info.address);
$('#buyer-email').html("<i class='glyphicon glyphicon-envelope'></i>" + info.email);
$('#buyer-phone').html("<i class='glyphicon glyphicon-phone'></i>" + info.phone);
$('#buyer-contact').html("<i class='glyphicon glyphicon-list-alt'></i>" + info.contact);

$('#product-name').html(product.product_name + "(商品)");
$('#product-url').attr("src", product.images[0]);
$('#product-price').html("<i class='glyphicon glyphicon-usd'></i>" + product.price);
$('#product-method').html("<i class='glyphicon glyphicon-thumbs-up'></i>" + product.trading_method);
$('#product-category').html("<i class='glyphicon glyphicon-inbox'></i>" + product.category);
if(product.status == 0)
  $('#product-status').html("<i class='glyphicon glyphicon-tag'></i>待出售");
if(product.trading_type == 0)
  $('#product-type').html("<i class='glyphicon glyphicon-tag'></i>直購");
$('#product-description').html("<i class='glyphicon glyphicon-comment'></i>" + product.description);



$('#seller').html(seller.user_name + "(賣家)");
$('#seller-address').html("<i class='glyphicon glyphicon-map-marker'></i>" + seller.address);
$('#seller-email').html("<i class='glyphicon glyphicon-envelope'></i>" + seller.email);
$('#seller-phone').html("<i class='glyphicon glyphicon-phone'></i>" + seller.phone);
$('#seller-contact').html("<i class='glyphicon glyphicon-list-alt'></i>" + seller.contact);
