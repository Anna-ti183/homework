import { Collection, Db } from "mongodb";
import { Blog } from "../blogs/domain/blogs";
import { Post } from "../posts/domain/posts";
import { IUserDB } from "../users/domain/users";
import { Comment } from "../comments/domain/comment";
import { IRefreshTokenBlackList } from "../blacklist-refreshtoken/domain/IRefreshTokenBlacklist";
import { ratelimit } from "../core/rate-limit/domain/rate-limit";
import { session  } from "../sessions/domain/sessions";


export const BLOG_COLLECTION_NAME = 'blogs';
export const POST_COLLECTION_NAME = 'posts';
export const USER_COLLECTION_NAME = 'users';
export const COMMENT_COLLECTION_NAME = 'comments';
export const BLACKLIST_COLLECTION_NAME = 'blacklist';
export const RATELIMIT_COLLECTION_NAME = 'rateLimit';
export const DEVICESESSION_COLLECTION_NAME = 'deviceSessions'


// Коллекция инициализируется один раз в initCollections() после подключения к БД.
// До этого момента она undefined, поэтому обращаться к ней можно только после runDB().
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<IUserDB>;
export let commentCollection: Collection<Comment>;
export let blacklistCollection: Collection<IRefreshTokenBlackList>;
export let rateLimitCollection: Collection <ratelimit>;
export let deviceSessionCollection: Collection <session>

// Создаём объект коллекции из подключённой базы.
export function initCollections(db: Db): void {
    blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME)
    postCollection = db.collection<Post>(POST_COLLECTION_NAME)
    userCollection = db.collection<IUserDB>(USER_COLLECTION_NAME)
    commentCollection = db.collection<Comment>(COMMENT_COLLECTION_NAME)
    blacklistCollection = db.collection<IRefreshTokenBlackList>(BLACKLIST_COLLECTION_NAME)
    rateLimitCollection = db.collection<ratelimit>(RATELIMIT_COLLECTION_NAME)
    deviceSessionCollection = db.collection<session>(DEVICESESSION_COLLECTION_NAME)
}


// Список всех коллекций считаем в МОМЕНТ вызова (уже после initCollections),
// а не на этапе загрузки модуля — иначе сюда попали бы ещё не инициализированные (undefined) коллекции.
export function getAllCollections(): Collection<any>[] {
  return [blogCollection, postCollection, userCollection, commentCollection, 
  blacklistCollection, rateLimitCollection, deviceSessionCollection];
}