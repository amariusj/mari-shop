const Product = require('../models/productModel');

//Filter, sorting and paginating

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filtering() {

        //Grabs the query and its value and places it into an object
        //Example { query: valueOfQuery }
        const queryObj = {...this.queryString}

        //The different queries. Grabbing them to exclude them from
        //the query Object
        const excludedFields = ['page', 'sort', 'limit']

        //Excludes the query from the query object
        excludedFields.forEach( element => delete(queryObj[element]))

        //Converts the query string into a string
        let queryStr = JSON.stringify(queryObj)

        //Adds the greater than, less than, and or equal to regex
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

        //Stringifies the uery with the regex added
        this.query.find(JSON.parse(queryStr))

        return this;
        
    }
    sorting() {
        if (this.queryString.sort) {

            //Determines w
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }

        return this
    }
    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const productCtrl = {
    getProducts: async (req, res) => {
        try {

            //Accesses the class
            const features = new APIfeatures(Product.find(), req.query).filtering().sorting().paginating()

            //Calls the query from the class (Products.find())
            const products = await features.query

            res.json({
                status: 'success',
                result: products.length,
                products: products
            })

        } catch (err) {

            return res.status(500).json({msg: err.message})

        }
    },
    createProduct: async (req, res) => {
        try {

            //Grabs all the fields from the request
            const { product_id, title, price, description, content, images, category } = req.body

            //If no images are selected, send an error
            if (!images) return res.status(400).json({msg: "No image selected"})

            //If the product already exists, send an error
            const existingProduct = await Product.findOne({
                product_id: product_id
            })
            if (existingProduct) return res.status(400).json({msg: "Product already exists"})

            //Create the new product
            const newProduct = await new Product({
                product_id,
                title: title.toLowerCase(),
                price,
                description,
                content,
                images,
                category
            })

            //Save the new product
            await newProduct.save()

            //Send a successful message
            return res.json({newProduct})

        } catch (err) {

            return res.status(500).json({msg: err.message})
            
        }
    },
    deleteProduct: async (req, res) => {
        try {

            await Product.findByIdAndDelete(req.params.id)
            return res.json({msg: "Product successfully deleted!"})

        } catch (err) {

            return res.status(500).json({msg: err.message})
            
        }
    },
    updateProduct: async (req, res) => {
        try {

            const { product_id, title, price, description, content, images, category } = req.body

            const updatedInfo = {
                product_id,
                title: title.toLowerCase(),
                price,
                description,
                content,
                images,
                category
            }

            const product = await Product.findByIdAndUpdate(req.params.id, updatedInfo)

            return res.json({msg: "Product successfully updated!"})

        } catch (err) {

            return res.status(500).json({msg: err.message})
            
        }
    }
}



module.exports = productCtrl