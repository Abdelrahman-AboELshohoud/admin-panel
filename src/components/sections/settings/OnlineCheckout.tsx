import { useTranslation } from 'react-i18next';
import { Button } from "../../ui/button"

export default function OnlineCheckout() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-200">
            {t('onlineCheckout.title')}
          </h1>
        </div>
        <nav className="flex flex-col gap-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-primary hover:text-primary hover:underline transition hover:bg-transparent"
          >
            {t('onlineCheckout.cashierProfiles')}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-primary hover:text-primary hover:underline transition hover:bg-transparent"
          >
            {t('onlineCheckout.cashierConfigurations')}
          </Button>
        </nav>
      </div>
    </div>
  )
}