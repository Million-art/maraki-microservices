import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class RootController {
  @Get()
  redirectToDocs(@Res() res: Response) {
    res.redirect('/docs');
  }
}
