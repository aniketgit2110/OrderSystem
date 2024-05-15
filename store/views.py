from pyexpat.errors import messages
from django.shortcuts import render
from django.http import JsonResponse,HttpResponse
import json
from datetime import datetime
from django.utils.timezone import localtime
from .models import *
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.contrib.sessions.models import Session
from django.contrib.auth.models import User
from django.db.models import Sum


def redirectUser(request):

    if request.user.is_authenticated:
        customer = request.user.customer
        if customer.user_type == 'admin':
            users = User.objects.all()
            context = {'users': users }
            return render(request, 'admin/manage.html', context)     

        elif customer.user_type == 'manager':
            products = Product.objects.all()
            completed_orders = Order.objects.filter(complete=True).order_by('-date_ordered')
            context = {'completed_orders': completed_orders, 'products': products}
            return render(request, 'manager/orders.html', context)        
                
        elif customer.user_type == 'customer':
            order, created = Order.objects.get_or_create(customer=customer, complete=False)
            items = order.orderitem_set.all()
            cartItems = order.get_cart_items
            context = {'cartItems':cartItems}
            return render(request, 'customer/store.html', context )
    
    else:
        items = []
        order = {'get_cart_total':0, 'get_cart_items':0, 'shipping': True}
        cartItems = order['get_cart_items']
        return render(request, 'base/login.html' )   


def adminHome(request):
    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
        cartItems = order.get_cart_items
    else:
        items = []
        order = {'get_cart_total':0, 'get_cart_items':0, 'shipping': True}
        cartItems = order['get_cart_items']   

    context = {'cartItems':cartItems }
    return render(request, 'admin/admin.html', context )

def managerHome(request):
    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
        cartItems = order.get_cart_items
    else:
        items = []
        order = {'get_cart_total':0, 'get_cart_items':0, 'shipping': True}
        cartItems = order['get_cart_items']   

    context = {'cartItems':cartItems }
    return render(request, 'home/manager.html', context )

def staffHome(request):
    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
        cartItems = order.get_cart_items
    else:
        items = []
        order = {'get_cart_total':0, 'get_cart_items':0, 'shipping': True}
        cartItems = order['get_cart_items']   

    context = {'cartItems':cartItems }
    return render(request, 'home/staff.html', context )



""" Login/Logout """

def login(request):
    return render(request, 'base/login.html' )

def logout(request):
    auth_logout(request)
    return render(request, 'home/home.html' )

def processUser(request):   
    data = json.loads(request.body)

    username = data['form']['name']
    password = data['form']['password']

    user = User.objects.get(username=username)
    customer = user.customer

    if customer.password == password:
        auth_login(request, user)
        if customer.user_type == 'admin':
            return JsonResponse('Admin', safe=False)
        elif customer.user_type == 'manager':
            return JsonResponse('Manager', safe=False)
        elif customer.user_type == 'staff':
            return JsonResponse('Staff', safe=False)
        elif customer.user_type in ('customer','customer2'):
            return JsonResponse('Customer', safe=False)
    else:
        return JsonResponse('Credentials do not match...', safe=False)




""" Manager Section """

""" Orders Page"""

def orders(request):
    products = Product.objects.all()
    if request.user.is_authenticated:
        customer = request.user.customer
        
        if customer.user_type in ('admin', 'manager'):
            customers = Customer.objects.filter(user_type='customer')
            ordered_products = OrderedProduct.objects.all().order_by('-date_ordered')
            context = {'customers': customers, 'products': products, 'ordered_products':ordered_products }
            return render(request, 'manager/orders.html', context) 
        else:
            return render(request, 'base/invalid.html')
    
    else:
        return render(request, 'base/invalid.html')
           

#Order Manipulation Functions 

def dispatchItem(request):
    data = json.loads(request.body)
    item_id = data['item_id']
    selected = int(data['selected'])

    item = OrderedProduct.objects.get(id=item_id)
    item.pending_quantity -= selected
    item.dispatched_quantity += selected
    item.save()

    custId = item.customer.id
    context={'item_id':item_id, 'cust_id':custId}
    return JsonResponse(context, safe=False)

