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
exports.calculateRideCost = void 0;
const RouteSettings_1 = require("../models/RouteSettingsModel/RouteSettings");
/**
 * Calculate ride cost based on km traveled, vehicle type, and route settings
 */
const calculateRideCost = (adminUserId, distanceKm, vehicleType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get route settings for the admin
        const routeSettings = yield RouteSettings_1.RouteSettingsModel.findOne({ adminUserId });
        if (!routeSettings || !routeSettings.kmRanges || routeSettings.kmRanges.length === 0) {
            // Fallback to default pricing if no settings found
            return {
                totalPrice: 0,
                driverCost: 0,
                adminCost: 0,
                cooperativaCost: 0,
            };
        }
        // Find the appropriate km range
        const kmRanges = routeSettings.kmRanges.sort((a, b) => a.maxKm - b.maxKm);
        let selectedRange = null;
        for (const range of kmRanges) {
            if (distanceKm <= range.maxKm) {
                selectedRange = range;
                break;
            }
        }
        // If distance exceeds all ranges, use the last (highest) range
        if (!selectedRange) {
            selectedRange = kmRanges[kmRanges.length - 1];
        }
        // Find pricing for the vehicle type (vehicleType is already numeric: 4, 6, or 8)
        const vehicleTypeNum = Number(vehicleType);
        const pricing = selectedRange.pricing.find((p) => p.vehicleType === vehicleTypeNum);
        if (!pricing) {
            // Fallback: use first pricing if vehicle type not found
            const fallbackPricing = selectedRange.pricing[0];
            if (!fallbackPricing) {
                return {
                    totalPrice: 0,
                    driverCost: 0,
                    adminCost: 0,
                    cooperativaCost: 0,
                };
            }
            const driverCost = fallbackPricing.driverFixed + distanceKm * fallbackPricing.driverPerKm;
            const adminCost = fallbackPricing.adminFixed + distanceKm * fallbackPricing.adminPerKm;
            const cooperativaCost = fallbackPricing.cooperativaFixed + distanceKm * fallbackPricing.cooperativaPerKm;
            const totalPrice = driverCost + adminCost + cooperativaCost;
            return {
                totalPrice: Math.round(totalPrice * 100) / 100,
                driverCost: Math.round(driverCost * 100) / 100,
                adminCost: Math.round(adminCost * 100) / 100,
                cooperativaCost: Math.round(cooperativaCost * 100) / 100,
            };
        }
        // Calculate costs
        const driverCost = pricing.driverFixed + distanceKm * pricing.driverPerKm;
        const adminCost = pricing.adminFixed + distanceKm * pricing.adminPerKm;
        const cooperativaCost = pricing.cooperativaFixed + distanceKm * pricing.cooperativaPerKm;
        const totalPrice = driverCost + adminCost + cooperativaCost;
        return {
            totalPrice: Math.round(totalPrice * 100) / 100,
            driverCost: Math.round(driverCost * 100) / 100,
            adminCost: Math.round(adminCost * 100) / 100,
            cooperativaCost: Math.round(cooperativaCost * 100) / 100,
        };
    }
    catch (error) {
        console.error("Error calculating ride cost:", error);
        return {
            totalPrice: 0,
            driverCost: 0,
            adminCost: 0,
            cooperativaCost: 0,
        };
    }
});
exports.calculateRideCost = calculateRideCost;
