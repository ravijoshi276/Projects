from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser




class Category(models.Model):
    slug = models.SlugField()
    title = models.CharField(max_length=255, db_index=True)

    def __str__(self):
        return self.title


class MenuItem(models.Model):
    title = models.CharField(max_length=255, db_index=True)
    price = models.DecimalField(max_digits=6, decimal_places=2, db_index=True)
    featured = models.BooleanField(db_index=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    image_url = models.URLField(max_length=500,blank=True,null=True)
    description = models.TextField(blank=True,null=True)
    compressed_image = models.ImageField(upload_to='compressed_images_menupage/', default='menuitem-placeholder.png')
    def __str__(self):
        return self.title



@receiver(post_delete, sender=MenuItem)
def delete_image_on_item_delete(sender, instance, **kwargs):
    """
    Automated cleanup trigger: Runs immediately AFTER a MenuItem is deleted.
    Ensures that physical image files do not become orphaned on the storage system.
    """
    image = instance.compressed_image
    
    # Safety Check: Verify the image exists, has a valid filename, and 
    # ensures we NEVER accidentally delete the default menu placeholder asset.
    if image and image.name and image.name != 'menuitem-placeholder.png':
        
        # Uses Django's abstract storage layer. This allows the deletion logic 
        # to work locally now, and scale to AWS S3/Google Cloud later without code modifications.
        image.storage.delete(image.name)


@receiver(pre_save, sender=MenuItem)
def delete_old_image_on_change(sender, instance, **kwargs):
    """
    Automated optimization trigger: Runs immediately BEFORE a MenuItem update is saved.
    Prevents storage bloat by purging old images when a user uploads a replacement image.
    """
    # If the instance has no primary key (ID), it is a new creation. 
    # There is no historical image data to look up or delete yet.
    if not instance.pk:
        return False

    # Fetch the existing version of the object directly from the database 
    # to compare its current storage state against the incoming modifications.
    try:
        old_item = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return False

    old_image = old_item.compressed_image
    new_image = instance.compressed_image

    # Check if a new image asset has actually been uploaded to replace the old one
    if old_image != new_image:
        
        # Safety Check: Guard against empty references and shield the primary placeholder asset
        if old_image and old_image.name and old_image.name != 'menuitem-placeholder.png':
            
            # Execute cloud-safe file removal for the deprecated asset
            old_image.storage.delete(old_image.name)


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    menuitem = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.SmallIntegerField()
    unit_price = models.DecimalField(max_digits=6, decimal_places=2)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    class Meta:
        unique_together = ('menuitem', 'user')


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    delivery_crew = models.ForeignKey(
        User, on_delete=models.SET_NULL, related_name="delivery_crew", null=True)
    status = models.BooleanField(default=0, db_index=True)
    total = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    date = models.DateField(db_index=True,auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name='items')
    menuitem = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.SmallIntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2)

    class Meta:
        unique_together = ('order', 'menuitem')

class Table(models.Model):
  table_number = models.IntegerField(unique=True)
  capacity = models.IntegerField()
  is_active = models.BooleanField(default=True)

  def __str__(self):
    return f"Table #{self.table_number} (Capacity: {self.capacity})"


class Reservation(models.Model):

  class StatusChoices(models.TextChoices):
    PENDING = "Pending", "Pending"
    CONFIRMED = "Confirmed", "Confirmed"
    CANCELLED = "Cancelled", "Cancelled"

  # Corrected: SET_NULL requires null=True and blank=True
  user = models.ForeignKey(
      User, on_delete=models.SET_NULL, null=True, blank=True
  )
  table = models.ForeignKey(
      Table, on_delete=models.SET_NULL, null=True, blank=True
  )

  customer_name = models.CharField(max_length=100)
  email = models.EmailField()
  phone = models.CharField(max_length=20)
  number_of_guests = models.IntegerField()
  date = models.DateField()
  time_slot = models.CharField(
      max_length=50
  )  # e.g., "7:00 PM - 9:00 PM" or use TimeField
  status = models.CharField(
      max_length=20,
      choices=StatusChoices.choices,
      default=StatusChoices.PENDING,
  )
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return (
        f"Reservation by {self.customer_name} for {self.number_of_guests} guests"
        f" on {self.date}"
    )