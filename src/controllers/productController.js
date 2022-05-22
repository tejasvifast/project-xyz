
const productModel = require('../models/productModel')

//******************************************CREATE PRODUCT************************************************************ */

const createProduct = async function (req, res) {
    try {
        let requestBody = req.body
        let productCreated = await productModel.create(requestBody)
        return res.status(201).send({ status: true, message: "User created successfully", data: productCreated })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

//***********************************************GET PRODUCT****************************************************** */

const getProduct = async function (req, res) {
    try {
        const requestQuery = req.query
        const { size, name, priceGreaterThan, priceLessThan } = requestQuery
        const filterQuery = { isDeleted: false }

        if (Object.keys(requestQuery).length > 0) {
            if (size) { filterQuery.availableSizes = { $in: size.split(",").map(x => x.trim()) } }// {$in:["X","S"]}
            if (name) { filterQuery.title = name.trim() }
            if (priceGreaterThan && priceLessThan) { filterQuery.price = { $gte: priceGreaterThan, $lte: priceLessThan } }
            if (priceGreaterThan) { filterQuery.price = { $gte: priceGreaterThan } }
            if (priceLessThan) { filterQuery.price = { $lte: priceLessThan } }
        }
    
        const findProducts = await productModel.find(filterQuery).sort({ price: 1 })
        if (!findProducts) return res.status(404).send({ status: false, message: "products not found or may be deleted" })
        return res.status(200).send({ status: true, message: "products details", data: findProducts })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

//****************************************************GET BY ID************************************************************************************* */

const getProductById = async function (req, res) {
    try {
        const productId = req.params.productId
        const findProduct = await productModel.findById({ _id: productId, isDeleted: false })
        if (!findProduct) return res.status(404).send({ status: false, message: "product details not found or may be deleted" })
        return res.status(200).send({ status: true, message: "product details", data: findProduct })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

//****************************************************DELETE BY ID************************************************************************************ */

const deleteProductById = async function (req, res) {
    try {
        const productId = req.params.productId
        const deleteProduct = await productModel.findByIdAndUpdate({ _id: productId }, { isDeleted: true }, { new: true })
        if (!deleteProduct) return res.status(404).send({ status: false, message: "product not found or may be already deleted" })
        return res.status(200).send({ status: true, message: "product deleted successfully" })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = { createProduct, getProduct, getProductById, deleteProductById }