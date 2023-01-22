const User = require("../models/user.model");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const config=require("../config.json");

module.exports.profile = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) {
        return res.json(500, {
            message: "internal server error!",
            data: {
              user: user,
            },
          });
    }
    return res.json(200, {
      message: "success!",
      data: {
        user: user,
      },
    });
  });
};

module.exports.update = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);
    User.uploadedAvatar(req, res, function (err) {
      if (err) console.log("**********Multer Error :", err);

      user.name = req.body.name;
      user.email = req.body.email;

      if (req.file) {
        if (user.avatar) {
          if (fs.existsSync(path.join(__dirname, "..", user.avatar))) {
            fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          }
        }
        user.avatar = User.avatarPath + "/" + req.file.filename;
      }
      user.save();

      return res.json(200, {
        message: "Profile updated succesfully!",
        data: {
          user: user,
        },
      });
    });
  } catch (err) {
    return;
  }
};

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user || user.password != req.body.password) {
      return res.json(422, {
        message: "wrong username or password!",
      });
    }
    return res.json(200, {
      message: "sign in successful! here is your token. please keep it safe!",
      data: {
        token: jwt.sign(user.toJSON(), config.jwt_secret, {
          expiresIn: "100000",
        }), //'numaniscool' is the secret ke to encrypt user
      },
    });
  } catch (error) {
    console.log("error occurred:", error);
    return res.json(500, {
      message: "internal server error!",
    });
  }
};

module.exports.createUser = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      user = await User.create({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
      });

      if (req.file) {
        if (user.avatar) {
          if (fs.existsSync(path.join(__dirname, "..", user.avatar))) {
            fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          }
        }
        user.avatar = User.avatarPath + "/" + req.file.filename;
      }

      return res.json(200, {
        message: "success, user created!",
        data: {
          user: user,
        },
      });
    } else {
      return res.json(500, {
        message: "user already exists",
      });
    }
  } catch (error) {
    console.log("error occurred:", error);
    return res.json(500, {
      message: "internal server error!",
    });
  }
};
