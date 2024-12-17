import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'

export default function CarDetailsForm() {
  return (
    <div className="space-y-6 text-gray-200 flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-white">Cars</h2>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-600 rounded-full" />
        </div>
      </div>
      <Card className="bg-[#1E1E1E] border-none">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Mercedes-Benz E-Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="callSign" className="text-gray-300">Call sign</label>
                <Input id="callSign" value="437247" className="bg-[#2A2A2A] border-none text-white" />
              </div>
              <div>
                <label htmlFor="branch" className="text-gray-300">The branch where the car works</label>
                <Input id="branch" value="Kazan" className="bg-[#2A2A2A] border-none text-white" />
              </div>
              <div>
                <label htmlFor="owner" className="text-gray-300">Whose car is it</label>
                <Select defaultValue="driver">
                  <SelectTrigger className="bg-[#2A2A2A] border-none text-white">
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="driver">The driver</SelectItem>
                    <SelectItem value="company">The company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="carModel" className="text-gray-300">Car</label>
                <div className="flex space-x-2">
                  <Select defaultValue="mercedes">
                    <SelectTrigger className="bg-[#2A2A2A] border-none text-white">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="e-class">
                    <SelectTrigger className="bg-[#2A2A2A] border-none text-white">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="e-class">E-Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label htmlFor="year" className="text-gray-300">Year of release</label>
                <Select defaultValue="2018">
                  <SelectTrigger className="bg-[#2A2A2A] border-none text-white">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2018">2018</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="class" className="text-gray-300">Class</label>
                <Select defaultValue="business">
                  <SelectTrigger className="bg-[#2A2A2A] border-none text-white">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Business+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="color" className="text-gray-300">Colour</label>
                <Select defaultValue="black">
                  <SelectTrigger className="bg-[#2A2A2A] border-none text-white">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black">Black</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="stateNumber" className="text-gray-300">State number</label>
                <Input id="stateNumber" value="0255KM799" className="bg-[#2A2A2A] border-none text-white" />
              </div>
              <div>
                <label htmlFor="addInfo" className="text-gray-300">Add. information</label>
                <Input id="addInfo" className="bg-[#2A2A2A] border-none text-white" />
              </div>
              <div>
                <label htmlFor="partners" className="text-gray-300">Partners</label>
                <Select defaultValue="opus">
                  <SelectTrigger className="bg-[#2A2A2A] border-none text-white">
                    <SelectValue placeholder="Select partner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="opus">Opus Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <img
                src="/placeholder.svg?height=300&width=300"
                alt="Mercedes-Benz E-Class"
                width="300"
                height="300"
                className="rounded-full mb-4"
              />
              <Card className="bg-[#2A2A2A] border-none">
                <CardHeader>
                  <CardTitle className="text-white">CTP</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <label className="text-gray-300">Series/Number</label>
                    <div className="flex space-x-2">
                      <Input value="9222" className="bg-[#1E1E1E] border-none text-white" />
                      <Input value="090366" className="bg-[#1E1E1E] border-none text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-300">Start date</label>
                    <Input value="02.02.2011" className="bg-[#1E1E1E] border-none text-white" />
                  </div>
                  <div>
                    <label className="text-gray-300">End date</label>
                    <Input value="02.02.2011" className="bg-[#1E1E1E] border-none text-white" />
                  </div>
                  <Button variant="outline" className="w-full bg-[#1E1E1E] border-none text-white">
                    Scan
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center space-x-2">
            <label htmlFor="block" className="text-sm font-medium text-gray-300">
              Block
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
            <CardTitle className="text-white">PTSD</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <label className="text-gray-300">Series/Number</label>
              <div className="flex space-x-2">
                <Input value="9222" className="bg-[#2A2A2A] border-none text-white" />
                <Input value="090366" className="bg-[#2A2A2A] border-none text-white" />
              </div>
            </div>
            <Button variant="outline" className="w-full bg-slate-600 border-none text-white">
              Scan
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-[#1E1E1E] border-none">
          <CardHeader>
            <CardTitle className="text-white">License to work in a taxi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <label className="text-gray-300">Number</label>
              <Input className="bg-[#2A2A2A] border-none text-white" />
            </div>
            <Button variant="outline" className="w-full bg-slate-600 border-none text-white">
              Scan
            </Button>
          </CardContent>
        </Card>
      </div>
      <Button className="ml-auto px-6 py-2 bg-[#D4AF37] text-black hover:bg-[#C4A137]">Save</Button>
    </div>
  )
}
