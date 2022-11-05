import { DataSource } from 'typeorm';
import { options } from './config/typeorm.config';

export default new DataSource(options);
