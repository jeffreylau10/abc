var myWidget = myWidget || {};

myWidget.Load = function () {
var AppItem = React.createClass({
                render() {
                    return <div className="appsitem">
                        <div className="appslogo">
                            xxxx
                        </div>
                        <div className="appsdesc">{this.props.appitem.text}</div>
                        </div>;
                }
            });            
            // this is a sample of the JSON returned
            var Apps = React.createClass({
                getInitialState() {
                    return { 
                        data1: [
                        { _id:0, text: 'temp - loading'},
                        { _id:1, text: 'temp - loading1'}
                            ]};                                        
                },
                componentDidMount() {   
                    var that = this;
                    var url = 'sampleappdata.json';
                    console.log('getting the data via promise');
                    fetch(url)
                    .then(function(response) {
                        if (response.status >= 400) {
                        throw new Error("Bad response from server");
                        }
                        return response.json();
                    })
                    .then(function(data) {
                        console.log('data function');
                        console.log(data);
                        that.setState({ data1: data });
                    });
                },
                getApps() {
                    fetch('sampleappdata.json').then(function(response){
                        return response.json()
                    });

                },
                getApps1() {                    
                    return [
                        { _id:1, text: 'this is app 1'},
                        { _id:2, text: 'this is app 2'}
                    ];
                },

                renderApps() {
                    //return this.getApps().map((appitem) => (
                    console.log('renderApps');
                    //this.setState({ data1: this.getApps1() });
                    console.log(this.state.data1);
                    
                    return this.state.data1.map((appitem) => (    
                        <AppItem key={appitem._id} appitem={appitem} />
                    ));
                },

                render() {
                    console.log('render first?');
                    return <div><FlatButton label="Default" /></div>;
                    //return <div className="appsitem">{this.renderApps()}</div>;
                    //return <div className="appsitem"></div>;
                }
            });

            ReactDOM.render(
                <Apps name="component" />, 
                document.getElementById('root')
            );

};