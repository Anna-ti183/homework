import { WithId } from "mongodb";
import { blacklistCollection } from "../../db/collections";
import { IRefreshTokenBlackList } from "../domain/IRefreshTokenBlacklist";

export const refreshTokenBlacklist = {

    //сохраняет отозванный refreshToken в MongoDB
    async create(newRefreshToken: IRefreshTokenBlackList): Promise<void> {
        await blacklistCollection.insertOne(newRefreshToken);   
    },

    //проверяем, находится ли переданный refresh token в blacklist.
    async findByToken(token: string): Promise<WithId<IRefreshTokenBlackList> | null> {
        const res = await blacklistCollection.findOne({token});
        if(!res){
            return null;
        }
        return res;
    }

}