import { db } from "@repo/database";

export const upsertUserFromGithubData = async (data: {
    githubUserId: bigint;
    githubLogin: string;
    email: string | null;
    name?: string | null;
    avatarUrl?: string | null;
}) => {
    return db.user.upsert({
        where: {
            githubUserId: data.githubUserId,
        },
        update: {
            githubLogin: data.githubLogin,
            email: data.email,
            name: data.name ?? null,
            avatarUrl: data.avatarUrl ?? null,
        },
        create: {
            githubUserId: data.githubUserId,
            githubLogin: data.githubLogin,
            email: data.email,
            name: data.name ?? null,
            avatarUrl: data.avatarUrl ?? null,
        },
    });
};