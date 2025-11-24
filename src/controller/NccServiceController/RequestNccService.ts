import { Response, Request } from "express";
import {
  sendErrorResponse,
  sendSuccessWithoutResponse,
} from "../../utils/responseFun";
import { CompanyModel } from "../../models/CompanyModel/CompanyModel";
import { NccBookingModel } from "../../models/NccBookingModel/NccBooking";
import { CompanyResponse } from "../../types/CompanyModel";
import { CityRouteModel } from "../../models/CityRouteModel/CityRoute";
import { CityrouteResponse } from "../../types/CityrouteTypeModel";
import BusinessData from "../../middleware/BusinessFunction/businessFunction";
import { CarDriversModel } from "../../models/CarDriverModel/CarDriver";
import { firebaseAdmin } from "../../middleware/firebase/firebase";
import route from "../../Routes/routes";
import SendSecurityPinEmail from "../../middleware/email/sendSecurityPinEmail";

const requestService = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      selectedRouteId,
      preferVehicel,
      clientName,
      telePhone,
      customerEmail,
      isReverse,
      noOfPassengers,
      appointmentTime,
      appointmentDate,
      usefulInformation,
      customFrom,
      customPrice,
      customTo,
      customDriver,
      customTime,
    } = req.body;

    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return sendErrorResponse(
        res,
        401,
        "Unauthorized: User is not authenticated."
      );
    }

    const userId = req.user._id;

    // Check if the user's associated company exists
    const existingCompany: CompanyResponse | null = await CompanyModel.findById(
      userId
    );
    if (!existingCompany) {
      return sendErrorResponse(res, 409, "Account not found for the user.");
    }

    // Fetch route information
    const routeInfo: CityrouteResponse | null = await CityRouteModel.findById(
      selectedRouteId
    );

    const userOrderCount = await NccBookingModel.countDocuments({
      companyId: userId,
    });
    const cityOrderCount = await NccBookingModel.countDocuments({
      city: existingCompany.city,
    });
    const hotelOrderCount = await NccBookingModel.countDocuments({
      companyId: userId,
    });
    const fromLocation = routeInfo
      ? {
          value: routeInfo.from,
          lat: null,
          long: null,
          description: null,
        }
      : {
          value: customFrom?.description || "",
          lat: customFrom?.lat || null,
          long: customFrom?.lng || null,
          description: customFrom?.description || "",
        };

    const toLocation = routeInfo
      ? {
          value: routeInfo.to,
          lat: null,
          long: null,
          description: null,
        }
      : {
          value: customTo?.description || "",
          lat: customTo?.lat || null,
          long: customTo?.lng || null,
          description: customTo?.description || "",
        };
    
    // Generate unique 6-digit PIN
    const securityPin = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Prepare booking request data
    const newBookingRequest = {
      companyId: userId,
      orderNumber: userOrderCount + 1,
      cityOrderNumber: cityOrderCount + 1,
      hotelOrderNumber: hotelOrderCount + 1,
      selectedRouteId,
      from: fromLocation.value,
      fromLat: fromLocation.lat,
      fromLong: fromLocation.long,
      fromDescription: fromLocation.description,
      to: toLocation.value,
      toLat: toLocation.lat,
      toLong: toLocation.long,
      toDescription: toLocation.description,
      totalPrice: routeInfo ? routeInfo.totalPrice : customPrice,
      isReverse: isReverse ? isReverse : false,
      preferVehicel,
      clientName,
      telePhone,
      customerEmail,
      securityPin,
      noOfPassengers,
      appointmentTime,
      appointmentDate,
      usefulInformation,
      city: existingCompany.city,
      address: existingCompany.address,
      driverCost: routeInfo ? routeInfo.driverCost : customDriver,
      averageTravelTime: routeInfo
        ? routeInfo.averageTravelTime.toString()
        : customTime,
    };

    // Save booking requests to the database
    const BookingInfo = await NccBookingModel.create(newBookingRequest);
    
    // Send security PIN email to customer
    await SendSecurityPinEmail(
      customerEmail,
      securityPin,
      clientName,
      BookingInfo.orderNumber as number,
      res
    );
    // Business data update
    await BusinessData(
      routeInfo ? routeInfo.totalPrice : customPrice,
      routeInfo ? routeInfo.averageTravelTime : customTime,
      existingCompany.city
    );

    // Retrieve drivers in the same city based on preferVehicel
    let driverQuery: any = {
      cityOfService: existingCompany.city,
      isActive: true,
    };

    if (preferVehicel === 6) {
      // Send to only drivers having carType 6
      driverQuery.carType = 6;
    }
    // else for preferVehicel === 4, send to all cars, so no need to add carType filter

    const drivers = await CarDriversModel.find(driverQuery);
    if (!drivers || drivers.length === 0) {
      console.warn("No active drivers found in the city.");
    } else {
      // Map to extract FCM tokens
      const fcmTokens = drivers
        .map((driver) => driver.fmcToken)
        .filter((token): token is string => Boolean(token));

      if (fcmTokens.length > 0) {
        const notificationPayload = {
          notification: {
            title: "Nuova corsa da Neth",
            body: `Hai una corsa in attesa. Visualizza le informazioni e accetta la richiesta.`,
          },
          data: {
            bookingId: BookingInfo._id.toString(),
            orderNumber: newBookingRequest.orderNumber.toString(),
            city: existingCompany.city,
          },
        };
        const response = await firebaseAdmin.messaging().sendEachForMulticast({
          tokens: fcmTokens,
          ...notificationPayload,
        });

        console.log(
          `Notifications sent successfully: ${response.successCount} successful, ${response.failureCount} failed.`
        );

        if (response.failureCount > 0) {
          console.warn(
            "Failed to send notifications to some devices:",
            response.responses
              .filter((r: any) => !r.success)
              .map((r: any) => r.error)
          );
        }
      } else {
        console.warn("No FCM tokens found for drivers in the city.");
      }
    }

    return sendSuccessWithoutResponse(
      res,
      "Booking request created successfully."
    );
  } catch (error) {
    console.error("Error while creating booking request:", error);
    return sendErrorResponse(
      res,
      500,
      "Server error: Unable to process the booking request at this time."
    );
  }
};

export default requestService;
