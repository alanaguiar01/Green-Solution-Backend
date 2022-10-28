import { setSeederFactory } from 'typeorm-extension';
import { User } from '~/modules/user/entities/user.entity';

export default setSeederFactory(User, (faker) => {
  const user = new User();
  user.name = faker.name.fullName();
  user.email = faker.internet.email(user.name);
  user.password = 'testuser';
  return user;
});
