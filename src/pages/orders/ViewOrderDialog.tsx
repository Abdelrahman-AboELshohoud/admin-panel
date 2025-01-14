// import { useTranslation } from "react-i18next";
// import { MyDialog } from "../../components/common/MyDialog";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../../components/ui/tabs";
// import { format } from "date-fns";
// import { Order} from "../../graphql/requests";
// import { Input } from "../../components/ui/input";
// import { Button } from "../../components/ui/button";
// import { Send } from "lucide-react";
// import { useState } from "react";

// interface ViewOrderDialogProps {
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
//   order: Order | null;
// }

// export default function ViewOrderDialog({
//   isOpen,
//   onOpenChange,
//   order,
// }: ViewOrderDialogProps) {
//   const { t } = useTranslation();
//   const [message, setMessage] = useState("");

//   if (!order) return null;

//     const renderEventContent = (event: OrderEvent) => {
//     const time = format(new Date(event.createdAt), "HH:mm:ss");
//     const date = format(new Date(event.createdAt), "dd.MM.yyyy");

//     let description = "";
//     let actor = event.actor
//       ? `${event.actor.firstName} ${event.actor.lastName}`
//       : "";

//     switch (event.event) {
//       case "ORDER_CREATED":
//         description = t("orders.events.created");
//         break;
//       case "DRIVER_ASSIGNED":
//         description = t("orders.events.driverAssigned", { driver: actor });
//         break;
//       case "STATUS_UPDATED":
//         description = t("orders.events.statusUpdated", {
//           status: event.newStatus,
//         });
//         break;
//       case "EDITED":
//         description = t("orders.events.edited", { editor: actor });
//         break;
//       default:
//         description = event.event;
//     }

//     return (
//       <div
//         key={event.id}
//         className="flex items-start gap-4 py-2 border-b border-gray-100 last:border-0"
//       >
//         <div className="min-w-[140px] text-sm text-gray-500">
//           <div>{time}</div>
//           <div>{date}</div>
//         </div>
//         <div className="flex-1">
//           <p className="text-sm">{description}</p>
//           {event.note && (
//             <p className="text-sm text-gray-500 mt-1">{event.note}</p>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderChatMessage = (message: any) => {
//     const time = format(new Date(message.createdAt), "HH:mm:ss");
//     const date = format(new Date(message.createdAt), "dd.MM.yyyy");
//     const isOperator = message.sentByOperator;

//     return (
//       <div
//         key={message.id}
//         className={`flex gap-4 ${isOperator ? "flex-row" : "flex-row-reverse"}`}
//       >
//         <div className="flex flex-col gap-1 max-w-[70%]">
//           <div
//             className={`rounded-lg p-3 ${
//               isOperator
//                 ? "bg-gray-100 text-gray-900"
//                 : "bg-blue-500 text-white"
//             }`}
//           >
//             <p className="text-sm">{message.content}</p>
//           </div>
//           <div
//             className={`text-xs text-gray-500 ${
//               isOperator ? "text-left" : "text-right"
//             }`}
//           >
//             {time} - {date}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const handleSendMessage = async () => {
//     if (!message.trim()) return;

//     try {
//       // Add your send message mutation here
//       // await SendMessageGQL({ orderId: order.id, content: message });
//       setMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//       toast.error(t("orders.chat.sendError"));
//     }
//   };

