/* eslint-disable react/no-unused-state */
import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {
  fetchOrder,
  fetchLocalStorageData,
  removeItemThunk,
  removeFromLocalStrage,
  updateQtyThunk,
  editLocalStorage
} from '../store/cart'
import {fetchProducts} from '../store/allProducts'
import {fetchUserWithProfile} from '../store/user'

class Cart extends React.Component {
  constructor() {
    super()
    this.state = {items: [], totalPrice: 0, totalItems: 0}
    this.handleDeleteItem = this.handleDeleteItem.bind(this)
  }

  async componentDidMount() {
    try {
      await this.props.getProducts()
      //if logged-in user:
      if (this.props.user.id) {
        await this.props.getUser(this.props.user.id)
        await this.props.getOrder(this.props.user.id)
        this.setState({
          items: this.props.order.products
        })
      } else {
        // if guest
        await this.props.getLocalStorage()
        const itemsIds = Object.keys(this.props.order)
        const items = this.props.products.filter(item => {
          return itemsIds.includes(String(item.id))
        })
        items.forEach(item => {
          item.qty = this.props.order[item.id]
          item.subtotal = item.qty * item.price
        })

        this.setState({items: items})
      }
      const totalItems = this.state.items.reduce((acc, curr) => {
        return acc + (curr.qty || curr.itemOrder.qty)
      }, 0)
      const totalPrice = this.state.items.reduce((acc, curr) => {
        return acc + (curr.subtotal || curr.itemOrder.subtotal)
      }, 0)
      this.setState({totalItems, totalPrice})
    } catch (error) {
      console.log(error)
    }
  }

  async handleDeleteItem(productId) {
    try {
      if (this.props.user.id) {
        await this.props.removeAnItemThunk(this.props.user.id, productId)
        this.setState({items: this.props.order.products})
      } else {
        await this.props.removeFromLocalStrage(productId)
        const itemsIds = Object.keys(this.props.order)
        const items = this.props.products.filter(item => {
          return itemsIds.includes(String(item.id))
        })
        items.forEach(item => {
          item.qty = this.props.order[item.id]
          item.subtotal = item.qty * item.price
        })

        this.setState({items: items})
      }
      const totalItems = this.state.items.reduce((acc, curr) => {
        return acc + (curr.qty || curr.itemOrder.qty)
      }, 0)
      const totalPrice = this.state.items.reduce((acc, curr) => {
        return acc + (curr.subtotal || curr.itemOrder.subtotal)
      }, 0)
      this.setState({totalPrice, totalItems})
    } catch (error) {
      console.log(error)
    }
  }

  async handleChangeQty(itemId, qty) {
    try {
      if (this.props.user.id) {
        await this.props.updateQty(this.props.user.id, itemId, {updateQty: qty})
        this.setState({items: this.props.order.products})
      } else {
        await this.props.editLocalStorage(itemId, Number(qty))
        const itemsIds = Object.keys(this.props.order)
        const items = this.props.products.filter(item => {
          return itemsIds.includes(String(item.id))
        })
        items.forEach(item => {
          item.qty = this.props.order[item.id]
          item.subtotal = item.qty * item.price
        })
        this.setState({items: items})
      }
      const totalItems = this.state.items.reduce((acc, curr) => {
        return acc + (curr.qty || curr.itemOrder.qty)
      }, 0)
      const totalPrice = this.state.items.reduce((acc, curr) => {
        return acc + (curr.subtotal || curr.itemOrder.subtotal)
      }, 0)
      this.setState({totalItems, totalPrice})
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <div className="cartContainer">
        <div className="itemContainer">
          <h2>MY CART</h2>
          <hr />
          {this.state.items[0] ? (
            <div className="itemCardContainer">
              {this.state.items.map(item => {
                return (
                  <div className="cartCard" key={item.id}>
                    <div className="cardImage">
                      <img src={item.imageUrl} />
                    </div>
                    <div className="cardItemInfo">
                      <Link to={`/products/${item.id}`}>{item.name}</Link>
                      <p>{`Color: ${item.color}`}</p>
                      <p>{`Size: ${item.size}`}</p>
                      <p>{`Price: $${item.price / 100}`}</p>
                      {/* <p>{`Quantity: ${
                        item.qty || item.itemOrder.qty || 1
                      }`}</p> */}
                      <label htmlFor="qty">Quantity:</label>
                      <select
                        value={item.qty || item.itemOrder.qty || 1}
                        onChange={event => {
                          this.handleChangeQty(item.id, event.target.value)
                        }}
                      >
                        {[1, 2, 3, 4, 5, 6, 7].map(num => {
                          return (
                            <option key={num} value={`${num}`}>
                              {num}
                            </option>
                          )
                        })}
                      </select>
                      <p>{`Subtotal: $${item.subtotal / 100 ||
                        item.itemOrder.subtotal / 100}`}</p>

                      <button
                        onClick={() => {
                          this.handleDeleteItem(item.id)
                        }}
                      >
                        Remove from cart
                      </button>
                    </div>
                  </div>
                )
              })}{' '}
            </div>
          ) : (
            <div>Your cart is empty!</div>
          )}
        </div>

        <div className="summaryContainer">
          <div>
            <h2>ORDER SUMMARY</h2>
            <hr />
            <div className="summaryInfo">
              {' '}
              <p>{`Total Items: ${this.state.totalItems}`}</p>
              <p>{`Total Price: $${this.state.totalPrice / 100}`}</p>
              <Link
                to={{
                  pathname: 'cart/checkout',
                  totalItems: this.state.totalItems,
                  totalPrice: this.state.totalPrice
                }}
              >
                <button disabled={!this.state.items[0]}>Checkout</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    order: state.order,
    products: state.products,
    user: state.user,
    singleUser: state.singleUser
  }
}

const mapDispatch = dispatch => {
  return {
    getOrder: userId => dispatch(fetchOrder(userId)),
    getProducts: () => dispatch(fetchProducts()),
    getUser: userId => dispatch(fetchUserWithProfile(userId)),
    getLocalStorage: () => dispatch(fetchLocalStorageData()),
    removeAnItemThunk: (userId, productId) =>
      dispatch(removeItemThunk(userId, productId)),
    removeFromLocalStrage: productId =>
      dispatch(removeFromLocalStrage(productId)),
    updateQty: (userId, productId, updateObj) =>
      dispatch(updateQtyThunk(userId, productId, updateObj)),
    editLocalStorage: (productId, qty) =>
      dispatch(editLocalStorage(productId, qty))
  }
}

export default connect(mapState, mapDispatch)(Cart)
