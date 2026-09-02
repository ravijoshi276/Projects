from rest_framework import serializers
from django.contrib.auth.models import User
from datetime import date,timedelta
from rest_framework.validators import UniqueValidator
from djoser.serializers import UserCreatePasswordRetypeSerializer,TokenSerializer,PasswordResetConfirmRetypeSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from .models import Category, MenuItem, Cart, Order, OrderItem,Table,Reservation
from django.utils.translation import gettext_lazy as _

class CategorySerializer (serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title', 'slug']


class MenuItemSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all()
    )
    image_url = serializers.URLField(required=True)
    compressed_image = serializers.ImageField(required=False)
    # category = CategorySerializer(read_only=True)
    class Meta:
        model = MenuItem
        fields = ['id', 'title', 'price', 'category', 'featured','image_url','description','compressed_image']


class CartSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        default=serializers.CurrentUserDefault()
    )
    #Removes all the default validator before adding items
    validators = [] 
    def validate(self, attrs):
        attrs['price'] = attrs['quantity'] * attrs['unit_price']
        return attrs

    class Meta:
        model = Cart
        fields = ['user', 'menuitem', 'unit_price', 'quantity', 'price']
        extra_kwargs = {
            'price': {'read_only': True},
            'user' :{'read_only': True} #This will secure front end
        }
    def create(self,validated_data):
        user = validated_data['user']
        unit_price = validated_data['unit_price']
        menuitem = validated_data['menuitem']
        quantity = validated_data['quantity']
        price = validated_data['price']


        #if quntity less than 0 immediatly removes from database 
        if quantity <=0:
            Cart.objects.filter(user=user,menuitem=menuitem).delete()
            return Cart(user=user, menuitem=menuitem, quantity=0, unit_price=unit_price, price=0.0)
        
        #Taking safe update or create
        cart_item ,created = Cart.objects.update_or_create(
            user=user,
            menuitem =menuitem,
            defaults={
                'quantity': quantity,
                'unit_price': unit_price,
                'price' : price
            }
        )
        return cart_item
        



class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['order', 'menuitem', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):

    orderitem = OrderItemSerializer(many=True, read_only=True, source='items')

    class Meta:
        model = Order
        fields = ['id', 'user', 'delivery_crew',
                  'status', 'date', 'total', 'orderitem']


class UserSerilializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email',"first_name",'last_name']

class UserCreationSerializer(UserCreatePasswordRetypeSerializer):
    re_password = serializers.CharField(style={"input_type": "password"}, write_only=True)
    class Meta(UserCreatePasswordRetypeSerializer.Meta):
        model =User
        #Adding first name ,last name and password to required field
        fields =  fields = (
            'id',
            'username',
            "email",
            'password',
            're_password', 
            'first_name',
            'last_name',
        )
    
class CustomUserSerializer(BaseUserSerializer):
    class Meta:
        model =User
        fields = ['id','username','email',"first_name",'last_name']
        read_only_fields = ['username','id']
        extra_kwargs = {
            'email': {
                'required': True,
                'validators': [
                    UniqueValidator(
                        queryset=User.objects.all(),
                        message="A user with this email already exists."
                    )
                ]
            }
        }

        def to_representation(self,instance):
            """
            Dynamically injects fallback values if names are empty strings or None.
            This alters only the outgoing JSON response, leaving the database intact.
            """
            representation = super().to_representation(instance)
            
            # Fallback for first_name
            if not representation.get('first_name'):
                representation['first_name'] = ""
                
            # Fallback for last_name (keeps it clean instead of returning null)
            if not representation.get('last_name'):
                representation['last_name'] = ""

class CustomTokenSerializer(TokenSerializer):
    groups = serializers.SlugRelatedField(read_only =True,slug_field='name',source ='user.groups',many=True)
    class Meta(TokenSerializer.Meta):
        fields = ('auth_token','groups')



class TableSeralizer(serializers.ModelSerializer):

    class Meta:
        model=Table
        fields=["id","table_number","capacity","is_active"]
        read_only_fields=["id"]


class ReservationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
            queryset=User.objects.all(),
            default=serializers.CurrentUserDefault()
        )
    class Meta:
        model = Reservation
        fields = [
            'id', 
            'user', 
            'table', 
            'customer_name', 
            'email', 
            'phone', 
            'number_of_guests', 
            'date', 
            'time_slot', 
            'status', 
            'created_at'
        ]
        # Make 'created_at' read-only so clients can't pass/manipulate it manually
        read_only_fields = ['created_at','user']

    def validate_date(self, value):
        """
        Validates that the reservation date is at least 1 day in advance.
        """
        min_allowed_date = date.today() + timedelta(days=1)
        
        if value < min_allowed_date:
            raise serializers.ValidationError(
                "Reservations must be made at least one day in advance."
            )
        
        return value


class CustomPasswordResetConfirmationRetypeSerializer(PasswordResetConfirmRetypeSerializer):
    current_password = serializers.CharField(
        style={'input_type': 'password'},
        write_only=True  # Production rule: Never expose passwords in responses
    )

    class Meta:
        fields = ('uid', 'token', 'new_password', 're_new_password', 'current_password')

    def validate(self, attrs):
        # 1. Grab fields 
        uid = attrs.get('uid')
        current_password = attrs.get('current_password')

        # 2. uid-to-user decoding 
        try:
            from djoser.utils import decode_uid
            user_id = decode_uid(uid)
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            # Production security: Raise a generic validation error 
            # to hide whether the user ID actually exists.
            raise serializers.ValidationError(
                {"non_field_errors": [_("Invalid reset link or token.")]}
            )

        # 3. Verify old password against the database record
        if not user.check_password(current_password):
            raise serializers.ValidationError(
                {"current_password": [_("The old password does not match.")]}
            )

        # 4. validate the token and update the password
        
        attrs = super().validate(attrs)
        return attrs