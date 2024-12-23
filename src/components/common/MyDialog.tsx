// import { Button } from "../ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../ui/dialog";
// import { useAssets } from "../../context/AssetsContext";
// import { DialogDescription } from "@radix-ui/react-dialog";

// export const MyDialog = ({
//   trigger,
//   title,
//   description,
//   ActionButton,
// }: {
//   description: string;
//   trigger: any;
//   title: string;
//   ActionButton: React.ReactNode;
// }) => {
//   const { openDialog, handleOpenDialog } = useAssets();
//   return (
//     <Dialog open={openDialog} onOpenChange={handleOpenDialog}>
//       <DialogTrigger>{trigger}</DialogTrigger>
//       {ActionButton}
//       {/* <DialogHeader>
//         <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
//         <DialogDescription className="text-sm text-gray-500">
//           {description}
//         </DialogDescription>
//       </DialogHeader> */}
//       {/* <DialogFooter>
//         <Button onClick={handleOpenDialog}>Close</Button>
//       </DialogFooter> */}
//     </Dialog>
//   );
// };
