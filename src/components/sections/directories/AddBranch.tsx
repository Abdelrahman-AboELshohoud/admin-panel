import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";

import { Textarea } from "../../ui/textarea";

interface Contact {
  id: string;
  type: string;
  name: string;
  value: string;
  visible: boolean;
}

export default function AddBranch() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      type: "Telephone",
      name: "",
      value: "",
      visible: true,
    },
  ]);

  const contactTypes = ["Telephone", "WhatsApp", "Viber", "Telegram", "Link"];

  const addContact = () => {
    setContacts([
      ...contacts,
      {
        id: Math.random().toString(),
        type: "Telephone",
        name: "",
        value: "",
        visible: true,
      },
    ]);
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  return (
    <div className="min-h-screen p-6 ">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-normal text-zinc-100">Add a branch</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="card-shape">
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div className="space-y-2">
                <label className="text-sm text-zinc-100 flex items-center gap-1">
                  A country
                  <span className="text-amber-500">*</span>
                </label>
                <Select>
                  <SelectTrigger className="custom-input">
                    <SelectValue placeholder="Russian Federation" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="ru">Russian Federation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-100">City</label>
                <Select>
                  <SelectTrigger className="custom-input">
                    <SelectValue placeholder="Choose a city" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="moscow">Moscow</SelectItem>
                    <SelectItem value="kazan">Kazan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-100">Interface language</label>
                <Select>
                  <SelectTrigger className="custom-input">
                    <SelectValue placeholder="Russian" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="ru">Russian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Currency Settings */}
          <Card className="card-shape">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-100 flex items-center gap-1">
                  Currency
                  <span className="text-amber-500">*</span>
                </label>
                <Select>
                  <SelectTrigger className="custom-input">
                    <SelectValue placeholder="Russian Ruble" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="rub">Russian Ruble</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-100">
                  Format price displays
                </label>
                <Select>
                  <SelectTrigger className="custom-input">
                    <SelectValue placeholder="₽:kopecks-100.00" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="format1">₽:kopecks-100.00</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-sm text-zinc-100">
                    Play a sound signal when
                  </label>
                  <label className="text-sm text-zinc-400 block">
                    a new order is received
                  <span className="text-amber-500 text-sm">{" "}*</span>
                  </label>
                </div>
                <Select>
                  <SelectTrigger className="custom-input">
                    <SelectValue placeholder="No" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sorting */}
        <Card className="card-shape">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <label className="text-sm text-zinc-100">Sorting</label>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-zinc-100"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              placeholder="To write..."
              className="bg-transparent border-0 text-zinc-400 px-0 h-auto placeholder:text-zinc-500 border-none select-none resize-none focus-visible:ring-0"
            />
          </CardContent>
        </Card>

       <div  className="flex gap-6">
        <Card className="card-shape w-1/2">
          <CardContent className="p-6 space-y-2">
            <label className="text-sm text-zinc-100 flex items-center gap-1">
              Current professions
              <span className="text-amber-500">*</span>
            </label>
            <Select>
              <SelectTrigger className="custom-input">
                <SelectValue placeholder="Taxi driver" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="taxi">Taxi driver</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="card-shape w-1/2">
          <CardContent className="p-6 space-y-2">
            <label className="text-sm text-zinc-100">
              Languages for translations
            </label>
            <Select>
              <SelectTrigger className="custom-input">
                <SelectValue placeholder="Not selected" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="none">Not selected</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        </div>

        {/* Contacts */}
        <Card className="card-shape">
          <CardContent className="p-6 flex flex-col gap-4">
            <label className="text-sm text-zinc-100">Contacts</label>
            <div className="flex flex-col gap-4">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="grid grid-cols-12 gap-4 items-center"
                >
                  <div className="col-span-2">
                    <Select defaultValue={contact.type}>
                      <SelectTrigger className="custom-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        {contactTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Input
                      placeholder="Enter a name..."
                      className="bg-zinc-900 border-zinc-700 text-zinc-100 "
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      placeholder="Enter the tel..."
                      className="bg-zinc-900 border-zinc-700 text-zinc-100"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-red-500 hover:bg-red-600 rounded-full text-white hover:text-black"
                      onClick={() => removeContact(contact.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className=" ml-auto  px-4 py-2 bg-zinc-600 border-zinc-700 text-zinc-100 hover:bg-zinc-700"
                onClick={addContact}
              >
                Add a contact
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-[#B69D74] hover:bg-[#a08a65] text-zinc-900 px-8">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
