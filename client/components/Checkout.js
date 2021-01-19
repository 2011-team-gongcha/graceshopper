import React from 'react'
import {connect} from 'react-redux'
import {
  fetchOrder,
  fetchLocalStorageData,
  checkoutUser,
  checkoutGuest
} from '../store/cart'
import {Comfirmed} from '../../server/db/models/constant'

class Checkout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {order: {status: Comfirmed}, submit: false, item: {}}
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    console.log(event.target)
    this.setState({
      order: {...this.state.order, [event.target.name]: event.target.value}
    })
  }

  async handleSubmit(event) {
    event.preventDefault()
    console.log('submit')
    try {
      if (this.props.user.id) {
        await checkoutUser(this.state.order.id, this.state.order)
        this.setState({submit: true})
      } else {
        await checkoutGuest(this.state)
        this.setState({submit: true})
      }
    } catch (error) {
      console.log(error)
    }
  }

  async componentDidMount() {
    try {
      if (this.props.user.id) {
        await this.props.getOrder(this.props.user.id)
        this.setState({order: this.props.order})
      } else {
        await this.props.getLocalStorage()
        this.setState({item: this.props.order})
      }
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <div className="cartContainer">
        <div className="itemContainer">
          <h3>SHIPPING INFOMATION</h3>
          <hr />
          <div className="formContainer">
            <form onSubmit={this.handleSubmit}>
              <label htmlFor="email">EMAIL</label>
              <input
                type="text"
                name="email"
                onChange={this.handleChange}
                // value={'test'}
                // ?this.props.user.email || ''
              />
              <div className="halfField">
                <label htmlFor="firstName">FIRST NAME</label>
                <input
                  type="text"
                  name="firstName"
                  onChange={this.handleChange}
                  value={this.props.user.firstName || ''}
                />
              </div>
              <div className="halfField">
                <label htmlFor="lastName">LAST NAME</label>
                <input
                  type="text"
                  name="lastName"
                  onChange={this.handleChange}
                  value={this.props.user.lastName || ''}
                />
              </div>
              <label htmlFor="sAddress">STREET ADDRESS</label>
              <input
                type="text"
                name="sAddress"
                onChange={this.handleChange}
                value={this.props.user.sAddress || ''}
              />
              <label htmlFor="sCity">CITY</label>
              <input
                type="text"
                name="sCity"
                onChange={this.handleChange}
                value={this.props.user.sCity || ''}
              />
              <label htmlFor="sState">STATE</label>
              <input
                type="text"
                name="sState"
                onChange={this.handleChange}
                value={this.props.user.sState || ''}
              />
              <label htmlFor="sZipCode">ZIP CODE</label>
              <input
                type="text"
                name="sZipCode"
                onChange={this.handleChange}
                value={this.props.user.sZipCode || ''}
              />
              <label htmlFor="country">COUNTRY</label>
              <input
                type="text"
                name="country"
                onChange={this.handleChange}
                value={this.props.user.country || ''}
              />
              <label htmlFor="phone">PHONE NUMBER</label>
              <input
                type="text"
                name="phone"
                onChange={this.handleChange}
                value={this.props.user.phone || ''}
              />
              <button type="submit">Submit Order</button>
            </form>
          </div>
        </div>
        <div className="summaryContainer">
          <div>
            <h3>ORDER SUMMARY</h3>
            <hr />
            <div className="summaryInfo">
              <p>{`Total Price: $${this.props.order.totalPrice / 100}`}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    user: state.user,
    order: state.order
  }
}

const mapDispatch = dispatch => {
  return {
    getOrder: userId => dispatch(fetchOrder(userId)),
    getLocalStorage: () => dispatch(fetchLocalStorageData()),
    checkoutUser: (orderId, orderData) =>
      dispatch(checkoutUser(orderId, orderData)),
    checkoutGuest: orderData => dispatch(checkoutGuest(orderData))
  }
}

export default connect(mapState, mapDispatch)(Checkout)