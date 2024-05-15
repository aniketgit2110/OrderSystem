import csv
from django.core.management.base import BaseCommand
from store.models import Product, Category

class Command(BaseCommand):
    help = 'Imports shades from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('filename', type=str, help='The CSV file to import shades from')

    def handle(self, *args, **kwargs):
        filename = kwargs['filename']
        with open(filename, 'r') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                # Extract data from CSV row
                name = row[0]
                category = row[1]
                description = row[2]
                inventory = int(row[3])

                # Get or create category
                category, created = Category.objects.get_or_create(name=category)

                # Create Product object and save it
                product = Product(name=name, category=category, description=description, inventory=inventory)
                product.save()

        self.stdout.write(self.style.SUCCESS('Shades imported successfully'))
