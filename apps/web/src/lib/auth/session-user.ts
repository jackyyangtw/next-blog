export interface AuthSessionUser {
  id: string;
  _id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

type LoadUserImage = (email: string) => Promise<string | null | undefined>;

export async function restoreAuthSessionUserImage(
  user: AuthSessionUser,
  tokenPicture: string | null | undefined,
  loadUserImage: LoadUserImage,
) {
  if (user.image) {
    return user;
  }

  let image = tokenPicture;
  if (!image && user.email) {
    try {
      image = await loadUserImage(user.email);
    } catch {
      return user;
    }
  }

  return image ? { ...user, image } : user;
}
