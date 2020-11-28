import {useState, useEffect} from 'react'
import axios from 'axios'

function ProductsAPI() {

    const [callback, setCallback] = useState(false)
    const [category, setCategory] = useState('')
    const [sort, setSort] = useState('')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [result, setResult] = useState(0)

    //Sets a state variable called products to an empty array
    const [products, setProducts] = useState([])

    //Like component did mount, runs getProducts whenever the app re-renders
    useEffect(() => {

        //A function that grabs all products from the api
        const getProducts = async () => {
            const res = await axios.get(`/api/products?limit=${page * 9}&${category}&${sort}&title[regex]=${search}`)
            //Sets the products state equal to the products array grabbed
            //from the request
            setProducts(res.data.products)
            setResult(res.data.result)
        }

        getProducts()
    }, [callback, category, sort, search, page])

    return {
        products: [products, setProducts],
        callback: [callback, setCallback],
        category: [category, setCategory],
        sort: [sort, setSort],
        search: [search, setSearch],
        page: [page, setPage],
        result: [result, setResult]
    }
}

export default ProductsAPI