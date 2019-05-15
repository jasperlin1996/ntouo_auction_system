import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud.firestore_v1 import ArrayUnion
import datetime

cred = credentials.Certificate('firestore_key.json')

# 初始化firebase，注意不能重複初始化
firebase_admin.initialize_app(cred)

# 初始化firestore
db = firestore.client()

def addProduct(user_id, product_id, product):
    """
    Args:
        user_id (str): The id link to the user's firestore document.
        product_id (str): The id link to the product's firestore ducument.
        product (dict): A dictionary which includes all data for the
            on-selling product.
    """
    print(product)
    print(product_id)
    try:
        # add a product
        ref = db.collection("products").document(str(product_id))
        ref.set(product) 
    except Exception as e:
        raise e

def linkProductToUser(user_id, product_id, list_name="onsale_items"):
    """
    Args:
        list_name (str): Decide which list @ firestore collection 
            ``users`` should ``product_id`` store at, including these
            options:
                {
                    "onsale_items",
                    "tracking_items",
                    "bidding_items",
                    "done_items",
                }
        user_id (str): The id link to the user's firestore document.
        product_id (str): The id link to the product's firestore docuument.
    """

    # link the product to user(seller)
    try:
        ref = db.collection("users").document(user_id)
        ref.update({list_name: ArrayUnion([product_id])})
    except Exception as e:
        raise e

# --- Developing --- #


def createProductDict():
    product = {
        'name': '',
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
        'deadline': datetime.datetime.now(),
        'images': [],
        'qas': [],
    }
    return product


def createUserDict():
    user = {
        # 'account': '',
        # 'password': '',
        'idToken': '',
        'name': '',
        'ntou_email': '',
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
        'buyer_rate': None,
        'seller_rate': None,
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
                'images'
            }
    """
    if ('product_name' in product) and ('images' in product):
        product_basic_info = {
            'id': doc.id, 'product_name': product['product_name'], 'images': product['images']}
    return product_basic_info

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
        products_basic_info.append(basic_info)

    return products_basic_info

def changeProductStatus(user_id, product_id, status):
    pass
# --- Developing --- #
