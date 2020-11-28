import React from 'react'

//import Components
import ProductItem from '../utils/productItem/ProductItem'

//import hooks from React
import { useContext, useState, useEffect } from 'react'

//import router components
import { useParams, Link } from 'react-router-dom'

//Imports the global state/products
import { GlobalState } from '../../../GlobalState'

const DetailProduct = () => {

    //Stores any parameters into a variable
    const params = useParams()
    
    //Grabs the global state
    const state = useContext(GlobalState)

    //Grabs the products from the state
    const [products] = state.productsAPI.products

    //Grabs the addCart fucntion from state
    const addCart = state.userAPI.addCart

    //Sets a state variable called detailProduct that holds
    //all data for the specific detail product
    const [detailProduct, setDetailProduct] = useState([])

    //Finds the product from the products array grabbed by the state,
    //to see which product matches the ID from the parameters. Then,
    //set the product found equal to the detailProduct state. If
    //there is a change with the parameter or products value, re-render
    useEffect(() => {
        if (params.id) {
            products.forEach( product => {
                if (product._id === params.id) setDetailProduct(product)
            })
        }
    }, [params, products])

    if (detailProduct.length === 0) return null;

    return(
        <>
        <div className="detail">
            <img src={detailProduct.images.url} alt="" />
            <div className="box-detail">
                <div className="row">
                    <h2>{detailProduct.title}</h2>
                    <h6>{detailProduct.product_id}</h6>
                </div>
                <span>$ {detailProduct.price}</span>
                <p>{detailProduct.description}</p>
                <p>{detailProduct.content}</p>
                <p>Sold: {detailProduct.sold}</p>
                <Link to="/cart" className="cart"
                onClick={() => addCart(detailProduct)}
                >   Buy Now
                </Link>
            </div>
        </div>

        <div>
            <h2>Related products</h2>
            <div className="products">
                {
                    products.map( product => {
                        return (product.category === detailProduct.category) && (product._id !== detailProduct._id)
                        ? <ProductItem key={product._id} product={product} /> : null
                    })
                }
            </div>
        </div>
        </>
    )
}

export default DetailProduct