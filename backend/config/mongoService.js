const mongoose = require("mongoose");

// find one
const findOne = async (model, where, projection = {}, options = {}, populate = []) => {
    let query = mongoose.model(model).findOne(where, projection, { lean: false, ...options })
    if (populate.length) {
        query = query.populate(populate);
    }
    return await query.exec();
};

const findOneLean = async (model, where, projection = {}, options = {}, populate = []) => {
    let query = mongoose.model(model).findOne(where, projection, { lean: true, ...options })
    if (populate.length) {
        query = query.populate(populate);
    }
    return await query.exec();
};

// create one
const createOne = async (model, payload) => {
    return await mongoose.model(model).create(payload);
};

// count documents 
const countDocument = async (model, criteria) => {
    return await mongoose.model(model).countDocuments(criteria)
};


// create many
const createMany = async (model, payload) => {
    return await mongoose.model(model).create(payload);
};

// find all
const findAll = async (model, criteria, projection = {}, options = { lean: true, populate: "" }) => {
    options.lean = true;

    let query = mongoose.model(model).find(criteria, projection, options);

    if (options.populate) query = query.populate(options.populate);
    return await query.exec();
};

//update one
const updateOne = async (model, criteria, dataToSet, options = {}) => {
    const defaultOptions = { lean: true, new: true };
    const finalOptions = { ...defaultOptions, ...options };

    return await mongoose.model(model).findOneAndUpdate(criteria, dataToSet, finalOptions);
};

//update many
const updateMany = async (model, criteria, dataToSet, options = { new: false }) => {
    return await mongoose.model(model).updateMany(criteria, dataToSet, options);
};

//aggregate data
const aggregation = async (model, data) => {
    return await mongoose.model(model).aggregate(data);
};

//populate
const populate = async (modelName, criteria, projection = {}, options = { lean: true }, populate = [], limit, skip, sort) => {
    options.lean = true;
    return await mongoose.model(modelName).find(criteria, projection, options).skip(skip).limit(limit).populate(populate).sort(sort);
};

// optional pagination
const optionalPagination = async (model, criteria, projection = {}, options = { lean: true }, populate = [], limit = null, offset = null, sort = null) => {
    options.lean = true;
    let query = mongoose.model(model).find(criteria, projection, options);


    if (limit !== null && offset !== null) {
        const limitData = parseInt(limit, 10) || 10;
        const offsetData = parseInt(offset, 10) || 0;
        query.skip(offsetData).limit(limitData);
    }

    if (populate.length) {
        query = query.populate(populate);
    }

    if (sort) {
        query = query.sort(sort);
    }

    let result = await query.exec();
    let totalCount = await mongoose.model(model).countDocuments(criteria)
    return { totalCount, result }
};

// check valid mongoose Id
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

// delete
const deleteOne = async (model, criteria) => {
    return await mongoose.model(model).findOneAndUpdate(criteria, { isDeleted: true });
};

const deleteData = async (model, criteria) => {
    return await mongoose.model(model).findOneAndDelete(criteria,);
}

const deleteMany = async(model, criteria) =>{
    return await mongoose.model(model).deleteMany(criteria);
}

module.exports = {
    findOne,
    findOneLean,
    createOne,
    countDocument,
    createMany,
    findAll,
    updateOne,
    updateMany,
    aggregation,
    populate,
    optionalPagination,
    isValidObjectId,
    deleteOne,
    deleteData,
    deleteMany,
}