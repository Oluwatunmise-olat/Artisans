import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { BusinessCategory } from '../entities';

export default class DefaultBusinessCategory implements Seeder {
  async run(_factory: Factory, connection: DataSource): Promise<void> {
    const manager = await connection.manager.getRepository(BusinessCategory);
    await manager.save({ name: 'others' });
  }
}
