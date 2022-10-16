const {
  Order,
  User,
  Address,
  Product_Order,
  Product_Cart,
  Product_Stock,
  Product,
  Expedition,
} = require("../models");
const { Op } = require("sequelize");

class OrderController {
  static async addOrder(req, res) {
    const total_payment = req.body.cost + req.body.total_price;
    const estimation_time = req.body.etd;
    const d = new Date();
    const productCart = req.body.Product_Carts;

    try {
      const newOrder = await Order.create({
        ...req.body,
        shipping_cost: req.body.cost,
        total_payment,
      });
      // const newOrder = { ...req.body };
      const no_invoice = `MDCR${newOrder.id_user}-${newOrder.id}${d.getTime()}`;
      await newOrder.update({ no_invoice });
      await Expedition.create({
        ...req.body,
        id: newOrder.id,
        estimation_time,
      });

      const orderProductData = [];
      const pcId = [];
      for (let i = 0; i < productCart.length; i++) {
        let temp = {};
        temp.id_order = newOrder.id;
        temp.id = 0;
        temp.id_product = productCart[i].Product.id;
        temp.quantity = productCart[i].quantity;
        temp.type = "Medicine";
        pcId.push(productCart[i].id);
        orderProductData.push(temp);
      }
      console.log("orderProductData");
      console.log(orderProductData);
      const newOrderProduct = await Product_Order.bulkCreate(orderProductData, {
        returning: true,
      });

      await Product_Cart.destroy({ where: { id: pcId } });

      return res.status(200).json({
        message: "new order has been created",
        result: newOrder,
        po: newOrderProduct,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.toString(),
      });
    }
  }

  static async getAllOrder(req, res) {
    const { status, no_invoice, order, orderby, datefrom, dateto, limit } =
      req.query;
    let offset = req.query.offset ? req.query.offset : 0;
    offset = parseInt(offset);

    try {
      let orders = await Order.findAll({
        include: [
          {
            model: Address,
            attributes: { exclude: ["updatedAt"] },
          },
          {
            model: User,
            attributes: ["full_name", "phone"],
          },
          {
            model: Product_Order,
            attributes: ["id", "quantity", "type"],
            include: {
              model: Product,
              attributes: ["id", "name", "price", "img_product"],
              include: {
                model: Product_Stock,
                attributes: ["id", "primary_stock", "primary_unit"],
              },
            },
          },
          {
            model: Expedition,
            attributes: [
              "cost",
              "courier",
              "service",
              "estimation_time",
              "description",
            ],
          },
        ],

        where: {
          [Op.and]: [
            no_invoice ? { no_invoice } : {},
            datefrom && dateto
              ? {
                  [Op.or]: [
                    {
                      createdAt: {
                        [Op.between]: [datefrom, dateto],
                      },
                    },
                  ],
                }
              : {},
            status ? { status } : {},
          ],
        },
        order: order && orderby ? [[order, orderby]] : [["id", "DESC"]],
        // limit: limit ? parseInt(limit) : undefined,
        // offset,
      });

      const totalOrder = await Order.count();
      const orderData = orders.slice(offset, limit ? offset + 4 : totalOrder);

      return res.status(200).json({
        message: "Get Order ",
        result: orderData,
        no_invoice,
        offset,
        totalOrder,
        status,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.toString(),
      });
    }
  }

