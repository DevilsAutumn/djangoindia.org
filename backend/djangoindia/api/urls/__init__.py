from .event import urlpatterns as event_urls
from .communication import urlpatterns as communication_urls
from .partner_and_sponsor import urlpatterns as community_partner_urls

urlpatterns = event_urls + communication_urls + community_partner_urls
