export interface Command {
	id?: string;
	name: string;
	property: Map<string, string | number | boolean>;
	comparision: 'eq' | 'neq' | 'gt' | 'lt';
  }
  