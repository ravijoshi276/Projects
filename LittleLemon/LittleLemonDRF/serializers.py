from rest_framework import serializers
from django.contrib.auth.models import User
from decimal import Decimal
from djoser.serializers import UserCreatePasswordRetypeSerializer,TokenSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from .models import Category, MenuItem, Cart, Order, OrderItem


class CategorySerializer (serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title', 'slug']


class MenuItemSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all()
    )
    # category = CategorySerializer(read_only=True)
    class Meta:
        model = MenuItem
        fields = ['id', 'title', 'price', 'category', 'featured']


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

    orderitem = OrderItemSerializer(many=True, read_only=True, source='order')

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