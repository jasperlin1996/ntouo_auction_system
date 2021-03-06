import firebase_admin
import datetime
from enum import Enum
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud.firestore_v1 import ArrayUnion, ArrayRemove

cred = credentials.Certificate('firestore_key.json')

# init firebase
firebase_admin.initialize_app(cred)

# init firestore
db = firestore.client()
user_ref = db.collection("users")
product_ref = db.collection("products")

# --- Developing --- #
# --- 2019/06/19 --- #
# Haven't Tested Yet #

def substring(product_id, product_name):
    """
        Args:
            product_id (str): The id of the product.
            product_name (str): The name of the product.
        Returns:
            res (dict): The result of all substrings generate by
                product_name and correspond to product_id.
                {
                    substring_1: [product_id],
                    substring_2: [product_id],
                    ...
                }
    """
    substrings = set()

    length = len(product_name)
    for i in range(length):
        for j in range(1, length - i + 1):
            substrings.add(product_name[i: i + j])

    # make a id list for correspond to substrings
    # list_id looks like: [[id], [id], [id], ...]
    list_id = [[product_id]] * len(substrings)

    res = dict(zip(substrings, list_id))
    return res

def addProductToSearch(product_id, product): # TODO check function name
    res = substring(product_id, product['product_name'])
    try:
        # TODO update res to firestore
        # TODO verify
        batch = db.batch()
        for k, v in res.items():
            ref = db.collection('product_search').document(k)
            batch.set(ref, {'array': ArrayUnion(v)}, merge=True)
        batch.commit()
    except Exception as e:
        raise e

# TODO add product to category for search category
def addProductToCategory(product_id, product): # TODO check function name
    try:
        ref = db.collection('category').document(product['category'])
        ref.set({product['category']: ArrayUnion([product_id])}, merge=True)
    except Exception as e:
        raise e

def searchCategory(category):
    try:
        res = []
        ref = db.collection('category').document(category)
        data = ref.get().to_dict()
        if data == None:
            data = []
        else:
            data = data[category]
        for product_id in data:
            res.append(getProductBasicInfo(getProduct(product_id)))
        return res

    except Exception as e:
        raise e

# --- Developing --- #

def addProduct(user_id, product_id, product):
    """
    Args:
        user_id (str): The id link to the user's firestore document.
        product_id (str): The id link to the product's firestore ducument.
        product (dict): A dictionary which includes all data for the
            on-selling product.
    """
    try:
        # add a product
        ref = db.collection("products").document(str(product_id))
        ref.set(product)
        addProductToSearch(product_id, product)
        addProductToCategory(product_id, product)
        linkProductToUser(user_id, product_id, list_name="onsale_items")
    except Exception as e:
        raise e


def getProductBasicInfo(product):
    """
    Args:
        product (dict): All data of the products.
    Return:
        product_basic_info (dict): Return basic info we need, including
        these elements:
            {
                'id',
                'product_name',
                'images',
                'status'
            }
    """

    if ('product_name' in product) and ('images' in product):
        product_basic_info = {
            'id': product['id'],
            'product_name': product['product_name'],
            'images': product['images'],
            'status': product['status'],
        }
        return product_basic_info
    return None

# TODO getNProductBasicInfo(n)

def getNProductsBasicInfo(n):
    try:
        ret = [ data.to_dict() for data in product_ref.order_by(
            'create_time', direction='DESCENDING').limit(n).stream()]
        ret = [ getProductBasicInfo(basic) for basic in ret]
        return ret
    except Exception as e:
        raise e

def getAllProductBasicInfo():
    """
    Return:
        products_basic_info (dict): Basic info for all products.
    """
    products_basic_info = []
    collection_ref = db.collection('products')

    for doc in collection_ref.get():

        product = getProduct(doc.id)
        basic_info = getProductBasicInfo(product)
        if basic_info != None:
            products_basic_info.append(basic_info)

    return products_basic_info


def createProductDict():
    time_format = '%Y-%m-%d %H:%M'
    product = {
        'product_name': '',
        'id': '',
        'status': 0,
        'trading_type': 0,
        'description': '',
        'trading_method': '',
        'category': '',
        'seller': '',
        'price': 0,
        'current_price': 0,
        'price_per_mark': 0,
        'highest_buyer_id': '',
        'create_time': datetime.datetime.strptime(datetime.datetime.now().strftime(time_format), time_format),
        'deadline': datetime.datetime.strptime((datetime.datetime.now() + datetime.timedelta(days = 7)).strftime(time_format), time_format),
        'images': [],
        'qas': [],
    }
    return product


def createUserDict():
    user = {
        # 'account': '',
        # 'password': '',
        'idToken': '',
        'user_name': '',
        'email': '',
        'phone': '',
        'contact': '',
        'address': '',
        'tp_info': {
            'provider': '',
            'uid': '',
        },
        'tracking_items': [],
        'bidding_items': [],
        'done_items': [],
        'onsale_items': [],
        'dealing_items': [],
        'buyer_rate': {
            'count': 0,
            'rate': 0,
        },
        'seller_rate': {
            'count': 0,
            'rate': 0,
        },
    }
    return user


