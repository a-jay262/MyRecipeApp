import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../recipe/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';  // Import JwtService

@Injectable()
export class AuthService {
  private otpMap = new Map<string, { otp: string, expires: number, username: string, password: string, email: string, image: string }>();

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService // Inject JwtService
  ) {}

  async signup(username: string, password: string, email: string, image: string): Promise<any> {
    const otp = randomBytes(3).toString('hex');
    const otpExpires = Date.now() + 60000;

    const userId = randomBytes(16).toString('hex');
    this.otpMap.set(userId, { otp, expires: otpExpires, username, password: await bcrypt.hash(password, 10), email, image });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'alishba.javed792@gmail.com',
        pass: 'jldj uhta vsji ukzs',
      },
      port: 587,
      secure: false,
    });

    const mailOptions = {
      from: 'alishba.javed792@gmail.com',
      to: email,
      subject: 'OTP for Account Verification',
      text: `Your OTP for account verification is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    return { success: true, message: 'Signup successful. Please check your email for OTP.', userId };
  }

  async verifyOtp(userId: string, otp: string): Promise<any> {
    const otpData = this.otpMap.get(userId);
    if (otpData) {
      if (otpData.expires > Date.now()) {
        if (otpData.otp === otp) {
          const user = new this.userModel({
            username: otpData.username,
            password: otpData.password,
            email: otpData.email,
            isVerified: true,
            image: otpData.image,
          });
          await user.save();
  
          // Generate token with expiration
          const expiresIn = '1h'; // Set token expiration time
          const token = this.jwtService.sign({ userId: user._id }, { expiresIn });
  
          // Remove OTP data from the map
          this.otpMap.delete(userId);
  
          return {
            success: true,
            message: 'Account successfully verified.',
            token,
            expiresIn, // Return expiration time
          };
        }
        return { success: false, message: 'Invalid OTP.' };
      }
      return { success: false, message: 'OTP expired.' };
    }
    return { success: false, message: 'Invalid OTP or User ID.' };
  }
  

  async login(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (user && user.isVerified) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const payload = { username: user.username, sub: user._id };
        const accessToken = this.jwtService.sign(payload); // This line may be causing the issue
        console.log("Logged In Successfull");
        return { success: true, accessToken, username: user.username, image: user.image, userId: user._id.toString() };
      } else {
        return { success: false, message: 'Invalid password.' };
      }
    }
    return { success: false, message: 'User not found or not verified.' };
  }
}
