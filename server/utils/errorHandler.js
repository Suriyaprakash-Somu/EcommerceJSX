export function handleDatabaseError(res, err) {
  console.error(err);
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({ message: 'Duplicate entry detected' });
  }
  if (err.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(400).json({ message: 'Related data not found' });
  }
  return res.status(500).json({ message: 'Internal server error' });
}
