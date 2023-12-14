import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthPortfolioOwnerService } from './auth-portfolio-owner.service';
import { AuthDto } from './dto/auth-portfolio-owner.dto';
import { SignInDto } from './dto/sign-in-portfolio-owner.dto';

@Controller('auth-portfolio-owner')
export class AuthPortfolioOwnerController {
    constructor(private authPortfolioOwnerService:AuthPortfolioOwnerService) {}

    @Post('signup')
    signup (@Body() dto: AuthDto) {
        return this.authPortfolioOwnerService.signup(dto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: SignInDto) {
        return this.authPortfolioOwnerService.signin(dto);
  }
}
