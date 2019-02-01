// import de react
import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
// si je m'utilisais que le 'render' de React.DOM je pourrais juste dire que j'ai besoin que de ca
// import { render } from 'react-dom';
import {Route, BrowserRouter, Link, Switch} from 'react-router-dom';
import 'typeface-raleway';
import './index.css';
//import registerServiceWorker from './registerServiceWorker';


//custom comp
import Home from './App'; // la mon module s'appelle App mais j'ai emvie de lui donner un autre nom qd je l'utilise ici parce que contextuellement c'est la Home
import SeriesItemLister from './series/ItemLister';
import EpisodesItemLister from './episodes/ItemLister';
import EpisodesCachedItemLister from './episodes/CachedItemLister';
import ApiItemLister from './series/ApiItemLister';
// Initialize Firebase
const config = {
    apiKey: "AIzaSyBGd17lYHFfBrTcJHj0yKQ8gPjhK0z8i0M",
    authDomain: "chatroom-9dc3c.firebaseapp.com",
    databaseURL: "https://chatroom-9dc3c.firebaseio.com",
    projectId: "chatroom-9dc3c",
    storageBucket: "chatroom-9dc3c.appspot.com",
    messagingSenderId: "892032838074"
};
firebase.initializeApp(config);

// The Header creates links that can be used to navigate
// between routes.
const Header = () => (
    <nav className="navbar">
        <ul className="navbar-list clearfix">
            <li className="navbar-item"><Link className="navbar-link" to={`${process.env.PUBLIC_URL}/`}>Home</Link></li>
            <li className="navbar-item"><Link className="navbar-link" to={`${process.env.PUBLIC_URL}/json_search`}>JSON</Link></li>
            <li className="navbar-item"><Link className="navbar-link" to={`${process.env.PUBLIC_URL}/cached_json_search`}>CACHED + JSON</Link></li>
            <li className="navbar-item"><Link className="navbar-link" to={`${process.env.PUBLIC_URL}/api_search`}>API</Link></li>
        </ul>
    </nav>
)

const Main = () => (
    <main className="container">
        <Switch>
            <Route exact path={`${process.env.PUBLIC_URL}/`} component={Home}/>
            <Route path={`${process.env.PUBLIC_URL}/all`} component={SeriesItemLister}/>
            <Route path={`${process.env.PUBLIC_URL}/json_search`} component={EpisodesItemLister}/>
            <Route path={`${process.env.PUBLIC_URL}/cached_json_search`} component={EpisodesCachedItemLister}/>
            <Route path={`${process.env.PUBLIC_URL}/api_search`} component={ApiItemLister}/>
        </Switch>
    </main>
)

const App = () => (
    <div className="">
        <Header/>
        <Main/>
    </div>
)

ReactDOM.render((
    <BrowserRouter basename={'/'}>
        <App/>
    </BrowserRouter>
), document.getElementById('root'))