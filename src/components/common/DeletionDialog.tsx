import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface DeletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  countdownSeconds?: number;
}

export default function DeletionDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  countdownSeconds = 5,
}: DeletionDialogProps) {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(countdownSeconds);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isOpen && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
        if (countdown === 0) {
          clearInterval(timer);
          setCountdown(0);
        }
      }, 1000);
    }
    return () => {
      if (timer === 0) {
        clearInterval(timer);
      }
      clearInterval(timer);
      setCountdown(countdownSeconds);
      setIsDeleting(false);
    };
  }, [isOpen, countdownSeconds]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error during deletion:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-h-[220px] flex flex-col card-shape w-[420px] text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-gray-100">{title}</DialogTitle>
          <DialogDescription>
            {description}
            <div className="mt-4">
              <p>
                {t("common.pleaseWait")}{" "}
                <span className="text-red-500 font-bold">
                  {countdown > 0 ? countdown : "0"}
                </span>{" "}
                {t("common.seconds")}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 mt-auto justify-between w-full">
          <Button className="text-gray-500" variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={countdown > 0 || isDeleting}
          >
            {isDeleting ? t("common.deleting") : t("common.delete")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