def revertDispatch(request):
    data = json.loads(request.body)
    item_id = data['item_id']
    selected = int(data['selected'])

    item = OrderedProduct.objects.get(id=item_id)
    item.pending_quantity += selected
    item.dispatched_quantity -= selected
    item.save()

    custId = item.customer.id
    context={'item_id':item_id, 'cust_id':custId}
    return JsonResponse(context, safe=False)

def dispatchAll(request):
    data = json.loads(request.body)
    custId = data['cust_id']
    customer = Customer.objects.get(id=custId)
    items = OrderedProduct.objects.filter(customer=customer)
    for product in items:
        product.dispatched_quantity += product.pending_quantity
        product.pending_quantity = 0
        product.save()
    
    return JsonResponse({'cust_id':custId}, safe=False)

def revertAll(request):
    data = json.loads(request.body)
    custId = data['cust_id']
    customer = Customer.objects.get(id=custId)
    items = OrderedProduct.objects.filter(customer=customer)
    for product in items:
        product.pending_quantity += product.dispatched_quantity
        product.dispatched_quantity = 0
        product.save()
    
    return JsonResponse({'cust_id':custId}, safe=False)

def dispatchSingle(request):
    data = json.loads(request.body)
    itemId = data['item_id']
    product = OrderedProduct.objects.get(id=itemId)

    product.dispatched_quantity += product.pending_quantity
    product.pending_quantity = 0
    product.save()
    
    customer = product.customer
    custId = customer.id
    return JsonResponse({'cust_id':custId}, safe=False)

def revertSingle(request):
    data = json.loads(request.body)
    itemId = data['item_id']
    product = OrderedProduct.objects.get(id=itemId)

    product.pending_quantity += product.dispatched_quantity
    product.dispatched_quantity = 0
    product.save()
    
    customer = product.customer
    custId = customer.id
    return JsonResponse({'cust_id':custId}, safe=False)


def getContent(request):
    data = json.loads(request.body)
    custId = data['cust_id']

    customer = Customer.objects.get(id=custId)
    items = OrderedProduct.objects.filter(customer=customer)

    product_ids = items.values_list('product_id', flat=True)
    products = Product.objects.filter(id__in=product_ids).values('id', 'name', 'category')

    return JsonResponse({'items': list(items.values()),
                         'products': list(products.values()),
                         })




def updateStatus(request):
    data = json.loads(request.body)
    itemId = data['item_id']
    newStatus = data['new_status']
    item = OrderItem.objects.get(id=itemId)
    orderId = item.order.id
    order = Order.objects.get(id=orderId)
    order.shipping_status = newStatus
    order.save()

    return JsonResponse("Status Updated", safe=False)

def itemToOrder(request):
    data = json.loads(request.body)
    itemId = data['item_id']
    item = OrderItem.objects.get(id=itemId)
    orderId = item.order.id

    return JsonResponse({'order_id': orderId})

def mitigateInventory(request):
    data = json.loads(request.body)
    productId = data['productId']
    product = Product.objects.get(id=productId)
    inventory = product.inventory
    mitigate = int(data['mitigate'])
    selected = int(data['selected'])

    if selected == mitigate:
        mitigate = 0
        if selected == inventory:
            product.inventory = 0
            product.save()
        elif selected < inventory:
            product.inventory = (inventory - selected)
            product.save()
    elif selected < mitigate:
        mitigate = (mitigate-selected)
        if selected == inventory:
            product.inventory = 0
            product.save()
        elif selected < inventory:
            product.inventory = (inventory - selected)
            product.save()

    return JsonResponse({'mitigate':mitigate,
                         })

def productData(request):
    
    products = Product.objects.all()
    return JsonResponse({'products': list(products.values())}) 


def searchBar(request):
    query = request.GET.get('query')
    print(query)

    if query:
        products = Product.objects.filter(name__icontains=query )
    else:
        products = Product.objects.all()

    print(products) 
    return JsonResponse({'products': list(products.values())}) 




