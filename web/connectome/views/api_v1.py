import string
import os
import time, datetime
import re
import math
import csv
import logging
from cStringIO import StringIO

from collections import defaultdict

from pyramid.response import Response
from pyramid.view import view_config
from pyramid.renderers import render
from sqlalchemy.types import Numeric, String
from sqlalchemy.exc import DBAPIError
from sqlalchemy import func, text as sa_text, Column

from sqlalchemy.orm import aliased
from sqlalchemy.orm.exc import NoResultFound

from pyramid.httpexceptions import HTTPException, HTTPPaymentRequired, HTTPInternalServerError, HTTPNotFound, HTTPBadRequest
from ..models import (
    DBSession,
    Region,
    Tracer,
    AnnotationType,
    Marmoset,
    Injection,
    Section,
    Region,
    Delineation,
    DelineationType,
#    RegionHierarchy,,
    FlneCell,
    )

import yaml

import msgpack

class APIException(HTTPException):
    pass

class InjectionNotFound(APIException):
    code = 400
    title = 'INJECTION_NOT_FOUND'
    explanation = 'Either the required injection_id is not provided, or the injection_id provided does not match any record in the system'
    def __init__(self, detail=None, **kw):
        HTTPException.__init__(self, detail=detail, **kw)

class RegionNotFound(APIException):
    code = 400
    title = 'STRUCTURE_NOT_FOUND'
    explanation = 'Either the required param area is not provided, or the area provided does not match any record in the system'
    def __init__(self, detail=None, **kw):
        HTTPException.__init__(self, detail=detail, **kw)

#@view_config(context=APIException, renderer='json')
class FancyException(object):
    def api_exception(self, request):
        request.response.status = self.code
        j = {
            'status': 'Failure',
            'name': self.title,
            'message': self.explanation,
            'details': self.detail
        }
        return j

@view_config(route_name='api.v1.cell.get', renderer='json')
def cell_get(request):
    log = logging.getLogger(__name__)
    try:
        session = DBSession()
        format_ = request.GET.get('format', 'JSON')
        injection_uid = request.GET.get('injection_id', '')
        matches = re.match(r'([a-zA-Z\d]+)\-(.+)', injection_uid)
        if not matches:
            raise InjectionNotFound('The injection is not found')
        case_id = matches.group(1)
        tracer_id = matches.group(2)

        try:
            inj, region = session.query(Injection, Region)\
                    .join(Marmoset).filter_by(case_id=case_id)\
                    .join(Tracer).filter_by(code=tracer_id)\
                    .join(Region)\
                    .one()


        except NoResultFound:
            raise InjectionNotFound('The injection is not found')

        cells = []
        ret = {
            'headers': [
                'case_id', 'tracer_id', 'target', 'source'#, 'M-L', 'A-P', 'D-V', 'laminar position'
            ],
            'status': 'success',
            'cells': cells,
            'total_cells': 0
        }
        _float = Numeric(asdecimal=False)
        res = DBSession.execute(
            sa_text(
            """SELECT r1.code, r2.code,
                    fc.l, fc.a, fc.h, fc.laminar_position
            FROM flne_cell fc
            LEFT JOIN injection inj ON fc.injection_id = inj.id
            LEFT JOIN region r1 ON fc.target_region_id = r1.id
            LEFT JOIN region r2 ON fc.source_region_id = r2.id
            WHERE inj.id=:injection_id""").columns(a=_float, l=_float, h=_float),
            {'injection_id': inj.id}
        ).fetchall()
        for _r in res:
            (
                target_region_code, source_region_code, l, a, h, laminar_position

            ) = _r
            #cells.append((case_id, tracer_id, target_region_code, source_region_code, '%+.2f' % l,'%+.2f' % a, '%+.2f' % h, laminar_position))
            cells.append((case_id, tracer_id, target_region_code, source_region_code))
        ret['total_cells'] = len(ret['cells'])
        ts = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        ret['timestamp'] = int(time.time())

        _comments = """\
# This file contains a FLNe values and cell count
# for an injection into %s in the animal %s
# using the %s tracer
# Columns description:
#  1) Case_id: animal identifier,
#  2) Tracer_id: tracer type,
#  3) Target: area receieving the projection,
#  4) Source: area sending the projection,
#  5) Mediolateral stereotaxic coordinate (mm).
#     the values increase towards the lateral direction.
#  6) Rostrocaudal stereotaxic coordinate (mm).
#     Positive values are caudal to the interaural line.
#     Negative values are rostral to the interaural line.
#  7) Dorsoventral stereotaxic coordinate (mm):
#     Values increase towards the dorsal direction
#     from the interaural line.
#  8) Laminar position of the specific cell with respect to.
#     the granular cells layer. -1 for infragranular cells
#     +1 for supragranular cells, 0 for undefined or not relevant.
#  timestamp (UTC): %s
#
#  This dataset has been downloaded from the
#  Marmoset Brain Connectivity Atlas
#  http://www.marmosetbrain.org/
#
#  The data is released under the terms of CC BY 4.0 license
#  (https://creativecommons.org/licenses/by/4.0/).
#  Please follow the citation policy:
#        http://www.marmosetbrain.org/
#
""" % (region.code, case_id, tracer_id, ts)
        ret['_comments'] = _comments
        if format_ == 'CSV':
            csv_data = StringIO()
            csv_data.write(ret['_comments'].replace('\n', '\r\n'))
            writer = csv.writer(csv_data)
            writer.writerow(ret['headers'])
            writer.writerows(ret['cells'])
            return Response(csv_data.getvalue())
        elif format_ == 'JSON':
            return ret
        else:
            return HTTPBadRequest('Unknown format parameter provided - %s, valid options are JSON (default) and CSV' % format_)
    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}


