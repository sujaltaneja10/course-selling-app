const { z } = require("zod");

// For sanitization
const escapeHTML = (str) => {
  return str
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

function validateCourseDetails(req, res, next) {
  try {
    const bodySchema = z.object({
      title: z
        .string("Title must be a string (required)")
        .max(20, "Title must be less than 20 characters"),
      description: z
        .string("Description must be a string (required)")
        .max(50, "Description must be less than 50 characters"),
      price: z.number("Price must be an integer (required)"),
      imageLink: z.string("Image link must be a string (required)"),
      published: z.boolean("Published must be a boolean (required)"),
    });

    const parsedData = bodySchema.safeParse(req.body);

    // Data not in correct format
    if (!parsedData.success) {
      console.log(parsedData.error);
      return res.status(400).json({
        message: parsedData.error.issues[0].message,
      });
    }

    const sanitizedData = {
      ...parsedData.data,
      title: escapeHTML(parsedData.data.title),
      description: escapeHTML(parsedData.data.description),
      price: escapeHTML(parsedData.data.price),
      imageLink: escapeHTML(parsedData.data.imageLink),
      published: escapeHTML(parsedData.data.published),
    };

    req.body = sanitizedData;

    next();
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = validateCourseDetails;
