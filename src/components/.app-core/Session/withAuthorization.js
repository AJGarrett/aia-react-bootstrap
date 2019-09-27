import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './context'
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../../constants/routes';
//import { auth } from 'firebase';

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {

    componentDidMount() {
        this.listener = this.props.firebase.onAuthUserListener(
            authUser => {

              if (!condition(authUser)) {
                console.log("condition failed");
                this.props.history.push(ROUTES.DENY);
              }
            },
            () => this.props.history.push(ROUTES.SIGN_IN),
          );
    }

    componentWillUnmount() {
        this.listener();
    }

    render() {
        
        return(
            <AuthUserContext.Consumer>
                {authUser =>
                condition(authUser) ? <Component {...this.props} /> : null
                }
            </AuthUserContext.Consumer>
        )
    }
  }

  return compose(
    withRouter,
    withFirebase,
  ) (WithAuthorization);
};

export default withAuthorization;