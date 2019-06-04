import os
import sys
import django
import datetime
import pyrebase
from django.http import JsonResponse
from django.shortcuts import render, redirect, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from . import firestore_ops

config = {
    "apiKey": "AIzaSyCF_Q4YD_W7FWb40pDU-NHW0ooYsnJWDUM",
    "authDomain": "auction-system-73960.firebaseapp.com",
    "databaseURL": "https://auction-system-73960.firebaseio.com",
    "projectId": "auction-system-73960",
    "storageBucket": "auction-system-73960.appspot.com",
    "messagingSenderId": "650872511305",
    "appId": "1:650872511305:web:8afe3f2f1c33b4f6"
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
storage = firebase.storage()

def _getUserId(idToken):
    user = auth.get_account_info(idToken)
    user_id = user['users'][0]['localId']
    return user_id

def _checkIdToken(request):
    '''
        Returns:
            (bool): check whether idToken exist
                exist => True
                doesn't exist => False
    '''
    try:
        idToken = request.session['idToken']
        user = auth.get_account_info(idToken)
        return True
    except:
        request.session['idToken'] = ''
    return False

def _imageSaveAndUpload(filename, image, idToken):
    path = '../.tmp/'
    with open(os.path.join(path, filename), 'wb+') as file:
        for chunk in image.chunks():
            file.write(chunk)
    storage.child(filename).put(os.path.join(path, filename), idToken)
    return storage.child(filename).get_url(idToken)

def _hashProduct(product):
    '''
        Args:
            product (dict): product info
        Returns:
            product_id (str): if product info isn't False, concat with str type and hash
    '''
    s = ''.join(map(lambda x: str(x) if x else '', product.values()))
    product_id = hash(s)
    if product_id < 0:
        product_id += sys.maxsize
    return str(product_id)

def _datetime2FrontendFormat(time):
    '''
        Args:
            time (datetime): %Y-%m-%d %H:%M:%S (yyyy-mm-dd HH:MM:SS)
        Returns:
            (str): %Y-%m-%dT%H:%M (yyyy-mm-ddTHH:MM)
    '''
    return 'T'.join(str(time.strftime('%Y-%m-%d %H:%M')).split())

def _frontendFormat2Datetime(time):
    '''
        Args:
            time (str): %Y-%m-%dT%H:%M (yyyy-mm-ddTHH:MM)
        Returns:
            (datetime): %Y-%m-%d %H:%M (yyyy-mm-dd HH:MM)
    '''
    return datetime.datetime.strptime(' '.join(time.split('T')), '%Y-%m-%d %H:%M')

def _parseItems(items):
    """
        Args:
            items (list): items in user database
                element: {
                    id
                }
                possible items: {
                    tracking_items,
                    bidding_items,
                    dealing_items,
                    done_items,
                    onsale_items
                }
        Returns:
            items (list): items in user database
                element: {
                    product_name,
                    id,
                    images
                }
                images (list): contains product images' url
    """
    for i in range(len(items)):
        product = firestore_ops.getProduct(items[i])
        items[i] = {
            'product_name': product['product_name'],
            'id': product['id'],
            'images': product['images']
        }
    return items

def index(request):
    products = firestore_ops.getAllProductBasicInfo()
    return render(request, 'index.html', {'products': products})

def signIn(request):
    if _checkIdToken(request):
        return redirect(index)
    return render(request, 'SignIn.html')

def preSignUp(request):
    if _checkIdToken(request):
        return redirect(index)
    return render(request, 'pre-SignUp.html')

def signUp(request):
    if not _checkIdToken(request):
        return redirect(signIn)
    return render(request, 'SignUp.html')

def postSignUp(request):
    if not _checkIdToken(request):
        return redirect(signIn)

    idToken  = request.session['idToken']
    user_id = _getUserId(idToken)

    user_info = firestore_ops.createUserDict()

    user_info['user_name'] = request.POST['user_name']
    user_info['phone'] = request.POST['phone']
    user_info['address'] = request.POST['address']
    user_info['contact'] = request.POST['contact']
    user_info['email'] = request.POST['email']
    user_info['tp_info']['provider'] = request.POST['provider']
    user_info['tp_info']['uid'] = request.POST['uid']
    user_info['idToken'] = idToken

    firestore_ops.createNewUser(user_id, user_info)

    return HttpResponse('create new user success')

def trade(request, product_id):
    if not _checkIdToken(request):
        return redirect(signIn)

    product = firestore_ops.getProduct(product_id)

    product['create_time'] = _datetime2FrontendFormat(product['create_time'])
    product['deadline'] = _datetime2FrontendFormat(product['deadline'])

    user_id = _getUserId(request.session['idToken'])
    user_info = firestore_ops.getUserInfo(user_id)

    seller_id = product['seller']
    seller_info = firestore_ops.getUserInfo(seller_id)

    return render(request,'Trade.html', {'user': user_info, 'seller': seller_info, 'product': product})

def memberCenter(request):
    if not _checkIdToken(request):
        return redirect(signIn)

    user_id = _getUserId(request.session['idToken'])
    user_info = firestore_ops.getUserInfo(user_id)
    print(user_info)
    user_info['tracking_items'] = _parseItems(user_info['tracking_items'])
    user_info['bidding_items'] = _parseItems(user_info['bidding_items'])
    user_info['dealing_items'] = _parseItems(user_info['dealing_items'])
    user_info['done_items'] = _parseItems(user_info['done_items'])
    user_info['onsale_items'] = _parseItems(user_info['onsale_items'])
    return render(request, 'MemberCenter.html', {'user': user_info})

def updateUserInfo(request):
    if not _checkIdToken(request):
        return redirect(signIn)

    user_id = _getUserId(request.session['idToken'])

    user_data = firestore_ops.createUserDict()
    user_data['user_name'] = request.POST['user_name']
    user_data['phone'] = request.POST['phone']
    user_data['address'] = request.POST['address']
    user_data['contact'] = request.POST['contact']

    firestore_ops.updateUserInfo(user_id, user_data)

    return redirect(memberCenter)

def toSell(request):
    if not _checkIdToken(request):
        return redirect(signIn)

    return render(request, 'ToSell.html')

def postToSell(request): # TODO update onsale_items
    if not _checkIdToken(request):
        return redirect(signIn)

    product = firestore_ops.createProductDict()

    user_id = _getUserId(request.session['idToken'])

    product['product_name'] = request.POST['product_name']
    product['category'] = request.POST['category']
    product['trading_type'] = int(request.POST['trading_type'])
    product['price'] = request.POST['price']
    product['current_price'] = request.POST['current_price']
    product['price_per_mark'] = request.POST['price_per_mark']
    product['description'] = request.POST['description']
    product['trading_method'] = request.POST['trading_method']
    product['deadline'] = _frontendFormat2Datetime(request.POST['deadline'])
    product['seller'] = user_id
    product['id'] = _hashProduct(product)

    image = request.FILES['image']
    filename = product['id'] + '_' + str(len(product['images'])) + '.' + image.name.split('.')[-1]
    image_url = _imageSaveAndUpload(filename, image, request.session['idToken'])

    product['images'].append(image_url)

    try:
        firestore_ops.addProduct(user_id, product['id'], product)
        user = firestore_ops.getUserInfo(user_id)
        user['onsale_items'].append(product['id'])
        firestore_ops.updateUserInfo(user_id, user)
    except Exception as e:
        print(e)

    return redirect(toSell)

def signOut(request):
    request.session['idToken'] = ''
    django.contrib.auth.logout(request)
    return render(request, 'SignOut.html')

@csrf_exempt
def postProductId2Product(request):
    product_id = request.POST['id']
    # TODO redirect to Product.html
    return HttpResponse(product_id)

@csrf_exempt
def getIdToken(request):
    if 'idToken' not in request.session:
        request.session['idToken'] = ''
    return HttpResponse(request.session['idToken'])

@csrf_exempt
def getUserName(request):
    user_name = ''
    if _checkIdToken(request):
        user_id = _getUserId(request.session['idToken'])
        user_name = firestore_ops.getUserInfo(user_id)['user_name']
    return HttpResponse(user_name)

@csrf_exempt
def getCategory(request):
    category = ['3C', '家具', '運動', '服飾', '娛樂', '精品', '交通工具', '生活用品', '食品', '書籍', '鞋子', '音樂', '電玩', '動漫', '其他']
    return HttpResponse(','.join(category))

@csrf_exempt
def setSession(request):
    idToken = request.POST['idToken']
    request.session['idToken'] = idToken
    return HttpResponse('set session successful')

@csrf_exempt
def checkUserData(request):
    isUserFillAll = False
    if _checkIdToken(request):
        user_id = _getUserId(request.session['idToken'])
        isUserFillAll = firestore_ops.checkUserInfoCompleteness(user_id)
    return HttpResponse(isUserFillAll) # TODO return json
