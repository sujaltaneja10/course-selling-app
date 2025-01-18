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

function validateUserDetails(req, res, next) {
  const bodySchema = z.object({
    username: z
      .string("Username must be a string")
      .min(3, "Username must have minimum 3 characters")
      .max(15, "Username must have maximum 15 characters"),
    password: z
      .string("Password must be a string")
      .min(6, "Password must have minimum 6 characters")
      .max(15, "Password must have maximum 15 characters")
      .regex(/[a-z]/, "Password must have 1 atleast lowercase character")
      .regex(/[A-Z]/, "Password must have 1 atleast uppercase character")
      .regex(/[0-9]/, "Password must have atleast 1 integer"),
    is_admin: z.boolean().optional(),
  });

  const parsedData = bodySchema.safeParse(req.body);

  // Data not in correct format
  if (!parsedData.success) {
    return res.status(400).json({
      message: parsedData.error.issues[0].message,
    });
  }

  const sanitizedData = {
    ...parsedData.data,
    username: escapeHTML(parsedData.data.username),
    password: escapeHTML(parsedData.data.password),
  };

  req.body = sanitizedData;

  next();
}

module.exports = validateUserDetails;
