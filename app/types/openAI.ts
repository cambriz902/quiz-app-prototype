export enum AI_ROLE_TYPE {
  USER = "user",
  ASSISTANT = "assistant",
}

export type ApiMessage = {
	role: AI_ROLE_TYPE;
	content: string;
}