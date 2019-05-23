import sys
import django
import datetime
import pyrebase
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

def index(request):
    products = firestore_ops.getAllProductBasicInfo()
    return render(request, 'index.html', {'products': products})

def signIn(request):
    return render(request, 'SignIn.html')

def preSignUp(request):
    return render(request, 'pre-SignUp.html')

def signUp(request):
    return render(request, 'SignUp.html')

def postSignUp(request):
    user_id = _getUserId(request.session['idToken'])

    user_info = firestore_ops.createUserDict()
    user_info['name'] = request.POST['name']
    user_info['phone'] = request.POST['phone']
    user_info['address'] = request.POST['address']
    user_info['contact'] = request.POST['contact']

    firestore_ops.createNewUser(user_id, user_info)

    return HttpResponse('create new user success')

def trade(request):
    return render(request,'Trade.html')

def memberCenter(request):
    if request.session['idToken'] == '':
        return redirect(signIn)
    user_id = _getUserId(request.session['idToken'])
    user_info = firestore_ops.getUserInfo(user_id)
    return render(request, 'MemberCenter.html', {'user': user_info})

def updateUserInfo(request):
    user_id = _getUserId(request.session['idToken'])

    user_data = firestore_ops.createUserDict()
    user_data['name'] = request.POST['user_name']
    user_data['phone'] = request.POST['phone']
    user_data['address'] = request.POST['address']
    user_data['contact'] = request.POST['contact']

    firestore_ops.updateUserInfo(user_id, user_data)

    return redirect(memberCenter)

def toSell(request):
    return render(request, 'ToSell.html')

def postToSell(request):
    user_id = _getUserId(request.session['idToken'])

    product = firestore_ops.createProductDict()
    # TODO read image
    product['name'] = request.POST['product_name']
    product['trading_type'] = request.POST['trading_type']
    product['price'] = request.POST['price']
    product['current_price'] = request.POST['current_price']
    product['price_per_mark'] = request.POST['price_per_mark']
    product['category'] = request.POST['category']
    product['description'] = request.POST['description']
    product['trading_method'] = request.POST['trading_method']
    product['deadline'] = request.POST['deadline']

    s = ('').join(product.values()) + str(datetime.datetime.now())
    product_id = hash(s)
    if product_id < 0:
        product_id += sys.maxsize

    try:
        firestore_ops.addProduct(user_id, product_id, product)
    except Exception as e:
        print(e)

    return redirect(toSell)

def signOut(request):
    request.session['idToken'] = ''
    django.contrib.auth.logout(request)
    return redirect(index)

@csrf_exempt
def getIdToken(request):
    if 'idToken' not in request.session:
        request.session['idToken'] = ''
    return HttpResponse(request.session['idToken'])

@csrf_exempt
def getUserName(request):
    name = ''
    if 'idToken' in request.session and request.session['idToken'] != '':
        user_id = _getUserId(request.session['idToken'])
        name = firestore_ops.getUserInfo(user_id)['name']
    return HttpResponse(name)

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
    user_id = _getUserId(request.session['idToken'])
    isUserFillAll = firestore_ops.checkUserInfoCompleteness(user_id)
    return HttpResponse(str(isUserFillAll))