def approveCancellation(request):
    data = json.loads(request.body)
    orderId = int(data['orderId'])
    order = Order.objects.get(pk=orderId)
    order.cancellation_approved = True
    order.cancellation_denied = False
    order.cancellation_requested = False
    order.save()

    success = True
    return JsonResponse({'success': success})


def denyCancellation(request):
    data = json.loads(request.body)
    orderId = int(data['orderId'])
    order = Order.objects.get(pk=orderId)
    order.cancellation_approved = False
    order.cancellation_denied = True
    order.cancellation_requested = False
    order.save()

    success = True
    return JsonResponse({'success': success})


def revertApproval(request):
    data = json.loads(request.body)
    orderId = int(data['orderId'])
    order = Order.objects.get(pk=orderId)
    order.cancellation_approved = False
    order.cancellation_denied = False
    order.cancellation_requested = True    
    order.save()

    success = True
    return JsonResponse({'success': success})


def revertDenial(request):
    data = json.loads(request.body)
    orderId = int(data['orderId'])
    order = Order.objects.get(pk=orderId)
    order.cancellation_approved = False
    order.cancellation_denied = False
    order.cancellation_requested = True
    order.save()

    success = True
    return JsonResponse({'success': success})


def dateFilter(request):
    data = json.loads(request.body)
    date = data['date']
    custIds = data['customer_ids']

    date_object = datetime.strptime(date, '%d-%m-%Y').date()
    start_date = datetime.combine(date_object, datetime.min.time())
    end_date = datetime.combine(date_object, datetime.max.time())

    # Now filter your queryset based on the date range
    filtered_ordered_products = OrderedProduct.objects.filter(
        date_ordered__date__gte=start_date, 
        date_ordered__date__lte=end_date,
        customer__id__in=custIds
    )

    return JsonResponse({'products': list(filtered_ordered_products.values('id'))})


""" Inventory Page """

def inventory(request):
    if request.user.is_authenticated:
        customer = request.user.customer
        
        if customer.user_type == 'manager':
            hd = Category.objects.get(name='HD')
            ss = Category.objects.get(name='Smart Silk')
            mtr800 = Category.objects.get(name='800 Mtr')
            rp = Category.objects.get(name='Red Poly')
            hd_products = Product.objects.filter(category = hd)
            ss_products = Product.objects.filter(category = ss)
            mtr800_products = Product.objects.filter(category = mtr800)
            rp_products = Product.objects.filter(category = rp)

            context = {
            'hd_products': hd_products, 'ss_products': ss_products, 
            'mtr800_products': mtr800_products, 'rp_products': rp_products,
            }
            return render(request, 'manager/inventory.html', context) 
        else:
            return render(request, 'base/invalid.html')
    
    else:
        return render(request, 'base/invalid.html')


def addInventory(request):
    data = json.loads(request.body)
    productId = data['id']
    newInventory = data['inventory']
    product = Product.objects.get(id=productId)
    product.inventory=newInventory
    product.save()

    return JsonResponse("Added Inventory.",safe=False)




""" Customer Views Section  """

""" Store Page """

def store(request):
    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
        
        cartItems = order.get_cart_items
    else:
        items = []
        order = {'get_cart_total':0, 'get_cart_items':0, 'shipping': True}
        cartItems = order['get_cart_items']  

    hd = Category.objects.get(name='HD')
    ss = Category.objects.get(name='Smart Silk')
    mtr800 = Category.objects.get(name='800 Mtr')
    rp = Category.objects.get(name='Red Poly')
    hd_products = Product.objects.filter(category = hd)
    ss_products = Product.objects.filter(category = ss)
    mtr800_products = Product.objects.filter(category = mtr800)
    rp_products = Product.objects.filter(category = rp)
    
    has_red_poly_products = any(item.product.category.name == 'Red Poly' for item in items)
    red_poly_dealer = request.user.customer.redpoly

    context = {
        'items':items, 'order':order, 'cartItems':cartItems, 
        'hd_products': hd_products, 'ss_products': ss_products, 
        'mtr800_products': mtr800_products, 'rp_products': rp_products,
        'has_red_poly_products': has_red_poly_products, 
        'red_poly_dealer': red_poly_dealer,
        }
    return render(request, 'customer/store.html', context )

