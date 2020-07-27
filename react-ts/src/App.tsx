import React, { Component } from "react";
import { Route, Switch, HashRouter as Router } from "react-router-dom";
import Login from "./Login";
import Video from "./Video";
import Play from "./Play";

// export interface Props extends RouteComponentProps<any> {
//   name?: string;
// }

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/Video" component={Video} />
          <Route path="/Play" component={Play} />
        </Switch>
      </Router>
    );
  }
}
export default App;
