import Chance from 'chance'
import { Clinic } from './models/clinic'
import fs from 'fs'
import path from 'path'

const chance = new Chance()
const mockClinicList: Clinic[] = []

function generateFakeClinic(): Clinic {
  const clinic: Clinic = {
    name: chance.company(),
    stateName: chance.state({ full: true, country: 'us' }),
    availability: {
      from: chance.hour({ twentyfour: true }) + ':' + chance.minute(),
      to: chance.hour({ twentyfour: true, min: 1 }) + ':' + chance.minute(),
    },
    type: chance.pickone(['vet', 'dental']),
  }

  return clinic
}

for (let i = 0; i < 4000; i++) {
  const fakeClinic = generateFakeClinic()
  mockClinicList.push(fakeClinic)
}

const jsonData = JSON.stringify(mockClinicList) // Convert the data to JSON format with 2-space indentation

fs.writeFile(path.join(__dirname, '../src/database/clinics.json'), jsonData, 'utf8', err => {
  if (err) {
    console.error('Error writing JSON file:', err)
    return
  }
  console.log('JSON file has been written successfully.')
})