def getProduct(product_id):
    """
    Args:
        product_id (str): The id of the product.
    Returns:
        product (dict): All data of the products.
    """
    ref = db.collection("products").document(product_id)
    product = ref.get().to_dict()
    return product

def createNewUser(user_id, user_data):
    try:
        ref = db.collection('users').document(user_id)
        ref.set(user_data)
    except Exception as e:
        raise e


def getUserInfo(user_id):
    try:
        ref = db.collection('users').document(user_id)
        return ref.get().to_dict()
    except Exception as e:
        raise e


def updateUserInfo(user_id, user_data):
    try:
        ref = db.collection('users').document(user_id)
        ref.update(flattenDict(user_data))
    except Exception as e:
        raise e


def checkUserInfoCompleteness(user_id):
    try:
        ref = db.collection('users').document(user_id)
        data = ref.get().to_dict()
        if (data['user_name'] is not "") and \
            (data['phone'] is not "") and \
            (data['address'] is not "") and \
            (data['contact'] is not ""):
            return True
        else:
            return False
    except Exception as e:
        return False


# --- Developing --- #
# --- 2019/06/08 --- #
# Haven't Tested Yet #
def searchProducts(string, n):
    """
    Args:
        string(str): Search string.
        n(int): Expect number of results.
    Return:
        result(list): Including **FULL** data from firestore. Ranked ascending.
    """
    ref = db.collection('product_search').document(string)
    result = []
    data = ref.get().to_dict()
    if data == None:
        data = []
    else:
        data = data['array']
    for product_id in data:
        result.append(getProductBasicInfo(getProduct(product_id)))
    return [element for element in result][:n]


def linkProductToUser(user_id, product_id, list_name="onsale_items"): # Tested
    """
    Args:
        list_name (str): Decide which list @ firestore collection
            ``users`` should ``product_id`` store at, including these
            options:
                {
                    "onsale_items",
                    "tracking_items",
                    "bidding_items",
                    "dealing_items",
                    "done_items",
                }
        user_id (str): The id link to the user's firestore document.
        product_id (str): The id link to the product's firestore document.
    """

    # link the product to user(seller)
    try:
        ref = db.collection("users").document(user_id)
        ref.update({list_name: ArrayUnion([product_id])})
    except Exception as e:
        raise e


def unlinkProductFromUser(user_id, product_id, list_name="onsale_items"): # Tested
    try:
        ref = user_ref.document(str(user_id))
        ref.update({list_name: ArrayRemove([product_id])})
    except Exception as e:
        raise e


class ArrayOps(Enum):
    ADD = 1
    DELETE = 2


def flattenDict(d, mode=ArrayOps.ADD):
    ret = {}
    try:
        for key, value in d.items():
            if type(value) is not dict:
                if value and type(value) is list:
                    value = ArrayUnion(value) if mode == ArrayOps.ADD else ArrayRemove(value)
                ret.update({key: value})
            else:
                for key_, value_ in flattenDict(value).items():
                    ret.update({str(key)+'.'+str(key_): value_})
    except Exception as e:
        pass
    return ret

def updateProduct(product_id, product, mode=ArrayOps.ADD): # Tested
    """
    Args:
        product_id (str): The id link to the product's firestore ducument.
        product (dict): A dictionary which includes all data for the
            on-selling product.
    """
    try:
        ref = db.collection("products").document(str(product_id))
        ref.update(flattenDict(product, mode))
    except Exception as e:
        raise e

def transferProductStatus(product_id, status): # Tested
    try:
        ref = product_ref.document(product_id)
        ref.update({'status': status})
    except Exception as e:
        raise e

# TODO not use yet
def deleteProduct(product_id):
    try:
        product_ref.document(str(product_id)).delete()
    except Exception as e:
        raise e

# --- Developing --- #

# --- Developing --- #
# --- 2019/06/18 --- #
# Haven't Tested Yet #

def checkProductDeadline():
    try:
        for doc in product_ref.get():
            update_product = {}
            product = getProduct(doc.id)
            status = product['status']
            deadline = datetime.datetime.strptime(product['deadline'].strftime('%Y-%m-%d %H:%M'), '%Y-%m-%d %H:%M')
            if datetime.datetime.now() >= deadline and (status == 0 or status == 1):
                if product['highest_buyer_id'] == '':
                    update_product['status'] = -1
                    unlinkProductFromUser(product['seller'], product['id'], list_name = 'onsale_items')
                else:
                    update_product['status'] = 2
                    unlinkProductFromUser(product['seller'], product['id'], list_name = 'onsale_items')
                    linkProductToUser(product['seller'], product['id'], list_name = 'dealing_items')
                    unlinkProductFromUser(product['highest_buyer_id'], product['id'], list_name = 'bidding_items')
                    linkProductToUser(product['highest_buyer_id'], product['id'], list_name = 'dealing_items')
                updateProduct(product['id'], update_product)
    except Exception as e:
        raise e

# --- Developing --- #
