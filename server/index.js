const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/roles", require("./routes/private/common/roles"));
app.use("/api/departments", require("./routes/private/common/departments"));
app.use("/api/categories", require("./routes/private/product/category"));
app.use("/api/units", require("./routes/private/product/units"));
app.use("/api/attributes", require("./routes/private/product/attributes"));
app.use(
  "/api/attribute-values",
  require("./routes/private/product/attributeValues")
);
app.use(
  "/api/category-attribute-values",
  require("./routes/private/product/categoryAttributeValues")
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
