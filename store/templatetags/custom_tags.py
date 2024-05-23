from django import template
from store.models import Customer
register = template.Library()

@register.simple_tag
def update_current_date(current_date, new_date):
    return new_date


@register.filter
def get_by_id(customers, customer_id):
    try:
        return customers.get(id=customer_id)
    except Customer.DoesNotExist:
        return None