""" Order Functions """

def submitOrder(request):
    transaction_id =  datetime.datetime.now().timestamp()
    data = json.loads(request.body)

    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        order.transaction_id = transaction_id
        order.complete = True
        order.save()
        orderId = order.id
        return JsonResponse({'orderId': orderId}, safe=False) 
    else:
        print('User is not Logged in.')
        return JsonResponse('Order Placed Successfully.', safe=False) 

       


def addItem(request):
    data = json.loads(request.body)
    productId = data['productId']
    action = data['action']

    print('Action :', action)
    print('Product ID :', productId)

    customer =  request.user.customer
    product = Product.objects.get(id=productId)
    order, created = Order.objects.get_or_create(customer=customer, complete=False)

    orderItem, created = OrderItem.objects.get_or_create(order=order, product=product)

    if action == 'add':
        orderItem.quantity = (orderItem.quantity + 4)
    elif action == 'remove':
        orderItem.quantity = (orderItem.quantity - 4)
    
    orderItem.save()

    if action == 'delete':
        orderItem.delete()
    
    items = order.orderitem_set.all().values()
    product_ids = items.values_list('product_id', flat=True)
    products = Product.objects.filter(id__in=product_ids).values('id', 'name', 'category')

    return JsonResponse({'items': list(items.values()),
                         'products': list(products.values()) })


def addItemCustom(request):
    data = json.loads(request.body)
    productId = data['productId']
    quantity = data['quantity']
    addQuant = int(quantity)

    customer =  request.user.customer
    order, created = Order.objects.get_or_create(customer=customer, complete=False)
    product = Product.objects.get(id=productId)

    orderItem, created = OrderItem.objects.get_or_create(order=order, product=product)
    
    orderItem.quantity = (orderItem.quantity + addQuant )  
    orderItem.save()
    
    items = order.orderitem_set.all().values()
    product_ids = items.values_list('product_id', flat=True)
    products = Product.objects.filter(id__in=product_ids).values('id', 'name', 'category')

    return JsonResponse({'items': list(items.values()),
                         'products': list(products.values())})


def updateItem(request):
    data = json.loads(request.body)
    productId = data['productId']
    newQuantity = data['quantity']

    customer =  request.user.customer
    product = Product.objects.get(id=productId)
    order, created = Order.objects.get_or_create(customer=customer, complete=False)

    orderItem, created = OrderItem.objects.get_or_create(order=order, product=product)

    if orderItem.quantity != newQuantity:
        orderItem.quantity = newQuantity
    elif newQuantity <= 0:
        orderItem.delete()

    orderItem.save()

    subtotal = orderItem.product.price * int(orderItem.quantity)
    grandtotal = order.get_cart_total
    totalquantity = order.get_cart_items

    print('Product ID :', productId, ', Quantity :', newQuantity, ', Subtotal:', subtotal)
    print('new grandtotal:', grandtotal)
    print('total quantity:', totalquantity)

    context = {
        'productId': productId,
        'subtotal': subtotal,
        'grandtotal': grandtotal,
        'totalquantity': totalquantity
    }
    
    return JsonResponse(context, safe=False)


def setUrgent(request):
    if request.user.is_authenticated:
        data = json.loads(request.body)
        urgent = data['is_urgent']
        itemId = data['item_id']

        orderItem = OrderItem.objects.get(id=itemId)
        orderItem.urgent = urgent
        orderItem.save()

        if urgent == True:
            return JsonResponse('OrderItem set to Urgent.',safe=False)
        elif urgent == False:
            return JsonResponse('OrderItem set to Normal.',safe=False)

    else:
        return JsonResponse('User not logged in.',safe=False)