  static async getOrderByUserId(req, res) {
    const { id } = req.params;
    const { status, no_invoice, order, orderby, datefrom, dateto, limit } =
      req.query;
    let offset = req.query.offset ? req.query.offset : 0;
    offset = parseInt(offset);

    try {
      let orderData = await Order.findAll({
        include: [
          {
            model: Address,
            attributes: { exclude: ["updatedAt"] },
          },
          {
            model: User,
            attributes: ["full_name", "phone"],
          },
          {
            model: Product_Order,
            attributes: ["id", "quantity", "type"],
            include: {
              model: Product,
              attributes: ["id", "name", "img_product"],
              include: {
                model: Product_Stock,
                attributes: ["selling_price", "secondary_price"],
              },
            },
          },
          {
            model: Expedition,
            attributes: [
              "cost",
              "courier",
              "service",
              "estimation_time",
              "description",
            ],
          },
        ],

        where: {
          [Op.and]: [
            no_invoice ? { no_invoice } : {},
            { id_user: id },
            datefrom && dateto
              ? {
                  [Op.or]: [
                    {
                      createdAt: {
                        [Op.between]: [datefrom, dateto],
                      },
                    },
                  ],
                }
              : {},
            status ? { status } : {},
          ],
        },
        order: order && orderby ? [[order, orderby]] : [["id", "DESC"]],
        limit: limit ? parseInt(limit) : undefined,
        offset,
      });

      const totalOrder = await Order.count();
      return res.status(200).json({
        message: "Get Order by User",
        result: orderData,
        id,
        no_invoice,
        offset,
        totalOrder,
        status,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  }
  static async getOrderByInvoice(req, res) {
    const { id, no_invoice } = req.params;
    try {
      let orderData = await Order.findOne({
        include: [
          {
            model: Address,
            attributes: { exclude: ["updatedAt"] },
          },
          {
            model: User,
            attributes: ["full_name", "phone"],
          },
          {
            model: Product_Order,
            attributes: ["id", "quantity", "type"],
            include: {
              model: Product,
              attributes: ["id", "name", "img_product"],
              include: {
                model: Product_Stock,
                attributes: ["selling_price", "secondary_price"],
              },
            },
          },
          {
            model: Expedition,
            attributes: [
              "cost",
              "courier",
              "service",
              "estimation_time",
              "description",
            ],
          },
        ],
        where: {
          [Op.and]: [{ no_invoice }, { id_user: id }],
        },
      });
      return res.status(200).json({
        message: "Get Order by User",
        result: orderData,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  }

  static async deleteOrder(req, res) {
    await Order.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ status: "success", data: "deleted" });
  }

  static async editOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      console.log(status);
      await Order.update({ status }, { where: { id } });
      res.status(200).json({ status: "success", result: status });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: err.toString(),
      });
    }
  }

  static async uploadPrescription(req, res) {
    try {
      const d = new Date();
      const estimation_time = req.body.etd;
      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = "prescription";
      if (!req.file) {
        return res.status(200).json({
          message: "No Image Selected",
        });
      }
      const { filename } = req.file;

      const newOrder = await Order.create({
        ...req.body,
        status: "Prescription",
        prescription: `${uploadFileDomain}/${filePath}/${filename}`,
      });

      const no_invoice = `MDCR${newOrder.id_user}-${newOrder.id}${d.getTime()}`;
      await newOrder.update({ no_invoice });

      await Expedition.create({
        ...req.body,
        id: newOrder.id,
        estimation_time,
      });

      return res.status(200).json({
        message: "Success create order by prescription",
        newOrder,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        err,
      });
    }
  }

  static async uploadPaymentReceipt(req, res) {
    try {
      const { id } = req.params;
      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = "payment";
      if (!req.file) {
        return res.status(200).json({
          message: "No Image Selected",
        });
      }
      const { filename } = req.file;

      await Order.update(
        {
          payment_receipt: `http://${uploadFileDomain}/${filePath}/${filename}`,
          status: "Payment",
        },
        { where: { id } }
      );
      return res.status(200).json({
        message: "Success change profile picture",
      });
    } catch (err) {
      console.log(err);
      return res.status(200).json({
        err,
      });
    }
  }

  static async prescriptionCopy(req, res) {
    const medicineItem = req.body.medicine;
    const compoundItem = req.body.compound;
    const prescriptionItem = [...medicineItem, ...compoundItem];

    try {
      const order = await Order.findOne({ where: { id: req.params.id } });

      const expedition = await Expedition.findOne({
        where: { id: req.params.id },
      });
      console.log("prescriptionItem");
      console.log(prescriptionItem);
      const shipping_cost = expedition.cost;

      const orderProductData = [];

      let total_price = 0;
      let total_item = 0;
      for (let i = 0; i < prescriptionItem.length; i++) {
        let temp = {};
        temp.id_order = order.id;
        temp.id_product = prescriptionItem[i].id;
        temp.quantity = prescriptionItem[i].quantity;
        temp.type = prescriptionItem[i].tipe;
        if (temp.type == "Chemical Raw") {
          total_price += temp.quantity * prescriptionItem[i].secondaryPrice;
        } else if (temp.type == "Medicine") {
          total_price += temp.quantity * prescriptionItem[i].primaryPrice;
        }
        total_item += temp.quantity;

        if (prescriptionItem[i].id && prescriptionItem[i].quantity) {
          orderProductData.push(temp);
        }
      }
      const total_payment = shipping_cost + total_price;

      await order.update({
        total_price,
        total_item,
        total_payment,
        shipping_cost,
        status: "Waiting For Payment",
      });

      const newOrderProduct = await Product_Order.bulkCreate(orderProductData, {
        returning: true,
      });

      return res.status(200).json({
        message: "prescription copied to order",
        result: order,
        po: newOrderProduct,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.toString(),
      });
    }
  }
}

module.exports = OrderController;
