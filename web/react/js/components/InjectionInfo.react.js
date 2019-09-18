import InjectionList from './InjectionList.react';
import Actions from '../actions/Actions';
import AppStore from '../stores/AppStore';
import React from 'react';

export default class InjectionInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        _.bindAll(this, 'handleChange');
        this.state = {
            filterType: null,
            filterByInjection: null
        }
    }
    componentDidMount() {
        AppStore.addChangeListener(this.handleChange);
        Actions.restoreFilter();
    }
    componentWillUnmount() {
        AppStore.removeChangeListener(this.handleChange);
    }
    handleChange() {
        this.setState(AppStore.getFilter());
    }
    /**
     * @return {object}
     */
    render()  {
        let inj_info = null;
        if (this.state.filterType == 'injection' && this.state.filterByInjection) {
            let inj = this.state.filterByInjection;
            let age = null;
            if (inj.dob && inj.injection_date) {
                let inj_date = new Date(inj.injection_date);
                let birth_date = new Date(inj.dob);
                let inj_year = inj_date.getFullYear();
                let birth_year = birth_date.getFullYear();
                var inj_month = inj_date.getMonth();
                var birth_month = birth_date.getMonth();
                let years = inj_year - birth_year;
                let months = inj_month - birth_month;
                if (inj_month < birth_month) {
                    years -= 1;
                    months += 12;
                }
                let y_s = '';
                if (years > 1) {
                    y_s = 's';
                }
                let m_s = '';
                if (months > 1) {
                    m_s = 's';
                }
                age = (<li>Age: {years} year{y_s}{months > 0 ? ' ' + months + ' month' + m_s : ''} old</li>);
            }
            inj_info = (
                <div className="injection-info" id="injection-selected-block">
                    <div>Injection Selected</div>
                    <div id="injection-selected-info">
                        <ul>
                            <li>Tracer: {inj.tracer}</li>
                            <li>Brain: {inj.display_name}</li>
                            <li>Section: {inj.section}</li>
                            <li>Region: {inj.region}</li>
                            <li>A: {inj.a.toFixed(1)} L: {inj.l.toFixed(1)} H: {inj.h.toFixed(1)}</li>
                            {age}
                            <li><a href={inj.action} target="_blank">View injection in section viewer</a></li>
                        </ul>
                    </div>
                </div>
            );
        }
        return (
            <td className="flatmap-info-pane">
                {inj_info}
                <InjectionList />
            </td>
        );
    }
}
