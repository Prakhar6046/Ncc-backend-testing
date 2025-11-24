"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const getAllHotels_1 = __importDefault(require("../../controller/HotelController/getAllHotels"));
const getSingleHotel_1 = __importDefault(require("../../controller/HotelController/getSingleHotel"));
const Hotelroutes = (0, express_1.default)();
Hotelroutes.get("/all-hotels", passport_1.default.authenticate("jwt", { session: false }), getAllHotels_1.default);
Hotelroutes.post("/hotel-info", getSingleHotel_1.default);
exports.default = Hotelroutes;
