"use strict";

var myWidget = myWidget || {};

myWidget.Load = function () {
    /*$(document).ready(function() {
                //alert('allo!');
                //alert($().SPServices.SPGetCurrentSite());
                var MyAppPromise = $().SPServices.SPGetListItemsJson({                    
                    listName: "Personal eApps",
                    debug: true
                });

                $.when(MyAppPromise).done(function() {
                    alert("done retrieving!");
                    //console.log(MyAppPromise);
                    console.log(this.data);
                })                
            })
      */
            
var sampleText = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?";

var AppItem = React.createClass({
    displayName: "AppItem",
    render: function render() {
        return React.createElement(
            "p",
            null,
            sampleText
        );
    }
});

var App = React.createClass({
    displayName: "App",
    getInitialState: function getInitialState() {
        return {
            choiceMade: false
        };
    },
    onRadio: function onRadio() {
        console.log('choice made');
        this.setState({
            choiceMade: true
        });
    },
    render: function render() {
        return React.createElement(
            "div",
            { className: "appsitem" },
            React.createElement(
                "div",
                { className: "appslogo" },
                "xxxx"
            ),
            React.createElement(AppItem, { id: "1" }),
            React.createElement(AppItem, { id: "2" }),
            React.createElement(AppItem, { id: "2" }),
            React.createElement(AppItem, { id: "2" }),
            React.createElement(AppItem, { id: "2" }),
            React.createElement(AppItem, { id: "2" }),
            React.createElement(AppItem, { id: "2" })
        );
    }
});

ReactDOM.render(React.createElement(App, { name: "component", text: "hello" }), document.getElementById('root'));
};