import React from 'react';
import Actions from '../actions/Actions';
import AppStore from '../stores/AppStore';
import _ from 'lodash';
import classNames from 'classnames';

export default class InjectionPager extends React.Component {
    constructor(props, context) {
        super(props, context);
        _.bindAll(this, 'handleHome', 'handlePrev', 'handleNext', 'handleEnd');
    }
    handleHome() {
        Actions.flipInjectionListPage(0, this.props.limit);
    }

    handlePrev() {
        Actions.flipInjectionListPage(this.props.start - this.props.limit, this.props.limit);
    }

    handleNext() {
        Actions.flipInjectionListPage(this.props.start + this.props.limit, this.props.limit);
    }

    handleEnd() {
        let total = this.props.injections.length;
        let last_start = total - (total % this.props.limit);
        Actions.flipInjectionListPage(last_start, this.props.limit);
    }

    render() {
        let injections = this.props.injections;
        let start = this.props.start;
        let limit = this.props.limit;
        var injection_count = 1;
        let page_end = start + limit;
        let total = injections.length;
        if (page_end > total) {
            page_end = total;
        }
        let home = null, prev = null;
        if (start > 0) {
            home = (<span className="pager-button pager-home" onClick={this.handleHome}>&lt;&lt;</span>);
            prev = (<span className="pager-button pager-prev" onClick={this.handlePrev}>&lt;</span>);
        } else {
            home = (<span className="pager-button pager-home pager-button-disabled">&lt;&lt;</span>);
            prev = (<span className="pager-button pager-prev pager-button-disabled">&lt;</span>);
        }
        let next = null, end = null;

        if (start + limit < total) {
            next = (<span className="pager-button pager-next" onClick={this.handleNext}>&gt;</span>);
            end = (<span className="pager-button pager-end" onClick={this.handleEnd}>&gt;&gt;</span>);
        } else {
            next = (<span className="pager-button pager-next pager-button-disabled">&gt;</span>);
            end = (<span className="pager-button pager-end pager-button-disabled">&gt;&gt;</span>);
        }
        return (
            <div className="pager">
                {home} {prev} {start + 1} - {page_end} of {total} injections {next} {end}
            </div>
        );
    }
}
