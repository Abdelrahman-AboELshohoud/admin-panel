import React, { useState } from 'react';

import { MapPin, Star, Image as ImageIcon } from "lucide-react";

import DriverType from '../../../types/driver';
import { Tabs, TabsList } from '../../ui/tabs';
import { TabsContent, TabsTrigger } from '@radix-ui/react-tabs';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';

import EmailAndPassword from './EmailAndPassword';
import Balance from './Balance';

const fakeProfile = {
  id: 1,
  city: "City of Kazan",
  rating: "4.95",
  employmentType: "Self-employed",
  personalInfo: {
    firstName: "Lana",
    middleName: "",
    lastName: "Lynch",
    dateOfBirth: "09.01.1985",
    phone: "+7(917)888-41-24",
    email: "lana.linch@yandex.ru"
  },
  bankInfo: {
    cardNumber: "2200150946163265",
    walletNumber: "",
    supportTerminalPayment: false
  },
  documents: {
    passport: {
      series: "0000",
      number: "000000",
      issuedBy: "",
      addressRegistration: "",
      actualAddress: ""
    },
    driversLicense: {
      series: "9928",
      number: "109088",
      category: "B",
      startDate: "02.02.2011"
    },
    snils: "",
    inn: "",
    ogrnip: "",
    medicalCertificate: ""
  },
  comment: "3000 balance",
  partner: "Olrus Auto",
  isBlocked: false,
  idCards: ["", "", "", ""]
};


const Driver: React.FC = () => {
  const [profile, setProfile] = useState<DriverType>(fakeProfile);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

 


  	return (
		<div className="min-h-screen bg-background p-6">
			<div className="max-w-5xl mx-auto">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<MapPin className="text-muted-foreground" size={16} />
							<span className="text-foreground">{profile.city}</span>
						</div>
						<div className="flex items-center gap-2">
							<Star className="text-muted-foreground" size={16} />
							<span className="text-foreground">{profile.rating} Rating</span>
						</div>
					</div>
				</div>

                <Tabs defaultValue={"Profile"} className="w-full">
        <TabsList className="bg-transparent hover:bg-transparent flex flex-wrap gap-4 justify-start mb-6 w-full">
          {["Profile", "Work", "Call sign and password", "Balance", "Reviews", "Purchased tariffs", "Photo control", "Travel history"].map((tab) => (
            <TabsTrigger
              onClick={() => {
                navigate(`/control-panel/drivers/active/${profile.id}/${tab}`);
              }}
              key={tab}
              value={tab}
              className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-slate-300 text-quaternary"
            >
              {tab}
            </TabsTrigger>
          ))}
				</TabsList>
        <TabsContent value={"Profile"} className="space-y-6">
          <Profile profile={profile} isEditing={isEditing} setIsEditing={setIsEditing} setProfile={setProfile} />
        </TabsContent>
        {/* <TabsContent value={"Work"} className="space-y-6">
          Work
        </TabsContent> */}
        <TabsContent value={"Call sign and password"} className="space-y-6">
          <EmailAndPassword />
        </TabsContent>
        <TabsContent value={"Balance"} className="space-y-6">
          <Balance />
        </TabsContent>
      </Tabs>
			</div>
		</div>
	);
};

export default Driver;
