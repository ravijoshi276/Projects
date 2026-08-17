from django.urls import path
from . import views

urlpatterns = [
    path('categories', views.CategoriesView.as_view()),
    path('menu-items', views.MenuItemsView.as_view()),
    path('menu-items/<int:pk>', views.SingleMenuItemView.as_view()),
    path('cart/menu-items', views.CartView.as_view()),
    path('orders', views.OrderView.as_view()),
    path('orders/<int:pk>', views.SingleOrderView.as_view()),
    path('groups/manager/users', views.GroupViewSet.as_view(
        {'get': 'list', 'post': 'create', 'delete': 'destroy'})),

    path('groups/delivery-crew/users', views.DeliveryCrewViewSet.as_view(
        {'get': 'list', 'post': 'create', 'delete': 'destroy'})),
    path("reservations",views.ReservationsView.as_view(),name='reservations'),
    path("tables",views.TablesView().as_view(),name='tables'),
    path("tables/<int:pk>/",views.TableDetailsDestroy().as_view(),name='table-details-destroy'),
    path("reservations/<int:pk>/",views.ReservationUpdateView().as_view(),name='reservation-details'),
]