import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchProducts} from '../store/allProducts'
import {motion} from 'framer-motion'
import {makeStyles} from '@material-ui/core/styles'

// const containerVariants = {
//   hidden: {
//     opacity: 0,
//     x: '100vw'
//   },
//   visible: {
//     opacity: 1,
//     x: 0,
//     transition: {
//       type: 'spring',
//       delay: 0.5
//     }
//   }
// }

// const nextVariants = {
//   hidden: {
//     x: '-100vw'
//   },
//   visible: {
//     x: 0,
//     transiton: {type: 'spring', stiffness: 120}
//   }
// }

class AllProducts extends React.Component {
  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    try {
      await this.props.getProducts()
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <motion.div
        className="landing-page"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 1}}
      >
        <div className="allProductsContainer">
          <div className="sidebar">
            <img src="/sidebar_img.png" />
            <img src="/sort_img.png" />
          </div>
          <div className="cardContainer">
            {this.props.products.map(product => {
              return (
                <div className="card" key={product.id}>
                  <Link to={`/products/${product.id}`}>
                    <div className="imageContainer">
                      <img src={product.imageUrl} />
                    </div>
                  </Link>
                  <div className="inforContainer">
                    <p>{product.name}</p>
                    <p>${product.price / 100}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>
      // <Card className={classes.root}>
      //   <CardActionArea>
      //     <CardMedia
      //       className={classes.media}
      //       image="https://s7d1.scene7.com/is/image/BHLDN/59278606_011_b5?$pdpmain$"
      //       title="Contemplative Reptile"
      //     />
      //   </CardActionArea>
      //   <CardActions>
      //     <Button size="small" color="primary">
      //       Some dress name.
      //     </Button>
      //     <Button size="small" color="primary">
      //       Learn More
      //     </Button>
      //   </CardActions>
      // </Card>
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
    getProducts: () => dispatch(fetchProducts())
  }
}

export default connect(mapState, mapDispatch)(AllProducts)
