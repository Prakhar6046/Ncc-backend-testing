import { Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse, sendSuccessWithoutResponse } from "../../utils/responseFun";
import { BusinessModel } from "../../models/BusinessModel/businessModel";
import { AdminResponse } from "../../types/AdminTypeModel";
import { AdminModel } from "../../models/AdminModel/Admin";
import { CityBusinessModel } from "../../models/BusinessModel/cityBusinessModel";
import { getEffectiveAdminUserId } from "../../utils/adminHelper";

const GetBusinessInfo = async (req: Request, res: Response) => {
    try {
         // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
        return sendErrorResponse(res, 401, "User not authenticated.");
      }
      // Get effective adminUserId (parent Admin's ID for Capoflotta)
      const { effectiveAdminUserId, adminInfo } = await getEffectiveAdminUserId(req.user._id.toString());

      // Check if admin exists (using effective admin)
      const adminExists: AdminResponse | null = await AdminModel.findById(effectiveAdminUserId);
      if(!adminExists){
        return sendSuccessWithoutResponse(res,"Admin info not found") 
      }
      
      let businessInfo;
      // Fetch city routes: filter by adminUserId if user is an admin, otherwise fetch all routes
      if(adminExists?.superAdmin){
        businessInfo = await BusinessModel.findOne({});
        return sendSuccessResponse(res, businessInfo, "Business information retrieved successfully");
      }

      // Fetch the business info from the database using effective admin's city
      businessInfo = await CityBusinessModel.findOne({city: adminInfo.cityId})
        // If no data is found, return an empty array with a success response
        if (!businessInfo) {
            return sendSuccessResponse(res, {}, "No business information found");
        }

        // Return the fetched data with a success response
        return sendSuccessResponse(res, businessInfo, "Business information retrieved successfully");
    } catch (error) {
        // Log the error for debugging
        console.error("Error fetching business info:", error);

        // Return a 500 Internal Server Error response
        return sendErrorResponse(res, 500, "An error occurred while retrieving business information");
    }
};

export default GetBusinessInfo;