@view_config(route_name='api.v1.injection.get', renderer='json')
def injection_get(request):
    log = logging.getLogger(__name__)
    try:
        session = DBSession()
        format_ = request.GET.get('format', 'JSON')
        injection_uid = request.GET.get('injection_id', '')
        matches = re.match(r'([a-zA-Z\d]+)\-(.+)', injection_uid)
        if not matches:
            raise InjectionNotFound('The injection is not found')
        case_id = matches.group(1)
        tracer_id = matches.group(2)

        try:
            inj, region = session.query(Injection, Region)\
                    .join(Marmoset).filter_by(case_id=case_id)\
                    .join(Tracer).filter_by(code=tracer_id)\
                    .join(Region)\
                    .one()


        except NoResultFound:
            raise InjectionNotFound('The injection is not found')

        target_region_code = region.code
        areas = []
        ret = {
            'status': 'success',
            'headers': [
                'case_id', 'tracer_id', 'target', 'source', 'cell_count', 'flne', 'log10_flne'
            ],
            'areas': areas,
            'total_areas': 0
        }
        _float = Numeric(asdecimal=False)
        res = DBSession.execute(
            sa_text(
            """SELECT fi.cell_count, fi.flne, r1.code
            FROM flne_injection fi
            LEFT JOIN injection inj ON fi.injection_id = inj.id
            LEFT JOIN region r1 ON fi.source_region_id = r1.id
            WHERE inj.id=:injection_id""").columns(flne=_float),
            {'injection_id': inj.id}
        ).fetchall()
        for _r in res:
            (
                cell_count, flne, source_region_code,

            ) = _r
            areas.append((case_id, tracer_id, target_region_code, source_region_code, cell_count, flne, math.log10(flne)))
        ret['total_areas'] = len(ret['areas'])

        ts = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        ret['timestamp'] = int(time.time())
        _comments = """\
# This file contains a FLNe values and cell count
# for an injection into %s in the animal %s
# using the %s tracer
# Columns description:
#  1) Case_id: animal identifier,
#  2) Tracer_id: tracer type,
#  3) Target: area receieving the projection,
#  4) Source: area sending the projection,
#  5) Cell_count: the actual number of labelled
#                 cells found in the source area,
#  6) FLNe: fraction of extrinsic labelled neurons,
#  7) log10_flne: log10(FLNe).
#  timestamp (UTC): %s

#
#  This dataset has been downloaded from the
#  Marmoset Brain Connectivity Atlas
#  http://www.marmosetbrain.org/
#
#  The data is released under the terms of CC BY 4.0 license
#  (https://creativecommons.org/licenses/by/4.0/).
#  Please follow the citation policy:
#        http://www.marmosetbrain.org/
#
""" % (region.code, case_id, tracer_id, ts)
        ret['_comments'] = _comments
        if format_ == 'CSV':
            csv_data = StringIO()
            csv_data.write(ret['_comments'].replace('\n', '\r\n'))
            writer = csv.writer(csv_data)
            writer.writerow(ret['headers'])
            writer.writerows(ret['areas'])
            return Response(csv_data.getvalue())
        elif format_ == 'JSON':
            return ret
        else:
            return HTTPBadRequest('Unknown format parameter provided - %s, valid options are JSON (default) and CSV' % format_)
    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

