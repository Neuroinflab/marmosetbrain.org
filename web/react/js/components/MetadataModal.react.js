import React, {Component} from 'react';
import Actions from '../actions/Actions';
import AppStore from '../stores/AppStore';
import _ from 'lodash';
import classNames from 'classnames';
import numberFormat from '../lib/numberformat';
import Modal from '../lib/modal';
import moment from 'moment';
import {expandTracerID, humanReadableDate, humanReadableDiffInMonth, parseAP, parseML, parseDV, getOffset} from '../lib/utils';
let modalStyle = {
    width: '80%',
    maxWidth: '1200px',
    scrollX: 'auto',
    overflow: 'scroll',
    maxHeight: '100%'
};


export default class MetadataModal extends Component {
    constructor(props, context) {
        super(props, context);
        _.bindAll(this, 'handleChange', 'handleEnhanceBorder',
                  'handleSet3D', 'handleShowCoordTip', 'handleHideCoordTip',
                  'handle3DEnter', 'handle3DLeave',
                  'handleShowFlatmapTip', 'handleHideFlatmapTip',
                  'handleShow3DTip', 'handleHide3DTip',
                  'handleShowCrossSectionTip', 'handleHideCrossSectionTip', 'handleUpdateCrossSectionTip',
                  'handle3DReset'
                 );
        this.state = {
            //p3d: AppStore.getPseudo3D(),
            top_lowres: false,
            bottom_lowres: false,
            top_done: false,
            bottom_done: false,
            showTip: false,
            showCrossSectionTip: false,
            showReset: false
        };
        let inj = this.props.injection;
        this.injection_name = (inj.display_name ? inj.display_name : inj.case_id) + '-' + inj.tracer;
    }
    componentDidMount() {
        AppStore.addChangeListener(this.handleChange);
    }
    componentWillUnmount() {
        AppStore.removeChangeListener(this.handleChange);
    }
    handleChange() {
        this.setState({
            //p3d: AppStore.getPseudo3D()
        });
    }
    handleEnhanceBorder(e) {
        let checked = e.target.checked;
        if (checked) {
            Actions.set3DIndex('borderAlpha', 100);
        } else {
            Actions.set3DIndex('borderAlpha', 0);
        }
    }
    handleSet3D(e) {
        let dest = $(e.target).data('dest');
        switch (dest) {
            case 'dorsal':
                Actions.set3DIndex('y', 0);
                break;
            case 'ventral':
                Actions.set3DIndex('y', 6);
                break;
            case 'left':
                Actions.set3DIndex('x', -12);
                break;
            case 'right':
                Actions.set3DIndex('x', 12);
                break;
            case 'transparent':
                Actions.set3DIndex('alpha', 100);
                break;
            case 'opaque':
                Actions.set3DIndex('alpha', 0);
                break;
        }

    }
    handleShowCoordTip() {
        //this.setState({showTip: true});
    }
    handleHideCoordTip() {
        //this.setState({showTip: false});
    }
    handleShowCrossSectionTip() {
        this.setState({showCrossSectionTip: true});
    }
    handleHideCrossSectionTip() {
        this.setState({showCrossSectionTip: false});
    }
    handleUpdateCrossSectionTip(e) {
        return;
        if (this.state.showCrossSectionTip) {
            let tooltip = d3.select(this.tt);
            let x_ = e.clientX + 0;
            let y_ = e.clientY - 80;
            console.log('e.screenY', e.screenY);
            /*
            let offset = getOffset($('.injection-detail-container')[0]);
            x_ -= offset.left;
            y_ -= offset.top;
            console.log('offset', offset);
            console.log('x, y', x_, y_);
                var node = $('.injection-detail-container')[0];
                var curtop = 0;
                var curtopscroll = 0;
                if (node.offsetParent) {
                    do {
                        curtop += node.offsetTop;
                        curtopscroll += node.offsetParent ? node.offsetParent.scrollTop : 0;
                    } while (node = node.offsetParent);

                    y_ -= (curtop - curtopscroll);
                    console.log('offset i get', (curtop - curtopscroll));
                    y_ += 400;
                }
            */
            let bbox = $('.injection-detail-container')[0].getBoundingClientRect();
            x_ -= bbox.left;
            y_ -= bbox.top;
            console.log('boxTop', bbox.top);
            tooltip
                .style("left", (x_) + "px")
                .style("top", (y_) + "px");
        }
    }
    handle3DEnter() {
        this.setState({showReset: true});
    }
    handle3DLeave() {
        this.setState({showReset: false});
    }
    handle3DReset() {
        let default_ = AppStore.getDefault3D();
        Actions.set3DIndex('x', default_.x);
        Actions.set3DIndex('y', default_.y);
        Actions.set3DIndex('alpha', default_.alpha);
    }
    handleShowFlatmapTip() {
        this.setState({showFlatmapTip: true});
    }
    handleHideFlatmapTip() {
        this.setState({showFlatmapTip: false});
    }
    handleShow3DTip() {
        this.setState({show3DTip: true});
    }
    handleHide3DTip() {
        this.setState({show3DTip: false});
    }
    render() {
        let loading;
        loading = (<div className="preloading">Loading Metadata for {this.injection_name}</div>);
        let area;
        let areaPicked = AppStore.getAreaPicked();
        let title = (<div className="main-title">{this.injection_name},  Injection into the <span className="area-fullname">{areaPicked.fullname}</span>, {areaPicked.abbrev}</div>);
        let inj = this.props.injection;
        let jump_href = 'http://www.marmosetbrain.org/goto/' + inj.case_id + '/'
            + inj.section + '/'
            + inj.section_x + '/'
            + inj.section_y
            + '/3';

        //<a className={classNames('jump', this.props.meta.tracer)} href={jump_href} target="_blank"><span className={classNames('icon-jump', this.props.meta.tracer)}/></a>
        let sub_title = (<div className="sub-title">
            <span className="coordinates" onMouseEnter={this.handleShowCoordTip} onMouseLeave={this.handleHideCoordTip}>
                {parseML(inj.l)} <br/>
                {parseAP(inj.a)} <br/>
                {parseDV(inj.h)}</span>
            <div className={classNames('tooltip', {hidden: !this.state.showTip})}>
                <div className="tip-title">
                    Stereotaxic coordinates (mm)
                </div>
                <div className="tip-item">
                    ML: Mediolateral, lateral to the midsagittal plane
                </div>
                <div className="tip-item">
                    AP: Rostrocaudal,
                    <div className="tip-subitem">
                        Positive: Caudal to interaural line<br/>
                        Negative: Rostral to interaural line
                    </div>
                </div>
                <div className="tip-item">
                    DV: Dorsoventral, Dorsal to the interaural line
                </div>
            </div>
        </div>);
        let sex;
        switch (inj.sex) {
            case 'M':
                sex = 'Male';
                break;
            case 'F':
                sex = 'Female';
                break;
            default:
                sex = 'Unknown';
                break;
        }
        let dob = humanReadableDate(inj.dob);
        let injection_date = humanReadableDate(inj.injection_date);
        let age = humanReadableDiffInMonth(inj.injection_date, inj.dob);
        let perfusion_date = humanReadableDate(inj.perfusion_date);
        let survival;
        if (inj.survival_days) {
            survival = '' + inj.survival_days + ' day' + (inj.survival_days > 1 ? 's' : '');
        }
        //<td>A {this.props.injection.a} L: {this.props.injection.l} H: {this.props.injection.h}</td>
        if (/^\s*$/.test(inj.case_memo)) {
            inj.case_memo = 'No case specific memo provided';
        }
        if (/^\s*$/.test(inj.memo)) {
            inj.memo = 'No injection specific memo provided';
        }
        //<span className="cursor-pointer" onMouseEnter={this.handleShowFlatmapTip} onMouseLeave={this.handleHideFlatmapTip}>[?]</span>
        //<span className="" onMouseEnter={this.handleShow3DTip} onMouseLeave={this.handleHide3DTip}>[?]</span>
        return (
            <div className="modal-content">
                <div className="modal-title">
                    <div className="title-box">
                        {title}
                    </div>
                </div>
                <div className="case-detail-container">
                    <div className="caption">Case details</div>
                    <table className="case-detail">
                        <tbody>
                            <tr>
                                <th>Case ID:</th><td>{inj.display_name}</td>
                            </tr>
                            <tr>
                                <th>Sex:</th><td>{sex}</td>
                            </tr>
                            <tr>
                                <th>Date of birth:</th>
                                <td>{dob}</td>
                            </tr>
                            <tr>
                                <th>Injection date:</th>
                                <td>{injection_date} &nbsp;&nbsp; {age ? '(' + age + ' old)' : ''}</td>
                            </tr>
                            <tr>
                                <th>Perfusion date:</th>
                                <td>
                                    {perfusion_date} &nbsp;&nbsp;
                                    {survival ? '(' + survival + ' survival time)' : ''}
                                </td>
                            </tr>
                            <tr>
                                <th colSpan="2" className="case-memo">Memo:</th>
                            </tr>
                            <tr>
                                <td colSpan="2">{inj.case_memo}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="note">
                        Hit [<strong>Esc</strong>] to close the window.<br/>
                    </div>
                </div>
                <div className="injection-detail-container">
                    <div className="caption">Injection details</div>
                    <div className={classNames('tooltip', 'p3d-tip', {hidden: !this.state.show3DTip})}>
                        Individual cells plotted against the mid-thickness cortical surface.<br/>The tip of the cone denotes the center of mass of the injection.
                    </div>
                    <table className="injection-detail">
                        <tbody>
                            <tr>
                                <th>Tracer:</th><td>{inj.tracer} ({expandTracerID(inj.tracer)})</td>
                            </tr>
                            <tr>
                                <td></td><td></td>
                            </tr>
                            <tr>
                                <th>Injection hemisphere:</th>
                                <td>{inj.hemisphere == 'R' ? 'Right hemisphere' : 'Left hemisphere'}</td>
                            </tr>
                            <tr>
                                <th>Area:</th>
                                <td>{areaPicked.name}, {inj.region}</td>
                            </tr>
                            <tr>
                                <td colSpan="2" className="cross-section">
                                    <div className="cross-section-caption">
                                        Injection site plotted against the reference template
                                    </div>
                                    <div className="cross-section-sub-caption">
                                        <div className="coronal label">Coronal</div>
                                        <div className="sagittal label">Sagittal</div>
                                        <div className="axial label">Horizontal</div>
                                    </div>
                                    <div className="cross-section-image-container">
                                        <a href={jump_href} target="_blank">
                                            <img src={'http://analytics.marmosetbrain.org/static/data/cross_sections/cross_section_' + this.injection_name + '.png?_=' + Date.now()}
                                                onMouseEnter={this.handleShowCrossSectionTip}
                                                onMouseLeave={this.handleHideCrossSectionTip}
                                                onMouseMove={this.handleUpdateCrossSectionTip}
                                            /></a>
                                    </div>
                                    <div className={classNames('tooltip', {hidden: !this.state.showCrossSectionTip})} ref={tt => {this.tt = tt; }}>
                                        <div className="tip-title">
                                            Click to view the injection site in the high-resolution viewer
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>Injection coordinates:</th>
                                <td>{sub_title}</td>
                            </tr>
                            <tr>
                                <th colSpan="2" className="injection-memo">Comments:</th>
                            </tr>
                            <tr>
                                <td colSpan="2">{this.injection_memo}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>);
    }
}
