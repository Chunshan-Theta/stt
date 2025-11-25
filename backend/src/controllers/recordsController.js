import Record from "../models/Record.js";

// 依type取得資料，type 可選 transcript/summary/meeting
export async function getRecordsByType(req, res) {
  const type = req.query.type; 
  try {
    const records = type
      ? await Record.find({ type }).sort({ createdAt: -1 })
      : await Record.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ message: "Failed to get records", error: error.message });
  }
}

// 刪除指定資料
export async function deleteRecord(req, res) {
  try {
    const deleted = await Record.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Error deleting record:", error);
    res.status(500).json({ message: "Failed to delete record", error: error.message });
  }
}
