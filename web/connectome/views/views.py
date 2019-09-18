import json
import logging
from pyramid.response import Response
from pyramid.view import view_config
from pyramid.renderers import render
from sqlalchemy.exc import DBAPIError
from sqlalchemy.orm import aliased
from pyramid.httpexceptions import HTTPPaymentRequired, HTTPInternalServerError, HTTPFound
from ..models import (
    DBSession,
    Region,
    AnnotationType,
    Marmoset,
    Injection,
    Tracer,
    Section

#    RegionHierarchy,
    )


@view_config(route_name='home', renderer='home.mako')
def home(request):
    try:
        pass
    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)
    return {}

@view_config(route_name='home.dev', renderer='home.mako')
def home_dev(request):
    try:
        return {}
    except DBAPIError as ex:
        return HTTPPaymentRequired(str(ex))

@view_config(route_name='about', renderer='about.mako')
def about(request):
    try:
        return {}
    except DBAPIError as ex:
        return HTTPInternalServerError(str(ex))

@view_config(route_name='publication', renderer='publication.mako')
def publication(request):
    try:
        return {}
    except DBAPIError as ex:
        return HTTPInternalServerError(str(ex))

@view_config(route_name='other_data', renderer='other-data.mako')
def other_data(request):
    try:
        return {}
    except DBAPIError as ex:
        return HTTPInternalServerError(str(ex))

@view_config(route_name='reference', renderer='reference.mako')
def reference(request):
    try:
        return {}
    except DBAPIError as ex:
        return HTTPInternalServerError(str(ex))

@view_config(route_name='marmoset', renderer='marmoset.mako')
def marmoset(request):
    try:
        pass
    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)
    return {}

@view_config(route_name='viewer', renderer='viewer.mako')
def viewer(request):
    try:
        session = DBSession()
        at = session.query(AnnotationType).order_by(AnnotationType.id).all()
        return {'annotation_types': at}
    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)

def build_region_tree(region_node):
    node = {
        'id': region_node.id, 'name': region_node.name,
        'code': region_node.code, 'color_code': region_node.color_code,
        'children': []
    }
    for r in region_node.children:
        node['children'].append(build_region_tree(r))
    return node

@view_config(route_name='region.overview', renderer='region-overview.mako')
def region_overview(request):
    try:
        pass
    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)
    return {'region_hierarchy': render('json', region_hierarchy(request))}

@view_config(route_name='connectivity', renderer='connectivity.mako')
def connectivity(request):
    try:
        session = DBSession()
        brains = {}
        region_tree = []
        for r in session.query(Region).all():
            if r.parent is None:
                region_tree.append(build_region_tree(r))
    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)
    return {'region_tree': region_tree}

@view_config(route_name='region.hierarchy', renderer='json')
def region_hierarchy(request):
    try:
        session = DBSession()
        brains = {}
        #region_parent = aliased(Region)
        #for r in session.query(Region).join(RegionHierarchy, Region.id==RegionHierarchy.region_id).join(Region, RegionHierarchy.parent_id==Region.id).all():
        #for r in session.query(Region).all():
        #    brains[r.id] = r
        #    r.children = []
        #    r.parent = None
        #for rh in session.query(RegionHierarchy).all():
        #    brains[rh.parent_id].children.append(brains[rh.region_id])
        #    brains[rh.region_id].parent = rh.parent_id
        #for r in session.query(Region).all():
        region_tree = []
        for r in session.query(Region).all():
            if r.parent is None:
                region_tree.append(build_region_tree(r))

    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)
    return region_tree

@view_config(route_name='openlayer.test', renderer='openlayer-test.mako')
def openlayer_test(reqeust):
    try:
        pass
    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)
    return {}

@view_config(route_name='whitepaper', renderer='whitepaper.mako')
def whitepaper(request):
    try:
        pass
    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)
    return {}

@view_config(route_name='dashboard', renderer='dashboard.mako', permission='view')
def dashboard(request):
    try:
        session = DBSession()
        marmosets = session.query(Marmoset).order_by(Marmoset.injection_date).all()
        injections = session.query(Injection).order_by(Injection.id).all()
        #for inj in injections:
        #    inj.marmoset_id =
        tracers = session.query(Tracer).order_by(Tracer.id).all()
        tracer_list = [{'value': t.id, 'text': t.code} for t in tracers]
        tracer_lookup = {}
        region_joined = aliased(Region)
        regions = session.query(Region)\
                .outerjoin(region_joined, region_joined.parent_id==Region.id)\
                .filter(region_joined.id==None)\
                .order_by(Region._3dbar_index)

        region_list = [{'value': r.id, 'text': r.code} for r in regions.all()]
        for t in tracers:
            tracer_lookup[t.id] = t
        admin_server = 'marmoset.mrosa.org' in request.host
        return {
            'marmosets': marmosets, 'injections': injections,
            'tracer_list': json.dumps(tracer_list),
            'region_list': json.dumps(region_list),
            'tracer_lookup': tracer_lookup,
            'admin_server': int(bool(admin_server))
        }
    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)

@view_config(route_name='goto')
def goto(request):
    try:
        log = logging.getLogger(__name__)
        case_id = request.matchdict.get('case_id')
        section_code = request.matchdict.get('section_code')
        x_mm = request.matchdict.get('x_mm')
        y_mm = request.matchdict.get('y_mm')
        opt = request.matchdict.get('opt')
        try:
            opt_zoom = int(opt[0])
        except (ValueError, TypeError, IndexError) as ex:
            log.warn(ex)
            opt_zoom = None
        session = DBSession()
        section = session.query(Section).filter_by(code=section_code).join(Marmoset).filter_by(case_id=case_id).first()
        if section:
            x_mm = (float(x_mm) - float(section.offset_x_mm)) / float(section.scale_factor_x)
            y_mm = (float(y_mm) - float(section.offset_y_mm)) / float(section.scale_factor_y)

            extent = [x_mm - 0.1, -(y_mm + 0.1), x_mm + 0.1, -(y_mm - 0.1)]
            extent = map(str, extent)
            return HTTPFound(request.route_url('section.view', section_id=section.id, _query={
                'override_extent': ','.join(extent),
                'override_zoom': opt_zoom,
                'from': request.url
            }))
    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)
    return {}

def cookie_policy(request):
    try:
        pass
    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)
    return {}

@view_config(route_name='cell_density', renderer='cell-density.mako')
def cell_density(request):
    try:
        pass
    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)
    return {}
