import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";

interface MyDialogProps {
  trigger?: ReactNode;
  title: any;
  description?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  showCloseButton?: boolean;
  className?: string;
}

export const MyDialog = ({
  trigger,
  title,
  description,
  isOpen,
  onOpenChange,
  children,
  showCloseButton = true,
  className = "",
}: MyDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={`min-h-[200px] flex flex-col ${className} card-shape text-gray-200`}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex-1 my-4">{children}</div>

        {showCloseButton && (
          <div className="flex justify-end mt-auto text-gray-500 hover:text-gray-600">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
