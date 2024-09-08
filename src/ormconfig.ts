import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'monorail.proxy.rlwy.net',
  port: 24539,
  username: 'postgres',
  password: 'hzQfoBeQAecVchNJWgzSCJuldDWTvRKe',
  database: 'railway',

  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
};

export default config;
