import React, { useContext, useState } from 'react';
import { GlobalState } from '../../../GlobalState'
import ProductItem from '../utils/productItem/ProductItem'
import Filters from './Filters'
import Loading from '../utils/loading/Loading'
import axios from 'axios'
import LoadMore from './LoadMore'

function Products() {

    //Grabs the state/children passed from GlobalState
    const state = useContext(GlobalState)

    const [products, setProducts] = state.productsAPI.products
    const [callback, setCallback] = state.productsAPI.callback
    const [token] = state.token
    const [isAdmin] = state.userAPI.isAdmin


    //Creating state
    const [loading, setLoading] = useState(false)
    const [isCheck, setIsCheck] = useState(false)

    const handleCheck = (id) => {
        products.forEach(product => {
            if (product._id === id) product.checked = !product.checked
        })
        setProducts([...products])
    }

    const deleteAll = () => {
        products.forEach(product => {
            if (product.checked) deleteProduct(product._id, product.images.public_id)
        })
    }

    const checkAll = () => {
        products.forEach(product => {
            product.checked = !isCheck
        })
        setProducts([...products])
        setIsCheck(!isCheck)
    }

    const deleteProduct = async (id, public_id) => {
        try {
            setLoading(true)
            const destroyImg = axios.post('/api/destroy', {public_id}, {
                headers: {Authorization: token}
            })
            const deleteProduct = axios.delete(`/api/products/${id}`, {
                headers: {Authorization: token}
            })

            await destroyImg
            await deleteProduct
            setCallback(!callback)
            setLoading(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    if (loading) return <div><Loading /></div>

    return (
        <>
        <Filters />
        {
            isAdmin &&
            <div className="delete-all">
                <span>Select all</span>
                <input type="checkbox" checked={isCheck} onChange={checkAll} />
                <button onClick={deleteAll}>Delete ALL</button>
            </div>
        }
        <div className="products">
            {
                products.map( product => {
                    return <ProductItem key={product._id} product={product} 
                    isAdmin={isAdmin} token={token} callback={callback} setCallback={setCallback} deleteProduct={deleteProduct} handleCheck={handleCheck} />
                })
            }
        </div>
        {products.length === 0 && <Loading />}
        <LoadMore />
        </>
    );
};

export default Products;