import type { SemanticTokenDef } from '@/types';

export const SEMANTIC_TOKENS: SemanticTokenDef[] = [
  { key: 'class', label: 'Class' },
  { key: 'enum', label: 'Enum' },
  { key: 'enumMember', label: 'Enum Member' },
  { key: 'function', label: 'Function' },
  { key: 'interface', label: 'Interface' },
  { key: 'method', label: 'Method' },
  { key: 'namespace', label: 'Namespace' },
  { key: 'parameter', label: 'Parameter' },
  { key: 'property', label: 'Property' },
  { key: 'type', label: 'Type' },
  { key: 'typeParameter', label: 'Type Parameter' },
  { key: 'variable', label: 'Variable' },
  { key: 'decorator', label: 'Decorator' },
];
