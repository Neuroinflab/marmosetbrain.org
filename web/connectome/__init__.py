from pyramid.config import Configurator
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy

from sqlalchemy import engine_from_config

from .models import (
    DBSession,
    #OldSession,
    Base,
    #OldBase,
    )
from .views.api_v1 import APIException
from .security import principle_finder

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    engine = engine_from_config(settings, 'sqlalchemy.')
    #old_engine = engine_from_config(settings, 'sqlalchemy_old.')

    DBSession.configure(bind=engine)
    #OldSession.configure(bind=old_engine)

    Base.metadata.bind = engine
    #OldBase.metadata.bind = old_engine
    config = Configurator(settings=settings, root_factory='connectome.security.RootFactory')
    authn_policy = AuthTktAuthenticationPolicy('bai@monash', callback=principle_finder, hashalg='sha512')
    authz_policy = ACLAuthorizationPolicy()
    config.set_authentication_policy(authn_policy)
    config.set_authorization_policy(authz_policy)

    config.add_view('.views.api_v1.FancyException', attr='api_exception', context=APIException, renderer='json')
    config.include('.routes')
    config.scan()
    return config.make_wsgi_app()
