from django.urls import path
from . import views

urlpatterns = [
    #Login-Logout
    path('',views.redirectUser, name="home"),
    path('login/',views.login, name="login"),
    path('process_user/',views.processUser, name="process_user"),
    path('logout/',views.logout, name="logout"),

    #Dealer Section
    path('store/',views.store, name="store"),
  
    path('update_item/',views.updateItem, name="update_item"),
    path('add_item/',views.addItem, name="add+item"),
    path('add_item_custom/',views.addItemCustom, name="add_item_custom"),
    path('submit_order/',views.submitOrder, name="submit_order"),
    path('set_urgent/',views.setUrgent, name="set_urgent"),
    path('update_ordered_product/',views.updateOrderedProduct, name="update_ordered_product"),
    path('check_red_poly/',views.checkRedPoly, name="check_red_poly"),
    path('dealer_red_poly/',views.dealerRedPoly, name="dealer_red_poly"),

    path('search-hd/', views.searchHd, name='search_hd'),
    path('search-ss/', views.searchSs, name='search_ss'),
    path('search-mtr/', views.searchMtr, name='search_mtr'),
    path('search-rp/', views.searchRp, name='search_rp'),

    path('myorders/',views.myOrders, name="myOrders"),
    path('request_cancellation/',views.requestCancellation, name="request_cancellation"),
    path('revert_cancellation/',views.revertCancellation, name="revert_cancellation"),
    path('set_urgent_product/',views.setUrgentProduct, name="set_urgent_product"),


    #Manager Section
    path('orders/',views.orders, name="orders"),    
    path('dispatch_item/',views.dispatchItem, name="dispatch_item"),
    path('revert_dispatch/',views.revertDispatch, name="revert_dispatch"),
    path('dispatch_single/',views.dispatchSingle, name="dispatch_single"),
    path('revert_single/',views.revertSingle, name="revert_single"),
    path('dispatch_all/',views.dispatchAll, name="dispatch_all"),
    path('revert_all/',views.revertAll, name="revert_all"),
    path('get_content/',views.getContent, name="get_content"),
    path('update_order_status/',views.updateStatus, name="update_order_status"),
    path('item_to_order_id/',views.itemToOrder, name="item_to_order_id"),
    path('mitigate_inventory/',views.mitigateInventory, name="mitigate_inventory"),
    path('product_data/',views.productData, name="product_data"),
    path('search_bar/',views.searchBar, name="search_bar"),

    path('date_filter/',views.dateFilter, name="date_filter"),

    path('approve_cancellation/',views.approveCancellation, name="approve_cancellation"),
    path('revert_approval/',views.revertApproval, name="revert_approval"),
    path('deny_cancellation/',views.denyCancellation, name="deny_cancellation"),
    path('revert_denial/',views.revertDenial, name="revert_denial"),


    path('inventory/',views.inventory, name="inventory"), 
    path('add_inventory/',views.addInventory, name="add_Inventory"), 


    #Admin Section
    path('home/admin/',views.adminHome, name="admin_home"),

    path('home/admin/manage/',views.manage, name="manage"),
    path('update_user_role/',views.updateUserRole, name="update_user_role"),
    path('update_username/',views.updateUsername, name="update_username"),
    path('update_password/',views.updateUserPassword, name="update_password"),
    path('update_user_data/',views.updateUserData, name="update_user_data"),

    path('home/admin/orders/',views.adminOrders, name="admin_orders"), 
    path('home/admin/inventory/',views.adminInventory, name="admin_inventory"), 

    #Miscellaneous
    
    path('home/manager/',views.managerHome, name="manager_home"),
    path('home/staff/',views.staffHome, name="staff_home"),

    path('profile/',views.profile, name="profile"),




]