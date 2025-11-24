import { useEffect } from "react";
import DynamicMenu from "../../components/dynamic-menu";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import { decryptData } from "../../utilities/utils";
import SuperAdminMenu from "../../components/superadmin-menu";
import {
  SelectBuisnessInfo,
  selectIsLoading,
} from "../../redux/reducers/superAdminSlice";
import { GetBuisnessInfo } from "../../redux/thunks/superAdmin";
import Loader from "../../components/Loader";

const AdminBi = () => {
  const user = decryptData("nccUser");
  const dispatch = useAppDispatch();
  const buisnessInfo = useAppSelector(SelectBuisnessInfo);
  const isSuperAdminLoading = useAppSelector(selectIsLoading);
  useEffect(() => {
    dispatch(GetBuisnessInfo());
  }, []);
  if (isSuperAdminLoading) {
    return <Loader />;
  }
  return (
    <div className="container">
      <div className="row justify-content-center">
        {user?.superAdmin === false ? (
          <DynamicMenu />
        ) : user?.superAdmin ? (
          <SuperAdminMenu />
        ) : null}
        <div className="col-12 col-md-9">
          <div className="mb-4">
            <h3 className="mb-2">Business Intelligence</h3>
            {/* <p className="text-muted">
              {user?.userType === "capoflotta" 
                ? "Visualizzazione dati per: Cooperative (Capoflotta)"
                : user?.userType === "ditta_individuale"
                ? "Visualizzazione dati per: Ditta Individuale"
                : "Visualizzazione dati per: Admin"}
            </p> */}
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="business_intellicence_card">
                <div className="bi_title">
                  <span>Guadagno totale</span>
                </div>
                <div className="group_bi_icon">
                  <div className="bi_icon">
                    <img src="static/img/icons/guadagno-totale.svg" />
                  </div>
                  <div className="value_bi">
                    {buisnessInfo && buisnessInfo.totalProfit
                      ? buisnessInfo.totalProfit.toFixed(2)
                      : 0}{" "}
                    €
                  </div>
                </div>
                <div className="infopoint_bi">Da inizio attività</div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="business_intellicence_card">
                <div className="bi_title">
                  <span>Guadagno per periodo</span>
                </div>
                <div className="group_bi_icon">
                  <div className="bi_icon">
                    <img src="static/img/icons/guadagno-per-periodo.svg" />
                  </div>
                  <div className="value_bi">
                    {buisnessInfo && buisnessInfo.earningsPerPeriod
                      ? buisnessInfo.earningsPerPeriod.toFixed(2)
                      : 0}{" "}
                    €
                  </div>
                </div>
                <div className="infopoint_bi">Ultimi 7 giorni in analisi</div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="business_intellicence_card">
                <div className="bi_title">
                  <span>Media giornaliera</span>
                </div>
                <div className="group_bi_icon">
                  <div className="bi_icon">
                    <img src="static/img/icons/media-giornaliera.svg" />
                  </div>
                  <div className="value_bi">
                    {buisnessInfo && buisnessInfo.dailyAverage
                      ? buisnessInfo.dailyAverage.toFixed(2)
                      : 0}{" "}
                    €
                  </div>
                </div>
                <div className="infopoint_bi">Media fatturato per giorno</div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="business_intellicence_card">
                <div className="bi_title">
                  <span>Corse totali</span>
                </div>
                <div className="group_bi_icon">
                  <div className="bi_icon">
                    <img src="static/img/icons/corse-totali.svg" />
                  </div>
                  <div className="value_bi">
                    {buisnessInfo && buisnessInfo.totalRuns
                      ? buisnessInfo.totalRuns.toFixed(2)
                      : 0}
                  </div>
                </div>
                <div className="infopoint_bi">Da inizio attività</div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="business_intellicence_card">
                <div className="bi_title">
                  <span>Guadagno medio per corsa</span>
                </div>
                <div className="group_bi_icon">
                  <div className="bi_icon">
                    <img src="static/img/icons/guadagno-per-corsa.svg" />
                  </div>
                  <div className="value_bi">
                    {buisnessInfo && buisnessInfo.averageEarningsPerRide
                      ? Number(buisnessInfo.averageEarningsPerRide).toFixed(2)
                      : 0}{" "}
                    €
                  </div>
                </div>
                <div className="infopoint_bi">
                  Calcolato su base giornaliera
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="business_intellicence_card">
                <div className="bi_title">
                  <span>Percorrenza tempo</span>
                </div>
                <div className="group_bi_icon">
                  <div className="bi_icon">
                    <img src="static/img/icons/percorrenza-tempo.svg" />
                  </div>
                  <div className="value_bi">
                    {buisnessInfo && buisnessInfo.timeTravel
                      ? buisnessInfo.timeTravel.toFixed(2)
                      : 0}{" "}
                    ore
                  </div>
                </div>
                <div className="infopoint_bi">Tempo totale di guida</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminBi;