//   return (
//     <MyDialog
//       title={`${t("orders.view.title")} #${order.id}`}
//       isOpen={isOpen}
//       onOpenChange={onOpenChange}
//       className="max-w-4xl"
//     >
//       <Tabs defaultValue="order" className="w-full">
//         <TabsList className="mb-4">
//           <TabsTrigger value="order">{t("orders.view.tabs.order")}</TabsTrigger>
//           <TabsTrigger value="events">
//             {t("orders.view.tabs.events")}
//           </TabsTrigger>
//           <TabsTrigger value="route">{t("orders.view.tabs.route")}</TabsTrigger>
//           <TabsTrigger value="chat">{t("orders.view.tabs.chat")}</TabsTrigger>
//           <TabsTrigger value="photos">
//             {t("orders.view.tabs.photos")}
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="order" className="space-y-6">
//           <div className="grid grid-cols-2 gap-4">
//             {/* Client Info */}
//             <div className="space-y-2">
//               <h3 className="font-semibold">{t("orders.view.client")}</h3>
//               <div className="flex items-center gap-2">
//                 <div className="w-10 h-10 bg-gray-200 rounded-full" />
//                 <div>
//                   <p className="font-medium">
//                     {order.rider?.firstName} {order.rider?.lastName}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {order.rider?.mobileNumber}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Executor Info */}
//             <div className="space-y-2">
//               <h3 className="font-semibold">{t("orders.view.executor")}</h3>
//               <div className="flex items-center gap-2">
//                 <div className="w-10 h-10 bg-gray-200 rounded-full" />
//                 <div>
//                   <p className="font-medium">
//                     {order.driver?.firstName} {order.driver?.lastName}
//                   </p>
//                   <div className="flex items-center gap-2">
//                     <p className="text-sm text-gray-500">
//                       {order.driver?.mobileNumber}
//                     </p>
//                     <span className="text-sm bg-gray-100 px-2 py-0.5 rounded">
//                       {order.driver?.status}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Order Details */}
//             <div className="col-span-2 space-y-4">
//               <h3 className="font-semibold">{t("orders.view.details")}</h3>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-500">
//                     {t("orders.view.fields.createdAt")}
//                   </p>
//                   <p>{format(new Date(order.createdOn), "PPp")}</p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-500">
//                     {t("orders.view.fields.startTime")}
//                   </p>
//                   <p>
//                     {order.startTimestamp
//                       ? format(new Date(order.startTimestamp), "PPp")
//                       : "-"}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-500">
//                     {t("orders.view.fields.finishTime")}
//                   </p>
//                   <p>
//                     {order.finishTimestamp
//                       ? format(new Date(order.finishTimestamp), "PPp")
//                       : "-"}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-500">
//                     {t("orders.view.fields.cost")}
//                   </p>
//                   <p>
//                     {order.costBest} {order.currency}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-500">
//                     {t("orders.view.fields.finalCost")}
//                   </p>
//                   <p>
//                     {order.costAfterCoupon} {order.currency}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-500">
//                     {t("orders.view.fields.status")}
//                   </p>
//                   <p>{order.status}</p>
//                 </div>
//               </div>

//               {/* Addresses */}
//               <div className="space-y-2">
//                 <h4 className="font-medium">{t("orders.view.addresses")}</h4>
//                 <div className="space-y-2">
//                   {order.addresses.map((address, index) => (
//                     <div
//                       key={index}
//                       className="flex items-start gap-2 bg-gray-50 p-2 rounded"
//                     >
//                       <span className="text-sm bg-gray-200 px-2 py-0.5 rounded">
//                         {index + 1}
//                       </span>
//                       <p>{address}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="events">
//           <div className="space-y-1 max-h-[400px] overflow-y-auto">
//             {order.events && order.events.length > 0 ? (
//               order.events
//                 .sort(
//                   (a, b) =>
//                     new Date(b.createdAt).getTime() -
//                     new Date(a.createdAt).getTime()
//                 )
//                 .map(renderEventContent)
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 {t("orders.events.noEvents")}
//               </div>
//             )}
//           </div>
//         </TabsContent>

//         <TabsContent value="route">{/* Route tab content */}</TabsContent>

//         <TabsContent value="chat">
//           <div className="flex flex-col h-[500px]">
//             <div className="flex-1 overflow-y-auto space-y-4 p-4">
//               {order.messages && order.messages.length > 0 ? (
//                 order.messages
//                   .sort(
//                     (a, b) =>
//                       new Date(a.createdAt).getTime() -
//                       new Date(b.createdAt).getTime()
//                   )
//                   .map(renderChatMessage)
//               ) : (
//                 <div className="text-center py-8 text-gray-500">
//                   {t("orders.chat.noMessages")}
//                 </div>
//               )}
//             </div>

//             <div className="border-t p-4 space-y-4">
//               <div className="flex gap-2">
//                 <Input
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   placeholder={t("orders.chat.messagePlaceholder")}
//                   className="flex-1"
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" && !e.shiftKey) {
//                       e.preventDefault();
//                       handleSendMessage();
//                     }
//                   }}
//                 />
//                 <Button
//                   onClick={handleSendMessage}
//                   disabled={!message.trim()}
//                   size="icon"
//                 >
//                   <Send className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="photos">{/* Photos tab content */}</TabsContent>
//       </Tabs>
//     </MyDialog>
//   );
// }
