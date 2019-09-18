var Footer = require('./Footer.react');
var Header = require('./Header.react');
//var MainSection = require('./MainSection.react');
import _ from 'lodash';
//var React = require('react');
import React from 'react';
import MainSection from './MainSection.react';
import AppStore from'../stores/AppStore';

function getState() {
    return {
    };
}

export default class MarmosetConnectomApp extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = getState();
        _.bindAll(this, '_onChange');
    }
    componentDidMount() {
        AppStore.addChangeListener(this._onChange);
        console.log('ok listener registered');
    }


    componentWillUnmount() {
        AppStore.removeChangeListener(this._onChange);
    }

    /**
     * @return {object}
     */
    render() {
        return (
            <div className="full-width-height">
                <Header />
                <div id="messages"></div>
                <MainSection
                />
            </div>
        );
    }

    _onChange() {
        this.setState(getState());
    }

};

//allTodos={this.state.allTodos}
//areAllComplete={this.state.areAllComplete}
//<Footer allTodos={this.state.allTodos} />
//module.exports = MarmosetConnectomeApp;
