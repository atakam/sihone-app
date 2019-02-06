import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import combineReducers from "./reducers";

import "assets/css/material-dashboard-react.css?v=1.4.1";
import "assets/css/custom.css";

import indexRoutes from "routes/index.jsx";

import { fetchAuthenticated } from "./actions/account";

const hist = createBrowserHistory();

const store = createStore(
  combineReducers,
  applyMiddleware(thunk)
);

store.dispatch(fetchAuthenticated())
  .then(() => {
    ReactDOM.render(
      <Provider store={store}>
        <Router history={hist}>
          <Switch>
            {indexRoutes.map((prop, key) => {
              return <Route path={prop.path} component={prop.component} key={key} />;
            })}
          </Switch>
        </Router>
      </Provider>,
      document.getElementById("root")
    );
  });
