import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../recipe/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private otpMap = new Map<string, { otp: string, expires: number, username: string, password: string, email: string }>();

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async signup(username: string, password: string, email: string): Promise<any> {
    // Generate OTP and set expiration time
    const otp = randomBytes(3).toString('hex'); // Generate a 6-digit OTP
    const otpExpires = Date.now() + 60000; // OTP expires in 1 minute

    // Store user data and OTP temporarily
    const userId = randomBytes(16).toString('hex'); // Generate a unique ID for temporary storage
    this.otpMap.set(userId, { otp, expires: otpExpires, username, password: await bcrypt.hash(password, 10), email });

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'alishba.javed792@gmail.com',
        pass: 'jldj uhta vsji ukzs', // Replace with your generated App Password
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
          // Create user in database
          const user = new this.userModel({
            username: otpData.username,
            password: otpData.password,
            email: otpData.email,
            isVerified: true,
          });
          await user.save();

          // OTP is used, so delete it
          this.otpMap.delete(userId);

          return { success: true, message: 'Account successfully verified.' };
        }
        return { success: false, message: 'Invalid OTP.' };
      }
      return { success: false, message: 'OTP expired.' };
    }
    return { success: false, message: 'Invalid OTP or User ID.' };
  }

  async login(email: string, password: string): Promise<any> {
    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (user && user.isVerified) {
      // Compare provided password with stored hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return { success: true, message: 'Login successful', userId: user._id.toString() };
      } else {
        return { success: false, message: 'Invalid password.' };
      }
    }
    return { success: false, message: 'User not found or not verified.' };
  }
}
