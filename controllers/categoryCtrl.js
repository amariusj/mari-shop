const Category = require('../models/categoryModel')
const Products = require('../models/productModel')

const categoryCtrl = {
    getCategories: async (req, res) => {
        try {
            //Grabs all categories from database
            const categories = await Category.find()

            //Send the categories to the client
            return res.json(categories)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        } 
    },
    createCategory: async (req, res) => {
        try {
            //Grab the name from the request
            const { name } = req.body

            //Verify a Category doesn't already exist with that name
            const category = await Category.findOne({name})
            if (category) return res.status(400).json({msg: "Category already exists"})

            //Create the new category and save it
            const newCategory = new Category({name})
            await newCategory.save()

            //Send a confirmation response
            return res.json({msg: "Category successfully created!"})

        } catch (err) {
            return res.status(400).json({msg: err.message})
        }
    },
    deleteCategory: async (req, res) => {
        try {

            const products = await Products.findOne({category: req.params.id})
            if (products) return res.status(400).json({
                msg: "Please delete all products with a relationship."
            })

            //Finds a category by the ID
            const category = await Category.findOneAndDelete({
                _id: req.params.id
            })

            //If the category doesn't exist, send message
            if (!category) return res.json({msg: "Category does not exist!"})

            //Sends successful delete message
            return res.json({msg: "Category Deleted"})
        } catch (err) {
            return res.json(500).json({msg: err.message})
        }
    },
    updateCategory: async (req, res) => {
        try {
            //Grabs the category name
            const { name } = req.body 

            if (!name) {
                return res.status(400).json({msg: "No name inserted for Category!"})
            }

            //Find the category inserted
            const category = await Category.findOneAndUpdate({_id: req.params.id}, {name})

            //If category doesn't exist, send error
            if (!category) return res.status(400).json({msg: "Category does not exist"})

            //Send a successful message
            return res.json({msg: "Category successfully updated"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = categoryCtrl