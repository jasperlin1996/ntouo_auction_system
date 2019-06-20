from . import firestore_ops

def checkProductDeadline():
    try:
        firestore_ops.checkProductDeadline()
    except Exception as e:
        print(e)