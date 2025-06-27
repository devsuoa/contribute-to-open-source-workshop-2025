import type { Language, FunctionSignatures } from "@/types/types";

export const FunctionBuilder = (
  lang: Language,
  sigs: FunctionSignatures | undefined,
): string => {
  const sig = sigs?.[lang];
  if (!sig) return "";

  const { functionName, parameters = [], returnType = "void" } = sig;

  switch (lang) {
    case "cpp":
      return `${returnType} ${functionName}(${parameters.join(", ")}) {\n    \n}`;

    case "java":
      return `public static ${returnType} ${functionName}(${parameters.join(
        ", ",
      )}) {\n    \n}`;

    case "python":
      return `def ${functionName}(${parameters.join(", ")}):\n    pass`;

    default:
      return "";
  }
};
