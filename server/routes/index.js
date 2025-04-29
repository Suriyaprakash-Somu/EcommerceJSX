// routes/index.js
import rolesRouter                         from "./private/common/roles.js";
import departmentsRouter                   from "./private/common/departments.js";
import categoriesRouter                    from "./private/product/category.js";
import unitsRouter                         from "./private/product/units.js";
import attributesRouter                    from "./private/product/attributes.js";
import attributeValuesRouter               from "./private/product/attributeValues.js";
import categoryAttributeValuesRouter       from "./private/product/categoryAttributeValues.js";

export default function registerRoutes(app) {
  app.use("/api/roles",                     rolesRouter);
  app.use("/api/departments",               departmentsRouter);
  app.use("/api/categories",                categoriesRouter);
  app.use("/api/units",                     unitsRouter);
  app.use("/api/attributes",                attributesRouter);
  app.use("/api/attribute-values",          attributeValuesRouter);
  app.use("/api/category-attribute-values", categoryAttributeValuesRouter);
}
