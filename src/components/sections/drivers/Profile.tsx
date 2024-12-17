import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import Switch from "../../common/Switch";
import { CardContent, CardHeader, CardTitle } from "../../ui/card";
import { SelectTrigger, SelectValue, Select, SelectContent, SelectItem } from "../../ui/select";
import DriverType from '../../../types/driver';
import { Avatar } from "@radix-ui/react-avatar";
import {  Image as ImageIcon } from "lucide-react";
import { Button } from "../../ui/button";

export default function Profile({ profile , isEditing, setIsEditing, setProfile}: { profile: DriverType , isEditing: boolean, setIsEditing: React.Dispatch<React.SetStateAction<boolean>>, setProfile: React.Dispatch<React.SetStateAction<DriverType>> }) {
    const handleEdit = () => setIsEditing(true);
    const handleSave = () => setIsEditing(false);
  
    const handleInputChange = (section: keyof Pick<DriverType, "personalInfo" | "bankInfo" | "documents">, key: string, value: string | boolean) => {
        setProfile(prevProfile => ({
          ...prevProfile,
          [section]: {
            ...prevProfile[section],
            [key]: value
          }
        }));
      };
    
      const handleIdCardChange = (index: number, value: string) => {
        setProfile(prevProfile => ({
          ...prevProfile,
          idCards: prevProfile.idCards.map((card, i) => i === index ? value : card)
        }));
      };
    
    return (


        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8">
            <div className="space-y-6">
                <Card className="card-shape border-none">
                    <CardHeader>
                        <CardTitle className="text-gray-100">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(profile.personalInfo).map(([key, value]) => (<InputField key={key} label={key} value={value} isEditing={isEditing} />))}
                    </CardContent>
                </Card>

                <Card className="card-shape border-none">
                    <CardHeader>
                        <CardTitle className="text-gray-100">Bank Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(profile.bankInfo).map(([key, value]) =>
                            typeof value === 'boolean'
                                ? <SwitchWithLabel key={key} label={key} checked={value} isEditing={isEditing} />
                                : <InputField key={key} label={key} value={value} isEditing={isEditing} />
                        )}
                    </CardContent>
                </Card>

                <Card className='card-shape border-none'>
                    <CardHeader>
                        <CardTitle className='text-gray-100'>Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Object.entries(profile.documents).map(([docType, docData]) => (
                            <div key={docType} className="space-y-4">
                                <h3 className="text-gray-100">{docType}</h3>
                                {typeof docData === 'object'
                                    ? Object.entries(docData).map(([key, value]) =>
                                        docType === 'driversLicense' && key === 'category'
                                            ? <SelectField key={key} label={key} value={value} isEditing={isEditing} options={['A', 'B', 'C', 'D', 'E']} />
                                            : <InputField key={key} label={key} value={value} isEditing={isEditing} />
                                    )
                                    : <InputField key={docType} label={docType} value={docData} isEditing={isEditing} />
                                }
                            </div>
                        ))}
                    </CardContent>
                </Card>


            </div>

            <div className="space-y-6">
                <Card className="card-shape border-none">
                    <CardContent className="flex justify-center pt-6">
                        <Avatar className="w-48 h-48" />
                    </CardContent>
                </Card>
                {profile.idCards.map((card, index) => (
                    <Card key={index} className="card-shape border-none">
                        <CardContent className="pt-6">
                            <label htmlFor={`id-card-${index}`} className="flex flex-col items-center cursor-pointer">
                                <ImageIcon size={48} className="mb-2" />
                                <span className="text-sm text-gray-100 mb-2">ID Card {index + 1}</span>
                                <input
                                    id={`id-card-${index}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            handleIdCardChange(index, URL.createObjectURL(file));
                                        }
                                    }}
                                />
                                {card && <img src={card} alt={`ID Card ${index + 1}`} className="mt-2 max-w-full h-auto" />}
                            </label>
                        </CardContent>
                    </Card>
                ))}
                <Card className='card-shape border-none'>
                    <CardContent className="space-y-4 pt-6">
                        <InputField label="Comment" value={profile.comment} isEditing={isEditing} />
                        <SelectField isEditing={isEditing} label="Type of cooperation" value={profile.employmentType} options={['Self-employed', 'Employee', 'Contractor']} />
                        <SelectField isEditing={isEditing} label="Partner" value={profile.partner} options={['Olrus Auto', 'Partner 2', 'Partner 3']} />
                        <SwitchWithLabel isEditing={isEditing} label="Blocked" checked={profile.isBlocked} />
                    </CardContent>
                </Card>
                <div className="mt-8 flex justify-end mt-auto">
                    {isEditing ? (
                        <Button onClick={handleSave} className='px-7 py-2 font-medium text-lg bg-yellow-500 hover:bg-yellow-400'>Save</Button>
                    ) : (
                        <Button onClick={handleEdit} className='px-7 py-2 font-medium text-lg bg-slate-900 hover:bg-slate-800'>Edit</Button>
                    )}
                </div>
            </div>
        </div>



    )
}

const SelectField: React.FC<{ label: string; value: string; options: string[]; isEditing: boolean }> = ({ label, value, options, isEditing }) => {
    console.log(value, options, isEditing, label);
    return (
        <div className="flex items-center gap-4">
            <label className="text-gray-100 w-1/3">{label}</label>
            <Select
                disabled={!isEditing}
                // onValueChange={(value) => handleInputChange(section, key, value)}
                value={value}
            >
                <SelectTrigger className="w-2/3">
                    <SelectValue placeholder={`Select ${label}`} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
const SwitchWithLabel: React.FC<{ label: string; checked: boolean; isEditing: boolean }> = ({ label, checked, isEditing }) => {
    return (
        <div className="flex items-center gap-4">
            <label className="text-gray-100 w-1/3">{label}</label>
            <Switch
                checked={checked}
                disabled={!isEditing}
            // onCheckedChange={(checked) => handleInputChange(section, key, checked)}
            />
        </div>
    );
}
const InputField: any = ({ label, value, isEditing }: { label: string, value: string, isEditing: boolean }) => {
    console.log(label, value, isEditing);
    return (
        <div className="flex items-center gap-4">
            <label className="text-gray-100 w-1/3">{label}</label>
            <Input
                value={value}
                readOnly={!isEditing}
                className="dark-input w-2/3"
            // onChange={(e) => handleInputChange(section, key, e.target.value)}
            />
        </div>
    );
}