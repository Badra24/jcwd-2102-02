const {
  Product,
  Category,
  Product_Description,
  Product_Stock,
} = require("../models");
const { Op } = require("sequelize");
const product = require("../models/product");

class productController {
  static async addProduct(req, res) {
    try {
      const { name } = req.body;

      const newProduct = await Product.create({
        name,
      });
      return res.status(200).json({
        message: "new Product has been created",
        result: newProduct,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.toString(),
      });
    }
  }

  static async getAllProduct(req, res) {
    try {
      //==================
      let category = [];
      const allCategory = await Category.findAll({
        attributes: ["category"],
      });

      for (let i = 0; i < allCategory.length; i++) {
        category.push(allCategory[i].category);
      }

      console.log(category);

      if (req.query.category) {
        category = req.query?.category;
      }

      const { orderby, order, filter } = req.query;
      let offset = req.query.offset ? req.query.offset : 0;
      offset = parseInt(offset);

      //==================

      const dataProducts = await Product.findAll({
        include: [
          {
            model: Category,
            attributes: ["id", "category"],
            where: {
              category: { [Op.or]: [category] },
            },
          },
          {
            model: Product_Stock,
          },
          {
            model: Product_Description,
          },
        ],
        attributes: { exclude: ["updatedAt", "createdAt"] },

        order:
          order && orderby != "selling_price"
            ? [[orderby, order]]
            : order
            ? [[{ model: Product_Stock }, orderby, order]]
            : [],

        where: {
          name: {
            [Op.substring]: [filter],
          },
        },
      });

      const products = dataProducts.slice(offset, offset + 9);
      const totalProduct = await Product.count();

      res.status(200).json({
        status: "success",
        result: { products, offset },
        totalProduct,
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.toString(),
      });
    }
  }

  static async getProductById(req, res) {
    try {
      const { id } = req.params;

      const findProduct = await Product.findAll({
        where: { id },
      });

      return res.status(200).json({
        message: "Get Product",
        result: findProduct,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  }

  static async getAllProductName(req, res) {
    try {
      const findProduct = await Product.findAll({
        attributes: ["id", "name"],
        include: [
          {
            model: Product_Stock,
            attributes: [
              "selling_price",
              "primary_unit",
              "secondary_unit",
              "secondary_price",
            ],
          },
        ],
      });

      const arrProduct = [];
      for (let i = 0; i < findProduct.length; i++) {
        const productName = findProduct[i].dataValues.name;
        const id = findProduct[i].dataValues.id;
        const primaryPrice =
          findProduct[i].dataValues.Product_Stock?.dataValues?.selling_price;
        const primaryUnit =
          findProduct[i].dataValues.Product_Stock?.dataValues?.primary_unit;
        const secondaryUnit =
          findProduct[i].dataValues.Product_Stock?.dataValues?.secondary_unit;
        const secondaryPrice =
          findProduct[i].dataValues.Product_Stock?.dataValues?.secondary_price;

        arrProduct.push({
          id,
          label: productName,
          productName,
          primaryPrice,
          primaryUnit,
          secondaryUnit,
          secondaryPrice,
        });
      }

      return res.status(200).json({
        message: "Get Product Name",
        arrProduct,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  }

  static async getProductDescription(req, res) {
    try {
      const { id } = req.params;

      const findProduct = await Product_Description.findOne({
        include: [
          {
            model: Product,
            include: {
              model: Product_Stock,
              attributes: ["selling_price"],
            },
          },
        ],

        where: {
          id,
        },
      });
      return res.status(200).json({
        message: "Get Product",
        result: findProduct,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  }

  static async createProduct(req, res) {
    try {
      const { name, code, price } = req.body;
      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = "product_images";

      const { filename } = req.file;

      const newProduct = await Product.create({
        img_product: `${uploadFileDomain}/${filePath}/${filename}`,
        name,
        code,
        price,
      });
      // let statusS = ""
      // if (updateStock.primary_stock <= primary_stock ) {
      //   statusS = "Penambahan"
      // } else {
      //   statusS = "Pengurangan"
      // }

      // await stock_history.create(
      //   {
      //      Date , Product , Unit , Qty , Type : "update stock" , status : statusS

      //   }
      // )

      return res.status(201).json({
        message: "product created",
        result: newProduct,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, code, price } = req.body;
      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = "product_images";

      const { filename } = req.file;

      const findProduct = await Product.findOne({
        where: {
          id: id,
        },
      });

      if (!findProduct) {
        throw new Error("product doesn't exist");
      }

      await Product.update(
        {
          img_product: `${uploadFileDomain}/${filePath}/${filename}`,
          name,
          code,
          price,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.status(200).json({
        message: "product success edited",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      await Product_Stock.destroy({
        where: {
          id,
        },
      });
      await Product.destroy({
        where: {
          id,
        },
      });

      return res.status(200).json({
        message: "product deleted",
        result: product,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
}

module.exports = productController;
