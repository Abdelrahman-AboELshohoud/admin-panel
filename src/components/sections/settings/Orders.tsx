import * as React from "react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import Selects from "../../common/Selects";
import Switch from "../../common/Switch";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { Plus, X } from "lucide-react";
import ToolTip from "../../common/ToolTip";
import SelectsWithLabel from "../../common/SelectswithLabel";

export default function OrderDistributionSettings() {
  const [circles, setCircles] = React.useState([
    { radius: 3000, repeats: 1 },
    { radius: 5000, repeats: 1 },
    { radius: 7000, repeats: 1 },
    { radius: 10000, repeats: 1 },
  ]);

  const addCircle = () => {
    if (circles.length < 5) {
      setCircles([...circles, { radius: 3000, repeats: 1 }]);
    }
  };

  const removeCircle = (index: number) => {
    setCircles(circles.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col gap-6 bg-transparent p-4 text-white">
      <div className="max-w-4xl mx-auto space-y-6 ">
        <div className="flex items-center justify-between text-white">
          <h1 className="text-2xl font-semibold">Orders</h1>
        </div>

        <Tabs defaultValue="taxi" className="w-full">
          <TabsList className="bg-transparent ">
            <TabsTrigger value="taxi" className="custom-tabs">
              Taxi Driver
            </TabsTrigger>
            <TabsTrigger value="driver" className="custom-tabs">
              Driver
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="bg-[#2C2C2E] border-[#3A3A3C]">
          <CardContent className="p-6 space-y-6 text-gray-100">
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Distribution</h2>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label>First Rule</label>
                  <ToolTip
                    text={`Distance: the proximity of the car to the client is taken into account.\nArea: cars located in the same area as the client participate.`}
                  />
                </div>
                <Selects
                  value="distance"
                  placeholder="distance"
                  options={["distance", "district"]}
                />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-[1fr,2fr,2fr] gap-4 items-center">
                  <div>Circles</div>
                  <div>Search Radius</div>
                  <div>Repeat Count</div>
                </div>

                {circles.map((circle, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr,2fr,2fr] gap-4 items-center"
                  >
                    <div>Circle {index + 1}</div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={circle.radius}
                        className="bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>m</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={circle.repeats}
                        className="bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      {index > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCircle(index)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="py-2 px-6 bg-[#3A3A3C] border-[#48484A] text-white hover:bg-[#48484A]"
                  onClick={addCircle}
                  disabled={circles.length >= 5}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Circle
                </Button>
              </div>

              <div className="space-y-4">
                <SelectsWithLabel
                  label="Order status between distribution attempts"
                  value="order"
                  placeholder="To single executor"
                  options={["New order", "Free order"]}
                />

                <div className="flex items-center justify-between">
                  <label>Delay between distribution attempts</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value="1"
                      className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                    />
                    <span>sec.</span>
                  </div>
                </div>

                <SelectsWithLabel
                  label="Offer order simultaneously"
                  value="single"
                  placeholder="To single executor"
                  options={["To single executor", "To multiple executors"]}
                />

                <div className="flex items-center justify-between">
                  <label>Second Rule</label>
                  <div className="flex items-center gap-2 w-1/2">
                    <Switch disabled={false} checked={true} />
                    <label className="text-xs text-gray-400">
                      Consider executor rating during distribution. Rating is
                      calculated for each shift using the formula: average
                      executor rating × 10 + sum of additional options
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <SelectsWithLabel
                    label="Third Rule"
                    value="distance"
                    placeholder="distance"
                    options={["distance", "time"]}
                  />
                  <SelectsWithLabel
                    label="Forth Rule"
                    value="no"
                    placeholder="No"
                    options={["No", "Business + sober driver"]}
                  />

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 justify-between">
                      <SelectsWithLabel
                        label="if order class matches"
                        value="businessplus"
                        placeholder="Bussiness+"
                        options={["Bussiness+", "Premium"]}
                      />
                      <div className="flex items-center gap-10">
                        <span>and order cost is greater than</span>
                        <Input
                          type="number"
                          value="1000"
                          className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <SelectsWithLabel
                  label="Distance calculation to executor"
                  value="roads"
                  placeholder="By roads"
                  options={["By roads", "Straight line"]}
                />
              </div>

              <div className="space-y-6 pt-6 border-t border-[#3A3A3C]">
                <h2 className="text-lg font-medium">Executor Display on Map</h2>
                <SelectsWithLabel
                  label="Show on map as"
                  value="executor"
                  placeholder="Executor"
                  options={["Executor", "Vehicle"]}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Orders</h3>

                  <SelectsWithLabel
                    label="Send PUSH notification about free order to executors not on shift"
                    value="no"
                    placeholder="No"
                    options={["No", "Yes"]}
                  />

                  <div className="flex items-center justify-between">
                    <label>Free orders visibility radius for executor</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="50000"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>m.</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>
                      Standard search time before order becomes overdue
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="600"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>sec.</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>Order offer time to executor</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="12"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>sec.</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>Auto-complete order with status after</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="60"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>min.</span>
                    </div>
                    <Selects
                      value="completed"
                      placeholder="completed"
                      options={["completed", "not_found"]}
                    />
                  </div>

                  <div className="space-y-4">
                    <SelectsWithLabel
                      label="Executor blocking type for ignored orders"
                      value="consecutive"
                      placeholder="consecutive"
                      options={["consecutive", "per_shift"]}
                    />

                    <div className="flex items-center justify-between">
                      <label>Number of rejected offers before blocking</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value="5"
                          className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                        />
                        <span>pcs.</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label>Blocking duration</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value="60"
                          className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                        />
                        <span>min.</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <SelectsWithLabel
                      value="Automatically"
                      placeholder="Automatically"
                      options={["Automatically", "Manually by the performer"]}
                      label="Time calculation until submission"
                    />

                    <div className="flex items-center gap-2 ml-auto">
                      <Switch disabled={false} checked={true} />
                      <label className="text-xs text-gray-400 ">
                        Adjust submission time
                      </label>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-[1fr,2fr,2fr,1fr] gap-4 items-center">
                        <div>Interval</div>
                        <div>Start</div>
                        <div>End</div>
                        <div>Percentage</div>
                      </div>

                      {[
                        { start: "07:00", end: "07:00", percent: 20 },
                        { start: "16:00", end: "17:00", percent: 50 },
                        { start: "17:00", end: "20:00", percent: 40 },
                        { start: "10:00", end: "16:00", percent: 30 },
                        { start: "20:00", end: "07:00", percent: 10 },
                      ].map((interval, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-[1fr,2fr,2fr,1fr] gap-4 items-center"
                        >
                          <div>Interval {index + 1}</div>
                          <Input
                            type="time"
                            value={interval.start}
                            className="bg-[#3A3A3C] border-[#48484A] text-white"
                          />
                          <Input
                            type="time"
                            value={interval.end}
                            className="bg-[#3A3A3C] border-[#48484A] text-white"
                          />
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={interval.percent}
                              className="bg-[#3A3A3C] border-[#48484A] text-white"
                            />
                            {index > 0 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  /* Remove interval */
                                }}
                                className="text-red-500 hover:text-red-400"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <Switch disabled={false} checked={true} />
                      <label className="text-xs text-gray-400">
                        Use order sum holding
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <label>
                        Current order amount to show in Attention tab
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value="1"
                          className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                        />
                        <span>₽</span>
                      </div>
                    </div>

                    <SelectsWithLabel
                      label="Assign offline executors to order"
                      value="no"
                      placeholder="No"
                      options={["No", "Yes"]}
                    />

                    <SelectsWithLabel
                      label="Maximum number of clients debts"
                      value="3"
                      placeholder="3"
                      options={["3", "5", "10"]}
                    />

                    <SelectsWithLabel
                      label="Show in order card in app, website, and to executors"
                      value="order_number"
                      placeholder="Order number"
                      options={[
                        "Order serial number",
                        "Alphanumeric order code",
                        "Order number from external system",
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Add new sections */}
              <div className=" pt-6 space-y-6 border-t border-[#3A3A3C]">
                <h2 className="text-lg font-medium">Order Form</h2>

                <div className="flex flex-col gap-6">
                  <SelectsWithLabel
                    label={`Add "phone" field to each order point`}
                    value="no"
                    placeholder="No"
                    options={["No", "Yes"]}
                  />

                  <SelectsWithLabel
                    label='Add "comment" field to each order point'
                    value="no"
                    placeholder="No"
                    options={["No", "Yes"]}
                  />
                  <SelectsWithLabel
                    label="Dispatcher comment"
                    value="no"
                    placeholder="No"
                    options={["No", "Yes"]}
                  />

                  <SelectsWithLabel
                    label="Driver payment"
                    value="no"
                    placeholder="No"
                    options={["No", "Yes"]}
                  />

                  <SelectsWithLabel
                    label="Display 'Terminal' payment type in order card in admin panel and client's account"
                    value="no"
                    placeholder="No"
                    options={["No", "Yes"]}
                  />

                  <div className="flex items-center gap-2 ml-auto">
                    <Switch disabled={false} checked={true} />
                    <label className="text-xs text-gray-400">
                      Show chat between client and driver
                    </label>
                  </div>
                </div>
              </div>

              <div className=" pt-6 border-t border-[#3A3A3C]">
                <h2 className="text-lg font-medium">Preliminary Orders</h2>

                <div className="flex flex-col gap-6">
                  <SelectsWithLabel
                    label="Send PUSH notification about preliminary order to executors not on shift"
                    value="yes"
                    placeholder="Yes"
                    options={["Yes", "No"]}
                  />

                  <div className="flex items-center justify-between">
                    <label>
                      Consider order preliminary if time until submission is
                      more than
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>min.</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch disabled={false} checked={true} />
                    <label className="text-xs text-gray-400">
                      Limit visibility time of preliminary orders for executor
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>Automatically enters distribution after</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>min.</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>Notify executor after</label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value="20"
                          className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                        />
                        <span>min.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value="20"
                          className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                        />
                        <span>min.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value="20"
                          className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                        />
                        <span>min.</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>
                      Preliminary order rejection without blocking for
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>min.</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>Block executor for preliminary orders for</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>min.</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>
                      Allow executor to start preliminary order after
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>min.</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>
                      Do not allow taking new orders for X minutes before
                      nearest preliminary order
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>min.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-[#3A3A3C]">
                <h2 className="text-lg font-medium">Order Exchange</h2>

                <SelectsWithLabel
                  label="Transfer order to another system"
                  placeholder="Manually"
                  options={["Manually", "Automatic"]}
                  value="manual"
                />
              </div>

              <div className="space-y-6 pt-6 border-t border-[#3A3A3C]">
                <h2 className="text-lg font-medium">Notifications</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label>
                      Number of call attempts if client doesn't answer
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>pcs.</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>
                      Time after which client is considered to have listened to
                      notification
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>sec.</span>
                    </div>
                  </div>

                  <SelectsWithLabel
                    label="Send order report to client via"
                    placeholder="Email"
                    options={["Email", "SMS"]}
                    value="email"
                  />
                </div>
              </div>

              {/* Add Reviews section */}
              <div className="space-y-6 pt-6 border-t border-[#3A3A3C]">
                <h2 className="text-lg font-medium">Reviews</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label>Minimum client rating to create an order</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span className="text-transparent select-none">pcs.</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>Add 5-star rating to client</label>
                    <div className="flex items-center gap-2 ">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span>pcs.</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label>
                      Number of recent client reviews considered in rating
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value="20"
                        className="w-[100px] bg-[#3A3A3C] border-[#48484A] text-white"
                      />
                      <span className="text-transparent select-none">pcs.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-[#3A3A3C]">
                <h2 className="text-lg">Client Personal Account Module</h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Switch disabled={false} checked={true} />
                    <label className="text-xs text-gray-400">
                      Allow client to suggest their price
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch disabled={false} checked={true} />
                    <label className="text-xs text-gray-400">
                      Show executor's phone number to client
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <button className=" ml-auto py-2 px-6 bg-primary hover:bg-primary/80 text-black hover:text-gray-100 rounded-md transition">
        Save
      </button>
    </div>
  );
}
