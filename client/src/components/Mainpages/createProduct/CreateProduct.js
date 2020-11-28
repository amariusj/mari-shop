import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import {GlobalState} from '../../../GlobalState'
import Loading from '../utils/loading/Loading'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'

const CreateProduct = () => {

    const state = useContext(GlobalState)

    //Global State variables
    const [products] = state.productsAPI.products
    const [callback, setCallback] = state.productsAPI.callback
    const [categories] = state.categoriesAPI.categories 
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token

       //Create initial state for creating a new product
       const initialState = {
        product_id: '',
        title: '',
        price: 0,
        description: 'Fully functioning Web Applications using MERN Stack technology. Follow for more.',
        content: 'Welcome to my website! Feel free to send me a message at !',
        category: '5fbc5a028b200216302e3d97',
        _id: ''
    }

    //Created state
    const [onEdit, setOnEdit] = useState(false)
    const [images, setImages] = useState(false)
    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState(initialState)
    
    //Browser router uses
    const history = useHistory()
    const param = useParams()


    //FUNCTIONS 
    const handleUpload = async e => {
        e.preventDefault()
        try {
            if (!isAdmin) return alert("You're not an admin")

            const file = e.target.files[0]

            if (!file) return alert("File does not exist")

            if (file.size > 1024 * 2014) //1mb
                return alert("Size too large!")

            if (file.type !== 'image/jpeg' && file.type !== 'image/png')
                return alert("File format is not supported")

            let formData = new FormData()
            formData.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/upload', formData, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })
            setLoading(false)
            
            setImages(res.data)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleDestroy = async () => {
        try {
            if (!isAdmin) return alert("You're not an admin")
            
            setLoading(true)

            await axios.post('/api/destroy', {public_id: images.public_id}, {
                headers: {Authorization: token}
            })

            setLoading(false)
            setImages(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            if (!isAdmin) return alert("You're not an admin")
            if (!images) return alert("No Image Upload")

            if (onEdit) {
                await axios.put(`/api/products/${product._id}`, {...product, images}, {
                    headers: {Authorization: token}
                })
            } else {
                await axios.post(`/api/products/${product._id}`, {...product, images}, {
                    headers: {Authorization: token}
                })
            }

            setCallback(!callback)
            history.push("/")
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleChangeInput = e => {
        const {name, value} = e.target;
        setProduct({...product, [name]:value})
    }

    const styleUpload = {
        display: images ? "block" : "none"
    }

    useEffect(() => {
        console.log(products.length)
        if (param.id) {
            setOnEdit(true)
            
            products.forEach(product => {
                if (product._id === param.id) {
                    setProduct(product)
                    setImages(product.images)
                }
            })
        } else {
            setOnEdit(false)
            setProduct(initialState)
            setImages(false)
        }
    }, [param.id, products])

    //image URL https://i.pinimg.com/originals/1b/30/15/1b3015d0783d1c569dad92a11a0d6f39.jpg

    return(
        <div className="create_product">
            <div className="upload">
                <input type="file" name="file" id="file_up" onChange={handleUpload} />
                {
                    loading ? <div id="file_img"><Loading /></div>

                    :<div id="file_img" style={styleUpload}>
                        <img src={images ? images.url : ''} alt="" />
                        <span onClick={handleDestroy}>X</span>
                    </div>
                }
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="product_id">Product Id</label>
                    <input type="text" name="product_id" id="product_id" required
                    value={product.product_id} onChange={handleChangeInput} disabled={product._id} />
                </div>

                <div className="row">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" required
                    value={product.title} onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="price">Price</label>
                    <input type="text" name="price" id="price" required
                    value={product.price} onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="description">Description</label>
                    <textarea type="text" name="description" id="description" required
                    value={product.description} row="5" onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="content">Content</label>
                    <textarea type="text" name="content" id="content" required
                    value={product.content} row="7" onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="categories">Categories</label>
                    <select name="category" value={product.category} onChange={handleChangeInput} >
                        {
                            categories.map(category => (
                                <option value={category._id} key={category._id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>

                    <button type="submit">{onEdit? "Update" : "Create"}</button>
            </form>
        </div>
    )
}

export default CreateProduct