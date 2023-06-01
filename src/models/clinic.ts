export type Clinic = {
  name: string
  stateName: string
  availability: {
    from: string
    to: string
  }
  type: 'vet' | 'dental'
}