def checkRedPoly(request):
    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
        has_red_poly_products = any(item.product.category.name == 'Red Poly' for item in items)
    
    if has_red_poly_products == True:
        return JsonResponse('True', safe=False)
    elif has_red_poly_products == False:
        return JsonResponse('False', safe=False)
    
def dealerRedPoly(request):
    if request.user.is_authenticated:
        red_poly_dealer = request.user.customer.redpoly
    
    if red_poly_dealer == 'yes':
        return JsonResponse('True', safe=False)
    elif red_poly_dealer == 'no':
        return JsonResponse('False', safe=False)

""" HD """

def searchHd(request):
    query = request.GET.get('query')
    print(query)
    hd = Category.objects.get(name='HD')

    if query:
        products = Product.objects.filter(category=hd, name__icontains=query )
    else:
        products = Product.objects.filter(category=hd)

    return JsonResponse({'products': list(products.values())})


""" Smart Silk """

def searchSs(request):
    query = request.GET.get('query')
    print(query)
    ss = Category.objects.get(name='Smart Silk')

    if query:
        if query == 'all':
            products = Product.objects.filter(category=ss)
        else:
            products = Product.objects.filter(category=ss, name__startswith=query )
    else:
        products = Product.objects.filter(category=ss)

    print(products)
    return JsonResponse({'products': list(products.values())})


""" 800 Mtr """

def searchMtr(request):
    query = request.GET.get('query')
    print(query)
    mtr800 = Category.objects.get(name='800 Mtr')

    if query:
        products = Product.objects.filter(category=mtr800, name__icontains=query )
    else:
        products = Product.objects.filter(category=mtr800)

    return JsonResponse({'products': list(products.values())})


""" Red Poly """

def searchRp(request):
    query = request.GET.get('query')
    print(query)
    rp = Category.objects.get(name='Red Poly')

    if query:
        products = Product.objects.filter(category=rp, name__icontains=query )
    else:
        products = Product.objects.filter(category=rp)

    return JsonResponse({'products': list(products.values())})

def updateOrderedProduct(request):
    customer = request.user.customer
    data = json.loads(request.body)
    orderId = int(data['orderId'])
    order = Order.objects.get(pk=orderId)
    order_items = OrderItem.objects.filter(order=order)
    for item in order_items:
        ordered_product, created = OrderedProduct.objects.get_or_create(customer=customer,product=item.product,date_ordered=order.date_ordered.date())
        ordered_product.pending_quantity += item.quantity
        if item.urgent:
                    ordered_product.urgent = True

        ordered_product.save()

    return JsonResponse('Added Ordered Products.',safe=False)

""" Placed Order Summaries """

def myOrders(request):

    if request.user.is_authenticated:
        customer = request.user.customer
        completed_orders = Order.objects.filter(customer=customer, complete=True).order_by('-date_ordered')
        categories = ['HD', 'Smart Silk', '800 Mtr', 'Red Poly']
        ordered_products = OrderedProduct.objects.filter(customer=customer).order_by('date_ordered')
        context = {'completed_orders': completed_orders, 'categories': categories, 'ordered_products': ordered_products} 
    else:
        completed_orders = []
        context = {'completed_orders': completed_orders}

    
    return render(request, 'customer/myorders.html', context)


def requestCancellation(request):
    data = json.loads(request.body)
    itemId = int(data['itemId'])
    orderedProduct = OrderedProduct.objects.get(pk=itemId)
    if orderedProduct.status == 'placed':
        orderedProduct.status = 'cancel-requested'
        orderedProduct.save()

    success = True
    return JsonResponse({'success': success})

def revertCancellation(request):
    data = json.loads(request.body)
    itemId = int(data['itemId'])
    orderedProduct = OrderedProduct.objects.get(pk=itemId)
    if orderedProduct.status == 'cancel-requested':
        orderedProduct.status = 'placed'
        orderedProduct.save()

    success = True
    return JsonResponse({'success': success})

