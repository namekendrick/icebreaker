import { useOpenAIGlobal } from "./use-openai-global";
import type { UnknownObject } from "./types";

/**
 * Hook to get the tool response metadata from the OpenAI global object.
 *
 * @returns The tool response metadata or null if not available.
 *
 * @example
 *
 * const toolResponseMetadata = useToolResponseMetadata();
 * console.log(toolResponseMetadata);
 *  */
export function useToolResponseMetadata(): UnknownObject | null {
  return useOpenAIGlobal("toolResponseMetadata");
}
