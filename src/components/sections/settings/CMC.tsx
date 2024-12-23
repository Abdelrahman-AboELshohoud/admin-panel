import { useTranslation } from 'react-i18next';
import { Input } from '../../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'

export default function CMCSettings() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background p-4 flex items-start">
      <Card className="w-1/2 card-shape text-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t('cmcSettings.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="provider" className="block text-sm font-medium text-gray-100">{t('cmcSettings.providerLabel')}</label>
            <Select defaultValue="60">
              <SelectTrigger id="provider" className='custom-input'>
                <SelectValue placeholder={t('cmcSettings.selectPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">{t('cmcSettings.option60')}</SelectItem>
                <SelectItem value="120">{t('cmcSettings.option120')}</SelectItem>
                <SelectItem value="180">{t('cmcSettings.option180')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="login" className="block text-sm font-medium text-gray-100">{t('cmcSettings.loginLabel')}</label>
            <Input
              id="login"
              placeholder={t('cmcSettings.inputPlaceholder')}
              className="bg-gray-200/20 border-transparent text-black placeholder:text-gray-800"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-100">{t('cmcSettings.passwordLabel')}</label>
            <Input
              id="password"
              type="password"
              placeholder={t('cmcSettings.inputPlaceholder')}
              className="bg-gray-200/20 border-transparent text-black placeholder:text-gray-800"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="signature" className="block text-sm font-medium text-gray-100">{t('cmcSettings.signatureLabel')}</label>
            <Input
              id="signature"
              placeholder={t('cmcSettings.inputPlaceholder')}
              className="bg-gray-200/20 border-transparent text-black placeholder:text-gray-800"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="server" className="block text-sm font-medium text-gray-100">{t('cmcSettings.serverLabel')}</label>
            <Input
              id="server"
              placeholder={t('cmcSettings.inputPlaceholder')}
              className="bg-gray-200/20 border-transparent text-black placeholder:text-gray-800"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}