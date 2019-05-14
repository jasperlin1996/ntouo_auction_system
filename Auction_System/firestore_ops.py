import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud.firestore_v1 import ArrayUnion

cred = credentials.Certificate('../firestore_key.json')

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
        product_id (str): The id link to the product's firestore ducument.
    """

    # link the product to user(seller)
    try:
        ref = db.collection("users").document(user_id)
        ref.update({list_name: ArrayUnion([product_id])})
    except Exception as e:
        raise e

def getProductBasicInfo():
    products_basic_info = []
    collection_ref = db.collection('products')

    for doc in collection_ref.get():
        ref = collection_ref.document(doc.id)
        product = ref.get().to_dict()
        if ('product_name' in product) and ('images' in product):
            products_basic_info.append({'id': doc.id, 'product_name': product['product_name'], 'images': product['images']})
    return products_basic_info