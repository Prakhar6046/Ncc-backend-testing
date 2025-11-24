import { BusinessModel } from "../../models/BusinessModel/businessModel";
import { CityBusinessModel } from "../../models/BusinessModel/cityBusinessModel";
import {
  BusinessResponse,
  CityBusinessResponse,
} from "../../types/businessTypeModel";

const BusinessData = async (
  totalPrice: number,
  totalTime: number,
  city: string
) => {
  try {
    // Fetch global business and city-specific business data
    const [business, cityBusiness] = await Promise.all([
      BusinessModel.findOne<BusinessResponse>({}),
      CityBusinessModel.findOne<CityBusinessResponse>({ city }),
    ]);

    // Update or create city-specific business data
    await handleCityBusinessUpdate(cityBusiness, city, totalPrice, totalTime);

    // Update or create global business data
    await handleGlobalBusinessUpdate(business, totalPrice, totalTime);
  } catch (error) {
    console.error("Error while updating business data:", error);
  }
};

// Handles updating or creating city-specific business data
const handleCityBusinessUpdate = async (
  cityBusiness: CityBusinessResponse | null,
  city: string,
  totalPrice: number,
  totalTime: number
) => {
  const initialCityBusinessInfo = {
    totalProfit: totalPrice,
    earningsPerPeriod: totalPrice,
    dailyAverage: totalPrice,
    totalRuns: 1,
    totalRunsPerDay: 1,
    averageEarningsPerRide: totalPrice, // Single run
    timeTravel: totalTime,
    city,
  };

  if (!cityBusiness) {
    // Create new city-specific business data
    await CityBusinessModel.create(initialCityBusinessInfo);
  } else {
    // Calculate updated values
    const updatedCityData = {
      totalProfit: cityBusiness.totalProfit + totalPrice,
      earningsPerPeriod: cityBusiness.earningsPerPeriod + totalPrice,
      dailyAverage: cityBusiness.dailyAverage + totalPrice,
      totalRuns: cityBusiness.totalRuns + 1,
      totalRunsPerDay: cityBusiness.totalRunsPerDay + 1,
      averageEarningsPerRide:
        (cityBusiness.dailyAverage + totalPrice) /
        (cityBusiness.totalRunsPerDay + 1),
      timeTravel: cityBusiness.timeTravel + totalTime,
    };

    // Update the document
    await CityBusinessModel.updateOne({ _id: cityBusiness._id }, { $set: updatedCityData });
  }
};

// Handles updating or creating global business data
const handleGlobalBusinessUpdate = async (
  business: BusinessResponse | null,
  totalPrice: number,
  totalTime: number
) => {
  const initialGlobalBusinessInfo = {
    totalProfit: totalPrice,
    earningsPerPeriod: totalPrice,
    dailyAverage: totalPrice,
    totalRuns: 1,
    totalRunsPerDay: 1,
    averageEarningsPerRide: totalPrice, // Single run
    timeTravel: totalTime,
  };

  if (!business) {
    // Create new global business data
    await BusinessModel.create(initialGlobalBusinessInfo);
  } else {
    // Calculate updated values
    const updatedGlobalData = {
      totalProfit: business.totalProfit + totalPrice,
      earningsPerPeriod: business.earningsPerPeriod + totalPrice,
      dailyAverage: business.dailyAverage + totalPrice,
      totalRuns: business.totalRuns + 1,
      totalRunsPerDay: business.totalRunsPerDay + 1,
      averageEarningsPerRide:
        (business.dailyAverage + totalPrice) / (business.totalRunsPerDay + 1),
      timeTravel: business.timeTravel + totalTime,
    };

    // Update the document
    await BusinessModel.updateOne({ _id: business._id }, { $set: updatedGlobalData });
  }
};

export default BusinessData;
