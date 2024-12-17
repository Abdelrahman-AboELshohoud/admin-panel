import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card, CardContent, CardFooter } from "../../ui/card";
import { Info } from "lucide-react";

export default function EmailAndPassword() {
  return (
    <Card className="bg-[#2A2A2A] border-none w-1/2">
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="callSign" className="text-white">Call sign</label>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <Input
            id="callSign"
            value="25521"
            className="bg-[#1E1E1E] border-gray-700 text-white"
          />
        </div>
        <div className="space-y-4">
          <label htmlFor="password" className="text-white">Change the password</label>
          <Input
            id="password"
            type="password"
            className="bg-[#1E1E1E] border-gray-700 text-white"
          />
        </div>
        <div className="space-y-4">
          <label htmlFor="repeatPassword" className="text-white">Repeat the password</label>
          <Input
            id="repeatPassword"
            type="password"
            className="bg-[#1E1E1E] border-gray-700 text-white"
          />
        </div>
      </CardContent>
      <CardFooter className="pt-6">
        <Button className="w-full bg-[#D4AF37] text-black hover:bg-[#C4A137]">
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
