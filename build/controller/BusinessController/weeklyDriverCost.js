"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Admin_1 = require("../../models/AdminModel/Admin");
const NccBooking_1 = require("../../models/NccBookingModel/NccBooking");
const responseFun_1 = require("../../utils/responseFun");
const CarDriver_1 = require("../../models/CarDriverModel/CarDriver");
const adminHelper_1 = require("../../utils/adminHelper");
const GetDriverWeeklyCost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.user || !req.user._id) {
            return (0, responseFun_1.sendErrorResponse)(res, 401, "User not authenticated.");
        }
        const { effectiveAdminUserId, adminInfo } = yield (0, adminHelper_1.getEffectiveAdminUserId)(req.user._id.toString());
        // Check if admin exists
        const adminExists = yield Admin_1.AdminModel.findById(effectiveAdminUserId);
        if (!adminExists) {
            return (0, responseFun_1.sendErrorResponse)(res, 404, "Admin not found");
        }
        const { start, end } = req.query;
        if (!start || !end) {
            return (0, responseFun_1.sendErrorResponse)(res, 400, "Start and end dates are required");
        }
        const startDate = new Date(start);
        const endDate = new Date(end);
        // Fetch all completed bookings in date range using effective admin's city
        const bookings = yield NccBooking_1.NccBookingModel.find({
            city: adminInfo.cityId,
            completeOrder: true,
            createdAt: { $gte: startDate, $lte: endDate },
        });
        const allDrivers = yield CarDriver_1.CarDriversModel.find({ adminUserId: effectiveAdminUserId });
        const driverCategoryMap = {};
        for (const driver of allDrivers) {
            driverCategoryMap[String(driver._id)] = driver.category || "Unknown";
        }
        // Aggregate costs by category
        const categoryMap = {};
        for (const booking of bookings) {
            const driverId = booking.driverId || "Unknown";
            const driverName = booking.driverName || driverId || "Unknown Driver";
            const category = driverCategoryMap[driverId] || "Unknown";
            const cost = (_a = booking.driverCost) !== null && _a !== void 0 ? _a : 0;
            if (!categoryMap[category]) {
                categoryMap[category] = { total: 0, drivers: {} };
            }
            categoryMap[category].total += cost;
            if (!categoryMap[category].drivers[driverName]) {
                categoryMap[category].drivers[driverName] = 0;
            }
            categoryMap[category].drivers[driverName] += cost;
        }
        // Fetch all cars registered under this admin
        // for (const car of allCars) {
        //   const bookingsForCar = bookings.filter(
        //     (b) => b.carModel === String(car._id)
        //   );
        //   // Use driverId as key, store { name, cost }
        //   const driverMap: Record<string, { name: string; cost: number }> = {};
        //   for (const booking of bookingsForCar) {
        //     const driverId = booking.driverId || "Unknown";
        //     const driverName = booking.driverName || driverId || "Unknown Driver";
        //     if (!driverMap[driverId])
        //       driverMap[driverId] = { name: driverName, cost: 0 };
        //     driverMap[driverId].cost += booking.driverCost ?? 0;
        //     console.log({
        //       driverId,
        //       driverName,
        //       mappedCategory: driverCategoryMap[driverId],
        //     });
        //   }
        //   const totalCost = Object.values(driverMap).reduce(
        //     (sum, val) => sum + val.cost,
        //     0
        //   );
        //   carMap.set(car && car.module && car.module.toUpperCase(), {
        //     totalCost,
        //     drivers: Object.entries(driverMap).map(([driverId, info]) => ({
        //       name: info.name,
        //       cost: info.cost,
        //       category: driverCategoryMap[driverId] || "Unknown",
        //     })),
        //   });
        // }
        // for (const car of allCars) {
        //   const bookingsForCar = bookings.filter(
        //     (b) => b.carModel === String(car._id)
        //   );
        //   const driverMap: Record<string, number> = {};
        //   for (const booking of bookingsForCar) {
        //     const driverName =
        //       booking.driverName || booking.driverId || "Unknown Driver";
        //     if (!driverMap[driverName]) driverMap[driverName] = 0;
        //     driverMap[driverName] += booking.driverCost ?? 0;
        //   }
        //   const totalCost = Object.values(driverMap).reduce(
        //     (sum, val) => sum + val,
        //     0
        //   );
        //   carMap.set(car && car.module && car.module.toUpperCase(), {
        //     totalCost,
        //     drivers: Object.entries(driverMap).map(([name, cost, category]) => ({
        //       name,
        //       cost,
        //       category:
        //         allDrivers.find((d) => d.driverName === name)?.category ||
        //         "Unknown",
        //     })),
        //   });
        // }
        const result = Object.entries(categoryMap).map(([category, data]) => ({
            category,
            total: data.total,
            drivers: Object.entries(data.drivers).map(([name, total]) => ({
                name,
                total,
            })),
        }));
        return (0, responseFun_1.sendSuccessResponse)(res, result, "Weekly driver cost fetched");
    }
    catch (error) {
        console.error("Error in GetDriverWeeklyCost:", error);
        return (0, responseFun_1.sendErrorResponse)(res, 500, "Internal server error");
    }
});
exports.default = GetDriverWeeklyCost;
