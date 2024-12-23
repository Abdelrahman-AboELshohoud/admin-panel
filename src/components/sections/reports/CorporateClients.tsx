import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { Input } from '../../ui/input'
import { Link } from 'react-router-dom'

interface Client {
  title: string
  activity: 'Yes' | 'No'
  city: string
}

const clients: Client[] = [
  { title: 'AGROPROF', activity: 'No', city: 'Kazan' },
  { title: 'IP Hakobyan A. Yu 2', activity: 'Yes', city: 'Kazan' },
  { title: 'FPD', activity: 'No', city: 'Kazan' },
]

const cities = ['allCities', 'Kazan', 'Moscow', 'Saint Petersburg']

export default function CorporateClients() {
  const { t } = useTranslation()
  const [selectedCity, setSelectedCity] = React.useState('allCities')
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredClients = React.useMemo(() => {
    return clients.filter(client => {
      const matchesCity = selectedCity === 'allCities' || client.city === selectedCity
      const matchesSearch = client.title.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCity && matchesSearch
    })
  }, [selectedCity, searchQuery])

  return (
    <div className="min-h-screen p-6 text-zinc-100">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">{t('corporateClients.title')}</h1>
      
      <div className="mb-6 flex gap-4">
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-[200px] custom-input ">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 text-zinc-100">
            {cities.map(city => (
              <SelectItem key={city} value={city} className="hover:bg-zinc-700">
                {t(`corporateClients.cities.${city}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder={t('corporateClients.titlePlaceholder')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-[300px] bg-zinc-800 text-zinc-100 placeholder:text-zinc-400"
        />
      </div>

      <div className="p-4 bg-[#1C1C1E] rounded-xl">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800  h-12 hover:bg-transparent">
              <TableHead className="text-zinc-400">{t('corporateClients.title')}</TableHead>
              <TableHead className="text-zinc-400">{t('corporateClients.activity')}</TableHead>
              <TableHead className="text-zinc-400">{t('corporateClients.city')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='py-6'>
            {filteredClients.map((client, index) => (
              <TableRow
                key={index}
                className="border-zinc-800 hover:bg-zinc-800/50 h-20"
              >
                <TableCell className="font-medium text-zinc-100">
                  <Link
                    to={`/control-panel/reports/corporate-clients/${client.title}`}
                    className="hover:underline"
                  >
                    {client.title}
                  </Link>
                </TableCell>
                <TableCell className="text-zinc-100">{t(`corporateClients.activity.${client.activity}`)}</TableCell>
                <TableCell className="text-zinc-100">{client.city}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

