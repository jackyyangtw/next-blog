import { expect, test, vi } from "vitest";
import {
  restoreAuthSessionUserImage,
  type AuthSessionUser,
} from "./session-user";

const userWithoutImage: AuthSessionUser = {
  id: "user-1",
  _id: "user-1",
  name: "Jacky Yang",
  email: "jacky@example.com",
  role: "user",
};

test("JWT 有 Google picture 時直接恢復頭像且不查詢 Sanity", async () => {
  const loadUserImage = vi.fn();

  const result = await restoreAuthSessionUserImage(
    userWithoutImage,
    "https://example.com/google-avatar.jpg",
    loadUserImage,
  );

  expect(result.image).toBe("https://example.com/google-avatar.jpg");
  expect(loadUserImage).not.toHaveBeenCalled();
});

test("舊 JWT 沒有 picture 時會從 Sanity 恢復頭像", async () => {
  const loadUserImage = vi
    .fn()
    .mockResolvedValue("https://example.com/sanity-avatar.jpg");

  const result = await restoreAuthSessionUserImage(
    userWithoutImage,
    undefined,
    loadUserImage,
  );

  expect(result.image).toBe("https://example.com/sanity-avatar.jpg");
  expect(loadUserImage).toHaveBeenCalledOnce();
  expect(loadUserImage).toHaveBeenCalledWith("jacky@example.com");
});

test("JWT 已有頭像時保留原物件且不查詢 Sanity", async () => {
  const userWithImage = {
    ...userWithoutImage,
    image: "https://example.com/current-avatar.jpg",
  };
  const loadUserImage = vi.fn();

  const result = await restoreAuthSessionUserImage(
    userWithImage,
    undefined,
    loadUserImage,
  );

  expect(result).toBe(userWithImage);
  expect(loadUserImage).not.toHaveBeenCalled();
});

test("Sanity 暫時失敗時保留原 session 使用者", async () => {
  const loadUserImage = vi.fn().mockRejectedValue(new Error("Sanity timeout"));

  const result = await restoreAuthSessionUserImage(
    userWithoutImage,
    undefined,
    loadUserImage,
  );

  expect(result).toBe(userWithoutImage);
  expect(loadUserImage).toHaveBeenCalledOnce();
});
