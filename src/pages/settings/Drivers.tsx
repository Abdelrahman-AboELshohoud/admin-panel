import Switch from "../../components/common/Switch";
import Selects from "../../components/common/Selects";
import { Input } from "../../components/ui/input";
import SelectsWithLabel from "../../components/common/SelectsWithLabel";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useTranslation } from "react-i18next";

export default function DriverSettings() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-transparent text-gray-100 p-4 md:p-8">
      <div className=" mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-6">{t("driversSettings.title")}</h1>

        <Tabs className="flex flex-col gap-4 mb-6" defaultValue="taxi">
          <TabsList className="grid w-[200px] grid-cols-2 bg-transparent">
            <TabsTrigger value="taxi" className="custom-tabs">
              {t("driversSettings.taxiDriver")}
            </TabsTrigger>
            <TabsTrigger value="driver" className="custom-tabs">
              {t("driversSettings.driver")}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="driver"
            className="card-shape flex flex-col gap-4"
          >
            <div className="bg-transparent text-gray-100 flex gap-6 items-center mb-6">
              <label className="text-nowrap font-semibold">
                {t("driversSettings.arrivalTime")}
              </label>
              <div className="flex justify-center gap-2 h-full py-auto items-center">
                {[10, 15, 20, 0, 0, 0].map((value, index) => (
                  <div key={index} className="">
                    <Input
                      type="number"
                      min="0"
                      defaultValue={value}
                      className="w-full custom-input text-white rounded-md px-3 py-2"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label>{t("driversSettings.allowWithoutGPS")}</label>
                <Switch disabled={false} checked={false} />
              </div>
              <SelectsWithLabel
                placeholder="1"
                options={Array.from({ length: 10 }, (_, i) =>
                  (i + 1).toString()
                )}
                value={1}
                label={t("driversSettings.minBalance")}
              />

              <SelectsWithLabel
                placeholder="1"
                options={Array.from({ length: 10 }, (_, i) =>
                  (i + 1).toString()
                )}
                value={1}
                label={t("driversSettings.minRating")}
              />

              <SelectsWithLabel
                placeholder="1"
                options={Array.from({ length: 10 }, (_, i) =>
                  (i + 1).toString()
                )}
                value={60}
                label={t("driversSettings.add5StarRatings")}
              />

              <SelectsWithLabel
                placeholder="1"
                options={Array.from({ length: 10 }, (_, i) =>
                  (i + 1).toString()
                )}
                value={100}
                label={t("driversSettings.recentReviews")}
              />

              <div className="space-y-4">
                {[
                  t("driversSettings.showNotPaidButton"),
                  t("driversSettings.showPaymentViaSBP"),
                  t("driversSettings.showPreliminaryCalculation"),
                  t("driversSettings.allowEditOrderAddresses"),
                  t("driversSettings.allowEditOrderCost"),
                  t("driversSettings.showDestinationToDriver"),
                ].map((label, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <label>{label}</label>
                    <Switch disabled={false} checked={false} />
                  </div>
                ))}
              </div>

              <SelectsWithLabel
                placeholder={t("driversSettings.selectStatus")}
                options={["default", "going", "waiting"]}
                value="default"
                label={t("driversSettings.hideStepsDuringOrder")}
              />

              <div className="flex items-center justify-between">
                <label>{t("driversSettings.showPriceAndAreaFilter")}</label>
                <Switch disabled={false} checked={false} />
              </div>

              <SelectsWithLabel
                placeholder="10%"
                options={Array.from({ length: 10 }, (_, i) =>
                  (i * 10).toString()
                )}
                value="10%"
                label={t("driversSettings.minSoundVolume")}
              />

              <SelectsWithLabel
                placeholder="direct"
                options={["direct", "support"]}
                value="Direct"
                label={t("driversSettings.clientCommunication")}
              />
              <SelectsWithLabel
                placeholder={t("driversSettings.showFullName")}
                options={[
                  t("driversSettings.showFullName"),
                  t("driversSettings.firstNameOnly"),
                  t("driversSettings.dontShow"),
                ]}
                value="Full"
                label={t("driversSettings.showClientNameToDriver")}
              />

              <div className="space-y-4">
                {[
                  t("driversSettings.showUrgentOrderTime"),
                  t("driversSettings.showDispatcherChatBeforeShift"),
                  t("driversSettings.showDispatcherChatDuringShift"),
                  t("driversSettings.showGeneralChatDuringShift"),
                  t("driversSettings.showEventsSection"),
                  t("driversSettings.showOtherCarsOnMap"),
                ].map((label, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <label>{label}</label>
                    <Switch disabled={false} checked={false} />
                  </div>
                ))}
              </div>

              <SelectsWithLabel
                placeholder="2000"
                options={Array.from({ length: 21 }, (_, i) =>
                  (i * 1000).toString()
                )}
                value="2000"
                label={t("driversSettings.withinRadius")}
              />

              <div className="space-y-4">
                {[
                  t("driversSettings.allowTopUpViaBankCard"),
                  t("driversSettings.autoEndShiftIfCoordinatesNotCurrent"),
                  t("driversSettings.autoEndShiftIfOutsideCity"),
                  t("driversSettings.showAvailableOrdersInTabs"),
                  t("driversSettings.prohibitFakeGPS"),
                  t("driversSettings.preventArrivedButtonAdvance"),
                  t("driversSettings.requirePasswordForLogin"),
                  t("driversSettings.showPrivacyPolicy"),
                  t("driversSettings.monitorMileage"),
                  t("driversSettings.allowReserveUrgentOrders"),
                  t("driversSettings.hidePriceAndRoutePoints"),
                  t("driversSettings.speakTextAfterTaximeterStart"),
                  t("driversSettings.speakTextAfterRideCompletion"),
                  t("driversSettings.autoStartTaximeterAfterFreeWait"),
                  t("driversSettings.allowOrderTypeSelection"),
                  t("driversSettings.allowSOSButton"),
                ].map((label, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <label>{label}</label>
                    <Switch disabled={false} checked={false} />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <label>{t("driversSettings.allowCancelOrder")}</label>
                <div className="flex flex-col gap-4">
                  {[
                    t("driversSettings.pickedUpGoingToClient"),
                    t("driversSettings.arrivedWaitingBeforePaid"),
                    t("driversSettings.arrivedWaitingAfterPaid"),
                  ].map((label, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <label>{label}</label>
                      <Switch disabled={false} checked={false} />
                    </div>
                  ))}
                </div>
                <Selects
                  placeholder="15 min."
                  options={Array.from({ length: 61 }, (_, i) => i.toString())}
                  value="15"
                />
              </div>

              <div className="space-y-4">
                {[
                  t("driversSettings.showClientRatingWindow"),
                  t("driversSettings.commissionForPenalties"),
                ].map((label, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <label>{label}</label>
                    <Switch disabled={false} checked={false} />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4">
                <label className="text-lg font-semibold">
                  {t("driversSettings.whatDataToShow")}
                </label>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className=" font-semibold">
                      {t("driversSettings.inOrderList")}
                    </h3>
                    <div className="space-y-4 pl-4">
                      <SelectsWithLabel
                        placeholder={t("driversSettings.showFullName")}
                        options={[
                          t("driversSettings.showFullName"),
                          t("driversSettings.firstNameOnly"),
                          t("driversSettings.dontShow"),
                        ]}
                        value="Full"
                        label={t("driversSettings.showClientNameToDriver")}
                      />

                      <div className="flex items-center justify-between">
                        <label>{t("driversSettings.clientRating")}</label>
                        <Switch disabled={false} checked={false} />
                      </div>
                      <SelectsWithLabel
                        placeholder={t("driversSettings.routePoints")}
                        options={[
                          t("driversSettings.showFullName"),
                          t("driversSettings.firstNameOnly"),
                          t("driversSettings.dontShow"),
                        ]}
                        value="all"
                        label={t("driversSettings.showClientNameToDriver")}
                      />
                      {[
                        t("driversSettings.comments"),
                        t("driversSettings.cost"),
                        t("driversSettings.paymentMethod"),
                        t("driversSettings.timeForUrgentOrders"),
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between"
                        >
                          <label>{item}</label>
                          <Switch disabled={false} checked={false} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* In detailed order card section */}
                  <div className="space-y-4">
                    <h3 className=" font-semibold">
                      {t("driversSettings.inDetailedOrderCard")}
                    </h3>
                    <div className="space-y-4 pl-4">
                      <SelectsWithLabel
                        placeholder={t("driversSettings.showFullName")}
                        options={[
                          t("driversSettings.showFullName"),
                          t("driversSettings.firstNameOnly"),
                          t("driversSettings.dontShow"),
                        ]}
                        value="Full"
                        label={t("driversSettings.showClientNameToDriver")}
                      />
                      <div className="flex items-center justify-between">
                        <label>{t("driversSettings.clientRating")}</label>
                        <Switch disabled={false} checked={false} />
                      </div>
                      <SelectsWithLabel
                        placeholder={t("driversSettings.routePoints")}
                        options={[
                          t("driversSettings.showAllPoints"),
                          t("driversSettings.partialPoints"),
                          t("driversSettings.dontShow"),
                        ]}
                        value="all"
                        label={t("driversSettings.routePoints")}
                      />
                      {[
                        t("driversSettings.comments"),
                        t("driversSettings.cost"),
                        t("driversSettings.paymentMethod"),
                        t("driversSettings.timeUntilUrgentOrders"),
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between"
                        >
                          <label>{item}</label>
                          <Switch disabled={false} checked={false} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">
                      {t("driversSettings.duringOrderExecution")}
                    </h3>
                    <div className="space-y-4 pl-4">
                      <SelectsWithLabel
                        placeholder={t("driversSettings.showFullName")}
                        options={["full", "first", "none"]}
                        value="full"
                        label={t("driversSettings.showClientNameToDriver")}
                      />

                      <div className="flex items-center justify-between">
                        <label>{t("driversSettings.clientRating")}</label>
                        <Switch disabled={false} checked={false} />
                      </div>

                      <SelectsWithLabel
                        placeholder={t("driversSettings.showAllPoints")}
                        options={["all", "partial", "none"]}
                        value="all"
                        label={t("driversSettings.routePoints")}
                      />
                      <div className="flex items-center justify-between">
                        <label>{t("driversSettings.cost")}</label>
                        <Switch disabled={false} checked={false} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button className=" ml-auto py-2 px-4 bg-primary hover:bg-primary/80 text-black hover:text-white rounded-md transition-colors">
              {t("driversSettings.saveChanges")}
            </button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
