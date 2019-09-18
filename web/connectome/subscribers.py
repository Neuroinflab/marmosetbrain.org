from functools import partial

from pyramid.events import NewRequest, BeforeRender
from pyramid.events import subscriber
from pyramid.security import authenticated_userid
from pyramid.httpexceptions import HTTPFound
from pyramid.settings import asbool

"""
    def
    import string
    from webhelpers.html.tags import *
"""
class Helpers(object):
    def __init__(self, request):
        self.request = request

    def link(self, route, **kw):
        return self.request.route_url(route, **kw)

    def static(self, url):
        return self.request.static_url('connectome:static/%s' % url)

    def static_nocache(self, url):
        return self.request.static_url('connectome:static_nocache/%s' % url)

    def route(self, route, *arg, **kwargs):
        return self.request.route_url(route, *arg, **kwargs)

    def authenticated(self):
        return authenticated_userid(self.request)

    #def __getattr__(self, name):
    #    return getattr(helpers, name)

    @property
    def deploy_revision(self):
        return self.request.registry.settings.get('deploy_revision', '')

    @property
    def js_bundle(self):
        rev = self.request.registry.settings.get('deploy_revision')
        if rev:
            return 'bundle_' + rev + '.min.js'
        else:
            return 'bundle.min.js'

    @property
    def allow_admin(self):
        _admin = asbool(self.request.registry.settings.get('marmoset.admin'))
        return int(_admin)

    @property
    def logged_in(self):
        _logged_in = self.request.authenticated_userid
        return int(bool(_logged_in))

@subscriber(BeforeRender)
def add_helpers(event):
    event['h'] = Helpers(event['request'])
