import { IsEmail, IsNotEmpty, IsString} from "class-validator";

export class AuthDto {
    
    @IsString()
    @IsNotEmpty()
    username: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;
    isEmailValid?: boolean;
    isOwner?: boolean;
    verifyToken?:string
    @IsString()
    @IsNotEmpty()
    password: string;
}