@view_config(route_name='api.v1.flne_area.get', renderer='json')
def area_get(request):
    log = logging.getLogger(__name__)
    try:
        session = DBSession()
        format_ = request.GET.get('format', 'JSON')
        area = request.GET.get('area')
        if area is None:
            region = None
        else:
            try:
                region = session.query(Region).filter_by(code=area).one()
            except NoResultFound:
                raise RegionNotFound('The area code provided is not found - %s' % area)

        areas = []
        ret = {
            'status': 'success',
            'headers': [
                'target', 'source', 'flne', 'log10_flne'
            ],
            'areas': areas,
            'total_areas': 0
        }
        _float = Numeric(asdecimal=False)
        if region is not None:
            res = DBSession.execute(
                sa_text(
                """SELECT r1.code, r2.code, fa.flne
                FROM flne_area fa
                LEFT JOIN region r1 ON fa.target_region_id = r1.id
                LEFT JOIN region r2 ON fa.source_region_id = r2.id
                WHERE r1.code=:area""").columns(flne=_float),
                {'area': region.code}
            ).fetchall()
        else:
            res = DBSession.execute(
                sa_text(
                """SELECT r1.code, r2.code, fa.flne
                FROM flne_area fa
                LEFT JOIN region r1 ON fa.target_region_id = r1.id
                LEFT JOIN region r2 ON fa.source_region_id = r2.id
                """).columns(flne=_float),
            ).fetchall()
        for _r in res:
            (
                target_region_code, source_region_code, flne

            ) = _r
            areas.append((target_region_code, source_region_code, flne, math.log10(flne)))
        ret['total_areas'] = len(ret['areas'])

        ts = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        ret['timestamp'] = int(time.time())
        _comments = """\
# This file contains %s
# Columns description:
#  1) Target: area receieving the projection,
#  2) Source: area sending the projection,
#  3) FLNe: fraction of extrinsic labelled neurons,
#  4) log10_flne: log10(FLNe).
#  timestamp (UTC): %s
#
#  This dataset has been downloaded from the
#  Marmoset Brain Connectivity Atlas
#  http://www.marmosetbrain.org/
#
#  The data is released under the terms of CC BY 4.0 license
#  (https://creativecommons.org/licenses/by/4.0/).
#  Please follow the citation policy:
#        http://www.marmosetbrain.org/
#
""" % ('a FLNe values for the area ' + region.code if region is not None else 'FLNe values for all areas', ts)
        ret['_comments'] = _comments
        if format_ == 'CSV':
            csv_data = StringIO()
            csv_data.write(ret['_comments'].replace('\n', '\r\n'))
            writer = csv.writer(csv_data)
            writer.writerow(ret['headers'])
            writer.writerows(ret['areas'])
            return Response(csv_data.getvalue())
        elif format_ == 'JSON':
            return ret
        else:
            return HTTPBadRequest('Unknown format parameter provided - %s, valid options are JSON (default) and CSV' % format_)
    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

@view_config(route_name='api.v1.injection.list', renderer='json')
def injection_list(request):
    try:
        session = DBSession()
        #mar = session.query(Injection).filter_by(case_id=case_id).one()
        injections = session.query(Injection, Tracer, Region, Section, Marmoset) \
            .filter_by(status='Active')\
            .join(Tracer) \
            .join(Region) \
            .join(Section) \
            .join(Marmoset) \
            .all()
        inj_data = []
        for inj, tracer, region, section, marmoset in injections:
            data = {
                'id': '%s-%s' % (marmoset.case_id, tracer.code),
                'display_name': '%s-%s' % (marmoset.display_name if marmoset.display_name else marmoset.case_id, tracer.code),
                'case_id': marmoset.case_id,
                'tracer': tracer.code,
                'area': region.code,
                'A-P': '%.2f' % inj.atlas_a,
                'M-L': '%.2f' % inj.atlas_l,
                'D-V': '%.2f' % inj.atlas_h,
                'memo': inj.memo.strip() if inj.memo else '',
                'section': section.code,
                'url_to_flatmap_image': 'http://flatmap.marmosetbrain.org/flatmap/%s/%s.png' % (marmoset.case_id, tracer.code),
                'url_to_highres_viewer': \
                    'http://www.marmosetbrain.org/goto/%s/%s/%s/%s/3' % (
                        marmoset.case_id, section.code, inj.section_x_mm, inj.section_y_mm
                    )
            }
            inj_data.append(data)
        ts = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        ret = {
            'status': 'success',
            'total_injections': len(inj_data),
            'injections': inj_data
        }
        ret['timestamp'] = int(time.time())
        return ret

    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

@view_config(route_name='api.v1.case.list', renderer='json')
def case_list(request):
    try:
        session = DBSession()
        case_data = []
        for mar in session.query(Marmoset).join(Injection).filter_by(status='Active').all():
            data = {
                'id': mar.case_id,
                'date_of_birth': mar.dob.strftime('%Y-%m-%d') if mar.dob else None,
                'injection_date': mar.injection_date.strftime('%Y-%m-%d') if mar.injection_date else None,
                #'hemisphere': mar.hemisphere,
                'sex': mar.sex,
                'survival_days': mar.survival_days,
                'perfusion_date': mar.perfusion_date.strftime('%Y-%m-%d') if mar.perfusion_date else None,
                'memo': mar.other_info.strip() if mar.other_info else '',
                'sectioning_plane': mar.sectioning_plane,
                'weight': mar.body_weight,
            }
            case_data.append(data)
        ts = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        ret = {
            'status': 'success',
            'total_cases': len(case_data),
            'cases': case_data,
            'timestamp': int(time.time())
        }
        ret['timestamp'] = int(time.time())
        return ret
    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

