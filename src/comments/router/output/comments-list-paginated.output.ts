import { CommentOutput } from "../../output/comment.output";

export type CommentListPaginatedOutput = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: CommentOutput[];
};