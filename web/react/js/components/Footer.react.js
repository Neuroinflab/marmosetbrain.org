var React = require('react');
var ReactPropTypes = React.PropTypes;
var Actions = require('../actions/Actions');

var Footer = React.createClass({
/*
    propTypes: {
        allTodos: ReactPropTypes.object.isRequired
    },
*/
    /**
     * @return {object}
     */
    render: function() {
        var allTodos = this.props.allTodos;
        var total = Object.keys(allTodos).length;

        if (total === 0) {
            return null;
        }

        var completed = 0;
        for (var key in allTodos) {
            if (allTodos[key].complete) {
                completed++;
            }
        }

        var itemsLeft = total - completed;
        var itemsLeftPhrase = itemsLeft === 1 ? ' item ' : ' items ';
        itemsLeftPhrase += 'left';

        // Undefined and thus not rendered if no completed items are left.
        var clearCompletedButton;
        if (completed) {
            clearCompletedButton =
                <button
                    id="clear-completed"
                    onClick={this._onClearCompletedClick}>
                    Clear completed ({completed})
                </button>;
        }

        return (
            <div class="row-wrapper">
                <div class="outer-container">
                    <footer id="footer">
                    </footer>
                </div>
            </div>
        );
    },

    /**
     * Event handler to delete all completed TODOs
     */
    _onClearCompletedClick: function() {
        Actions.destroyCompleted();
    }

});

module.exports = Footer;