@view_config(route_name='api.v1.area.flat', renderer='json')
def area_flat(request):
    try:
        session = DBSession()
        structs = {}
        flatten = {}
        region_by_id = {}
        _root = None

        for region in session.query(Region).all():
            if not region.parent_id:
                _root = region
            region_by_id[region.id] = region
            region.nodes = []
            region.is_leaf = True
            region.is_processed = False

        for region in region_by_id.values():
            if region.parent_id:
                parent = region_by_id[region.parent_id]
                parent.nodes.append(region)
                parent.is_leaf = False

        def _get_dict(n, with_children=True):
            data = {
                'id': n._3dbar_index,
                'name': n.name,
                'abbrev': n.code,
                'human_readable_abbrev': n.code,
                'color_code': n.color_code,
            }
            if with_children:
                data['is_leaf'] = n.is_leaf
                data['nodes'] = [_get_dict(_n) for _n in n.nodes if not _n.is_processed]
            for _n in region.nodes:
                _n.is_processed = True
            return data

        for region in region_by_id.values():
            if region.is_leaf:
                data = _get_dict(region, with_children=False)
                flatten[data['abbrev']] = data
        ts = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        ret = {
            'status': 'success',
        }
        ret['areas'] = flatten
        ret['timestamp'] = int(time.time())
        return ret
    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

@view_config(route_name='api.v1.area.list', renderer='json')
def area_list(request):
    try:
        session = DBSession()
        structs = {}
        flatten = {}
        region_by_id = {}
        _root = None


        layout = request.GET.get('layout', 'nested')

        for region in session.query(Region).all():
            if not region.parent_id:
                _root = region
            region_by_id[region.id] = region
            region.nodes = []
            region.is_leaf = True
            region.is_processed = False

        for region in region_by_id.values():
            if region.parent_id:
                parent = region_by_id[region.parent_id]
                parent.nodes.append(region)
                parent.is_leaf = False

        def _get_dict(n, with_children=True):
            data = {
                'id': n._3dbar_index,
                'name': n.name,
                'abbrev': n.code,
                'human_readable_abbrev': n.code,
                'color_code': n.color_code,
            }
            if with_children:
                data['is_leaf'] = n.is_leaf
                data['nodes'] = [_get_dict(_n) for _n in n.nodes if not _n.is_processed]
            for _n in region.nodes:
                _n.is_processed = True
            return data

        """
        for region in region_by_id.values():
            if region.is_leaf:
                data = _get_dict(region, with_children=False)
                flatten[data['abbrev']] = data
        """
        structs = _get_dict(_root)
        ts = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        ret = {
            'status': 'success',
        }
        ret['areas'] = structs
        ret['timestamp'] = int(time.time())
        return ret
    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

@view_config(route_name='api.v1.tracer.list', renderer='json')
def tracer_list(request):
    try:
        session = DBSession()
        tracers = []
        for tracer in session.query(Tracer).order_by('id').all():
            tracers.append({
                'id': tracer.code,
                'name': tracer.name,
                'description': tracer.display_name_long,
                'color_code': tracer.color_code,
                'comment': tracer.comment,

            })
        ret = {
            'status': 'success',
        }
        ret['tracers'] = tracers
        ret['total_tracers'] = len(tracers)
        ret['timestamp'] = int(time.time())
        return ret
    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

def ref(loader, node):
    #seq = loader.construct_sequence(node)
    m = loader.construct_mapping(node)
    return '<a href="#' + m['anchor'] + '">' + m['text'] + '</a>'

def anchor(loader, node):
    #seq = loader.construct_sequence(node)
    m = loader.construct_mapping(node)
    return '<a id="' + m['anchor'] + '"></a>' + m['text']

@view_config(route_name='api.v1.content', renderer='api-content-yaml.mako')
def content(request):
    try:
        session = DBSession()
        areas = session.query(Region).all()
        api = []
        yaml.add_constructor('!ref', ref)
        yaml.add_constructor('!anchor', anchor)

        for markup in [
            'list_injections.yaml',
            'list_cases.yaml',
            'list_areas.yaml',
            'list_areas_flat.yaml',
            'list_tracers.yaml',
            'flne_area.yaml',
            'flne_injection.yaml',
            'flne_cell.yaml',
        ]:
            markup = os.path.join('..', 'api_reference', 'api', 'yaml', markup)
            with open(markup, 'rb') as fin:
                api.append(yaml.load(fin))
        return {
            'areas': areas,
            'api': api
        }
    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}
