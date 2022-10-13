const { User, Address, Cart,Token } = require("../models");
const { Op, where } = require("sequelize");
const bcrypt = require("bcrypt");
const { generateToken, verifyToken } = require("../lib/jwt");
const mailer = require("../lib/mailer");
const { Error } = require("sequelize");

async function SendVerification(id, email, username) {
  const verToken = await generateToken(
    { id, isEmailVerification: true },
    "180s"
  );
  const url_verify = process.env.LINK_VERIFY + verToken;

  await mailer({
    to: email,
    subject: "Halo" + username + "silahkan verify account anda",
    html: `<div><h1>KLIK LINK UNTUK VERIFY</h1></div>
      <div> Please verify dari sini <a href="${url_verify}">Link</a></div>`,
  });
  return verToken;
}

async function resetPassword(email,token) {
 
  const url_reset = process.env.LINK_FORGETPASS + token;

  await mailer({
    to: email,
    subject: "Reset Password",
    html: `<div><h1>KLIK LINK UNTUK MENGUBAH PASSWORD </h1></div>
          <div> Please Click here to reset your password <a href="${url_reset}">Link</a></div>`,
  });

  return token;
}

class userController {
  static async addUser(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.create({
        username,
        password,
      });
      return res.status(200).json({
        message: "new user has been created",
        result: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.toString(),
      });
    }
  }

  static async getAllUser(req, res) {
    try {
      let findUsers = await User.findAll({
        include: [Address],
      });
      res.status(200).json({ status: "success", result: findUsers });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.toString(),
      });
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;

      const findUser = await User.findAll({
        attributes: ["id", "username", "email", "full_name"],
        where: {
          id,
        },
      });
      return res.status(200).json({
        message: "Get User Profile",
        result: findUser,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  }
  static async getUser(req, res) {
    try {
      const findUser = await User.findAll({
        attributes: ["id", "username", "email", "full_name", "image_url"],
      });
      return res.status(200).json({
        message: "Get User Profile",
        result: findUser,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  }

  static async deleteUser(req, res) {
    await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ status: "success", data: "deleted" });
  }
  static async login(req, res) {
    try {
      const { username, email, password } = req.body;
      console.log(req.body);
      const user = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });
      console.log(user);

      if (!user) {
        throw new Error("phone/email/password not found");
      }

      const checkPass = bcrypt.compareSync(password, user.password);

      if (!checkPass) {
        throw new Error("phone/email/password not found");
      }

      const token = generateToken({
        id: user.id,
        password: user.password,
        roles: user.roles,
      });

      delete user.dataValues.createAt;
      delete user.dataValues.password;
      delete user.dataValues.updateAt;

      res.status(200).json({
        message: "login succeed",
        result: { user, token },
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err.toString(),
      });
    }
  }
  static async register(req, res) {
    try {
      const { username, password, full_name, email, phone } = req.body;

      const findUser = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });

      if (findUser) {
        throw new Error("username/email has been taken");
      }

      const hashedPassword = bcrypt.hashSync(password, 5);

      const user = await User.create({
        username,
        password: hashedPassword,
        full_name,
        phone,
        email,
        role: "User",
      });

      console.log(user.id);
      const token = await generateToken({
        id: user.id,
        isEmailVerification: true,
      });
      const verToken = await SendVerification(user.id, email, username);
      console.log(token);
      console.log(verToken);

      await Cart.create({ id: user.id, id_user: user.id });

      return res.status(200).json({
        message: "new user has been created",
        result: { user, token, verToken },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: err.toString(),
      });
    }
  }
  static async verifyUser(req, res) {
    try {
      const { vertoken } = req.params;
      console.log(vertoken);
      const isTokenVerified = verifyToken(vertoken, process.env.JWT_SECRET_KEY);

      if (!isTokenVerified || !isTokenVerified.isEmailVerification) {
        throw new Error("token is invalid");
      }

      await User.update(
        { is_verified: true },
        {
          where: {
            id: isTokenVerified.id,
          },
        }
      );
      return res.status(200).json({
        message: "User is Verified",
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err.toString(),
        success: false,
      });
    }
  }
  static async verifySend(req, res) {
    try {
      const { id, email, username } = req.body;
      const token = generateToken({ id, isEmailVerification: true });
      const verToken = await SendVerification(id, email, username);

      return res.status(200).json({
        message: "verification send",
        result: { token, verToken },
      });
    } catch (err) {
      console.log("error");
      return res.status(500).json({
        message: err.toString(),
      });
    }
  }
  static async changePassword(req, res) {
    try {
      const { restoken } = req.params;
      const { password } = req.body;
      console.log(restoken);
      const isTokenVerified = verifyToken(restoken, process.env.JWT_SECRET_KEY);

      if (!isTokenVerified || !isTokenVerified.isEmailVerification) {
        throw new Error("token is invalid");
      }

      const hashedPassword = bcrypt.hashSync(password, 5);

      await User.update(
        { password: hashedPassword },
        { where: { email: isTokenVerified.email } }
      );

      await Token.destroy({
        where : {
          token: restoken
        }
        })
      return res.status(200).json({
        message: "Success change password",
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err.toString(),
        success: false,
      });
    }
  }
  static async verifyResToken(req, res) {
    try {
      const { restoken } = req.params;
      console.log(restoken);

      const cek = await Token.findOne({
        where: {
          token : restoken
        }
      })
      console.log(cek)

      // if(!isTokenVerified || !isTokenVerified.isEmailVerification){
      // throw new Error("token is not verified")
      // }
      if(!cek){
        throw new Error("token is not verified")
        }
      
      return res.status(200).json({
        message: "Token Reset Pass",
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err.toString(),
        success: false,
      });
    }
  }
  static async resendVerification(req, res) {
    try {
      const { id, email, username } = req.body;

      const token = generateToken({ id: id, isEmailVerification: true });

      const verToken = await SendVerification(id, email, username);

      return res.status(200).json({
        message: "Verified has been send to your email",
        result: { token, verToken },
      });
    } catch (err) {
      console.log(err.toString());
      return res.status(500).json({
        message: err.toString(),
      });
    }
  }
  static async sendResetPass(req, res) {
    try {
      const { email } = req.body;

      const token = generateToken({ email: email, isEmailVerification: true });

      const resetToken = await resetPassword(email);

      await Token.create({
        token : token,
        status: "valid"
       })
  

      return res.status(200).json({
        message: "Reset Password link has been send to your email",
        result: { token, resetToken },
      });
    } catch (err) {
      console.log("error");
      return res.status(500).json({
        message: err.toString(),
      });
    }
  }
  static async keepLogin(req, res) {
    // Kirim token + user data
    try {
      const { token } = req;
      console.log(token);

      const renewedToken = generateToken({ id: token.id });

      const findUser = await User.findByPk(token.id);

      // delete findUser.dataValues.password;

      return res.status(200).json({
        message: "Renewed user token",
        result: {
          user: findUser,
          token: renewedToken,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
  static async editUser(req, res) {
    try {
      const { id } = req.params;

      await User.update(
        {
          ...req.body,
        },
        {
          where: {
            id,
          },
        }
      );

      const user = await User.findOne({ id });

      return res.status(200).json({
        message: "User Profile Edited",
        user: user,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  }
  static async editPassword(req, res) {
    const { id } = req.params;
    const { password, oldpassword } = req.body;
    const oldpass = await User.findOne({
      where: {
        id,
      },
    });
    const hashedPassword = bcrypt.hashSync(password, 5);

    const Match = await bcrypt.compare(oldpassword, oldpass.password);

    if (!Match) {
      console.log(oldpassword);

      throw new Error("old password not Match");
    }

    const user = await User.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          id,
        },
      }
    );

    return res.status(200).json({
      message: "Success change password",
      success: user,
    });
  }
  catch(err) {
    console.log(err);
    res.status(400).json({
      message: err.toString(),
      success: false,
    });
  }

  static async uploadProfilePict(req, res) {
    try {
      const { id } = req.params;
      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = "profile_pict";
      if (!req.file) {
        return res.status(200).json({
          message: "No Image Selected",
        });
      }
      const { filename } = req.file;

      await User.update(
        { image_url: `${uploadFileDomain}/${filePath}/${filename}` },
        { where: { id } }
      );
      return res.status(200).json({
        message: "Success change profile picture",
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  }

  static async editDefaultAddress(req, res) {
    const { id, default_address } = req.params;
    try {
      await User.update({ default_address }, { where: { id } });
      return res.status(200).json({
        message: "Address default changed",
      });
    } catch (error) {
      console.log(err);
      res.status(200).json({
        message: "Failed",
      });
    }
  }
}

module.exports = userController;
