import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";

import GiftBatches from "./GiftBatches";
import Copouns from "./Copouns";

export default function Promotions() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("coupons");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("promotions.title")}</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-transparent border-transparent">
          <TabsTrigger value="coupons" className="custom-tabs">
            {t("promotions.coupons")}
          </TabsTrigger>
          {/* <TabsTrigger value="rewards">{t("promotions.rewards")}</TabsTrigger> */}
          <TabsTrigger value="giftCards" className="custom-tabs">
            {t("promotions.giftCards")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="coupons">
          <Copouns />
        </TabsContent>

        {/* <TabsContent value="rewards">
          <Rewards />
        </TabsContent> */}

        <TabsContent value="giftCards">
          <GiftBatches />
        </TabsContent>
      </Tabs>
      {/* 
      <MyDialog
        isOpen={showRewardDialog}
        onOpenChange={setShowRewardDialog}
        title={t("promotions.createReward")}
        showCloseButton={false}
      >
        <div className="space-y-4">
          <Input
            placeholder={t("promotions.title")}
            value={rewardForm.title}
            onChange={(e) =>
              setRewardForm({ ...rewardForm, title: e.target.value })
            }
          />
          <Select
            value={rewardForm.appType}
            onValueChange={(value) =>
              setRewardForm({ ...rewardForm, appType: value as RewardAppType })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t("promotions.appType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={RewardAppType.Driver}>
                {t("promotions.driver")}
              </SelectItem>
              <SelectItem value={RewardAppType.Rider}>
                {t("promotions.rider")}
              </SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={rewardForm.beneficiary}
            onValueChange={(value) =>
              setRewardForm({
                ...rewardForm,
                beneficiary: value as RewardBeneficiary,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t("promotions.beneficiary")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={RewardBeneficiary.Self}>
                {t("promotions.self")}
              </SelectItem>
              <SelectItem value={RewardBeneficiary.Referrer}>
                {t("promotions.referrer")}
              </SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={rewardForm.event}
            onValueChange={(value) =>
              setRewardForm({ ...rewardForm, event: value as RewardEvent })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t("promotions.event")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={RewardEvent.ServiceCompleted}>
                {t("promotions.serviceCompleted")}
              </SelectItem>
              <SelectItem value={RewardEvent.Referral}>
                {t("promotions.referral")}
              </SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder={t("promotions.creditGift")}
            value={rewardForm.creditGift}
            onChange={(e) =>
              setRewardForm({
                ...rewardForm,
                creditGift: Number(e.target.value),
              })
            }
          />
          <Input
            placeholder={t("promotions.creditCurrency")}
            value={rewardForm.creditCurrency}
            onChange={(e) =>
              setRewardForm({ ...rewardForm, creditCurrency: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder={t("promotions.tripFeePercentGift")}
            value={rewardForm.tripFeePercentGift}
            onChange={(e) =>
              setRewardForm({
                ...rewardForm,
                tripFeePercentGift: Number(e.target.value),
              })
            }
          />
          <Input
            type="number"
            placeholder={t("promotions.conditionTripCountsLessThan")}
            value={rewardForm.conditionTripCountsLessThan}
            onChange={(e) =>
              setRewardForm({
                ...rewardForm,
                conditionTripCountsLessThan: Number(e.target.value),
              })
            }
          />
          <Input
            type="date"
            placeholder={t("promotions.startDate")}
            value={rewardForm.startDate}
            onChange={(e) =>
              setRewardForm({ ...rewardForm, startDate: e.target.value })
            }
          />
          <Input
            type="date"
            placeholder={t("promotions.endDate")}
            value={rewardForm.endDate}
            onChange={(e) =>
              setRewardForm({ ...rewardForm, endDate: e.target.value })
            }
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowRewardDialog(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button onClick={handleCreateReward}>{t("common.create")}</Button>
          </div>
        </div>
      </MyDialog> */}
    </div>
  );
}