def setUrgentProduct(request):
    if request.user.is_authenticated:
        data = json.loads(request.body)
        urgent = data['is_urgent']
        itemId = data['item_id']

        orderedProduct = OrderedProduct.objects.get(id=itemId)
        orderedProduct.urgent = urgent
        orderedProduct.save()

        if urgent == True:
            return JsonResponse('Ordered Product set to Urgent.',safe=False)
        elif urgent == False:
            return JsonResponse('Ordered Product set to Normal.',safe=False)



""" Admin Section """

"""Manage Users Page"""

def manage(request):

    if request.user.is_authenticated:
        customer = request.user.customer
        
        if customer.user_type == 'admin':
            users = User.objects.all()
            context = {'users': users }
            return render(request, 'admin/manage.html', context) 
        else:
            return render(request, 'base/invalid.html')
    
    else:
        return render(request, 'base/invalid.html')

def updateUserRole(request):
    data = json.loads(request.body)
    username = data['username']
    role = data['role']
    redpoly = data['redpoly']

    user = User.objects.get(username=username)
    customer = user.customer
    customer.user_type = role
    customer.redpoly = redpoly

    customer.save()

    return JsonResponse('User Roles Updated.', safe=False)

def updateUsername(request):
    data = json.loads(request.body)
    username = data['username']
    newUsername = data['new_username']

    user = User.objects.get(username=username)
    user.username = newUsername
    user.save()

    return JsonResponse('Username Updated.', safe=False)

def updateUserPassword(request):
    data = json.loads(request.body)
    username = data['username']
    currentPassword = data['current_pass']
    newPassword = data['new_pass']

    user = User.objects.get(username=username)
    customer = user.customer
    customer.password = newPassword
    customer.save()

    return JsonResponse('Password Updated.', safe=False)

def updateUserData(request):
    data = json.loads(request.body)
    username = data['username']
    newUsername = data['new_username']
    currentPassword = data['current_pass']
    newPassword = data['new_pass']

    user = User.objects.get(username=username)
    user.username = newUsername
    customer = user.customer
    customer.password = newPassword

    user.save()
    customer.save()

    return JsonResponse('User Updated.', safe=False)

""" Logout event after updating user details 

def logoutUser(request):
    data = json.loads(request.body)
    username = data['username']
    user = User.objects.get(username=username)
    print(user)

    return JsonResponse('User Logged Out.', safe=False) """



"""Admin Order Management Page"""

def adminOrders(request):
    products = Product.objects.all()
    if request.user.is_authenticated:
        customer = request.user.customer
        
        if customer.user_type in 'admin':
            customers = Customer.objects.filter(user_type='customer')
            ordered_products = OrderedProduct.objects.all()
            context = {'customers': customers, 'products': products, 'ordered_products':ordered_products }
            return render(request, 'admin/orders.html', context) 
        else:
            return render(request, 'base/invalid.html')
    
    else:
        return render(request, 'base/invalid.html')
    

"""Admin Inventory Management Page"""

def adminInventory(request):
    if request.user.is_authenticated:
        customer = request.user.customer
        
        if customer.user_type == 'admin':
            hd = Category.objects.get(name='HD')
            ss = Category.objects.get(name='Smart Silk')
            mtr800 = Category.objects.get(name='800 Mtr')
            rp = Category.objects.get(name='Red Poly')
            hd_products = Product.objects.filter(category = hd)
            ss_products = Product.objects.filter(category = ss)
            mtr800_products = Product.objects.filter(category = mtr800)
            rp_products = Product.objects.filter(category = rp)

            context = {
            'hd_products': hd_products, 'ss_products': ss_products, 
            'mtr800_products': mtr800_products, 'rp_products': rp_products,
            }
            return render(request, 'admin/inventory.html', context) 
        else:
            return render(request, 'base/invalid.html')

    else:
        return render(request, 'base/invalid.html')
    


"""Misc"""


def profile(request):

    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()

        cartItems = order.get_cart_items
    else:
        items = []
        order = {'get_cart_total':0, 'get_cart_items':0, 'shipping': True}
        cartItems = order['get_cart_items']   

    context = {'cartItems':cartItems }
    return render(request, 'base/profile.html', context)