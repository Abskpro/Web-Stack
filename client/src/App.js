import React, { Component } from "react";
/*react router*/
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
/*react bootstrap*/
import jwt_decode from "jwt-decode";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import "bootstrap/dist/css/bootstrap.min.css";


import "./App.css";
/*Components*/
import Toolbar from "./components/navigation/Toolbar/Toolbar";
import SideDrawer from "./components/navigation/SideDrawer/SideDrawer";
import Backdrop from "./components/Backdrop/Backdrop";
import BannerSearch from "./components/BannerSearch/BannerSearch";
import Footer from "./components/Foooter/Footer";
import Addroom from "./components/FormComponent/form.component.jsx";
import Login from "./components/FormContainer/Login/login.jsx";
import Registration from "./components/FormContainer/Registration/registration.jsx";
import PrivateRoute from "./components/privateRoute/privateRoute.jsx";
import EditPost from './components/Profile/EditPost/EditPost.jsx';

import SearchResult from './components/searchResult/SearchResult';
import PostDetail from './components/searchResult/PostDetail/PostDetail.jsx'
import setAuthToken from "./utils/setAuthToken.jsx";
import { setCurrentUser, logoutUser } from "./actions/authAction.jsx";
import Profile from './components/Profile/Profile.jsx';
// import EditPost from './components/Profile/EditPost/form.component.jsx';

(() => {
  //check for token to keep user logged in
  if (localStorage.jwtToken) {
    //set auth token header auth
    const token = localStorage.jwtToken;
    setAuthToken(token);
    //Decode  token and get user info and exp
    const decoded = jwt_decode(token);
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));
    //Check for expired token
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      //logout user
      store.dispatch(logoutUser());
      //Redirect to login
      window.location.href = "./";
    }
  }
})();

class App extends Component {
  state = {
    sideDrawerOpen: false,
  };
  drawerToggleClickHandler = () => {
    this.setState((prevState) => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen };
    });
  };
  backdropClickHandler = () => {
    this.setState({ sideDrawerOpen: false });
  };
  bannerFormClickHandler = () => {};
  render() {
    // let sideDrawer;
    let backdrop;

    if (this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler} />;
    }

    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Router>
            <div className="App" style={{ height: "100%" }}>
              <Toolbar drawerClickHandler={this.drawerToggleClickHandler} />
              <SideDrawer show={this.state.sideDrawerOpen} />
              {backdrop}
              <Switch>
                <Route path="/" exact component={BannerSearch} />
                <PrivateRoute exact path="/form" component={Addroom} />
                <Route path="/login" exact component={Login} />
                <Route path="/register" exact component={Registration} />
                <Route path = '/result' exact component = {SearchResult}/>
                <Route path="/details" component={PostDetail}/>
                <PrivateRoute path="/profile" component={Profile}/>
                <PrivateRoute path="/editPost" component={EditPost}/>
              </Switch>
              <Footer />
            </div>
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
