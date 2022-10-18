const {
  Cart,
  User,
  Product_Cart,
  Product,
  Product_Stock,
} = require("../models");

class CartController {
  static async addCartItem(req, res) {
    const { id_cart, id_product } = req.params;
    let message;
    try {
      let product = await Product_Stock.findOne({
        where: {
          id: id_product,
        },
      });

      //masuk ke utils
      const stock = product.primary_stock;
      if (stock < 1) {
        return res.status(200).json({
          message: "Not Enoguh Stock!",
          stock,
        });
      }
      //Detract Stock
      await product.update({ stock: product.stock - 1 });

      let findProductCart = await Product_Cart.findOne({
        where: {
          id_product,
          id_cart,
        },
      });

      if (findProductCart) {
        message = "Quantitiy Product Added";
        findProductCart.set({
          quantity: findProductCart.quantity + 1,
        });
        await findProductCart.save();
        console.log(true);
      } else {
        message = "Item added to Product Cart";
        let addItem = await Product_Cart.create({
          quantity: 1,
          id_cart,
          id_product,
        });
      }

      return res.status(200).json({
        message,
        stock: product.stock,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.toString(),
      });
    }
  }

  static async getCartByUserId(req, res) {
    try {
      const { id_user } = req.params;

      let cart = await Cart.findOne({
        include: [
          {
            model: User,
            attributes: ["full_name", "default_address", "phone"],
          },
          {
            model: Product_Cart,
            attributes: ["id", "quantity"],
            include: {
              model: Product,
              attributes: ["id", "name", "img_product"],
              include: {
                model: Product_Stock,
                attributes: ["selling_price"],
              },
            },
          },
        ],
        where: {
          id_user,
        },
      });

      let totalItem = 0;
      let totalPrice = 0;
      cart.Product_Carts.forEach((val) => {
        let qty = val.dataValues.quantity;
        let price = val.dataValues.Product.Product_Stock.selling_price;

        console.log(price);
        totalItem += qty;
        totalPrice += qty * price;
      });

      cart.total_item = totalItem;
      cart.total_price = totalPrice;

      await cart.save();

      return res.status(200).json({
        message: "Get Cart",
        result: cart,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  }

  static async editQuantity(req, res) {
    const { quantity } = req.body;
    const { id_product, id_cart } = req.params;
    let message;
    try {
      let findProductCart = await Product_Cart.findOne({
        where: {
          id_product,
          id_cart,
        },
      });

      message = "Quantitiy Product Edited";
      findProductCart.set({
        quantity,
      });
      await findProductCart.save();

      res.status(200).json({ message, findProductCart });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.toString(),
      });
    }
  }

  static async deleteCartItem(req, res) {
    const { id_product_cart } = req.params;
    try {
      await Product_Cart.destroy({
        where: {
          id: id_product_cart,
        },
      });
      res.status(200).json({ message: "Product deleted from cart" });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  }
}

module.exports = CartController;
