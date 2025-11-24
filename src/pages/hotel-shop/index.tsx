import { Calendar } from "primereact/calendar";
import { addLocale } from "primereact/api";
import StructureMenu from "../../components/structure-menu";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  AllCityRoutes,
  getAdminSingleSettings,
} from "../../redux/thunks/admin";
import {
  SelectAllCityRoutes,
  SelectIsLoading,
  SelectSingleAdminData,
} from "../../redux/reducers/adminSlice";
import * as ValidationMessage from "../../utilities/validationsMessage/index";
import {
  decryptData,
  encryptData,
  parseDurationToMinutes,
} from "../../utilities/utils";
import { SingleCityRoute } from "../../TSModels/Admin";
import { handlePayment } from "../../redux/thunks/payment";
import {
  selectHotelData,
  selectIsLoading,
} from "../../redux/reducers/hotelProfile";
import Loader from "../../components/Loader";
import { handleGetCompanyData } from "../../redux/thunks/hotel";
import { HotelData } from "../../TSModels/Hotel";
import { selectIsPaymentLoading } from "../../redux/reducers/paymentSlice";
import GooglePlacesInput from "../../components/google-places";

addLocale("it", {
  firstDayOfWeek: 1,
  dayNames: [
    "Domenica",
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
  dayNamesMin: ["Do", "Lu", "Ma", "Me", "Gi", "Ve", "Sa"],
  monthNames: [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ],
  monthNamesShort: [
    "Gen",
    "Feb",
    "Mar",
    "Apr",
    "Mag",
    "Giu",
    "Lug",
    "Ago",
    "Set",
    "Ott",
    "Nov",
    "Dic",
  ],
  today: "Oggi",
  clear: "Cancella",
});

const HotelShop = () => {
  const dispatch = useAppDispatch();
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const isHotelLoading = useAppSelector(selectIsLoading);
  const isAdminLoading = useAppSelector(SelectIsLoading);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [durationText, setDurationText] = useState<string | null>(null);
console.log("distanceKm-======", distanceKm);
console.log("durationText-======", durationText);
  const isPaymentLoading = useAppSelector(selectIsPaymentLoading);
  const requestData = decryptData("requestData");
  const cityRoutes = useAppSelector(SelectAllCityRoutes);
  const hotelData: HotelData = useAppSelector(selectHotelData);
  const [availableHours, setAvailableHours] = useState<number[]>([]);
  const [availableMinutes, setAvailableMinutes] = useState<string[]>([]);
  const [driverCost, setDriverCost] = useState<number>();
  const [estimateTime, setEstimateTime] = useState<number>();
  const [adminCost, setAdminCost] = useState<number>();
  const [cooperativeCost, setCooperativeCost] = useState<number>();
  const [dittaIndividualeCost, setDittaIndividualeCost] = useState<number>();
  const selectedDate = watch("appointmentDate");
  const selectedHour = watch("hour");
  const adminData = useAppSelector(SelectSingleAdminData);

  const [showCustomRouteFields, setShowCustomRouteFields] =
    useState<boolean>(false);
  const [currentRoutes, setCurrentRoutes] = useState<
    Array<SingleCityRoute & { isReversed: boolean }>
  >([]);
  const [search, setSearch] = useState<string>("");
  const onSubmit = (data: any) => {
    const phoneNumber = Number(data.telePhone);
    if (isNaN(phoneNumber)) {
      console.error("Invalid phone number");
      return;
    }
    const paymentPayload = {
      amount: data.product
        ? Math.round(JSON.parse(data.product)?.totalPrice * 100)
        : Math.round(data.customPrice * 100),
      currency: "eur",
    };
    encryptData("requestData", {
      ...data,
      phone: phoneNumber,
      customTime: estimateTime,
      customDriver: driverCost,
      customAdminCost: adminCost,
      customCooperativeCost: cooperativeCost,
      customDittaIndividualeCost: dittaIndividualeCost,
    });
    dispatch(handlePayment(paymentPayload));
  };

  useEffect(() => {
    const today = new Date();
    const selected = selectedDate ? new Date(selectedDate) : null;
    if (selected && selected.toDateString() === today.toDateString()) {
      // Today selected
      const currentHour = today.getHours();
      const nextAvailableHour = currentHour + 1;
      const validHours = [];
      for (let i = nextAvailableHour; i <= 23; i++) {
        validHours.push(i);
      }
      setAvailableHours(validHours);
    } else {
      // Future date
      const validHours = [];
      for (let i = 1; i <= 23; i++) {
        validHours.push(i);
      }
      setAvailableHours(validHours);
    }
  }, [selectedDate]);

  useEffect(() => {
    const now = new Date();
    const selected = selectedDate ? new Date(`${selectedDate}T00:00:00`) : null;
    const hour =
      selectedHour !== undefined && selectedHour !== null
        ? parseInt(selectedHour.toString())
        : NaN;
    const isSameDay =
      selected &&
      now.getFullYear() === selected.getFullYear() &&
      now.getMonth() === selected.getMonth() &&
      now.getDate() === selected.getDate();

    if (isSameDay && !isNaN(hour)) {
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();

      let validMinutes: string[] = [];

      if (hour === currentHour) {
        // Current hour: show only remaining minutes
        const roundedToNextTen = Math.ceil(currentMinutes / 10) * 10;
        for (let i = roundedToNextTen; i < 60; i += 10) {
          validMinutes.push(i.toString().padStart(2, "0"));
        }
      } else if (hour === currentHour + 1) {
        // Next hour: filter out minutes less than currentMinutes
        for (let i = 0; i < 60; i += 10) {
          if (i > currentMinutes) {
            validMinutes.push(i.toString().padStart(2, "0"));
          }
        }
      } else {
        // Future hours: show all minutes
        validMinutes = ["00", "10", "20", "30", "40", "50"];
      }

      setAvailableMinutes(validMinutes);
    } else {
      // Future dates or invalid input
      setAvailableMinutes(["00", "10", "20", "30", "40", "50"]);
    }
  }, [selectedDate, selectedHour]);

  useEffect(() => {
    if (!cityRoutes || !hotelData) return;

    let updatedRoutes = cityRoutes
      .map((route) => {
        if (requestData && route._id === JSON.parse(requestData?.product)._id) {
          return JSON.parse(requestData?.product);
        }
        return { ...route, isReversed: false };
      })
      ?.filter(
        (path) =>
          path.city &&
          hotelData.city &&
          path.city.toLowerCase() === hotelData.city.toLowerCase()
      );
    const selectedCarType = watch("cartype");
    if (selectedCarType) {
      if (search) {
        const lowerCaseSearch = search.toLowerCase();
        updatedRoutes = updatedRoutes.filter(
          (route) =>
            route.from.toLowerCase().includes(lowerCaseSearch) ||
            route.to.toLowerCase().includes(lowerCaseSearch)
        );
      }
    } else {
      setSearch("");
      updatedRoutes = [];
    }

    setCurrentRoutes(updatedRoutes);
  }, [cityRoutes, search, watch("cartype")]);
  useEffect(() => {
    dispatch(AllCityRoutes());
    console.log("cityRoutes-======", cityRoutes);
    dispatch(handleGetCompanyData());
    dispatch(getAdminSingleSettings());
    if (requestData) {
      setValue("cartype", requestData.cartype);
      if (currentRoutes) {
        const newProduct = JSON.parse(requestData.product);
        const updatedRoutes = currentRoutes.map((route) =>
          route._id === newProduct._id ? newProduct : route
        );
        setCurrentRoutes(updatedRoutes);
      }
      setValue("product", requestData.product);
      setValue("clientName", requestData.clientName);
      setValue("telePhone", requestData.telePhone);
      setValue("noOfPassengers", requestData.noOfPassengers);
      setValue("appointmentDate", requestData.appointmentDate);
      setValue("hour", requestData.hour);
      setValue("minutes", requestData.minutes);
      setValue("customFrom", requestData.customFrom);
      setValue("customPrice", Number(requestData.customPrice));
      setValue("customTo", requestData.customTo);
      if (requestData.customFrom) {
        setShowCustomRouteFields(true);
      }
      setDriverCost(requestData.customDriver);
      setEstimateTime(requestData.customTime);
      setValue(
        "usefulInformation",
        requestData.usefulInformation ? requestData.usefulInformation : ""
      );
    }
  }, []);
  const calculateDistance = (origin: string, destination: string) => {
    return new Promise<{ distanceKm: number; durationText: string }>(
      (resolve, reject) => {
        if (
          !window.google ||
          !window.google.maps ||
          !window.google.maps.DistanceMatrixService
        ) {
          console.error("Google Maps API not loaded yet");
          return reject("Google Maps API not loaded");
        }

        const service = new window.google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [destination],
            travelMode: window.google.maps.TravelMode.DRIVING,
            unitSystem: window.google.maps.UnitSystem.METRIC,
          },
          (response: any, status) => {
            if (status === "OK") {
              const result = response.rows[0].elements[0];
              if (result.status === "OK") {
                const distanceInMeters = result.distance.value;
                resolve({
                  distanceKm: distanceInMeters / 1000,
                  durationText: result.duration.text,
                });
              } else {
                console.error("Element error:", result.status);
                reject(`Element status: ${result.status}`);
              }
            } else {
              console.error("Service error:", status);
              reject(`Service status: ${status}`);
            }
          }
        );
      }
    );
  };

  // const frommm = watch("customFrom");
  // const too = watch("customTo");
  // console.log("frommm", frommm, too);
  const from = watch("customFrom")?.description;
  const to = watch("customTo")?.description;
  useEffect(() => {
    const fetchDistanceAndSetPrice = async () => {
      if (!from || !to) {
        console.warn("From or To address is missing");
        setDistanceKm(null);
        setDurationText(null);
        return;
      }

      if (!adminData || Object.keys(adminData).length === 0) {
        console.warn("Admin data not available yet");
        setDistanceKm(null);
        setDurationText(null);
        return;
      }

      try {
        // Step 1: Calculate distance from Google Maps API
        const { distanceKm, durationText } = await calculateDistance(from, to);
        setDistanceKm(distanceKm);
        setDurationText(durationText);
        
        console.log("Step 1 - Distance calculated:", distanceKm, "km");

        // Step 2: Get selected vehicle type (4 = berlina, 6 = van, 8 = lusso)
        const selectedCarType = watch("cartype");
        
        if (!selectedCarType) {
          console.warn("No vehicle type selected");
          return;
        }
        
        // Map car type to vehicle type key
        const vehicleTypeMap: { [key: number]: "berlina" | "van" | "lusso" } = {
          4: "berlina",
          6: "van",
          8: "lusso",
        };
        const vehicleType = vehicleTypeMap[selectedCarType] || "berlina";
        
        console.log("Step 2 - Vehicle type selected:", vehicleType, "(carType:", selectedCarType, ")");

        // Step 3: Check mileage bands and find matching band based on distance
        // Handle both possible property names (mileageBands or miLeageBands - MongoDB field name variation)
        const mileageBands = adminData?.mileageBands || (adminData as any)?.miLeageBands || [];
        
        if (adminData && mileageBands && Array.isArray(mileageBands) && mileageBands.length > 0) {
          console.log("Step 3 - Checking mileage bands for distance:", distanceKm, "km");
          console.log("Available bands:", mileageBands.map((b: any) => ({ kmMin: b.kmMin, kmMax: b.kmMax })));
          
          // Find the correct mileage band based on distance range
          // Bands are defined with kmMin and kmMax (e.g., kmMin=0, kmMax=4 means "0-4 km")
          // Find the band where kmMin <= distance < kmMax
          let selectedBand = null;
          
          for (const band of mileageBands) {
            const kmMin = band.kmMin ?? 0;
            const kmMax = band.kmMax;
            
            console.log(`  Checking band: ${kmMin}-${kmMax} km (distance: ${distanceKm} km)`);
            
            if (distanceKm >= kmMin && distanceKm < kmMax) {
              selectedBand = band;
              console.log("  ✓ Band matched:", selectedBand);
              break;
            }
          }
          
          // If no band found (distance exceeds all bands), use the band with highest kmMax
          if (!selectedBand) {
            const sortedBands = [...mileageBands].sort((a: any, b: any) => (b.kmMax || 0) - (a.kmMax || 0));
            selectedBand = sortedBands[0];
            console.log("  ⚠ No matching band found, using highest band:", selectedBand);
          }

          if (!selectedBand) {
            console.error("❌ No mileage band found and no fallback available");
            throw new Error("No mileage band configuration found");
          }

          // Step 4: Get costs for the selected vehicle type
          if (!selectedBand.vehicleTypes || !selectedBand.vehicleTypes[vehicleType]) {
            console.error("❌ Vehicle type not found in band:", vehicleType, selectedBand);
            throw new Error(`Vehicle type ${vehicleType} not found in mileage band`);
          }

          const vehicleCosts = selectedBand.vehicleTypes[vehicleType];
          console.log("Step 4 - Vehicle costs for", vehicleType, ":", vehicleCosts);
          // Step 5: Calculate prices based on mileage band
          // Formula: Total = (Admin fixedCost + Admin costPerKm × km) + (Cooperative fixedCost + Cooperative costPerKm × km) + (Driver fixedCost + Driver costPerKm × km) + (Ditta individuale fixedCost + Ditta individuale costPerKm × km)
          const calculatedAdminCost = vehicleCosts.admin.fixedCost + (vehicleCosts.admin.costPerKm * distanceKm);
          const calculatedCooperativeCost = vehicleCosts.cooperative.fixedCost + (vehicleCosts.cooperative.costPerKm * distanceKm);
          const calculatedDriverCost = vehicleCosts.driver.fixedCost + (vehicleCosts.driver.costPerKm * distanceKm);
          const calculatedDittaIndividualeCost = vehicleCosts.ditta_individuale.fixedCost + (vehicleCosts.ditta_individuale.costPerKm * distanceKm);
          
          console.log("Step 5 - Price calculation:");
          console.log("  Admin cost:", calculatedAdminCost, `(${vehicleCosts.admin.fixedCost} + ${vehicleCosts.admin.costPerKm} × ${distanceKm})`);
          console.log("  Cooperative cost:", calculatedCooperativeCost, `(${vehicleCosts.cooperative.fixedCost} + ${vehicleCosts.cooperative.costPerKm} × ${distanceKm})`);
          console.log("  Driver cost:", calculatedDriverCost, `(${vehicleCosts.driver.fixedCost} + ${vehicleCosts.driver.costPerKm} × ${distanceKm})`);
          console.log("  Ditta individuale cost:", calculatedDittaIndividualeCost, `(${vehicleCosts.ditta_individuale.fixedCost} + ${vehicleCosts.ditta_individuale.costPerKm} × ${distanceKm})`);
          
          const totalPrice = calculatedAdminCost + calculatedCooperativeCost + calculatedDriverCost + calculatedDittaIndividualeCost;
          const DriverPrice = calculatedDriverCost;

          console.log("Step 6 - Final prices:");
          console.log("  Total price:", totalPrice);
          console.log("  Driver price:", DriverPrice);

          const timeTravel = parseDurationToMinutes(durationText);

          setDriverCost(DriverPrice);
          setEstimateTime(timeTravel);
          setAdminCost(calculatedAdminCost);
          setCooperativeCost(calculatedCooperativeCost);
          setDittaIndividualeCost(calculatedDittaIndividualeCost);
          setValue("customPrice", totalPrice.toFixed(2));
        } else {
      
          const kmAmount = selectedCarType === 6 ? (adminData as any).van_KM_amount : (adminData as any).driver_KM_amount;
          const minAmount = selectedCarType === 6 ? (adminData as any).van_min_amount_route : (adminData as any).driver_min_amount_route;
         
        const totalPrice =
            distanceKm * (adminData as any).admin_KM_amount +
          distanceKm * kmAmount +
            (adminData as any).admin_min_amount_route +
          minAmount;

        const DriverPrice =
          distanceKm * kmAmount +
          minAmount;

        const timeTravel = parseDurationToMinutes(durationText);

        setDriverCost(DriverPrice);
        setEstimateTime(timeTravel);
        setValue("customPrice", totalPrice.toFixed(2));
        }
      } catch (err) {
        console.error("Distance calculation failed:", err);
        setDistanceKm(null);
        setDurationText(null);
      }
    };

    // Only run the effect if adminData is loaded
    if (!isAdminLoading && adminData && Object.keys(adminData).length > 0) {
      fetchDistanceAndSetPrice();
    }
  }, [from, to, adminData, isAdminLoading, setValue, watch("cartype")]);

  if (isHotelLoading || isAdminLoading) {
    return <Loader />;
  }
  if (isPaymentLoading) {
    return <Loader />;
  }
  return (
    <div className="container">
      <div className="row justify-content-center">
        <StructureMenu />
        <div className="col-12 col-md-9">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-12 mb-5">
                <div className="step_wizard">
                  <div className="number_step">
                    <span>1</span>
                  </div>
                  <div className="text_step">
                    <h4>Richiedi il servizio NCC</h4>
                    <p>Seleziona il tipo di veicolo che preferisci.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-4 mb-5">
                <input
                  className="select_product_type"
                  id="berlina"
                  type="radio"
                  // name="cartype"
                  value={4}
                  hidden
                  {...register("cartype")}
                  checked={watch("cartype") == 4}
                />
                <label htmlFor="berlina" className="single_check">
                  <span className="container_image_icon">
                    <img src="static/img/icons/car.svg" />
                  </span>
                  <span className="type_of_car">Berlina</span>
                </label>
              </div>
              <div className="col-12 col-md-4 mb-5">
                <input
                  className="select_product_type"
                  id="van"
                  type="radio"
                  // name="cartype"
                  value={6}
                  hidden
                  {...register("cartype")}
                  checked={watch("cartype") == 6}
                />
                <label htmlFor="van" className="single_check">
                  <span className="container_image_icon">
                    <img src="static/img/icons/van.svg" />
                  </span>
                  <span className="type_of_car">Van</span>
                </label>
              </div>
              <div className="col-12 col-md-4 mb-5">
                <input
                  className="select_product_type"
                  id="lusso"
                  type="radio"
                  // name="cartype"
                  value={8}
                  hidden
                  {...register("cartype")}
                  checked={watch("cartype") == 8}
                />
                <label htmlFor="lusso" className="single_check">
                  <span className="container_image_icon">
                    <img src="static/img/icons/car.svg" />
                  </span>
                  <span className="type_of_car">Lusso</span>
                </label>
              </div>
            </div>

            <div className="row">
              <div className="col-12 mb-5">
                <div
                  className={`step_wizard ${
                    watch("cartype") ? "" : "step_disabled"
                  }`}
                >
                  <div className="number_step">
                    <span>2</span>
                  </div>
                  <div className="text_step">
                    <h4>
                      {currentRoutes?.length && watch("cartype")
                        ? currentRoutes?.length
                        : 0}{" "}
                      tratte trovate
                    </h4>
                    <p>Trova, filtra e seleziona la tratta da acquistare.</p>
                  </div>
                  {watch("cartype") && (
                    <div className="d-flex flex-column align-items-end gap-2 flex-grow-1">
                      <p className="mb-0">Non trovi il percorso ?</p>
                      <button
                        type="button"
                        className="btn btn-dark"
                        style={{
                          width: "fit-content",
                          marginLeft: "auto",
                        }}
                        onClick={() => {
                          setShowCustomRouteFields(!showCustomRouteFields);
                          setValue("product", null);
                        }}
                      >
                        {showCustomRouteFields
                          ? "Nascondi percorso personalizzato"
                          : "Seleziona tratte personalizzate"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {watch("cartype") && (
              <>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Cerca una tratta"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {currentRoutes &&
                  currentRoutes.length !== 0 &&
                  currentRoutes.map((route, idx) => (
                    <div
                      key={idx}
                      className="single_product_container"
                      style={
                        watch("product") &&
                        JSON.parse(watch("product"))._id !== route._id
                          ? { display: "none" }
                          : {}
                      }
                    >
                      <input
                        {...register("product")}
                        id={`product_${idx}`}
                        type="radio"
                        value={JSON.stringify(route)}
                        className="radio_single_product"
                        onChange={(e) => {
                          setShowCustomRouteFields(false);
                          register("product").onChange(e);
                        }}
                      />
                      <label
                        htmlFor={`product_${idx}`}
                        className="single_product"
                      >
                        <div
                          className="change_product"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setValue("product", null);
                            setShowCustomRouteFields(false);
                          }}
                        >
                          <span className="x_close">✕</span>
                          <span>Cambia selezione</span>
                        </div>

                        <span className="metadata_product">
                          <span className="title_product">
                            <span className="fromto">
                              <span className="from">
                                <span className="calm_gray">Da:</span>{" "}
                                {route?.isReversed ? route.to : route.from}
                              </span>
                              <span className="to">
                                <span className="calm_gray">A:</span>{" "}
                                {route?.isReversed ? route.from : route.to}
                              </span>
                            </span>
                          </span>
                          <span
                            className="module_invert_direction"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCurrentRoutes(
                                currentRoutes.map((path) =>
                                  path._id === route._id
                                    ? {
                                        ...route,
                                        isReversed: !route.isReversed,
                                      }
                                    : path
                                )
                              );
                            }}
                          >
                            <span className="change_direction">
                              <img src="static/img/icons/invert.svg" />
                            </span>
                            <span className="invert_places">
                              Inverti destinazione
                            </span>
                          </span>
                        </span>
                        <div className="price_and_change">
                          <span className="proce_product">
                            {route.totalPrice} €
                          </span>
                        </div>
                      </label>
                    </div>
                  ))}
              </>
            )}

            <div className="row mt-5">
              <div className="col-12 mb-5">
                <div
                  className={`step_wizard ${
                    watch("product") || showCustomRouteFields
                      ? ""
                      : "step_disabled"
                  }`}
                >
                  <div className="number_step">
                    <span>3</span>
                  </div>
                  <div className="text_step">
                    <h4>Completa l'ordine</h4>
                    <p>
                      Seleziona la data e l'ora e aggiungi le informazioni utili
                      per i nostri driver.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {(!!watch("product") || showCustomRouteFields) && (
              <div className="row mb-5">
                <div className="col-12">
                  <div className="col-12">
                    <div className="form_container">
                      {showCustomRouteFields &&
                        !watch("product") &&
                        watch("cartype") && (
                          <div className="row mb-3">
                            <div className="col-12 col-md-6">
                              <GooglePlacesInput
                                label="Indirizzo di partenza"
                                fieldName="customFrom"
                                control={control}
                                error={errors.customFrom}
                                required={true}
                                setValue={setValue}
                              />
                            </div>
                            <div className="col-12 col-md-6">
                              <GooglePlacesInput
                                label="Indirizzo di arrivo"
                                fieldName="customTo"
                                control={control}
                                error={errors.customTo}
                                required={true}
                                setValue={setValue}
                              />
                            </div>
                            {/* --- SUMMARY BOX UI --- */}
                            {from &&
                              to &&
                              distanceKm !== null &&
                              durationText !== null && (
                                <div className="col-12">
                                  <div className="d-flex justify-content-between align-items-center mt-4 border border-dark-subtle px-3 py-4 rounded-3">
                                    <div
                                      className="d-flex align-items-center gap-2"
                                      style={{ height: "80px" }}
                                    >
                                      <div className="rounded-circle p-2 border border-dark-subtle">
                                        <img
                                          src={
                                            watch("cartype") == 4
                                              ? "static/img/icons/car.svg"
                                              : "static/img/icons/van.svg"
                                          }
                                          alt={
                                            watch("cartype") == 4
                                              ? "Berlina"
                                              : "Van"
                                          }
                                          style={{ width: 32, height: 32 }}
                                        />
                                      </div>

                                      <span
                                        style={{
                                          color: "#f7b500",
                                          fontWeight: 600,
                                          fontSize: "1.1rem",
                                          marginRight: "16px",
                                        }}
                                      >
                                        {watch("cartype") == 4
                                          ? "Berlina"
                                          : "Van"}
                                      </span>
                                      <div className="vr"></div>
                                      <div className="d-flex flex-column ms-3">
                                        <span style={{ fontWeight: 500 }}>
                                          <span
                                            style={{
                                              color: "#222",
                                              fontWeight: "bolder",
                                            }}
                                          >
                                            Distanza:
                                          </span>{" "}
                                          {distanceKm.toLocaleString("it-IT", {
                                            minimumFractionDigits: 1,
                                            maximumFractionDigits: 1,
                                          })}{" "}
                                          Km
                                        </span>

                                        <span
                                          style={{
                                            fontWeight: 500,
                                          }}
                                        >
                                          <span
                                            style={{
                                              color: "#222",
                                              fontWeight: "bolder",
                                            }}
                                          >
                                            Durata stimata:
                                          </span>{" "}
                                          {durationText}
                                        </span>
                                      </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                      <span
                                        style={{
                                          fontWeight: 700,
                                          fontSize: "1.2rem",
                                        }}
                                      >
                                        Prezzo (€){" "}
                                        {watch("customPrice")
                                          ? parseFloat(
                                              watch("customPrice")
                                            ).toLocaleString("it-IT", {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            })
                                          : "--"}
                                      </span>
                                      <span
                                        style={{
                                          color: "#666",
                                          marginLeft: "8px",
                                        }}
                                      >
                                        tasse incluse
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            {/* --- END SUMMARY BOX --- */}
                            {/* <div className="former_row">
                              <label
                                htmlFor="customPrice"
                                className="form-label"
                              >
                                Prezzo (€)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                id="customPrice"
                                disabled
                                {...register("customPrice", {
                                  required: showCustomRouteFields,
                                  min: 0,
                                })}
                              />
                              {errors?.customPrice?.type === "required" && (
                                <p className="mt-1 text-danger">
                                  {ValidationMessage.required}
                                </p>
                              )}
                              {errors?.customPrice?.type === "min" && (
                                <p className="mt-1 text-danger">
                                  Price must be a positive number.
                                </p>
                              )}
                            </div> */}
                          </div>
                        )}
                      <div className="row">
                        <div className="col-12 col-md-6">
                          <div className="former_row">
                            <label htmlFor="name" className="form-label">
                              Nome cliente <span className="mandatory">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="name"
                              {...register("clientName", {
                                required: true,
                                validate: (value) =>
                                  value.trim() === ""
                                    ? ValidationMessage.required
                                    : /^[^\d]+$/.test(value) ||
                                      "Il nome non può contenere numeri",
                              })}
                            />
                            {errors?.clientName?.type === "required" && (
                              <p className="mt-1 text-danger">
                                {ValidationMessage.required}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="former_row">
                            <label htmlFor="phone" className="form-label">
                              Telefono <span className="mandatory">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="phone"
                              {...register("telePhone", {
                                required: true,
                                validate: (value) =>
                                  value.trim() === ""
                                    ? ValidationMessage.required
                                    : /^[0-9]+$/.test(value) ||
                                      "Il numero di telefono può contenere solo cifre",
                              })}
                            />
                            {errors?.telePhone?.type === "required" && (
                              <p className="mt-1 text-danger">
                                {ValidationMessage.required}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="former_row">
                            <label htmlFor="customerEmail" className="form-label">
                              Email cliente <span className="mandatory">*</span>
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              id="customerEmail"
                              {...register("customerEmail", {
                                required: true,
                                validate: (value) =>
                                  value.trim() === ""
                                    ? ValidationMessage.required
                                    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
                                      "Inserisci un indirizzo email valido",
                              })}
                            />
                            {errors?.customerEmail?.type === "required" && (
                              <p className="mt-1 text-danger">
                                {ValidationMessage.required}
                              </p>
                            )}
                            {errors?.customerEmail && typeof errors.customerEmail.message === "string" && (
                              <p className="mt-1 text-danger">
                                {errors.customerEmail.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="former_row">
                            <label htmlFor="name" className="form-label">
                              Numero passeggeri{" "}
                              <span className="mandatory">*</span>
                            </label>
                            <select
                              className="form-select"
                              {...register("noOfPassengers", {
                                required: true,
                              })}
                            >
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              {watch("cartype") == 6 && (
                                <>
                                  <option value="5">5</option>
                                  <option value="6">6</option>
                                </>
                              )}
                            </select>
                            {errors?.noOfPassengers?.type === "required" && (
                              <p className="mt-1 text-danger">
                                {ValidationMessage.required}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="former_row">
                            <label htmlFor="name" className="form-label">
                              Seleziona una data{" "}
                              <span className="mandatory">*</span>
                            </label>
                            <div className="calendar_container">
                              <Calendar
                                {...register("appointmentDate", {
                                  required: true,
                                })}
                                locale="it"
                                showButtonBar
                                minDate={new Date()}
                                value={
                                  watch("appointmentDate")
                                    ? new Date(watch("appointmentDate"))
                                    : null
                                }
                                onChange={(e) => {
                                  const selectedDate = e.target.value;
                                  const localDate = selectedDate
                                    ? new Date(selectedDate)
                                    : null;

                                  if (
                                    localDate &&
                                    !isNaN(localDate.getTime())
                                  ) {
                                    const year = localDate.getFullYear();
                                    const month = String(
                                      localDate.getMonth() + 1
                                    ).padStart(2, "0");
                                    const day = String(
                                      localDate.getDate()
                                    ).padStart(2, "0");

                                    setValue(
                                      "appointmentDate",
                                      `${year}-${month}-${day}`,
                                      { shouldValidate: true }
                                    );
                                  }
                                }}
                                onClearButtonClick={() =>
                                  setValue("appointmentDate", "")
                                }
                                inline
                              ></Calendar>
                            </div>
                            {errors?.appointmentDate?.type === "required" && (
                              <p className="mt-1 text-danger">
                                {ValidationMessage.required}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="former_row">
                            <label htmlFor="name" className="form-label">
                              Seleziona l'ora dell'appuntamento{" "}
                              <span className="mandatory">*</span>
                            </label>
                            <div className="calendar_container">
                              <div className="row">
                                <div className="col-6">
                                  <label htmlFor="name" className="form-label">
                                    Ore <span className="mandatory">*</span>
                                  </label>
                                  <select
                                    className="form-select"
                                    {...register("hour", {
                                      required: true,
                                    })}
                                  >
                                    {availableHours.map((hr: number) => (
                                      <option key={hr} value={hr}>
                                        {hr}
                                      </option>
                                    ))}
                                  </select>
                                  {errors?.hour?.type === "required" && (
                                    <p className="mt-1 text-danger">
                                      {ValidationMessage.required}
                                    </p>
                                  )}
                                </div>
                                <div className="col-6">
                                  <label htmlFor="name" className="form-label">
                                    MinutiHours{" "}
                                    <span className="mandatory">*</span>
                                  </label>
                                  <select
                                    className="form-select"
                                    {...register("minutes", {
                                      required: true,
                                    })}
                                  >
                                    {availableMinutes.map((min) => (
                                      <option key={min} value={min}>
                                        {min}
                                      </option>
                                    ))}
                                  </select>
                                  {errors?.minutes?.type === "required" && (
                                    <p className="mt-1 text-danger">
                                      {ValidationMessage.required}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="former_row">
                            <label htmlFor="info" className="form-label">
                              Informazioni utili per il conducente
                            </label>
                            <textarea
                              id="info"
                              className="form-control"
                              {...register("usefulInformation")}
                              rows={8}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                      <div className="centered_all">
                        <p>
                          Controlla la prenotazione e procedi con il pagamento
                        </p>
                        <button type="submit" className="btn btn-lg btn-dark">
                          {watch("product")
                            ? `Paga ${
                                JSON.parse(watch("product"))?.totalPrice
                              } €`
                            : watch("customPrice")
                            ? `Paga ${parseFloat(watch("customPrice")).toFixed(
                                2
                              )} €`
                            : "Paga"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default HotelShop;
