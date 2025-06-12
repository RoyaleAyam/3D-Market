import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL } from "../global";
import fs from "fs"

const prisma = new PrismaClient({ errorFormat: "pretty" })

// 3D Asset Market Controller
export const getAllAssets = async (request: Request, response: Response) => {
    try {
        const { search } = request.query
        const allAssets = await prisma.asset.findMany({
            where: { name: { contains: search?.toString() || "" } }
        })
        return response.json({
            status: true,
            data: allAssets,
            message: `3D Assets have been retrieved`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const createAsset = async (request: Request, response: Response) => {
    try {
        const { name, category, price, description } = request.body
        const uuid = uuidv4()
        let filename = ""
        if (request.file) filename = request.file.filename
        const newAsset = await prisma.asset.create({
            data: { uuid, name, category, price: Number(price), description, asset_picture: filename }
        })
        return response.json({
            status: true,
            data: newAsset,
            message: `New 3D Asset has been created`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const updateAsset = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const { name, category, price, description } = request.body
        const findAsset = await prisma.asset.findFirst({ where: { id: Number(id) } })
        if (!findAsset) return response
            .status(200)
            .json({ status: false, message: `3D Asset is not found` })
        let filename = findAsset.asset_picture
        if (request.file) {
            filename = request.file.filename
            let path = `${BASE_URL}/../public/asset_picture/${findAsset.asset_picture}`
            let exists = fs.existsSync(path)
            if(exists && findAsset.asset_picture !== ``) fs.unlinkSync(path)
        }
        const updatedAsset = await prisma.asset.update({
            data: {
                name: name || findAsset.name,
                category: category || findAsset.category,
                price: price ? Number(price) : findAsset.price,
                description: description || findAsset.description,
                asset_picture: filename
            },
            where: { id: Number(id) }
        })
        return response.json({
            status: true,
            data: updatedAsset,
            message: `3D Asset has been updated`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const deleteAsset = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const findAsset = await prisma.asset.findFirst({ where: { id: Number(id) } })
        if (!findAsset) return response
            .status(200)
            .json({ status: false, message: `3D Asset with ${id} is not found` })
        let path = `${BASE_URL}/../public/asset_picture/${findAsset.asset_picture}`
        let exists = fs.existsSync(path)
        if(exists && findAsset.asset_picture !== ``) fs.unlinkSync(path)
        const deletedAsset = await prisma.asset.delete({
            where: { id: Number(id) }
        })
        return response.json({
            status: true,
            data: deletedAsset,
            message: `3D Asset with ${id} has been deleted`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const getAssetById = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;
        const asset = await prisma.asset.findUnique({
            where: { id: parseInt(id) }
        });
        if (!asset) {
            return response
                .json({
                    status: false,
                    message: `3D Asset with ID ${id} not found`
                })
                .status(404);
        }
        return response.json({
            status: true,
            data: asset,
            message: `3D Asset has been retrieved`
        }).status(200);
    } catch (error) {
        return response
            .json({
                status: false,
                message: `Error occurred: ${error}`
            })
            .status(400);
    }
};
