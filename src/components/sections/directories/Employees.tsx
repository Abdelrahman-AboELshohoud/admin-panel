import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { TabsContent } from "@radix-ui/react-tabs";
import { Button } from "../../ui/button";

export default function Employees() {
  const staff = [
    {
      id: 1,
      name: "Ivanov Ivan Ivanovich",
      branch: "Branch 1",
      position: "Admin",
      isOnline: true,
    },
    {
      id: 2,
      name: "Petrov Petr Petrovich",
      branch: "Branch 2",
      position: "Admin",
      isOnline: false,
    },
    {
      id: 3,
      name: "Sidorov Sidor Sidorovich",
      branch: "Branch 3",
      position: "Admin",
      isOnline: true,
    },
  ];
  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl text-zinc-100">Employees</h1>
      </div>

      <Tabs defaultValue="working" className="mb-6">
        <TabsList className="bg-transparent mb-2">
          <TabsTrigger value="working" className="custom-tabs">
            Working
          </TabsTrigger>
          <TabsTrigger value="invitations" className="custom-tabs">
            Invitations have been sent
          </TabsTrigger>
          <TabsTrigger value="blocked" className="custom-tabs">
            Blocked
          </TabsTrigger>
        </TabsList>

        <TabsContent value="working">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { placeholder: "All cities", options: ["All cities", "Kazan"] },
              {
                placeholder: "Post",
                options: ["All posts", "Administrator", "Partner's employee"],
              },
              { placeholder: "Partners", options: ["All partners"] },
            ].map(({ placeholder, options }, index) => (
              <Select key={index}>
                <SelectTrigger className="custom-input">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option, i) => (
                    <SelectItem
                      key={i}
                      value={i === 0 ? "all" : option.toLowerCase()}
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Input
              placeholder="Search by FULL name..."
              className="bg-zinc-900 border-zinc-700 text-zinc-100"
            />
            <Input
              placeholder="To find"
              className="bg-black border-zinc-700 text-zinc-100"
            />
          </div>

          <div className="card-shape">
            <Table>
              <TableHeader>
                <TableRow className="border-transparent text-slate-300 hover:bg-transparent ">
                  <TableHead>Full name</TableHead>
                  <TableHead>Job title</TableHead>
                  <TableHead>The branch where the employee works</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow
                    key={member.id}
                    className="border-transparent hover:bg-transparent py-2 h-14"
                  >
                    <TableCell className="text-zinc-100">
                      <div className="flex items-center gap-2">
                        {member.name}
                        {member.isOnline && (
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-100">
                      {member.position}
                    </TableCell>
                    <TableCell className="text-zinc-100">
                      {member.branch}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="invitations">
        <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { placeholder: "All cities", options: ["All cities", "Kazan"] },
              {
                placeholder: "Post",
                options: ["All posts", "Administrator", "Partner's employee"],
              },
              { placeholder: "Partners", options: ["All partners"] },
            ].map(({ placeholder, options }, index) => (
              <Select key={index}>
                <SelectTrigger className="custom-input">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option, i) => (
                    <SelectItem
                      key={i}
                      value={i === 0 ? "all" : option.toLowerCase()}
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Input
              placeholder="Search by FULL name..."
              className="bg-zinc-900 border-zinc-700 text-zinc-100"
            />
            <Input
              placeholder="To find"
              className="bg-black border-zinc-700 text-zinc-100"
            />
          </div>

          <div className="card-shape">
            <Table>
              <TableHeader>
                <TableRow className="border-transparent text-slate-300 hover:bg-transparent ">
                  <TableHead>Full name</TableHead>
                  <TableHead>Job title</TableHead>
                  <TableHead>The branch where the employee works</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow
                    key={member.id}
                    className="border-transparent hover:bg-transparent py-2"
                  >
                    <TableCell className="text-zinc-100">
                      <div className="flex items-center gap-2">
                        {member.name}
                        {member.isOnline && (
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-100">
                      {member.position}
                    </TableCell>
                    <TableCell className="text-zinc-100">
                      {member.branch}
                    </TableCell>
                    <TableCell className="text-zinc-100 flex gap-4">
                      <Button className="bg-transparent border-green-500 border-2 text-green-500 hover:bg-green-500 hover:text-white p-2 rounded-md">
                        Send Again
                      </Button>
                      <Button className="bg-transparent border-red-500 border-2 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-md">
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="blocked">
        <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { placeholder: "All cities", options: ["All cities", "Kazan"] },
              {
                placeholder: "Post",
                options: ["All posts", "Administrator", "Partner's employee"],
              },
              { placeholder: "Partners", options: ["All partners"] },
            ].map(({ placeholder, options }, index) => (
              <Select key={index}>
                <SelectTrigger className="custom-input">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option, i) => (
                    <SelectItem
                      key={i}
                      value={i === 0 ? "all" : option.toLowerCase()}
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Input
              placeholder="Search by FULL name..."
              className="bg-zinc-900 border-zinc-700 text-zinc-100"
            />
            <Input
              placeholder="To find"
              className="bg-black border-zinc-700 text-zinc-100"
            />
          </div>

          <div className="card-shape">
            <Table>
              <TableHeader>
                <TableRow className="border-transparent text-slate-300 hover:bg-transparent ">
                  <TableHead>Full name</TableHead>
                  <TableHead>Job title</TableHead>
                  <TableHead>The branch where the employee works</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow
                    key={member.id}
                    className="border-transparent hover:bg-transparent py-2"
                  >
                    <TableCell className="text-zinc-100 h-14">
                      <div className="flex items-center gap-2">
                        {member.name}
                        {member.isOnline && (
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-100">
                      {member.position}
                    </TableCell>
                    <TableCell className="text-zinc-100">
                      {member.branch}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
