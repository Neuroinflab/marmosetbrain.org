from functools import partial
from pyramid.events import NewRequest, BeforeRender
from pyramid.events import subscriber
from pyramid.security import authenticated_userid
from pyramid.httpexceptions import HTTPFound

class Helpers(object):
    def __init__(self, request):
        self.request = request

    def link(self, route, **kw):
        return self.request.route_url(route, **kw)

    def static(self, url):
        return self.request.static_url('rosaj2k:static/%s' % url)

    def route(self, route, *arg, **kwargs):
        return self.request.route_url(route, *arg, **kwargs)

    def authenticated(self):
        return authenticated_userid(self.request)

    #def __getattr__(self, name):
    #    return getattr(helpers, name)

@subscriber(BeforeRender)
def add_helpers(event):
    event['h'] = Helpers(event['request'])

