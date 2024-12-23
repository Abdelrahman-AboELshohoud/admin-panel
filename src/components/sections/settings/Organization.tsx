import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

interface OrganizationDetails {
  organizationName: string;
  taxiServiceName: string;
  legalAddress: string;
  postalAddress: string;
  directorName: string;
  directorPosition: string;
  accountantName: string;
  inn: string;
  kpp: string;
  ogrn: string;
  phone: string;
  email: string;
  website: string;
  contactPerson: {
    lastName: string;
    firstName: string;
    middleName: string;
    phone: string;
    email: string;
  };
}

export default function OrganizationDetails() {
  const { t } = useTranslation();
  const [logoImage, setLogoImage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 dark">
      <Card className="mx-auto max-w-4xl card-shape">
        <CardHeader>
          <CardTitle>{t('organizationDetails.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 flex flex-col gap-4"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="organizationName">
                      {t('organizationDetails.fullOrganizationName')}
                    </label>
                    <Input
                      id="organizationName"
                      placeholder={t('organizationDetails.organizationNamePlaceholder')}
                      className="bg-muted custom-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="taxiServiceName">{t('organizationDetails.taxiServiceName')}</label>
                    <Input
                      id="taxiServiceName"
                      placeholder={t('organizationDetails.taxiServiceNamePlaceholder')}
                      className="bg-muted custom-input"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="legalAddress">{t('organizationDetails.legalAddress')}</label>
                    <Input
                      id="legalAddress"
                      placeholder={t('organizationDetails.legalAddressPlaceholder')}
                      className="bg-muted custom-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="postalAddress">{t('organizationDetails.postalAddress')}</label>
                    <Input
                      id="postalAddress"
                      placeholder={t('organizationDetails.postalAddressPlaceholder')}
                      className="bg-muted custom-input"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="phone">{t('organizationDetails.organizationPhone')}</label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t('organizationDetails.phonePlaceholder')}
                      className="bg-muted custom-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email">{t('organizationDetails.organizationEmail')}</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('organizationDetails.emailPlaceholder')}
                      className="bg-muted custom-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="website">{t('organizationDetails.website')}</label>
                    <Input
                      id="website"
                      type="url"
                      placeholder={t('organizationDetails.websitePlaceholder')}
                      className="bg-muted custom-input"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t('organizationDetails.contactPerson')}</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <label htmlFor="contactLastName">{t('organizationDetails.lastName')}</label>
                      <Input
                        id="contactLastName"
                        className="bg-muted custom-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contactFirstName">{t('organizationDetails.firstName')}</label>
                      <Input
                        id="contactFirstName"
                        className="bg-muted custom-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contactMiddleName">{t('organizationDetails.middleName')}</label>
                      <Input
                        id="contactMiddleName"
                        className="bg-muted custom-input"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="contactPhone">{t('organizationDetails.contactPhone')}</label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        placeholder={t('organizationDetails.phonePlaceholder')}
                        className="bg-muted custom-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contactEmail">{t('organizationDetails.contactEmail')}</label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder={t('organizationDetails.emailPlaceholder')}
                        className="bg-muted custom-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-64 w-64">
                    <AvatarImage
                      src={logoImage || "/organization-logo.svg"}
                      alt={t('organizationDetails.organizationLogo')}
                    />
                    <AvatarFallback>OL</AvatarFallback>
                  </Avatar>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="logo-upload"
                  />

                  <Button
                    className="w-full cursor-pointer add-button text-white"
                    onClick={() =>
                      document.getElementById("logo-upload")?.click()
                    }
                  >
                    {t('organizationDetails.uploadLogo')}
                  </Button>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {t('organizationDetails.logoRecommendation')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('organizationDetails.logoFileTypes')}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="directorName">{t('organizationDetails.directorFullName')}</label>
                    <Input
                      id="directorName"
                      placeholder={t('organizationDetails.fullNamePlaceholder')}
                      className="bg-muted custom-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="directorPosition">{t('organizationDetails.position')}</label>
                    <Input
                      id="directorPosition"
                      placeholder={t('organizationDetails.positionPlaceholder')}
                      className="bg-muted custom-input"
                    />
                  </div>
                </div>

                <div className="grid gap-6 grid-cols-1">
                  <div className="col-span-1 flex flex-col gap-2">
                    <label htmlFor="inn">{t('organizationDetails.inn')}</label>
                    <Input
                      id="inn"
                      placeholder={t('organizationDetails.innPlaceholder')}
                      className="bg-muted custom-input"
                    />
                  </div>
                  <div className="col-span-1 flex flex-col gap-2">
                    <label htmlFor="kpp">{t('organizationDetails.kpp')}</label>
                    <Input
                      id="kpp"
                      placeholder={t('organizationDetails.kppPlaceholder')}
                      className="bg-muted custom-input"
                    />
                  </div>
                  <div className="col-span-1 flex flex-col gap-2">
                    <label htmlFor="ogrn">{t('organizationDetails.ogrn')}</label>
                    <Input
                      id="ogrn"
                      placeholder={t('organizationDetails.ogrnPlaceholder')}
                      className="bg-muted custom-input"
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="ml-auto bg-primary text-black hover:bg-primary/80 px-6 py-2 rounded-md"
            >
              {t('organizationDetails.save')}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}