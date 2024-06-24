import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { TUser } from './user';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>) {
    }
    /**
     * 用户登录并获取用户信息
     * @param code 
     * @returns 
     */
    async login(code: string): Promise<TUser> {
        //1.请求微信接口
        const { openId, unionId } = this.getUserInfoFromWechat(code);
        //2.查询用户信息
        const user = await this.userRepository.findOne({ select: ["id", "userName", "avatarUrl"], where: { "openId": openId, "unionId": unionId } });
        //3.用户信息存在，返回用户信息
        if (user) {
            return user;
        } else {  //4.用户信息不存在，创建用户，保存用户信息，返回用户信息  
            const defaultUser = this.defaultUser(openId, unionId);
            const { id, userName, avatarUrl } = await this.userRepository.save(defaultUser);
            return { id, userName, avatarUrl }
        }
    }

    private DEFAULT_USER_NAME: string = 'momo';
    private DEFAULT_AVATAR_URL: string = 'https://www.baidu.com';
    /**
     * 创建默认用户信息
     * @param openId 
     * @param unionId 
     * @returns 
     */
    private defaultUser(openId: string, unionId: string): User {
        const user = new User();
        user.openId = openId;
        user.unionId = unionId;
        user.userName = this.DEFAULT_USER_NAME;
        user.avatarUrl = this.DEFAULT_AVATAR_URL;
        return user;
    }

    /**
     * 从微信接口获取用户信息
     * @param code 
     * @returns 
     */
    private getUserInfoFromWechat(code: string) {
        return { openId: code, unionId: code };
    }

    async getUserInfo(userId: number): Promise<TUser | null> {
        return await this.userRepository.findOne({ select: ["userName", "avatarUrl"], where: { "id": userId } });
    }
}
