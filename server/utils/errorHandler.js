function handleDatabaseError(res, err) {
  console.error(err); // always log full error for developers

  if (err.code === "ER_DUP_ENTRY") {
    // MySQL duplicate key
    return res.status(400).json({ message: "Duplicate entry detected" });
  }

  if (err.code === "ER_NO_REFERENCED_ROW") {
    // Foreign key constraint failed
    return res.status(400).json({ message: "Related data not found" });
  }

  // other known MySQL codes you can customize here...

  // fallback for unknown errors
  return res.status(500).json({ message: "Internal server error" });
}

module.exports = {
  handleDatabaseError,
};
