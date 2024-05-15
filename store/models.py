from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import *

class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=50, null=True)
    password = models.CharField(max_length=50, null=True)
    number = models.CharField(max_length=50, null=True)
    email = models.CharField(max_length=50, null=True)
    user_type = models.CharField(max_length=50, choices=(
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('customer', 'Dealer')
    ),null=True)
    redpoly = models.CharField(max_length=50, choices=(
        ('yes', 'Yes'),
        ('no', 'No')
    ),default='no')

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, unique=True)

    class Meta:
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name



class Product(models.Model):
    name = models.CharField(max_length=50, null=True, db_index = True)
    category = models.ForeignKey(Category, related_name='product', on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    inventory = models.IntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, blank=True, null=True)
    date_ordered = models.DateTimeField(auto_now_add=True)
    complete = models.BooleanField(default=False, null=True, blank=False)
    processed = models.BooleanField(default=False, null=True, blank=False) 
    cancellation_requested = models.BooleanField(default=False, null=True, blank=False) 
    cancellation_approved = models.BooleanField(default=False, null=True, blank=False) 
    cancellation_denied = models.BooleanField(default=False, null=True, blank=False) 
    shipping_status = models.CharField(max_length=50, choices=(
        ('pending', 'Pending'),
        ('dispatched', 'Dispatched'),
    ),default='pending')
    tid = models.CharField(max_length=200, null=True)

    def __str__(self):
        return str(self.tid)
    
    @property
    def order_items(self):
        return OrderItem.objects.filter(order=self)
 
    @property
    def get_cart_total(self):
        orderitems =  self.orderitem_set.all()
        total = sum([item.get_total for item in orderitems])
        return total
    
    @property
    def get_cart_items(self):
        orderitems =  self.orderitem_set.all()
        total_items = sum([item.quantity for item in orderitems])
        return total_items


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, blank=True, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, blank=True, null=True)
    quantity = models.IntegerField(default=0, null=True, blank=True)
    dispatched_quantity = models.PositiveIntegerField(default=0)
    date_added = models.DateTimeField(auto_now_add=True)
    urgent = models.BooleanField(default=False, null=True, blank=False) 

    @property
    def total_quantity(self):
        return self.quantity + self.dispatched_quantity


class OrderedProduct(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    pending_quantity = models.IntegerField(default=0)
    dispatched_quantity = models.IntegerField(default=0)
    date_ordered = models.DateTimeField(auto_now_add=True)
    urgent = models.BooleanField(default=False)
    status = models.CharField(max_length=50, choices=(
        ('placed', 'Placed'),
        ('cancel-requested', 'Cancellation Requested'),
        ('cancel-approved', 'Cancellation Approved'),
        ('cancel-denied', 'Cancellation Denied'),
    ),default='placed')

    @property
    def total_quantity(self):
        return self.pending_quantity + self.dispatched_quantity

    @property
    def valid(self):
            return self.pending_quantity > 0 or self.dispatched_quantity > 0
    
    def __str__(self):
        return f"{self.product.name}"

