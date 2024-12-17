import  Switch  from "../../common/Switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import Selects from "../../common/Selects"
import { Input } from "../../ui/input"
import SelectsWithLabel from "../../common/SelectswithLabel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"

export default function DriverSettings() {
  return (
    <div className="min-h-screen bg-transparent text-gray-100 p-4 md:p-8">
      <div className=" mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-6">Performers</h1>
        
        <Tabs className="flex flex-col gap-4 mb-6">
          <TabsList className="grid w-[200px] grid-cols-2 bg-transparent">

          <TabsTrigger value="taxi" className="custom-tabs">Taxi Driver</TabsTrigger>
          <TabsTrigger value="driver" className="custom-tabs">Driver</TabsTrigger>
          </TabsList>



        <TabsContent value="taxi" className="card-shape flex flex-col gap-4">
        <div className="bg-transparent text-gray-100 flex gap-6 items-center mb-6">
            <label className="text-nowrap font-semibold">Arrival Time (minutes)</label>
            <div className="flex justify-center gap-2 h-full py-auto items-center">

            {[10, 15, 20, 0, 0, 0].map((value, index) => (
              <div key={index} className="">
                <Input
                  type="number"
                  min="0"
                  defaultValue={value}
                  className="w-full custom-input text-white rounded-md px-3 py-2"
                />
              </div>
            ))}

            </div>

        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label>Allow performer to work without GPS?</label>
            <Switch disabled={false} checked={false} />
          </div>
            <SelectsWithLabel placeholder="1" options={Array.from({length: 10}, (_, i) => (i + 1).toString())} value={1} label="Minimum balance for shift start (₽)" />

            <SelectsWithLabel placeholder="1" options={Array.from({length: 10}, (_, i) => (i + 1).toString())} value={1} label="Minimum rating for system access" />

            <SelectsWithLabel placeholder="1" options={Array.from({length: 10}, (_, i) => (i + 1).toString())} value={60} label="Add 5-star ratings to performer" />

            <SelectsWithLabel placeholder="1" options={Array.from({length: 10}, (_, i) => (i + 1).toString())} value={100} label="Number of recent reviews for rating" />

          <div className="space-y-4">
            {[
              "Show 'Not Paid' button at end of ride",
              "Show payment via SBP",
              "Show preliminary calculation",
              "Allow editing order addresses",
              "Allow editing order cost",
              "Show destination to performer"
            ].map((label, index) => (
              <div key={index} className="flex items-center justify-between">
                <label>{label}</label>
                <Switch disabled={false} checked={false} />
              </div>
            ))}
          </div>

            <SelectsWithLabel placeholder="Select status" options={["default", "going", "waiting"]} value="default" label="Hide steps during order execution (statuses)" />

          <div className="flex items-center justify-between">
            <label>Show price and area filter</label>
            <Switch disabled={false} checked={false} />
          </div>

          <SelectsWithLabel placeholder="10%" options={Array.from({length: 10}, (_, i) => (i * 10).toString())} value="10%" label="Minimum sound volume level" />

                  {/* // <SelectItem key={i} value={(i * 10).toString()}>{i * 10}%</SelectItem> */}
        
            <SelectsWithLabel placeholder="direct" options={["direct", "support"]} value="Direct" label="Client communication" />
            <SelectsWithLabel placeholder="Show Full Name" options={["Show Full Name", "First Name Only", "Don't Show"]} value="Full" label="Show client name to performer" />

          <div className="space-y-4">
            {[
              "Show urgent order submission time to performer",
              "Show dispatcher chat before shift?",
              "Show dispatcher chat during shift?",
              "Show general chat during shift?",
              "Show Events section",
              "Show other cars on map"
            ].map((label, index) => (
              <div key={index} className="flex items-center justify-between">
                <label>{label}</label>
                <Switch disabled={false} checked={false} />
              </div>
            ))}
          </div>

            <SelectsWithLabel placeholder="2000" options={Array.from({length: 21}, (_, i) => (i * 1000).toString())} value="2000" label="Within radius (meters)" />

          <div className="space-y-4">
            {[
              "Allow performer to top up balance via bank card?",
              "Automatically end shift if performer coordinates are not current",
              "Automatically end shift if performer is outside city or order acceptance zone",
              "Show available and preliminary orders in application tabs",
              "Prohibit use of fake GPS?",
              "Prevent performer from pressing 'Arrived' button in advance?",
              "Require password for each application login",
              "Show privacy policy?",
              "Monitor your cars' mileage?",
              "Allow performer to reserve urgent orders",
              "Hide price and route points (except point A)",
              "Speak text after taximeter start",
              "Speak text after ride completion",
              "Automatically start taximeter after free waiting time ends",
              "Allow performer to choose which types of orders to receive",
              "Allow driver to use SOS button"
            ].map((label, index) => (
              <div key={index} className="flex items-center justify-between">
                <label>{label}</label>
                <Switch disabled={false} checked={false} />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <label>Allow driver to cancel order</label>
            <div className="flex flex-col gap-4">
              {[
                "Picked up and going to client",
                "Arrived and waiting for client (before paid waiting)",
                "Arrived and waiting for client (after paid waiting starts)"
              ].map((label, index) => (
                <div key={index} className="flex items-center justify-between">
                  <label>{label}</label>
                  <Switch disabled={false} checked={false} />
                </div>
              ))}
            </div>
            <Selects placeholder="15 min." options={Array.from({length: 61}, (_, i) => (i).toString())} value="15" />
          </div>

          <div className="space-y-4">
            {[
              "Show client rating window after order completion",
              "Commission for penalties"
            ].map((label, index) => (
              <div key={index} className="flex items-center justify-between">
                <label>{label}</label>
                <Switch disabled={false} checked={false} />
              </div>
            ))}
          </div>

            <div className="flex flex-col gap-4">
              <label className="text-lg font-semibold">What data to show for order:</label>
            <CardContent className="space-y-8">

              <div className="space-y-4">
                <h3 className=" font-semibold">In order list:</h3>
                <div className="space-y-4 pl-4">
                  <SelectsWithLabel placeholder="Show Full Name" options={["Show Full Name", "First Name Only", "Don't Show"]} value="Full" label="Show client name to performer" />

                  <div className="flex items-center justify-between">
                    <label>Client rating</label>
                    <Switch disabled={false} checked={false} />
                  </div>
                  <SelectsWithLabel placeholder="Route points" options={["Show Full Name", "First Name Only", "Don't Show"]} value="all" label="Show client name to performer" />

                        {/* <SelectItem value="all">Show all points</SelectItem>
                        <SelectItem value="partial">Show partial points</SelectItem>
                        <SelectItem value="none">Don't show</SelectItem> */}

                  {[
                    "Comments",
                    "Cost",
                    "Payment method",
                    "Time for urgent orders"
                  ].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <label>{item}</label>
                      <Switch disabled={false} checked={false} />
                    </div>
                  ))}
                </div>
              </div>

              {/* In detailed order card section */}
              <div className="space-y-4">
                <h3 className=" font-semibold">In detailed order card:</h3>
                <div className="space-y-4 pl-4">
                  <SelectsWithLabel placeholder="Show Full Name" options={["Show Full Name", "First Name Only", "Don't Show"]} value="Full" label="Show client name to performer" />
                  <div className="flex items-center justify-between">
                    <label>Client rating</label>
                    <Switch disabled={false} checked={false} />
                  </div>
                  <SelectsWithLabel placeholder="Route points" options={["Show all points", "Partial points", "Don't show"]} value="all" label="Route points" />
                  {[
                    "Comments",
                    "Cost",
                    "Payment method",
                    "Time until urgent orders"
                  ].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <label>{item}</label>
                      <Switch disabled={false} checked={false} />
                    </div>
                  ))}
                </div>
              </div>

              {/* During order execution section */}
              <div className="space-y-4">
                <h3 className="font-semibold">During order execution:</h3>
                <div className="space-y-4 pl-4">
                  <SelectsWithLabel placeholder="Show Full Name" options={["full", "first", "none"]} value="full" label="Show client name to performer" />

                  <div className="flex items-center justify-between">
                    <label>Client rating</label>
                    <Switch disabled={false} checked={false} />
                  </div>

                  <SelectsWithLabel placeholder="Show all points" options={["all", "partial", "none"]} value="all" label="Route points" />
                  <div className="flex items-center justify-between">
                    <label>Cost</label>
                    <Switch disabled={false} checked={false} />
                  </div>
                </div>
              </div>
            </CardContent>
            </div>

        </div>

          <button className=" ml-auto py-2 px-4 bg-primary hover:bg-primary/80 text-black hover:text-white rounded-md transition-colors">
            Save Changes
          </button>
          
        </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

