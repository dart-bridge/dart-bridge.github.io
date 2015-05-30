import React from 'react';
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import Router from 'react-router';
var { Route, RouteHandler, DefaultRoute, Redirect } = Router;

import Header from './Components/Header';
import Footer from './Components/Footer';
import Page from './Components/Page';
import Home from './Pages/Home';

class App extends React.Component {

    render() {
        var name = this.context.router.getCurrentPath();
        return (
            <div>
                <main className="container">
                    <div className="row">
                        <div className="col col-sm-3">
                            <Header />
                        </div>
                        <div className="col col-sm-9">
                            <TransitionGroup component="div" transitionName="pages">
                                <RouteHandler key={name}/>
                            </TransitionGroup>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}
App.contextTypes = {
    router: React.PropTypes.func
};

class PageHandler extends React.Component {
    render() {
        var segmentMap = this.context.router.getCurrentParams();
        var segments = [];
        for (var key in segmentMap) {
            if (segmentMap.hasOwnProperty(key))
                segments.push(segmentMap[key]);
        }
        return (
            <div className="page-container">
                <Page page={segments.join('/')}/>
            </div>
        )
    }
}
PageHandler.contextTypes = {
    router: React.PropTypes.func
};

var routes = (
    <Route handler={App}>
        <Redirect from='/' to='/installation' />
        <Route path='/:page' handler={PageHandler}/>
        <Route path='/:page/:subPage' handler={PageHandler}/>
        <Route path='/:page/:subPage/:subSubPage' handler={PageHandler}/>
        <Route path='/:page/:subPage/:subSubPage/:subSubSubPage' handler={PageHandler}/>
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('app'));
});
