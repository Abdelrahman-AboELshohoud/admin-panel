import * as React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import Selects from "../../components/common/form-elements/Selects";
import Switch from "../../components/common/form-elements/Switch";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Plus, X } from "lucide-react";
import ToolTip from "../../components/common/ToolTip";
import SelectsWithLabel from "../../components/common/form-elements/SelectsWithLabel";
import { useTranslation } from "react-i18next";

export default function OrderDistributionSettings() {
  const { t } = useTranslation();

  const [circles, setCircles] = React.useState([
    { radius: 3000, repeats: 1 },
    { radius: 5000, repeats: 1 },
    { radius: 7000, repeats: 1 },
    { radius: 10000, repeats: 1 },
  ]);

  const addCircle = () => {
    if (circles.length < 5) {
      setCircles([...circles, { radius: 3000, repeats: 1 }]);
    }
  };

  const removeCircle = (index: number) => {
    setCircles(circles.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col gap-6 bg-transparent p-4 text-white">
      <div className=" mx-auto space-y-6 ">
        <div className="flex items-center justify-between text-white">
          <h1 className="text-2xl font-semibold">
            {t("ordersSettings.title")}
          </h1>
        </div>

        <Tabs defaultValue="taxi" className="w-full">
          <TabsList className="bg-transparent ">
            <TabsTrigger value="taxi" className="custom-tabs">
              {t("ordersSettings.tabs.taxiDriver")}
            </TabsTrigger>
            <TabsTrigger value="driver" className="custom-tabs">
              {t("ordersSettings.tabs.driver")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="bg-[#2C2C2E] border-[#3A3A3C]">
          <CardContent className="p-6 space-y-6 text-gray-100">
            <div className="space-y-4">
              <h2 className="text-lg font-medium">
                {t("ordersSettings.distribution.title")}
              </h2>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label>{t("ordersSettings.rules.first")}</label>
                  <ToolTip text={t("ordersSettings.rules.firstTooltip")} />
                </div>
                <Selects
                  value="distance"
                  placeholder={t("ordersSettings.selects.distance")}
                  options={[
                    t("ordersSettings.selects.distance"),
                    t("ordersSettings.selects.district"),
                  ]}
                />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-[1fr,2fr,2fr] gap-4 items-center">
                  <div>{t("ordersSettings.circles")}</div>
                  <div>{t("ordersSettings.searchRadius")}</div>
                  <div>{t("ordersSettings.repeatCount")}</div>
                </div>

                {circles.map((circle, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr,2fr,2fr] gap-4 items-center"
                  >
                    <div>
                      {t("ordersSettings.circle", { index: index + 1 })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={circle.radius}
                        className="bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>{t("ordersSettings.meters")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={circle.repeats}
                        className="bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      {index > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCircle(index)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="py-2 px-6 bg-[#3A3A3C] border-[#48484A] text-white hover:bg-[#48484A]"
                  onClick={addCircle}
                  disabled={circles.length >= 5}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("ordersSettings.addCircle")}
                </Button>
              </div>

              <div className="space-y-4">
                <SelectsWithLabel
                  label={t("ordersSettings.ordersSettingstatus")}
                  value="order"
                  placeholder={t("ordersSettings.toSingleExecutor")}
                  options={[
                    t("ordersSettings.newOrder"),
                    t("ordersSettings.freeOrder"),
                  ]}
                />

                <div className="flex items-center justify-between">
                  <label>{t("ordersSettings.delayBetweenAttempts")}</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value="1"
                      className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                    />
                    <span>{t("ordersSettings.seconds")}</span>
                  </div>
                </div>

                <SelectsWithLabel
                  label={t("ordersSettings.offerordersSettingsimultaneously")}
                  value="single"
                  placeholder={t("ordersSettings.toSingleExecutor")}
                  options={[
                    t("ordersSettings.toSingleExecutor"),
                    t("ordersSettings.toMultipleExecutors"),
                  ]}
                />

                <div className="flex items-center justify-between">
                  <label>{t("ordersSettings.rules.second")}</label>
                  <div className="flex items-center gap-2 w-1/2">
                    <Switch disabled={false} checked={true} />
                    <label className="text-xs text-gray-400">
                      {t("ordersSettings.rules.secondTooltip")}
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <SelectsWithLabel
                    label={t("ordersSettings.rules.third")}
                    value="distance"
                    placeholder={t("ordersSettings.selects.distance")}
                    options={[
                      t("ordersSettings.selects.distance"),
                      t("ordersSettings.selects.time"),
                    ]}
                  />
                  <SelectsWithLabel
                    label={t("ordersSettings.rules.forth")}
                    value="no"
                    placeholder={t("ordersSettings.selects.no")}
                    options={[
                      t("ordersSettings.selects.no"),
                      t("ordersSettings.selects.businessSoberDriver"),
                    ]}
                  />

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 justify-between">
                      <SelectsWithLabel
                        label={t("ordersSettings.ifOrderClassMatches")}
                        value="businessplus"
                        placeholder={t("ordersSettings.selects.businessPlus")}
                        options={[
                          t("ordersSettings.selects.businessPlus"),
                          t("ordersSettings.selects.premium"),
                        ]}
                      />
                      <div className="flex items-center gap-10">
                        <span>
                          {t("ordersSettings.andOrderCostGreaterThan")}
                        </span>
                        <Input
                          type="number"
                          value="1000"
                          className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <SelectsWithLabel
                  label={t("ordersSettings.distanceCalculationToExecutor")}
                  value="roads"
                  placeholder={t("ordersSettings.byRoads")}
                  options={[
                    t("ordersSettings.byRoads"),
                    t("ordersSettings.straightLine"),
                  ]}
                />
              </div>

              <div className="space-y-6 pt-6 border-t border-[#3A3A3C]">
                <h2 className="text-lg font-medium">
                  {t("ordersSettings.executorDisplayOnMap")}
                </h2>
                <SelectsWithLabel
                  label={t("ordersSettings.showOnMapAs")}
                  value="executor"
                  placeholder={t("ordersSettings.executor")}
                  options={[
                    t("ordersSettings.executor"),
                    t("ordersSettings.vehicle"),
                  ]}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    {t("ordersSettings.ordersSettings")}
                  </h3>

                  <SelectsWithLabel
                    label={t("ordersSettings.sendPushNotification")}
                    value="no"
                    placeholder={t("ordersSettings.no")}
                    options={[t("ordersSettings.no"), t("ordersSettings.yes")]}
                  />

                  <div className="flex items-center justify-between">
                    <label>
                      {t("ordersSettings.freeordersSettingsVisibilityRadius")}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="50000"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>{t("ordersSettings.meters")}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>{t("ordersSettings.standardSearchTime")}</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="600"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>{t("ordersSettings.seconds")}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>{t("ordersSettings.orderOfferTime")}</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="12"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>{t("ordersSettings.seconds")}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>
                      {t("ordersSettings.autoCompleteordersSettingstatusAfter")}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="60"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>{t("ordersSettings.minutes")}</span>
                    </div>
                    <Selects
                      value="completed"
                      placeholder={t("ordersSettings.completed")}
                      options={[
                        t("ordersSettings.completed"),
                        t("ordersSettings.notFound"),
                      ]}
                    />
                  </div>

                  <div className="space-y-4">
                    <SelectsWithLabel
                      label={t("ordersSettings.executorBlockingType")}
                      value="consecutive"
                      placeholder={t("ordersSettings.consecutive")}
                      options={[
                        t("ordersSettings.consecutive"),
                        t("ordersSettings.perShift"),
                      ]}
                    />

                    <div className="flex items-center justify-between">
                      <label>
                        {t("ordersSettings.numberOfRejectedOffers")}
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value="5"
                          className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                        />
                        <span>{t("ordersSettings.pcs")}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label>{t("ordersSettings.blockingDuration")}</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value="60"
                          className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                        />
                        <span>{t("ordersSettings.minutes")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <SelectsWithLabel
                      value="Automatically"
                      placeholder={t("ordersSettings.automatically")}
                      options={[
                        t("ordersSettings.automatically"),
                        t("ordersSettings.manuallyByDriver"),
                      ]}
                      label={t("ordersSettings.timeCalculationUntilSubmission")}
                    />

                    <div className="flex items-center gap-2 ml-auto">
                      <Switch disabled={false} checked={true} />
                      <label className="text-xs text-gray-400 ">
                        {t("ordersSettings.adjustSubmissionTime")}
                      </label>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-[1fr,2fr,2fr,1fr] gap-4 items-center">
                        <div>{t("ordersSettings.interval")}</div>
                        <div>{t("ordersSettings.start")}</div>
                        <div>{t("ordersSettings.end")}</div>
                        <div>{t("ordersSettings.percentage")}</div>
                      </div>

                      {[
                        { start: "07:00", end: "07:00", percent: 20 },
                        { start: "16:00", end: "17:00", percent: 50 },
                        { start: "17:00", end: "20:00", percent: 40 },
                        { start: "10:00", end: "16:00", percent: 30 },
                        { start: "20:00", end: "07:00", percent: 10 },
                      ].map((interval, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-[1fr,2fr,2fr,1fr] gap-4 items-center"
                        >
                          <div>
                            {t("ordersSettings.interval", { index: index + 1 })}
                          </div>
                          <Input
                            type="time"
                            value={interval.start}
                            className="bg-[#3A3A3C] border-[#48484A] text-white"
                          />
                          <Input
                            type="time"
                            value={interval.end}
                            className="bg-[#3A3A3C] border-[#48484A] text-white"
                          />
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={interval.percent}
                              className="bg-[#3A3A3C] border-[#48484A] text-white"
                            />
                            {index > 0 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  /* Remove interval */
                                }}
                                className="text-red-500 hover:text-red-400"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <Switch disabled={false} checked={true} />
                      <label className="text-xs text-gray-400">
                        {t("ordersSettings.useordersSettingsumHolding")}
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <label>{t("ordersSettings.currentOrderAmount")}</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value="1"
                          className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                        />
                        <span>₽</span>
                      </div>
                    </div>

                    <SelectsWithLabel
                      label={t("ordersSettings.assignOfflineExecutors")}
                      value="no"
                      placeholder={t("ordersSettings.no")}
                      options={[
                        t("ordersSettings.no"),
                        t("ordersSettings.yes"),
                      ]}
                    />

                    <SelectsWithLabel
                      label={t("ordersSettings.maximumNumberOfClientsDebts")}
                      value="3"
                      placeholder="3"
                      options={["3", "5", "10"]}
                    />

                    <SelectsWithLabel
                      label={t("ordersSettings.showInOrderCard")}
                      value="order_number"
                      placeholder={t("ordersSettings.orderNumber")}
                      options={[
                        t("ordersSettings.ordersSettingserialNumber"),
                        t("ordersSettings.alphanumericOrderCode"),
                        t("ordersSettings.orderNumberFromExternalSystem"),
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Add new sections */}
              <div className=" pt-6 space-y-6 border-t border-[#3A3A3C]">
                <h2 className="text-lg font-medium">
                  {t("ordersSettings.orderForm")}
                </h2>

                <div className="flex flex-col gap-6">
                  <SelectsWithLabel
                    label={t("ordersSettings.addPhoneField")}
                    value="no"
                    placeholder={t("ordersSettings.no")}
                    options={[t("ordersSettings.no"), t("ordersSettings.yes")]}
                  />

                  <SelectsWithLabel
                    label={t("ordersSettings.addCommentField")}
                    value="no"
                    placeholder={t("ordersSettings.no")}
                    options={[t("ordersSettings.no"), t("ordersSettings.yes")]}
                  />
                  <SelectsWithLabel
                    label={t("ordersSettings.dispatcherComment")}
                    value="no"
                    placeholder={t("ordersSettings.no")}
                    options={[t("ordersSettings.no"), t("ordersSettings.yes")]}
                  />

                  <SelectsWithLabel
                    label={t("ordersSettings.driverPayment")}
                    value="no"
                    placeholder={t("ordersSettings.no")}
                    options={[t("ordersSettings.no"), t("ordersSettings.yes")]}
                  />

                  <SelectsWithLabel
                    label={t("ordersSettings.displayTerminalPaymentType")}
                    value="no"
                    placeholder={t("ordersSettings.no")}
                    options={[t("ordersSettings.no"), t("ordersSettings.yes")]}
                  />

                  <div className="flex items-center gap-2 ml-auto">
                    <Switch disabled={false} checked={true} />
                    <label className="text-xs text-gray-400">
                      {t("ordersSettings.showChatBetweenClientAndDriver")}
                    </label>
                  </div>
                </div>
              </div>

              <div className=" pt-6 border-t border-[#3A3A3C]">
                <h2 className="text-lg font-medium">
                  {t("ordersSettings.preliminaryordersSettings")}
                </h2>

                <div className="flex flex-col gap-6">
                  <SelectsWithLabel
                    label={t(
                      "ordersSettings.sendPushNotificationPreliminaryOrder"
                    )}
                    value="yes"
                    placeholder={t("ordersSettings.yes")}
                    options={[t("ordersSettings.yes"), t("ordersSettings.no")]}
                  />

                  <div className="flex items-center justify-between">
                    <label>
                      {t("ordersSettings.considerOrderPreliminary")}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>{t("ordersSettings.minutes")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch disabled={false} checked={true} />
                    <label className="text-xs text-gray-400">
                      {t("ordersSettings.limitVisibilityTime")}
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>
                      {t("ordersSettings.automaticallyEntersDistributionAfter")}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>{t("ordersSettings.minutes")}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>{t("ordersSettings.notifyExecutorAfter")}</label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value="20"
                          className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                        />
                        <span>{t("ordersSettings.minutes")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value="20"
                          className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                        />
                        <span>{t("ordersSettings.minutes")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value="20"
                          className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                        />
                        <span>{t("ordersSettings.minutes")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>
                      {t(
                        "ordersSettings.preliminaryOrderRejectionWithoutBlocking"
                      )}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>{t("ordersSettings.minutes")}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>
                      {t(
                        "ordersSettings.blockExecutorForPreliminaryordersSettings"
                      )}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>{t("ordersSettings.minutes")}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>
                      {t(
                        "ordersSettings.allowExecutorToStartPreliminaryOrderAfter"
                      )}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>{t("ordersSettings.minutes")}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>
                      {t(
                        "ordersSettings.doNotAllowTakingNewordersSettingsForXMinutesBefore"
                      )}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>{t("ordersSettings.minutes")}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-[#3A3A3C]">
                <h2 className="text-lg font-medium">
                  {t("ordersSettings.orderExchange")}
                </h2>

                <SelectsWithLabel
                  label={t("ordersSettings.transferOrderToAnotherSystem")}
                  placeholder={t("ordersSettings.manually")}
                  options={[
                    t("ordersSettings.manually"),
                    t("ordersSettings.automatic"),
                  ]}
                  value="manual"
                />
              </div>

              <div className="space-y-6 pt-6 border-t border-[#3A3A3C]">
                <h2 className="text-lg font-medium">
                  {t("ordersSettings.notifications")}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label>
                      {t(
                        "ordersSettings.numberOfCallAttemptsIfClientDoesNotAnswer"
                      )}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>{t("ordersSettings.pcs")}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>
                      {t(
                        "ordersSettings.timeAfterWhichClientIsConsideredToHaveListened"
                      )}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>{t("ordersSettings.seconds")}</span>
                    </div>
                  </div>

                  <SelectsWithLabel
                    label={t("ordersSettings.sendOrderReportToClientVia")}
                    placeholder={t("ordersSettings.email")}
                    options={[
                      t("ordersSettings.email"),
                      t("ordersSettings.sms"),
                    ]}
                    value="email"
                  />
                </div>
              </div>

              {/* Add Reviews section */}
              <div className="space-y-6 pt-6 border-t border-[#3A3A3C]">
                <h2 className="text-lg font-medium">
                  {t("ordersSettings.reviews")}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label>
                      {t("ordersSettings.minimumClientRatingToCreateOrder")}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span className="text-transparent select-none">
                        {t("ordersSettings.pcs")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>{t("ordersSettings.add5StarRatingToClient")}</label>
                    <div className="flex items-center gap-2 ">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>{t("ordersSettings.pcs")}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>
                      {t(
                        "ordersSettings.numberOfRecentClientReviewsConsideredInRating"
                      )}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span className="text-transparent select-none">
                        {t("ordersSettings.pcs")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-[#3A3A3C]">
                <h2 className="text-lg">
                  {t("ordersSettings.clientPersonalAccountModule")}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Switch disabled={false} checked={true} />
                    <label className="text-xs text-gray-400">
                      {t("ordersSettings.allowClientToSuggestTheirPrice")}
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch disabled={false} checked={true} />
                    <label className="text-xs text-gray-400">
                      {t("ordersSettings.showExecutorsPhoneNumberToClient")}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <button className=" ml-auto py-2 px-6 bg-primary hover:bg-primary/80 text-black hover:text-gray-100 rounded-md transition">
        {t("ordersSettings.save")}
      </button>
      <pre style={{ display: "none" }}>{JSON.stringify({}, null, 2)}</pre>
    </div>
  );
}
