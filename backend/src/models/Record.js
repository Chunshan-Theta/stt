import mongoose from "mongoose";

//1- create a schema 定義資料的結構
//2- model based off of the schema 資料模型

const RecordSchema = new mongoose.Schema({
  filename: String,
  content: String,
  type: {
    type: String,
    enum:["transcript","summary","meetingNotes"], //限定只能是這三種type
    required: true,
    select: false, //type不會被預設回傳(user不會看到type)
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Record", RecordSchema);
