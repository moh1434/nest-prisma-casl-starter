import { IS_PUBLIC_KEY } from './../utils/constant';
import { SetMetadata } from '@nestjs/common';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
