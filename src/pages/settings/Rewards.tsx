// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { Button } from "../../components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import { Input } from "../../components/ui/input";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../../components/ui/tabs";
// import { Plus } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../components/ui/table";
// import {
//   CouponListGQL,
//   RewardListGQL,
//   GiftBatchListGQL,
//   CreateCouponGQL,
//   CreateRewardGQL,
//   CreateGiftBachGQL,
//   DeleteCouponGQL,
//   ExportGiftBatchToCsvGQL,
//   CreateCouponMutationVariables,
//   CreateRewardMutationVariables,
//   CreateGiftBachMutationVariables,
//   RewardAppType,
//   RewardBeneficiary,
//   RewardEvent,
// } from "../../graphql/requests";
// import { MyDialog } from "../../components/common/MyDialog";
// import { format } from "date-fns";
// import toast from "react-hot-toast";
// import { Switch } from "../../components/ui/switch";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";
// import GiftBatches from "./GiftBatches";
// import Copouns from "./Copouns";

// interface Coupon {
//   id: string;
//   code: string;
//   title: string;
//   startAt: string;
//   expireAt: string;
//   isEnabled: boolean;
// }

// interface Reward {
//   id: string;
//   title: string;
//   beneficiary: string;
//   event: string;
//   startDate: string;
//   endDate: string;
// }

// interface GiftBatch {
//   id: string;
//   name: string;
//   amount: number;
//   currency: string;
//   totalUsed: {
//     count: {
//       id: number;
//     };
//   };
//   totalUnused: {
//     count: {
//       id: number;
//     };
//   };
// }

// export default function Rewards() {
//   const { t } = useTranslation();
//   const [activeTab, setActiveTab] = useState("coupons");
//   const [coupons, setCoupons] = useState<Coupon[]>([]);
//   const [rewards, setRewards] = useState<Reward[]>([]);
//   const [giftBatches, setGiftBatches] = useState<GiftBatch[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [showCouponDialog, setShowCouponDialog] = useState(false);
//   const [showRewardDialog, setShowRewardDialog] = useState(false);
//   const [showGiftBatchDialog, setShowGiftBatchDialog] = useState(false);

//   // Form states
//   const [couponForm, setCouponForm] = useState<
//     CreateCouponMutationVariables["input"]
//   >({
//     code: "",
//     title: "",
//     startAt: "",
//     expireAt: "",
//     isEnabled: true,
//     description: "",
//     creditGift: 0,
//     discountFlat: 0,
//     discountPercent: 0,
//     isFirstTravelOnly: false,
//     manyTimesUserCanUse: 0,
//     maximumCost: 0,
//     minimumCost: 0,
//     manyUsersCanUse: 0,
//   });

//   const [rewardForm, setRewardForm] = useState<
//     CreateRewardMutationVariables["input"]
//   >({
//     title: "",
//     appType: RewardAppType.Driver,
//     startDate: "",
//     endDate: "",
//     beneficiary: RewardBeneficiary.Self,
//     event: RewardEvent.ServiceCompleted,
//     creditGift: 0,
//     id: "",
//     conditionTripCountsLessThan: 0,
//     conditionUserNumberFirstDigits: [],
//     creditCurrency: "USD",
//     tripFeePercentGift: 0,
//   });

