#from rosaj2k.models import DBSession, User
from pyramid.security import Allow, Everyone, Authenticated

class RootFactory(object):
    def __init__(self, request):
        pass

    @property
    def __acl__(self):
        return [
                (Allow, Authenticated, 'view'),
                (Allow, 'admin', 'edit')
                ]

def principle_finder(userid, request):
    #user = DBSession.query(User).filter_by(userid=userid).first()
    #if user:
    #    return user.principles
    if False:
        return 'user'


