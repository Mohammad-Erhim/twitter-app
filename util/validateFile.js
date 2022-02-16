const fs = require("fs");
const path = require("path");
const pathHelper = require("./path");

exports.validateImageHelper = (image, param) => {
  const p = path.join(pathHelper,image);

  if (!fs.existsSync(p)) {
    const error = new Error("Validation failed.");
    error.statusCode = 400;
    error.data = [
      {
        value: image,
        msg: "Image did not upload.",
        param: param,
        location: "body",
      },
    ];
    throw error;
  }
};
