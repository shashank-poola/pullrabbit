export const githubUser = (user: {
    id: string;
    githubUserId: bigint;
    githubLogin: string;
    email: string | null;
    name: string | null;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}) => ({
    ...user,
    githubUserId: user.githubUserId.toString(),
});