import React from 'react'
import {connect} from 'react-redux'
import {
  fetchProducts,
  deleteProduct,
  postProduct,
  updateProduct
} from '../store/allProducts'
import {
  List,
  Paper,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Fab,
  Button
} from '@material-ui/core'
const {
  Mermaid,
  Ballgown,
  Aline,
  Sheath,
  Other,
  Silk,
  Crepe,
  Polyester,
  White
} = require('../../server/db/models/constant')
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'

const defaultState = {
  product: {},
  addFormOpen: false,
  editFormOpen: false,
  currentProductId: null
}
// let editFormOpen = false
// let currentProductId;

class ManageProducts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      product: {},
      addFormOpen: false,
      editFormOpen: false,
      currentProductId: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    // this.onOpenHandler = this.onOpenHandler.bind(this)
    this.onUpdateHandler = this.onUpdateHandler.bind(this)
  }

  async componentDidMount() {
    try {
      await this.props.getProducts()
    } catch (error) {
      console.log('This is componentDidMount error', error)
    }
  }

  onOpenHandler(product) {
    this.setState({
      ...this.state,
      product: product,
      editFormOpen: true,
      addFormOpen: false,
      currentProductId: product.id
    })
  }

  onUpdateHandler(event) {
    this.props.updateProduct(this.state.currentProductId, this.state.product)
    // this.setState({
    //   ...this.state,
    //   editFormOpen: false,
    //   currentProductId: null
    // })
  }

  onOpenAddForm(event) {
    this.setState({
      ...this.state,
      addFormOpen: true,
      editFormOpen: false,
      currentProductId: null
    })
  }

  onCloseAddForm(event) {
    this.setState(defaultState)
  }

  onCloseEditForm(event) {
    this.setState(defaultState)
  }

  handleChange(event) {
    this.setState({
      ...this.state,
      product: {...this.state.product, [event.target.name]: event.target.value}
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.addProduct(this.state.product)
    this.setState(defaultState)
  }

  deleteHandler(id) {
    this.props.deleteProduct(id)
  }

  render() {
    return (
      <div className="adminContainer">
        <div className="adminListContainer">
          {/* ADD FORM */}
          <Paper>
            {this.state.addFormOpen ? (
              <form onSubmit={this.handleSubmit}>
                {/* NAME */}
                <label htmlFor="name">
                  Name:
                  {this.props.warningMessage && (
                    <span>{this.props.warningMessage}</span>
                  )}
                </label>
                <input
                  name="name"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.product.name}
                  placeholder={this.state.product.name}
                />

                {/* PRICE */}
                <label htmlFor="price">
                  Price:
                  {this.props.warningMessage && (
                    <span>{this.props.warningMessage}</span>
                  )}
                </label>
                <input
                  name="price"
                  type="number"
                  onChange={this.handleChange}
                  value={this.state.product.price}
                  placeholder={this.state.product.price}
                />

                {/* FIT */}
                <label htmlFor="fit">
                  Fit:
                  {this.props.warningMessage && (
                    <span>{this.props.warningMessage}</span>
                  )}
                </label>
                <select
                  name="fit"
                  onChange={this.handleChange}
                  value={this.state.product.fit}
                >
                  <option value={Mermaid}>Mermaid</option>
                  <option value={Ballgown}>Ballgown</option>
                  <option value={Aline}>A-line</option>
                  <option value={Sheath}>Sheath</option>
                  <option value={Other}>Other</option>
                </select>

                {/* MATERIAL */}
                <label htmlFor="material">
                  Material:
                  {this.props.warningMessage && (
                    <span>{this.props.warningMessage}</span>
                  )}
                </label>
                <select
                  name="material"
                  onChange={this.handleChange}
                  value={this.state.product.material}
                >
                  <option value={Silk}>Silk</option>
                  <option value={Crepe}>Crepe</option>
                  <option value={Polyester}>Polyester</option>
                  <option value={Other}>Other</option>
                </select>

                {/* COLOR */}
                <label htmlFor="color">
                  Color:
                  {this.props.warningMessage && (
                    <span>{this.props.warningMessage}</span>
                  )}
                </label>
                <input
                  name="color"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.product.color}
                  placeholder={this.state.product.color}
                />

                {/* SIZE */}
                <label htmlFor="size">
                  Size:
                  {this.props.warningMessage && (
                    <span>{this.props.warningMessage}</span>
                  )}
                </label>
                <input
                  name="size"
                  type="number"
                  onChange={this.handleChange}
                  value={this.state.product.size}
                  placeholder={this.state.product.size}
                />

                {/* IMAGE URL */}
                <label htmlFor="imageUrl">
                  Image Url:
                  {this.props.warningMessage && (
                    <span>{this.props.warningMessage}</span>
                  )}
                </label>
                <input
                  name="imageUrl"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.product.imageUrl}
                  placeholder={this.state.product.imageUrl}
                />

                {/* DESCRIPTION */}
                <label htmlFor="description">
                  Description:
                  {this.props.warningMessage && (
                    <span>{this.props.warningMessage}</span>
                  )}
                </label>
                <input
                  name="description"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.product.description}
                  placeholder={this.state.product.description}
                />

                <Button type="submit">Add</Button>
                <Button onClick={() => this.onCloseAddForm()}>Close</Button>
              </form>
            ) : (
              <Button onClick={() => this.onOpenAddForm()}>
                Add a New Product
              </Button>
            )}
          </Paper>

          {/* PRODUCT LIST */}
          <Paper>
            <List>
              {this.props.products.map(product => {
                return (
                  <div key={product.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar src={product.imageUrl} />
                      </ListItemAvatar>
                      <ListItemText primary={product.name} />
                      <Fab
                        size="small"
                        onClick={() => this.deleteHandler(product.id)}
                      >
                        <DeleteIcon />
                      </Fab>
                      <Fab
                        size="small"
                        onClick={() => this.onOpenHandler(product)}
                      >
                        <EditIcon />
                      </Fab>
                    </ListItem>

                    {/* EDIT FORM */}
                    {this.state.editFormOpen &&
                    this.state.currentProductId === product.id ? (
                      <Paper>
                        <form onSubmit={this.onUpdateHandler}>
                          {/* NAME */}
                          <label htmlFor="name">
                            Name:
                            {this.props.warningMessage && (
                              <span>{this.props.warningMessage}</span>
                            )}
                          </label>
                          <input
                            name="name"
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.product.name}
                          />

                          {/* PRICE */}
                          <label htmlFor="price">
                            Price:
                            {this.props.warningMessage && (
                              <span>{this.props.warningMessage}</span>
                            )}
                          </label>
                          <input
                            name="price"
                            type="number"
                            onChange={this.handleChange}
                            value={this.state.product.price}
                          />

                          {/* FIT */}
                          <label htmlFor="fit">
                            Fit:
                            {this.props.warningMessage && (
                              <span>{this.props.warningMessage}</span>
                            )}
                          </label>
                          <select
                            name="fit"
                            value={this.state.product.fit}
                            onChange={this.handleChange}
                          >
                            <option value={Mermaid}>Mermaid</option>
                            <option value={Ballgown}>Ballgown</option>
                            <option value={Aline}>A-line</option>
                            <option value={Sheath}>Sheath</option>
                            <option value={Other}>Other</option>
                          </select>

                          {/* MATERIAL */}
                          <label htmlFor="material">
                            Material:
                            {this.props.warningMessage && (
                              <span>{this.props.warningMessage}</span>
                            )}
                          </label>
                          <select
                            name="material"
                            value={this.state.product.material}
                            onChange={this.handleChange}
                          >
                            <option value={Silk}>Silk</option>
                            <option value={Crepe}>Crepe</option>
                            <option value={Polyester}>Polyester</option>
                            <option value={Other}>Other</option>
                          </select>

                          {/* COLOR */}
                          <label htmlFor="color">
                            Color:
                            {this.props.warningMessage && (
                              <span>{this.props.warningMessage}</span>
                            )}
                          </label>
                          <input
                            name="color"
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.product.color}
                          />

                          {/* SIZE */}
                          <label htmlFor="size">
                            Size:
                            {this.props.warningMessage && (
                              <span>{this.props.warningMessage}</span>
                            )}
                          </label>
                          <input
                            name="size"
                            type="number"
                            onChange={this.handleChange}
                            value={this.state.product.size}
                          />

                          {/* IMAGE URL */}
                          <label htmlFor="imageUrl">
                            Image Url:
                            {this.props.warningMessage && (
                              <span>{this.props.warningMessage}</span>
                            )}
                          </label>
                          <input
                            name="imageUrl"
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.product.imageUrl}
                          />

                          {/* DESCRIPTION */}
                          <label htmlFor="description">
                            Description:
                            {this.props.warningMessage && (
                              <span>{this.props.warningMessage}</span>
                            )}
                          </label>
                          <input
                            name="description"
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.product.description}
                          />

                          <Button type="submit">Save</Button>
                          <Button onClick={() => this.onCloseEditForm()}>
                            Discard Changes
                          </Button>
                        </form>
                      </Paper>
                    ) : null}
                  </div>
                )
              })}
            </List>
          </Paper>
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    products: state.products
  }
}

const mapDispatch = dispatch => {
  return {
    getProducts: () => dispatch(fetchProducts()),
    deleteProduct: id => dispatch(deleteProduct(id)),
    addProduct: product => dispatch(postProduct(product)),
    updateProduct: (id, product) => dispatch(updateProduct(id, product))
  }
}

export default connect(mapState, mapDispatch)(ManageProducts)
