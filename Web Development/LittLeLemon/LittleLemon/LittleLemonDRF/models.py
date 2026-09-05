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
    compressed_image = models.ImageField(upload_to='LittleLemonFiles/CompressedImages/', default='LittleLemonFiles/CompressedImages/menuitem-placeholder.png')

    def __str__(self):
        return self.title


PLACEHOLDER = "menuitem-placeholder.png"


@receiver(post_delete, sender=MenuItem)
def delete_image_on_item_delete(sender, instance, **kwargs):
    image = instance.compressed_image

    if (
        image
        and image.name
        and image.name != PLACEHOLDER
    ):
        image.storage.delete(image.name)


@receiver(pre_save, sender=MenuItem)
def delete_old_image_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old_item = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    old_image = old_item.compressed_image
    new_image = instance.compressed_image

    if old_image.name != new_image.name:
        if (
            old_image
            and old_image.name
            and old_image.name != PLACEHOLDER
        ):
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