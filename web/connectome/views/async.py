import json
import msgpack
from pyramid.response import Response
from pyramid.view import view_config
from pyramid.renderers import render
from sqlalchemy import func

from sqlalchemy.exc import DBAPIError
from sqlalchemy.orm import aliased

from connectome.models import (
    DBSession,
    Region,
    Injection,
    Section,
    Cell,
    Marmoset,
    AnnotationType,
    Annotation,
    DelineationType,
    Delineation,
    )
from ..libs import models2list

@view_config(route_name='async.annotation', renderer='json')
def annotation(request):
    try:
        session = DBSession()
        anno = request.json_body
        print repr(anno)
        section_id = anno['section_id']
        new = False
        for f in anno['features']:
            fid = f['properties'].get('annotation_id')
            if fid:
                a = session.query(Annotation).filter_by(id=fid).one()
            else:
                a = Annotation()
                a.status = f['properties'].get('status', 'Active')
                session.add(a)
                new = True
            type_ = f['properties']['annotation_type']
            type_id_obj = session.query(AnnotationType).filter_by(name=type_).one()
            path = f['geometry']['coordinates']
            #print type_, path
            a.section_id = section_id
            a.path = msgpack.packb(path)
            a.type_id = type_id_obj.id
            a.memo = f['properties'].get('memo')
            if new:
                session.flush()
                f['properties']['annotation_id'] = a.id
        for df in anno['deleted']['features']:
            fid = df['properties'].get('annotation_id')
            deleted = df['properties'].get('deleted')
            if fid:
                a = session.query(Annotation).filter_by(id=fid).first()
                if a and deleted:
                    a.status = 'Deleted'
        return anno
    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)
    return {}

@view_config(route_name='async.delineation', renderer='json')
def delineation(request):
    try:
        session = DBSession()
        anno = request.json_body
        section_id = anno['section_id']
        new = False
        for f in anno['features']:
            fid = f['properties'].get('delineation_id')
            print 'fid', fid
            if fid:
                a = session.query(Delineation).filter_by(id=fid).one()
            else:
                a = Delineation()
                a.status = f['properties'].get('status', 'Active')
                session.add(a)
                new = True
            type_ = f['properties']['delineation_type']
            type_id_obj = session.query(DelineationType).filter_by(name=type_).one()
            path = f['geometry']['coordinates']
            #print type_, path
            a.section_id = section_id
            a.path = msgpack.packb(path)
            a.type_id = type_id_obj.id
            a.memo = f['properties'].get('memo')
            if new:
                session.flush()
                f['properties']['delineation_id'] = a.id
        for df in anno['deleted']['features']:
            fid = df['properties'].get('delineation_id')
            deleted = df['properties'].get('deleted')
            if fid:
                a = session.query(Delineation).filter_by(id=fid).first()
                if a and deleted:
                    a.status = 'Deleted'
        return anno
    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)
    return {}
