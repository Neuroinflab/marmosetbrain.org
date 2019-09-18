import React from 'react';
import Actions from '../actions/Actions';
import AppStore from '../stores/AppStore';
import _ from 'lodash';
import classNames from 'classnames';
import {modalStyle} from '../lib/Libs';
import MetadataModal from './MetadataModal.react';
import Modal from '../lib/modal';
import {
    expandTracerID, humanReadableDate, humanReadableDiffInMonth,
    parseAP, parseML, parseDV, getOffset,
    getColorOfTracer, sortInjection
} from '../lib/utils';
import {escapeRegExp, getInjectionFilterHint, getInjectionTestFunction} from '../lib/intellifilter';
import InjectionPager from './InjectionPager.react';
import InjectionListItem from './InjectionListItem.react';
import {getBarWidthFunc, getLogColorFunc} from '../lib/utils';
import numberFormat from '../lib/numberformat';

export class InfoTag extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
        _.bindAll(this, 'handleClick');
    }
    handleClick(e) {
        let injection_id = e.target.getAttribute('data-injection-id');
        let inj = _.find(AppStore.getInjectionModalStack(), {injection_id: injection_id});
        Actions.setCurrentInjectionModal(inj);
    }
    render() {
        return null;
        return (
            <div className="injection-info-tag">
                {_.map(AppStore.getInjectionModalStack(), v => {
                    return (
                        <div key={v.injection_id}
                            className={classNames('injection-info-pane', {active: v.injection_id == AppStore.getCurrentInjectionModal().injection_id})}
                            data-injection-id={v.injection_id}
                            onClick={this.handleClick}
                            >
                            {v.injection_id}
                        </div>);
                })}
            </div>
        );
    }
}
export default class InjectionListInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
        _.bindAll(this, 'handleClick', 'handlePopInjectionModal', 'handleFilterByRegion');
    }
    handleClick() {
    }
    handlePopInjectionModal() {
        let inj = AppStore.getCurrentInjectionModal();
        Actions.popInjectionModal(inj);
        if (inj) {
            if (AppStore.getCurrentInjectionModal()) {
                Actions.showModal('metadata', inj);
            } else {
                Actions.hideModal();
            }
        } else {
            Actions.hideModal();
        }
    }
    handlePopIntelliFilter() {
        Actions.popIntelliFilter();
        //Actions.popInjectionModal();
        Actions.hideModal();
    }
    handleFilterByRegion(e) {
        Actions.hideModal('metadata');
        let value = e.currentTarget.getAttribute('data-region');
        Actions.pushIntelliFilter('area:' + value);
        Actions.filterInjectionListByIntelliSearch('area:' + value);
        //window.clearTimeout(this.filterTimeout);
        //this.filterTimeout = window.setTimeout(function() {
        //    this.filterTimeout = null;
        //}, 500);
    }
    render() {
        let inj = this.props.injection;
        if (!inj) {
            return null;
        }
        let hemisphere;
        switch (inj.hemisphere) {
            case 'L':
                hemisphere = 'left hemisphere';
                break;
            case 'R':
                hemisphere = 'right hemisphere';
                break;
            default:
                hemisphere = 'Unknown';
                break;
        }
        let jump_href = 'http://www.marmosetbrain.org/goto/' + inj.case_id
            + '/' + inj.section + '/' + inj.section_x + '/' + inj.section_y + '/3';
        let comment;
        if (_.trim(inj.case_memo) || _.trim(inj.memo)) {
            comment = [];
            comment.push(
                <tr key={inj.id + '-comment-header'}>
                    <th colSpan="2" className="no-bottom">Comment</th>
                </tr>
            );
            if (!_.trim(inj.case_memo)) {
                comment.push(
                    <tr key={inj.id + '-memo'}>
                        <td colSpan="2" className="no-top">{inj.memo}</td>
                    </tr>
                );
            } else if (!_.trim(inj.memo)) {
                comment.push(
                    <tr key={inj.id + '-case-memo'}>
                        <td colSpan="2" className="no-top">{inj.case_memo}</td>
                    </tr>
                );

            } else {
                comment.push(<tr key={inj.id + '-comment'}>
                    <td colSpan="2" className="no-top">{inj.case_memo}<br/>{inj.memo}</td>
                </tr>);
            }
        }
        return (<div className="injection-detail-wrapper">
            <div className="injection-detail-pane">
                <div className="injection-detail-caption">Details of the <a href={jump_href} target="_blank" title="Click to jump to the injection site in the high resolution viewer"><span className="bold-injection-id">{inj.injection_id}</span> <img src={'/static/images/jump-' + getColorOfTracer(inj.tracer) + '.png'}/></a> injection
                    <div className="hide-detail-icon"
                        data-onClick1={this.handlePopInjectionModal}
                        onClick={this.handlePopIntelliFilter}
                        title="Close the details panel"
                        >&#x21b6;</div>
                </div>
                <table className="injection-detail">
                    <tbody>
                        <tr>
                            <th>Injection Area</th>
                            <td>{inj.region_name} (<a className="filter-by-region" onClick={this.handleFilterByRegion} data-region={inj.region} title={'See all injections in ' + inj.region}>{inj.region}</a>)</td>
                        </tr>
                        <tr>
                            <th className="injection-info">Tracer</th>
                            <td>{inj.tracer} ({expandTracerID(inj.tracer)})</td>
                        </tr>
                        <tr>
                            <th>Atlas Coordinates</th>
                            <td>
                                {parseML(inj.l)}<br/>
                                {parseAP(inj.a)}<br/>
                                {parseDV(inj.h)}
                            </td>
                        </tr>
                        <tr>
                            <th>Section</th>
                            <td><a href={jump_href} target="_blank" title="View the injection site in the high resolution viewer.">{inj.section}</a>, {hemisphere}</td>
                        </tr>
                        <tr>
                            <th className="no-bottom">Date of Birth</th>
                            <td className="no-bottom">{humanReadableDate(inj.dob)}</td>
                        </tr>
                        <tr>
                            <th className="no-bottom">Injection Date</th>
                            <td className="no-bottom">{humanReadableDate(inj.injection_date)} ({humanReadableDiffInMonth(inj.injection_date, inj.dob)})</td>
                        </tr>
                        <tr>
                            <th>Perfusion Date</th>
                            <td>{humanReadableDate(inj.perfusion_date)} (survival time: {inj.survival_days} day{inj.survival_days > 1 ? 's' : ''})</td>
                        </tr>
                        {comment}
                    </tbody>
                </table>
            </div>
            <InfoTag />
        </div>
        );
    }
}
