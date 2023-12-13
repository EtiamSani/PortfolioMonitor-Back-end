import { Body, Controller, Post } from '@nestjs/common';
import { AuthPortfolioOwnerService } from './auth-portfolio-owner.service';
import { AuthDto } from './dto';

@Controller('auth-portfolio-owner')
export class AuthPortfolioOwnerController {
    constructor(private authPortfolioOwnerService:AuthPortfolioOwnerService) {}

    @Post('signup')
    signup (@Body() dto: AuthDto) {
        return this.authPortfolioOwnerService.signup(dto)
    }
}
