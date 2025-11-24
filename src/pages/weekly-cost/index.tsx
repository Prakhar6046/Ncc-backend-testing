import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { addLocale } from "primereact/api"; 
import DynamicMenu from "../../components/dynamic-menu";
import "react-calendar/dist/Calendar.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { GetDriverWeeklyCost } from "../../redux/thunks/admin";
import {
  SelectWeeklyData,
  SelectWeeklyLoading,
} from "../../redux/reducers/adminSlice";
import Loader from "../../components/Loader";

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
function DriverWeeklyAmount() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const weeklyCost = useAppSelector(SelectWeeklyData);

  const loading = useAppSelector(SelectWeeklyLoading);
  const dispatch = useAppDispatch();

  const getWeekRange = (date: Date) => {
    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { monday, sunday };
  };
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setIsCalendarOpen(false);
    }
  };
  useEffect(() => {
    const { monday, sunday } = getWeekRange(selectedDate);
    dispatch(
      GetDriverWeeklyCost({
        start: monday.toISOString(),
        end: sunday.toISOString(),
      })
    );
  }, [selectedDate]);
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="container py-4 weekly-view">
      <div className="row">
        <DynamicMenu />
        <div className="col-md-9 mx-auto">
          {/* Header Section */}
          <div className="d-sm-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-semibold mb-sm-0">
              Pagamenti settimanali driver
            </h4>

            {/* Calendar dropdown toggle */}
            <div className="position-relative">
              <div
                className="cal-input d-flex align-items-center gap-2"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              >
                <img
                  src="static/img/icons/calender.svg"
                  alt="Calendar"
                  className="cal-icon"
                />
                <span>{formatDate(selectedDate)}</span>
              </div>

              {isCalendarOpen && (
                <div className="position-absolute bg-white border rounded mt-2 p-2 shadow cal-popup">
                  <Calendar
                  locale="it"
                    onChange={handleDateChange}
                    value={selectedDate}
                    tileClassName={({ date }) => {
                      const { monday, sunday } = getWeekRange(selectedDate);
                      if (date >= monday && date <= sunday) {
                        return "bg-warning text-white"; // Add a yellow background
                      }
                      return "";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Data Display */}
          <div className="form_container">
            {weeklyCost &&
            weeklyCost.filter(
              (category) => category.drivers && category.drivers.length > 0
            ).length > 0 ? (
              weeklyCost
                .filter(
                  (category) => category.drivers && category.drivers.length > 0
                )
                .map((category, catIndex) => (
                  <div key={catIndex} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                      <h6 className="text-uppercase fw-bold mb-0 text-orange">
                        {category?.category || "No Category"}
                      </h6>
                      <span className="fw-bold">{category?.total} €</span>
                    </div>
                    {category.drivers.map((driver, idx) => (
                      <div
                        key={idx}
                        className="d-flex justify-content-between border-bottom py-2"
                      >
                        <span>{driver?.name}</span>
                        <span className="fw-medium">{driver?.total} €</span>
                      </div>
                    ))}
                  </div>
                ))
            ) : (
              <div className="text-center text-muted">
                Nessun dato disponibile Calendar
              </div>
            )}

            {/* {weeklyCost &&
              weeklyCost?.map((category, catIndex) => (
                <div key={catIndex} className="mb-4">
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                    <h6 className="text-uppercase fw-bold mb-0 text-orange">
                      {category?.drivers[0]?.category || "No Category"}
                    </h6>
                    <span className="fw-bold">{category?.total} €</span>
                  </div>

                  {category &&
                    category?.drivers &&
                    category?.drivers.map((driver, idx) => (
                      <div
                        key={idx}
                        className="d-flex justify-content-between border-bottom py-2"
                      >
                        <span>{driver?.name}</span>
                        <span className="fw-medium">{driver?.cost} €</span>
                      </div>
                    ))}
                </div>
              ))} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverWeeklyAmount;
