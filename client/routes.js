/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  LandingPage,
  Login,
  Signup,
  MyAccount,
  AdminHome,
  AllProducts,
  SingleProduct,
  CreateUserProfile,
  Cart,
  Checkout,
  OrderHistory
} from './components'
import {me} from './store'

const adminsOnly = (req, res, next) => {
  if (!req.user.isAdmin) {
    const err = new Error('You look lost. Follow us on Insta!')
    err.status = 401
    return next(err)
  }
  next()
}

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn, isAdmin} = this.props
    console.log('IS ADMIN?', isAdmin)
    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route exact path="/home" component={LandingPage} />
        <Route exact path="/products" component={AllProducts} />
        <Route exact path="/products/:productId" component={SingleProduct} />
        <Route exact path="/profiles" component={CreateUserProfile} />
        <Route exact path="/cart" component={Cart} />
        <Route exact path="/cart/checkout" component={Checkout} />
        <Route exact path="/" component={LandingPage} />
        {!isLoggedIn && (
          <Switch>
            {/* Routes placed here are only available before logging in */}
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
          </Switch>
        )}
        {isLoggedIn && (
          <Switch>
            {/* Routes placed here are only available after logging in */}
            <Route path="/myaccount" component={MyAccount} />
            <Route path="/order_history" component={OrderHistory} />

            {isAdmin && <Route path="/admin" component={AdminHome} />}
          </Switch>
        )}

        {/* {isAdmin && (
          <Switch>
          </Switch>
        )} */}
        {/* Displays our Login component as a fallback */}
        <Route path="*" component={LandingPage} />

        <Route component={Login} />
      </Switch>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id,
    isAdmin: !!state.user.isAdmin
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired
}

// {/* <Switch>
//         {/* Routes placed here are available to all visitors */}
//         <Route path="/login" component={Login} />
//         <Route path="/signup" component={Signup} />
//         <Route path="/profiles" component={CreateUserProfile} />
//         <Route path="/products" conponent={AllProducts} />
//         {isLoggedIn && (
//           <Switch>
//             {/* Routes placed here are only available after logging in */}
//             <Route path="/home" component={UserHome} />
//             <Route exact path="/profiles/:profileId" component={SingleUser} />;
//           </Switch>
//         )}
//         {/* Displays our Login component as a fallback */}
//         <Route component={Login} />
//       </Switch> */}
