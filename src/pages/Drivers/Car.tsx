import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useTranslation } from "react-i18next";

export default function CarDetailsForm() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 text-gray-200 flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-white">
          {t("cars.car.title")}
        </h2>
      </div>
      <Card className="bg-[#1E1E1E] border-none">
        <CardHeader>
          <CardTitle className="text-2xl text-white">mercedas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="callSign" className="text-gray-300">
                  {t("cars.details.callSign")}
                </label>
                <Input
                  id="callSign"
                  value="437247"
                  className="bg-[#2A2A2A] border-none text-white"
                />
              </div>
              <div>
                <label htmlFor="branch" className="text-gray-300">
                  {t("cars.details.branch")}
                </label>
                <Input
                  id="branch"
                  value="Kazan"
                  className="bg-[#2A2A2A] border-none text-white"
                />
              </div>
              <div>
                <label htmlFor="owner" className="text-gray-300">
                  {t("cars.details.owner")}
                </label>
                <Select defaultValue="driver">
                  <SelectTrigger className="bg-[#2A2A2A] border-none text-white">
                    <SelectValue placeholder={t("cars.details.selectOwner")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="driver">
                      {t("cars.details.ownerTypes.driver")}
                    </SelectItem>
                    <SelectItem value="company">
                      {t("cars.details.ownerTypes.company")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="carModel" className="text-gray-300">
                  {t("cars.car.title")}
                </label>
                <div className="flex space-x-2">
                  <Select defaultValue="mercedes">
                    <SelectTrigger className="bg-[#2A2A2A] border-none text-white">
                      <SelectValue
                        placeholder={t("cars.details.selectBrand")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mercedes">
                        Mercedes-Benz E-Class
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="e-class">
                    <SelectTrigger className="bg-[#2A2A2A] border-none text-white">
                      <SelectValue
                        placeholder={t("cars.details.selectModel")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="e-class">
                        {t("cars.details.models.eClass")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label htmlFor="year" className="text-gray-300">
                  {t("cars.details.year")}
                </label>
                <Select defaultValue="2018">
                  <SelectTrigger className="bg-[#2A2A2A] border-none text-white">
                    <SelectValue placeholder={t("cars.details.selectYear")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2018">2018</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="class" className="text-gray-300">
                  {t("cars.details.class")}
                </label>
                <Select defaultValue="business">
                  <SelectTrigger className="bg-[#2A2A2A] border-none text-white">
                    <SelectValue placeholder={t("cars.details.selectClass")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">
                      {t("cars.details.classes.business")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="color" className="text-gray-300">
                  {t("cars.details.color")}
                </label>
                <Select defaultValue="black">
                  <SelectTrigger className="bg-[#2A2A2A] border-none text-white">
                    <SelectValue placeholder={t("cars.details.selectColor")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black">
                      {t("cars.details.colors.black")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="stateNumber" className="text-gray-300">
                  {t("cars.details.stateNumber")}
                </label>
                <Input
                  id="stateNumber"
                  value="0255KM799"
                  className="bg-[#2A2A2A] border-none text-white"
                />
              </div>
              <div>
                <label htmlFor="addInfo" className="text-gray-300">
                  {t("cars.details.additionalInfo")}
                </label>
                <Input
                  id="addInfo"
                  className="bg-[#2A2A2A] border-none text-white"
                />
              </div>
              <div>
                <label htmlFor="partners" className="text-gray-300">
                  {t("cars.details.partners")}
                </label>
                <Select defaultValue="opus">
                  <SelectTrigger className="bg-[#2A2A2A] border-none text-white">
                    <SelectValue
                      placeholder={t("cars.details.selectPartner")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="opus">Opus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <img
                src="/placeholder.svg?height=300&width=300"
                alt="mercedas"
                width="300"
                height="300"
                className="rounded-full mb-4"
              />
              <Card className="bg-[#2A2A2A] border-none">
                <CardHeader>
                  <CardTitle className="text-white">
                    {t("cars.details.ctp.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <label className="text-gray-300">
                      {t("cars.details.ctp.seriesNumber")}
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        value="9222"
                        className="bg-[#1E1E1E] border-none text-white"
                      />
                      <Input
                        value="090366"
                        className="bg-[#1E1E1E] border-none text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-300">
                      {t("cars.details.ctp.startDate")}
                    </label>
                    <Input
                      value="02.02.2011"
                      className="bg-[#1E1E1E] border-none text-white"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300">
                      {t("cars.details.ctp.endDate")}
                    </label>
                    <Input
                      value="02.02.2011"
                      className="bg-[#1E1E1E] border-none text-white"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-[#1E1E1E] border-none text-white"
                  >
                    {t("cars.details.scan")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center space-x-2">
            <label
              htmlFor="block"
              className="text-sm font-medium text-gray-300"
            >
              {t("block")}
            </label>
            <div className="w-12 h-6 bg-[#2A2A2A] rounded-full relative">
              <div className="absolute left-1 top-1 w-4 h-4 bg-gray-600 rounded-full" />
            </div>
          </div>
        </CardFooter>
      </Card>
      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-[#1E1E1E] border-none">
          <CardHeader>
            <CardTitle className="text-white">
              {t("cars.details.ptsd.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <label className="text-gray-300">
                {t("cars.details.ptsd.seriesNumber")}
              </label>
              <div className="flex space-x-2">
                <Input
                  value="9222"
                  className="bg-[#2A2A2A] border-none text-white"
                />
                <Input
                  value="090366"
                  className="bg-[#2A2A2A] border-none text-white"
                />
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full bg-slate-600 border-none text-white"
            >
              {t("cars.details.scan")}
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-[#1E1E1E] border-none">
          <CardHeader>
            <CardTitle className="text-white">
              {t("cars.details.license.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <label className="text-gray-300">
                {t("cars.details.license.number")}
              </label>
              <Input className="bg-[#2A2A2A] border-none text-white" />
            </div>
            <Button
              variant="outline"
              className="w-full bg-slate-600 border-none text-white"
            >
              {t("cars.details.scan")}
            </Button>
          </CardContent>
        </Card>
      </div>
      <Button className="ml-auto px-6 py-2 bg-[#D4AF37] text-black hover:bg-[#C4A137]">
        {t("save")}
      </Button>
    </div>
  );
}
