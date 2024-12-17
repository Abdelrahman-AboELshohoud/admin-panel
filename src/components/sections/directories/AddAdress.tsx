import { useState } from 'react'

export default function AddAddress() {
  const [formData, setFormData] = useState({
    city: '',
    placeName: '',
    street: '',
    houseNumber: '',
    lat: '',
    lon: '',
  })

  const [errors, setErrors] = useState({
    city: '',
    placeName: '',
    street: '',
    houseNumber: '',
    lat: '',
    lon: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    let newErrors: typeof errors = {
      city: '',
      placeName: '',
      street: '',
      houseNumber: '',
      lat: '',
      lon: '',
    }
    if (!formData.city) newErrors.city = 'City is required'
    if (!formData.placeName) newErrors.placeName = 'Place name is required'
    if (!formData.street) newErrors.street = 'Street is required'
    if (!formData.houseNumber) newErrors.houseNumber = 'House number is required'
    if (!formData.lat) {
      newErrors.lat = 'Latitude is required'
    } else if (isNaN(parseFloat(formData.lat)) || parseFloat(formData.lat) < -90 || parseFloat(formData.lat) > 90) {
      newErrors.lat = 'Latitude must be a number between -90 and 90'
    }
    if (!formData.lon) {
      newErrors.lon = 'Longitude is required'
    } else if (isNaN(parseFloat(formData.lon)) || parseFloat(formData.lon) < -180 || parseFloat(formData.lon) > 180) {
      newErrors.lon = 'Longitude must be a number between -180 and 180'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      console.log('Form submitted:', formData)
      // Here you would typically send the data to your backend
    }
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center p-4">
      <div className="w-full max-w-2xl card-shape rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Add Address</h2>
        <form onSubmit={handleSubmit} className="grid gap-6 grid-cols-2 md:grid-cols-4">
{          [
  {
    label: 'City',
    id: 'city',
    placeholder: 'Enter city...',
  },
  {
    label: 'Place Name',
    id: 'placeName',
    placeholder: 'Enter place name...',
  },
  {
    label: 'Street',
    id: 'street',
    placeholder: 'Enter street...',
  },
  {
    label: 'House Number',
    id: 'houseNumber',
    placeholder: 'Enter house number...',
  },
  {
    label: 'Latitude',
    id: 'lat',
    placeholder: 'Enter latitude...',
  },
  {
    label: 'Longitude',
    id: 'lon',
    placeholder: 'Enter longitude...',
  },
].map(({ label, id, placeholder }) => (
  <div key={id} className="flex flex-col col-span-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1 ml-2">{label}</label>
    <input
      type="text"
      id={id}
      name={id}
      value={formData[id as keyof typeof formData]}
      onChange={handleChange}
      className="custom-input"
      placeholder={placeholder}
    />
    {errors[id as keyof typeof errors] && <p className="mt-1 text-sm text-red-500">{errors[id as keyof typeof errors]}</p>}
  </div>
))}
          <div className="md:col-span-4 flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/80 focus:outline-none"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

