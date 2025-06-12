import express from "express"
import { getAllAssets, createAsset, updateAsset, deleteAsset, getAssetById } from "../controllers/MController"
import { verifyAddM, verifyEditM } from "../middlewares/MValidation"
import { verifyRole, verifyToken } from "../middlewares/authorization"
import uploadFile from "../middlewares/menuUpload"

const app = express()
app.use(express.json())

app.get(`/`, [verifyToken, verifyRole(["ADMIN","USER"])], getAllAssets)

app.get(`/getAssetById/:id`, [verifyToken, verifyRole(["ADMIN","USER"])], getAssetById)

app.post(`/createAsset`, [verifyToken, verifyRole(["ADMIN"]), uploadFile.single("asset_picture"), verifyAddM], createAsset)
app.put(`/:id`, [verifyToken, verifyRole(["ADMIN"]), uploadFile.single("asset_picture"), verifyEditM], updateAsset)
app.delete(`/:id`, [verifyToken, verifyRole(["ADMIN"])], deleteAsset)

export default app