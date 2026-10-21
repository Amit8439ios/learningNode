const ProductUser = require("../models/ProductUser");
const Product = require("../models/Product");
const Token = require("../models/Token");
const AppError = require("../utils/AppError");

// users joined with their products; pass a match stage to narrow it down
const usersWithProductsPipeline = (match = {}) => [
    { $match: match },
    {
        $lookup: {
            from: Product.collection.name,
            localField: "_id",
            foreignField: "userId",
            as: "products",
            pipeline: [
                { $sort: { _id: -1 } },
                { $project: { productName: 1, productType: 1, createdAt: 1 } }
            ]
        }
    },
    {
        $project: {
            firstName: 1,
            lastName: 1,
            email: 1,
            products: 1,
            productCount: { $size: "$products" }
        }
    },
    { $sort: { _id: -1 } }
];

const getAllUsersWithProducts = async () => {
    return ProductUser.aggregate(usersWithProductsPipeline());
};

const getUserWithProducts = async (userId) => {
    // aggregate() does not cast strings, so validate and convert the id here
    if (!ProductUser.base.isValidObjectId(userId)) {
        throw new AppError("invalid user id", 400);
    }

    const [user] = await ProductUser.aggregate(
        usersWithProductsPipeline({ _id: new ProductUser.base.Types.ObjectId(userId) })
    );

    if (!user) {
        throw new AppError("user not found", 404);
    }

    return user;
};

const updateUser = async (userId, data) => {
    const user = await ProductUser.findByIdAndUpdate(
        userId,
        { $set: data },
        { returnDocument: "after", runValidators: true }
    ).lean();

    if (!user) {
        throw new AppError("user not found", 404);
    }

    return user;
};

const deleteUser = async (userId) => {
    const user = await ProductUser.findByIdAndDelete(userId).lean();

    if (!user) {
        throw new AppError("user not found", 404);
    }

    // remove everything that belongs to the user
    await Promise.all([
        Product.deleteMany({ userId }),
        Token.deleteMany({ userId })
    ]);

    return user;
};

module.exports = {
    getAllUsersWithProducts,
    getUserWithProducts,
    updateUser,
    deleteUser
};
