import json
from json import encoder
from pyramid.response import Response
from pyramid.view import view_config
from pyramid.renderers import render
from sqlalchemy.exc import DBAPIError
from sqlalchemy.orm import aliased

from connectome.models import (
    DBSession,
    Region,
    Injection,
    Tracer,
    Marmoset,
    Section,
#    RegionHierarchy,
    )

@view_config(route_name='injection.search', renderer='injection-search.mako')
def injection_search(request):
    try:
        region = request.params.get('region')
        session = DBSession()
        #injections = session.query(Injection, Section).join(Section).filter(Injection.status=='Active').join(Region).order_by(Region.center_ap, Injection.atlas_a)
        if 'system.Authenticated' in request.effective_principals:
            injections = session.query(Injection, Section, Marmoset, Region).join(Section).filter((Injection.status=='Active') | (Injection.status=='Hidden')).join(Region).reset_joinpoint().join(Marmoset, Injection.marmoset_id == Marmoset.id).order_by(Region.center_ap, Injection.atlas_a.desc())
        else:
            injections = session.query(Injection, Section, Marmoset, Region).join(Section).filter(Injection.status=='Active').join(Region).reset_joinpoint().join(Marmoset, Injection.marmoset_id == Marmoset.id).order_by(Region.center_ap, Injection.atlas_a.desc())
        regions = session.query(Region).all()
        r_json = {}
        for r in regions:
            r_json[r._3dbar_index] = {
                'index': r._3dbar_index,
                'id': r.id,
                'color_code': r.color_code,
                'name': r.name,
                'code': r.code,
            }
        inj_json = [
            {
                'id': i.id,
                'region_id': i.region_id,
                'region_name': i.region.name if i.region else '',
                'title': i.slug,
                'hemisphere': i.hemisphere,
                'tracer': i.tracer.code,
                'region': i.region.code if i.region else '',
                'case_id': i.marmoset.case_id,
                'section': s.code,
                'action': request.route_url('goto',
                    case_id=i.marmoset.case_id,
                    section_code=s.code,
                    x_mm=float(i.section_x_mm),
                    y_mm=float(i.section_y_mm),
                    opt='/3'
                ) if (i.section_x_mm is not None and i.section_y_mm is not None) \
                    else request.route_url('section.view', section_id=i.section_id),
                'flatmap_x': float(i.flatmap_x) if i.flatmap_x else -1000.,
                'flatmap_y': float(i.flatmap_y) if i.flatmap_y else -1000.,
                'a': float(i.atlas_a),
                'l': float(i.atlas_l),
                'h': float(i.atlas_h),
                'status': i.status,
                'dob': m.dob.strftime('%Y-%m-%d') if m.dob else None,
                'injection_date': m.injection_date.strftime('%Y-%m-%d') if m.injection_date else None,
                'perfusion_date': m.perfusion_date.strftime('%Y-%m-%d') if m.perfusion_date else None,
                'survival_days': m.survival_days,
                'section_x': float(i.section_x_mm) if i.section_x_mm else None,
                'section_y': float(i.section_y_mm) if i.section_y_mm else None,
                'display_name': m.display_name if m.display_name else m.case_id,
                'injection_id': (m.display_name if m.display_name else m.case_id) + '-' + i.tracer.code,
                'sex': m.sex,
                'memo': i.memo,
                'region_center_ap': r.center_ap,
                'case_memo': m.other_info
            }
            for i, s, m, r in injections
        ]

        _float_repr = encoder.FLOAT_REPR
        encoder.FLOAT_REPR = lambda o: format(o, '.15g')
        injections_json = json.dumps(inj_json)
        encoder.FLOAT_REPR = _float_repr
        return {
            'regions': regions, 'regions_json': json.dumps(r_json),
            'injections_json': injections_json,
        }

    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)



@view_config(route_name='injection.search_async', renderer='json')
def injection_search_async(request):
    try:
        region = request.params.get('region')
        session = DBSession()
        injections = session.query(Injection)
        if region is not None:
            injections = injections.filter(Injection.region.has(Region.code.ilike('%%%s%%' % region)))
        return [
            {
                'id': i.id,
                'title': i.slug,
                'hemisphere': i.hemisphere,
                'tracer': i.tracer.code,
                'region': i.region.code if i.region else '',
                'case_id': i.marmoset.case_id,
                'action': request.route_url('section.view', section_id=i.section_id),
            }
            for i in injections.filter_by(status='Active').order_by(Injection.marmoset_id, Injection.tracer_id).all()]
    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)
    return {}
