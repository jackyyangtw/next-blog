import {
  constants,
  createHash,
  generateKeyPairSync,
  privateEncrypt,
} from "node:crypto";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

type Forge = {
  pki: {
    publicKeyFromPem: (pem: string) => {
      verify: (digest: string, signature: string) => boolean;
    };
  };
};

// Resolve through the actual Expo consumers so this checks the installed patch.
const mobileRequire = createRequire(
  new URL("../../../../mobile/package.json", import.meta.url),
);
const expoRequire = createRequire(mobileRequire.resolve("expo/package.json"));
const cliRequire = createRequire(expoRequire.resolve("@expo/cli/package.json"));
const certificatesRequire = createRequire(
  cliRequire.resolve("@expo/code-signing-certificates/package.json"),
);
const consumers = [
  {
    name: "Expo CLI",
    require: cliRequire,
    forge: cliRequire("node-forge") as Forge,
  },
  {
    name: "Expo 簽章憑證",
    require: certificatesRequire,
    forge: certificatesRequire("node-forge") as Forge,
  },
];
const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 1024,
});
const publicPem = publicKey.export({ type: "spki", format: "pem" }).toString();
const digest = createHash("sha256").update("簽章安全回歸案例").digest();
const sha256Oid = Buffer.from("0609608648016503040201", "hex");
const nullParameters = Buffer.from([0x05, 0x00]);
const garbage = Buffer.from([0x04, 0x01, 0x88]);

function sequence(value: Buffer) {
  return Buffer.concat([Buffer.from([0x30, value.length]), value]);
}

function signatureForAlgorithm(parts: Buffer[]) {
  const digestInfo = sequence(
    Buffer.concat([
      sequence(Buffer.concat([sha256Oid, ...parts])),
      Buffer.from([0x04, digest.length]),
      digest,
    ]),
  );
  return privateEncrypt(
    { key: privateKey, padding: constants.RSA_PKCS1_PADDING },
    digestInfo,
  ).toString("binary");
}

test("CVE 例外使用經核對的 node-forge 補丁", () => {
  const patch = readFileSync(
    new URL("../../../../../patches/node-forge@1.4.0.patch", import.meta.url),
    "utf8",
  ).replace(/\r\n/g, "\n");
  expect(createHash("sha256").update(patch).digest("hex")).toBe(
    "4fa957cddb4b4601a48b535053d0fec7ed013f9d075660a38365f285fc830fe0",
  );
});

describe.each(consumers)(
  "$name 的 node-forge 安全補丁",
  ({ forge, require: consumerRequire }) => {
    const key = forge.pki.publicKeyFromPem(publicPem);

    test("CVE 例外僅適用於已套用此補丁的 node-forge 1.4.0", () => {
      const { version } = consumerRequire("node-forge/package.json") as {
        version: string;
      };
      expect(version).toBe("1.4.0");
      const rsaSource = readFileSync(
        consumerRequire.resolve("node-forge/lib/rsa.js"),
        "utf8",
      ).replace(/\r\n/g, "\n");
      expect(createHash("sha256").update(rsaSource).digest("hex")).toBe(
        "acc22e5d36e27832c34e02dd3933aad7977d45b047eead5016520735efedc9c5",
      );
    });

    test("接受具有 NULL 參數的正常 SHA-256 簽章", () => {
      expect(
        key.verify(
          digest.toString("binary"),
          signatureForAlgorithm([nullParameters]),
        ),
      ).toBe(true);
    });

    test("接受省略可選 NULL 參數的正常 SHA-256 簽章", () => {
      expect(
        key.verify(digest.toString("binary"), signatureForAlgorithm([])),
      ).toBe(true);
    });

    test.each([
      { name: "NULL 參數之後", parts: [nullParameters, garbage] },
      { name: "省略 NULL 參數時", parts: [garbage] },
    ])("拒絕 $name 在巢狀 DigestAlgorithm 中夾帶多餘元素", ({ parts }) => {
      expect(() =>
        key.verify(digest.toString("binary"), signatureForAlgorithm(parts)),
      ).toThrow(/DigestInfo/);
    });

    test("拒絕與訊息摘要不符的簽章", () => {
      const differentDigest = createHash("sha256")
        .update("另一則訊息")
        .digest();
      expect(
        key.verify(
          differentDigest.toString("binary"),
          signatureForAlgorithm([nullParameters]),
        ),
      ).toBe(false);
    });
  },
);
