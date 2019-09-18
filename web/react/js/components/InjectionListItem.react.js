import React from 'react';
import Actions from '../actions/Actions';
import AppStore from '../stores/AppStore';
import _ from 'lodash';
import classNames from 'classnames';

export default class InjectionListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        _.bindAll(this, 'handleMouseEnter', 'handleMouseLeave', 'handleHighRes', 'handleMouseMove',
                  'handleHighResEnter', 'handleHighResLeave', 'handleHighResMove',
                  'handleDetails', 'handle3DPreview', 'handleAnalytics',
                  'handleSuppress', 'handleUnsuppress',
                  'handlePreviewMouseEnter', 'handlePreviewMouseLeave',
                  'handleAnalyticEnter', 'handleAnalyticLeave', 'handleAnalyticMove',
                 );
        this.ref_injection = null;

    }
    handleMouseEnter(e) {
        if (!app.flat_ready) return;
        Actions.highlightInjection(this.props.injection);
        var region = _.find(app.regions, {id: this.props.injection.region_id});
        Actions.highlightRegion(region);
        let bbox = this.ref_injection.getBoundingClientRect();
        let parent_bbox = $('.injection-caption')[0].getBoundingClientRect();
        let top_offset = Math.round(bbox.top - parent_bbox.top) + bbox.height + 2;
        //Actions.showInjectionListHint(this.props.injection, top_offset);
        $('.injection-filter-hint').css({top: top_offset + 'px'});
    }
    handleMouseMove(e) {
        let x = e.clientX;
        let y = e.clientY;
        let parent_bbox = $('.injection-caption')[0].getBoundingClientRect();
        let left_offset = x - parent_bbox.left + 10;
        let top_offset = y - parent_bbox.top + 25;
        $('.injection-filter-hint').css({
            left: left_offset + 'px',
            top: top_offset + 'px',
        });
    }
    handleHighResEnter(e) {
        if (!app.flat_ready) return;
        Actions.highlightInjection(this.props.injection);
        var region = _.find(app.regions, {id: this.props.injection.region_id});
        Actions.highlightRegion(region);
        let bbox = this.ref_injection.getBoundingClientRect();
        let parent_bbox = $('.injection-caption')[0].getBoundingClientRect();
        let top_offset = Math.round(bbox.top - parent_bbox.top) + bbox.height + 2;
        Actions.showInjectionHighRes(this.props.injection, top_offset);
        $('.injection-high-res').css({top: top_offset + 'px'});
    }
    handleHighResLeave(e) {
        let x = e.clientX;
        let y = e.clientY;
        let parent_bbox = $('.injection-caption')[0].getBoundingClientRect();
        let left_offset = x - parent_bbox.left + 10;
        let top_offset = y - parent_bbox.top + 25;
        $('.injection-high-res').css({
            left: left_offset + 'px',
            top: top_offset + 'px',
        });
        Actions.hideInjectionHighRes(this.props.injection);
    }
    handleHighResMove(e) {
        let x = e.clientX;
        let y = e.clientY;
        let parent_bbox = $('.injection-caption')[0].getBoundingClientRect();
        let left_offset = x - parent_bbox.left + 10;
        let top_offset = y - parent_bbox.top + 25;
        $('.injection-high-res').css({
            left: left_offset + 'px',
            top: top_offset + 'px',
        });
    }
    handlePreviewMouseEnter(e) {
        if (!app.flat_ready) return;
        Actions.highlightInjection(this.props.injection);
        var region = _.find(app.regions, {id: this.props.injection.region_id});
        Actions.highlightRegion(region);
        let bbox = this.ref_injection.getBoundingClientRect();
        let parent_bbox = $('.injection-caption')[0].getBoundingClientRect();
        let top_offset = Math.round(bbox.top - parent_bbox.top) + bbox.height + 2;
        Actions.showInjectionListHint(this.props.injection, top_offset);
        $('.injection-filter-hint').css({top: top_offset + 'px'});
    }
    handlePreviewMouseLeave(e) {
        let x = e.clientX;
        let y = e.clientY;
        let parent_bbox = $('.injection-caption')[0].getBoundingClientRect();
        let left_offset = x - parent_bbox.left + 10;
        let top_offset = y - parent_bbox.top + 25;
        $('.injection-filter-hint').css({
            left: left_offset + 'px',
            top: top_offset + 'px',
        });
        Actions.hideInjectionListHint(this.props.injection);
    }
    handleMouseLeave() {
        //Actions.hideInjectionListHint(this.props.injection);
    }
    handleAnalyticEnter() {
        if (!app.flat_ready) return;
        Actions.highlightInjection(this.props.injection);
        var region = _.find(app.regions, {id: this.props.injection.region_id});
        Actions.highlightRegion(region);
        let bbox = this.ref_injection.getBoundingClientRect();
        let parent_bbox = $('.injection-caption')[0].getBoundingClientRect();
        let top_offset = Math.round(bbox.top - parent_bbox.top) + bbox.height + 2;
        Actions.showAnalytic(this.props.injection);
        $('.injection-analytic').css({top: top_offset + 'px'});

    }
    handleAnalyticLeave(e) {
        let x = e.clientX;
        let y = e.clientY;
        let parent_bbox = $('.injection-caption')[0].getBoundingClientRect();
        let left_offset = x - parent_bbox.left + 10;
        let top_offset = y - parent_bbox.top + 25;
        $('.injection-analytic').css({
            left: left_offset + 'px',
            top: top_offset + 'px',
        });
        Actions.hideAnalytic(this.props.injection);
    }
    handleAnalyticMove(e) {
        let x = e.clientX;
        let y = e.clientY;
        let parent_bbox = $('.injection-caption')[0].getBoundingClientRect();
        let left_offset = x - parent_bbox.left - 400;
        let top_offset = y - parent_bbox.top + 25;
        $('.injection-analytic').css({
            left: left_offset + 'px',
            top: top_offset + 'px',
        });
    }
    handleHighRes(e) {
        //window.location.href = this.props.injection.action;
        e.stopPropagation();
        let bgTab = window.open(this.props.injection.action);
    }
    handleDetails(e) {
        let i = this.props.injection;
        e.stopPropagation();
        let area = _.find(app.regions, {code: this.props.injection.region});
        Actions.pickArea(area);
        Actions.filterInjectionListByIntelliSearch('detail:' + i.display_name + '-' + i.tracer);
        Actions.pushIntelliFilter('detail:' + i.display_name + '-' + i.tracer);
        Actions.stackInjectionModal(this.props.injection);
        Actions.showModal('metadata', AppStore.getCurrentInjectionModal());
    }
    handle3DPreview(e) {
        e.stopPropagation();
    }
    handleAnalytics(e) {
        e.stopPropagation();
        let href = 'http://analytics.marmosetbrain.org/?pickInjection=' + encodeURI(this.props.injection.case_id + '-' + this.props.injection.tracer);
        window.open(href, '_blank');
    }
    handleSuppress(e) {
        $('.injection-filter-hint').addClass('suppress-hint');
    }
    handleUnsuppress(e) {
        $('.injection-filter-hint').removeClass('suppress-hint');
    }
    render() {
        var _inj = this.props.injection;
        var _region;
        /*
        if (app.region_picked) {
            _region = app.region_picked;
        } else {
            _region = _.find(app.regions, {id: _inj.region_id});
        }
                    <span onClick={this.handleClick} onMouseEnter={this.handleSuppress} onMouseLeave={this.handleUnsuppress}
                        key={_inj.id + '-detail'}>View</span>
                    &nbsp;
        */
        _region = _.find(app.regions, {id: _inj.region_id});
        var bg_color = 'rgba(' + _region.color.r + ', ' + _region.color.g + ', ' + _region.color.b + ', 0.9)';
        return (
            <tr data-id={_inj.id}
                key={_inj.id}
                onClick={this.handleHighRes}
                >
                <td style={{backgroundColor: bg_color}}
                    onMouseEnter={this.handleHighResEnter}
                    onMouseLeave={this.handleHighResLeave}
                    onMouseMove={this.handleHighResMove}
                    >{_region.code}</td>
                <td ref={ (ref) => { this.ref_injection = ref; } }
                    onMouseEnter={this.handleHighResEnter}
                    onMouseLeave={this.handleHighResLeave}
                    onMouseMove={this.handleHighResMove}
                    >{_inj.display_name}-{_inj.tracer}</td>
                <td className="align-center">
                    <span onClick={this.handleDetails}
                        onMouseEnter={this.handlePreviewMouseEnter}
                        onMouseLeave={this.handlePreviewMouseLeave}
                        onMouseMove={this.handleMouseMove}
                        key={_inj.id + '-3d'}>Details</span>
                    &nbsp;
                    <span onClick={this.handleAnalytics} onMouseEnter={this.handleSuppress} onMouseLeave={this.handleUnsuppress}
                        onMouseEnter={this.handleAnalyticEnter}
                        onMouseLeave={this.handleAnalyticLeave}
                        onMouseMove={this.handleAnalyticMove}
                        key={_inj.id + '-analytics'}>Analytics</span>
                </td>
            </tr>
        );
    }
};

