const { Token } = require("../models");

class tokenController {
  static async addToken(req, res) {
    try {
      const { token } = req.body;

      const newToken = await Token.create({
        token,
      });
      return res.status(200).json({
        message: "new token has been created",
        result: newToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.toString(),
      });
    }
  }

  static async getAllToken(req, res) {
    try {
      let findTokens = await Token.findAll({
       
      });
      res.status(200).json({ status: "success", result: findTokens });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.toString(),
      });
    }
  }

  static async getTokenById(req, res) {
    try {
      const { id } = req.params;

      const findToken = await Token.findAll({
        where: {
          id,
        },
      });
      return res.status(200).json({
        message: "Get Token",
        result: findToken,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  }

  static async deleteToken(req, res) {
    await Token.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ status: "success", data: "deleted" });
  }
}

module.exports = tokenController;