//   const [giftBatchForm, setGiftBatchForm] = useState<
//     CreateGiftBachMutationVariables["input"]
//   >({
//     name: "",
//     amount: 0,
//     currency: "USD",
//     quantity: 1,
//     availableFrom: "",
//     expireAt: "",
//   });

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [couponData, rewardData, giftBatchData] = await Promise.all([
//         CouponListGQL({}),
//         RewardListGQL({}),
//         GiftBatchListGQL({}),
//       ]);

//       setCoupons(couponData.data.coupons.nodes);
//       setRewards(rewardData.data.rewards.nodes);
//       setGiftBatches(giftBatchData.data.giftBatches.nodes);
//     } catch (error) {
//       toast.error(t("common.error"));
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleDeleteCoupon = async (id: string) => {
//     try {
//       await DeleteCouponGQL({ id });
//       await fetchData();
//       toast.success(t("common.deleted"));
//     } catch (error) {
//       toast.error(t("common.error"));
//     }
//   };

//   const handleExportGiftBatch = async (id: string) => {
//     try {
//       const response = await ExportGiftBatchToCsvGQL({ giftBatchId: id });
//       // Handle CSV download
//       if (response.statusCode === 200) {
//         const blob = new Blob([response.data.exportGiftBatchToCsv], {
//           type: "text/csv",
//         });
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = `gift-batch-${id}.csv`;
//         a.click();
//         return;
//       }
//       toast.error(t("common.permissionNotGranted"));
//     } catch (error) {
//       toast.error(t("common.permissionNotGranted"));
//     }
//   };

//   const handleCreateCoupon = async () => {
//     try {
//       await CreateCouponGQL({
//         input: {
//           ...couponForm,
//           creditGift: Number(couponForm.creditGift),
//           discountFlat: Number(couponForm.discountFlat),
//           discountPercent: Number(couponForm.discountPercent),
//           manyTimesUserCanUse: Number(couponForm.manyTimesUserCanUse),
//           maximumCost: Number(couponForm.maximumCost),
//           minimumCost: Number(couponForm.minimumCost),
//           manyUsersCanUse: Number(couponForm.manyUsersCanUse),
//         },
//       });
//       await fetchData();
//       setShowCouponDialog(false);
//       setCouponForm({
//         code: "",
//         title: "",
//         startAt: "",
//         expireAt: "",
//         isEnabled: true,
//         description: "",
//         creditGift: 0,
//         discountFlat: 0,
//         discountPercent: 0,
//         isFirstTravelOnly: false,
//         manyTimesUserCanUse: 0,
//         maximumCost: 0,
//         minimumCost: 0,
//         manyUsersCanUse: 0,
//       });
//       toast.success(t("common.created"));
//     } catch (error) {
//       toast.error(t("common.error"));
//     }
//   };

//   const handleCreateReward = async () => {
//     try {
//       await CreateRewardGQL({
//         input: {
//           ...rewardForm,
//           creditGift: Number(rewardForm.creditGift),
//           tripFeePercentGift: Number(rewardForm.tripFeePercentGift),
//           conditionTripCountsLessThan: Number(
//             rewardForm.conditionTripCountsLessThan
//           ),
//         },
//       });
//       await fetchData();
//       setShowRewardDialog(false);
//       setRewardForm({
//         title: "",
//         appType: RewardAppType.Driver,
//         startDate: "",
//         endDate: "",
//         beneficiary: RewardBeneficiary.Self,
//         event: RewardEvent.ServiceCompleted,
//         creditGift: 0,
//         id: "",
//         conditionTripCountsLessThan: 0,
//         conditionUserNumberFirstDigits: [],
//         creditCurrency: "USD",
//         tripFeePercentGift: 0,
//       });
//       toast.success(t("common.created"));
//     } catch (error) {
//       toast.error(t("common.error"));
//     }
//   };

//   const handleCreateGiftBatch = async () => {
//     try {
//       await CreateGiftBachGQL({
//         input: {
//           ...giftBatchForm,
//           amount: Number(giftBatchForm.amount),
//           quantity: Number(giftBatchForm.quantity),
//         },
//       });
//       await fetchData();
//       setShowGiftBatchDialog(false);
//       setGiftBatchForm({
//         name: "",
//         amount: 0,
//         currency: "USD",
//         quantity: 1,
//         availableFrom: "",
//         expireAt: "",
//       });
//       toast.success(t("common.created"));
//     } catch (error) {
//       toast.error(t("common.error"));
//     }
//   };
//   return (
//     <div>
//       <div className="card-shape">
//         <Card className="bg-transparent border-transparent shadow-none">
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle className="text-gray-200 text-xl">
//               {t("promotions.rewards")}
//             </CardTitle>
//             <Button onClick={() => setShowRewardDialog(true)}>
//               <Plus className="w-4 h-4 mr-2" />
//               {t("common.create")}
//             </Button>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow className="hover:bg-transparent border-transparent">
//                   <TableHead>{t("promotions.title")}</TableHead>
//                   <TableHead>{t("promotions.beneficiary")}</TableHead>
//                   <TableHead>{t("promotions.event")}</TableHead>
//                   <TableHead>{t("promotions.startDate")}</TableHead>
//                   <TableHead>{t("promotions.endDate")}</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {loading ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={5}
//                       className="text-center text-gray-200 py-14 hover:bg-transparent border-transparent"
//                     >
//                       {t("common.loading")}
//                     </TableCell>
//                   </TableRow>
//                 ) : rewards.length === 0 ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={5}
//                       className="text-center text-gray-200"
//                     >
//                       {t("common.noData")}
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   rewards.map((reward) => (
//                     <TableRow
//                       key={reward.id}
//                       className="hover:bg-[#262626] border-transparent text-gray-200"
//                     >
//                       <TableCell>{reward.title}</TableCell>
//                       <TableCell>{reward.beneficiary}</TableCell>
//                       <TableCell>{reward.event}</TableCell>
//                       <TableCell>
//                         {format(new Date(reward.startDate), "PP")}
//                       </TableCell>
//                       <TableCell>
//                         {format(new Date(reward.endDate), "PP")}
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//       <MyDialog
//         isOpen={showRewardDialog}
//         onOpenChange={setShowRewardDialog}
//         title={t("promotions.createReward")}
//         showCloseButton={false}
//       >
//         <div className="space-y-4">
//           <Input
//             placeholder={t("promotions.title")}
//             value={rewardForm.title}
//             onChange={(e) =>
//               setRewardForm({ ...rewardForm, title: e.target.value })
//             }
//           />
//           <Select
//             value={rewardForm.appType}
//             onValueChange={(value) =>
//               setRewardForm({ ...rewardForm, appType: value as RewardAppType })
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder={t("promotions.appType")} />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value={RewardAppType.Driver}>
//                 {t("promotions.driver")}
//               </SelectItem>
//               <SelectItem value={RewardAppType.Rider}>
//                 {t("promotions.rider")}
//               </SelectItem>
//             </SelectContent>
//           </Select>
//           <Select
//             value={rewardForm.beneficiary}
//             onValueChange={(value) =>
//               setRewardForm({
//                 ...rewardForm,
//                 beneficiary: value as RewardBeneficiary,
//               })
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder={t("promotions.beneficiary")} />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value={RewardBeneficiary.Self}>
//                 {t("promotions.self")}
//               </SelectItem>
//               <SelectItem value={RewardBeneficiary.Referrer}>
//                 {t("promotions.referrer")}
//               </SelectItem>
//             </SelectContent>
//           </Select>
//           <Select
//             value={rewardForm.event}
//             onValueChange={(value) =>
//               setRewardForm({ ...rewardForm, event: value as RewardEvent })
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder={t("promotions.event")} />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value={RewardEvent.ServiceCompleted}>
//                 {t("promotions.serviceCompleted")}
//               </SelectItem>
//               <SelectItem value={RewardEvent.Register}>
//                 {t("promotions.register")}
//               </SelectItem>
//             </SelectContent>
//           </Select>
//           <Input
//             type="number"
//             placeholder={t("promotions.creditGift")}
//             value={rewardForm.creditGift}
//             onChange={(e) =>
//               setRewardForm({
//                 ...rewardForm,
//                 creditGift: Number(e.target.value),
//               })
//             }
//           />
//           <Input
//             placeholder={t("promotions.creditCurrency")}
//             value={rewardForm.creditCurrency}
//             onChange={(e) =>
//               setRewardForm({ ...rewardForm, creditCurrency: e.target.value })
//             }
//           />
//           <Input
//             type="number"
//             placeholder={t("promotions.tripFeePercentGift")}
//             value={rewardForm.tripFeePercentGift}
//             onChange={(e) =>
//               setRewardForm({
//                 ...rewardForm,
//                 tripFeePercentGift: Number(e.target.value),
//               })
//             }
//           />
//           <Input
//             type="number"
//             placeholder={t("promotions.conditionTripCountsLessThan")}
//             value={rewardForm.conditionTripCountsLessThan}
//             onChange={(e) =>
//               setRewardForm({
//                 ...rewardForm,
//                 conditionTripCountsLessThan: Number(e.target.value),
//               })
//             }
//           />
//           <Input
//             type="date"
//             placeholder={t("promotions.startDate")}
//             value={rewardForm.startDate}
//             onChange={(e) =>
//               setRewardForm({ ...rewardForm, startDate: e.target.value })
//             }
//           />
//           <Input
//             type="date"
//             placeholder={t("promotions.endDate")}
//             value={rewardForm.endDate}
//             onChange={(e) =>
//               setRewardForm({ ...rewardForm, endDate: e.target.value })
//             }
//           />
//           <div className="flex justify-end space-x-2">
//             <Button
//               variant="outline"
//               onClick={() => setShowRewardDialog(false)}
//             >
//               {t("common.cancel")}
//             </Button>
//             <Button onClick={handleCreateReward}>{t("common.create")}</Button>
//           </div>
//         </div>
//       </MyDialog>
//     </div>
//   );
// }
