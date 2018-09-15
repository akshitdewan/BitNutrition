export default class ProductsRepository {
  products = [
    {
      id: 1,
      title: 'Doritos',
      calories: 150,
      addedAt: new Date('2018-09-10T15:16:00')
    },
    {
      id: 2,
      title: 'Mineral water',
      calories: 15,
      addedAt: new Date('2018-09-10T17:10:00')
    },
    {
      id: 3,
      title: 'Mtn Dew',
      calories: 420,
      addedAt: new Date('2018-09-09T15:16:00')
    }
  ]

  async getAll() {
    return this.products;
  }
}